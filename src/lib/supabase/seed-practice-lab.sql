-- Secure persistence and sequential unlocking for the 16 Laboratory missions.
-- Apply after schema.sql. Re-runnable; it does not alter existing progress rows.

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  mission_code text not null check (mission_code in ('message-suspect', 'identite-numerique', 'enquete-information')),
  age_band public.age_band not null,
  attempt_number integer not null check (attempt_number > 0),
  status text not null check (status in ('completed', 'retry')),
  score smallint not null check (score between 0 and 100),
  demonstrated_criteria jsonb not null default '{}'::jsonb,
  responses jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (learner_id, mission_code, attempt_number)
);

create index if not exists practice_attempts_learner_date_idx
  on public.practice_attempts (learner_id, created_at desc);
create index if not exists practice_attempts_mission_idx
  on public.practice_attempts (mission_code, status);

alter table public.practice_attempts drop constraint if exists practice_attempts_mission_code_check;
alter table public.practice_attempts add constraint practice_attempts_mission_code_check check (mission_code in (
  'message-suspect', 'identite-numerique', 'enquete-information',
  'message-suspect-01', 'identite-numerique-02', 'enquete-information-03', 'message-suspect-04',
  'enquete-information-05', 'identite-numerique-06', 'message-suspect-07', 'enquete-information-08',
  'identite-numerique-09', 'message-suspect-10', 'identite-numerique-11', 'enquete-information-12',
  'message-suspect-13', 'enquete-information-14', 'identite-numerique-15', 'message-suspect-16'
));

alter table public.practice_attempts enable row level security;
drop policy if exists "practice_attempts_read_scoped" on public.practice_attempts;
create policy "practice_attempts_read_scoped" on public.practice_attempts
  for select to authenticated
  using (
    learner_id = (select auth.uid())
    or public.current_app_role() = 'admin'
    or (
      public.current_app_role() = 'educator'
      and exists (
        select 1 from public.profiles as learner
        where learner.id = practice_attempts.learner_id
          and learner.educator_id = (select auth.uid())
          and learner.role = 'learner'
      )
    )
  );

-- Do not allow a user to self-assign a privileged role, educator, organization,
-- or age band through a direct profiles.update request from the browser.
revoke update on table public.profiles from public, anon, authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;

-- Attempts are readable through scoped RLS, but writes happen only through the
-- validating function below. No direct INSERT/UPDATE/DELETE policy is granted.
revoke all on table public.practice_attempts from anon, authenticated;
grant select on table public.practice_attempts to authenticated;

create or replace function public.submit_practice_attempt(p_mission_code text, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_learner_id uuid := auth.uid();
  v_age_band public.age_band;
  v_attempt_number integer;
  v_score integer := 0;
  v_status text := 'retry';
  v_criteria jsonb := '{}'::jsonb;
  v_safe_action boolean := false;
  v_clue_count integer := 0;
  v_sensitive_count integer := 0;
  v_private_sensitive_count integer := 0;
  v_expected_sources text[];
  v_allowed_clues text[];
  v_allowed_actions text[];
  v_opened_sources text[];
  v_source_count integer := 0;
  v_conclusion text;
  v_sharing text;
  v_visibility text;
  v_field_choices jsonb;
  v_sensitive_fields text[];
  v_allowed_fields text[];
  v_responses jsonb;
  v_attempt_id uuid;
  v_stage_number integer := 0;
  v_previous_mission text;
begin
  if v_learner_id is null then
    raise exception 'Authentification requise.' using errcode = '28000';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) is distinct from 'object' then
    raise exception 'Format de réponse invalide.' using errcode = '22023';
  end if;
  if p_mission_code is null or p_mission_code not in (
    'message-suspect', 'identite-numerique', 'enquete-information',
    'message-suspect-01', 'identite-numerique-02', 'enquete-information-03', 'message-suspect-04',
    'enquete-information-05', 'identite-numerique-06', 'message-suspect-07', 'enquete-information-08',
    'identite-numerique-09', 'message-suspect-10', 'identite-numerique-11', 'enquete-information-12',
    'message-suspect-13', 'enquete-information-14', 'identite-numerique-15', 'message-suspect-16'
  ) then
    raise exception 'Mission inconnue.' using errcode = '22023';
  end if;


  select profile.age_band into v_age_band
  from public.profiles as profile
  where profile.id = v_learner_id and profile.role = 'learner';
  if v_age_band is null then
    raise exception 'Un profil jeune avec tranche d’âge est requis.' using errcode = '42501';
  end if;

  if p_mission_code ~ '-[0-9]{2}$' then
    v_stage_number := right(p_mission_code, 2)::integer;
    v_previous_mission := case v_stage_number - 1
      when 1 then 'message-suspect-01'
      when 2 then 'identite-numerique-02'
      when 3 then 'enquete-information-03'
      when 4 then 'message-suspect-04'
      when 5 then 'enquete-information-05'
      when 6 then 'identite-numerique-06'
      when 7 then 'message-suspect-07'
      when 8 then 'enquete-information-08'
      when 9 then 'identite-numerique-09'
      when 10 then 'message-suspect-10'
      when 11 then 'identite-numerique-11'
      when 12 then 'enquete-information-12'
      when 13 then 'message-suspect-13'
      when 14 then 'enquete-information-14'
      when 15 then 'identite-numerique-15'
      else null
    end;
    if v_stage_number > 1 and not exists (
      select 1 from public.practice_attempts as previous_attempt
      where previous_attempt.learner_id = v_learner_id
        and previous_attempt.mission_code = v_previous_mission
        and previous_attempt.status = 'completed'
    ) then
      raise exception 'Termine d’abord l’étape précédente.' using errcode = '42501';
    end if;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_learner_id::text || ':' || p_mission_code, 0));
  select coalesce(max(attempt.attempt_number), 0) + 1 into v_attempt_number
  from public.practice_attempts as attempt
  where attempt.learner_id = v_learner_id and attempt.mission_code = p_mission_code;

  if p_mission_code in ('message-suspect', 'message-suspect-01', 'message-suspect-04', 'message-suspect-07', 'message-suspect-10', 'message-suspect-13', 'message-suspect-16') then
    v_allowed_clues := case v_age_band
      when '6-8' then array['sender', 'urgency']
      when '9-11' then array['sender', 'urgency', 'link']
      else array['sender', 'urgency', 'link', 'password']
    end;
    v_allowed_actions := case v_age_band
      when '6-8' then array['open', 'ask-adult']
      when '9-11' then array['open', 'report', 'ask-adult']
      else array['open', 'report', 'delete', 'ask-adult']
    end;
    if coalesce(jsonb_typeof(p_answers -> 'clues'), '') <> 'array' then
      raise exception 'Indices sélectionnés invalides.' using errcode = '22023';
    end if;
    if jsonb_array_length(p_answers -> 'clues') > 4 or exists (
        select 1 from jsonb_array_elements_text(p_answers -> 'clues') as clue(value)
        where not (clue.value = any(v_allowed_clues))
      ) then
      raise exception 'Indices sélectionnés invalides.' using errcode = '22023';
    end if;
    if not (coalesce(p_answers ->> 'action', '') = any(v_allowed_actions)) then
      raise exception 'Réaction sélectionnée invalide.' using errcode = '22023';
    end if;
    select count(distinct clue.value)::integer into v_clue_count
    from jsonb_array_elements_text(p_answers -> 'clues') as clue(value);
    v_safe_action := p_answers ->> 'action' in ('report', 'delete', 'ask-adult');
    v_score := least(v_clue_count, 3) * 20 + case when v_safe_action then 40 else 0 end;
    if v_clue_count >= 2 and v_safe_action then v_status := 'completed'; end if;
    v_criteria := jsonb_build_object(
      'repere_deux_indices', v_clue_count >= 2,
      'choisit_une_reaction_sure', v_safe_action,
      'indices_reperes', v_clue_count
    );
    v_responses := jsonb_build_object('clues', p_answers -> 'clues', 'action', p_answers ->> 'action');

  elsif p_mission_code in ('identite-numerique', 'identite-numerique-02', 'identite-numerique-06', 'identite-numerique-09', 'identite-numerique-11', 'identite-numerique-15') then
    v_visibility := p_answers ->> 'visibility';
    v_field_choices := p_answers -> 'choices';
    if coalesce(jsonb_typeof(v_field_choices), '') <> 'object' or coalesce(v_visibility, '') not in ('contacts', 'public') then
      raise exception 'Réglages du profil simulé invalides.' using errcode = '22023';
    end if;
    v_sensitive_fields := case v_age_band
      when '6-8' then array['nickname', 'school', 'place']
      when '9-11' then array['nickname', 'school', 'place']
      when '12-15' then array['nickname', 'school', 'place', 'routine']
      else array['nickname', 'school', 'place', 'routine', 'contact']
    end;
    v_allowed_fields := case when v_age_band = '6-8' then v_sensitive_fields else v_sensitive_fields || array['interest'] end;
    if (select count(*) from jsonb_object_keys(v_field_choices)) <> cardinality(v_allowed_fields)
      or exists (
      select 1 from jsonb_each_text(v_field_choices) as choice(key, value)
      where choice.value not in ('private', 'public') or not (choice.key = any(v_allowed_fields))
    ) or exists (
      select 1 from unnest(v_allowed_fields) as allowed(field)
      where not (v_field_choices ? allowed.field)
    ) then
      raise exception 'Choix du profil simulé incomplets ou invalides.' using errcode = '22023';
    end if;
    select count(*)::integer into v_private_sensitive_count
    from unnest(v_sensitive_fields) as sensitive(field)
    where v_field_choices ->> sensitive.field = 'private';
    if exists (
      select 1 from unnest(v_sensitive_fields) as sensitive(field)
      where v_field_choices ->> sensitive.field is distinct from 'private'
    ) then
      v_status := 'retry';
    end if;
    v_sensitive_count := cardinality(v_sensitive_fields);
    v_score := round((v_private_sensitive_count::numeric / v_sensitive_count) * 75)::integer
      + case when v_visibility = 'contacts' then 25 else 0 end;
    if v_private_sensitive_count = v_sensitive_count and v_visibility = 'contacts' then v_status := 'completed'; end if;
    v_criteria := jsonb_build_object(
      'informations_sensibles_privees', v_private_sensitive_count = v_sensitive_count,
      'audience_limitee', v_visibility = 'contacts',
      'informations_protegees', v_private_sensitive_count,
      'informations_a_proteger', v_sensitive_count
    );
    v_responses := jsonb_build_object('choices', v_field_choices, 'visibility', v_visibility);

  elsif p_mission_code in ('enquete-information', 'enquete-information-03', 'enquete-information-05', 'enquete-information-08', 'enquete-information-12', 'enquete-information-14') then
    v_expected_sources := case v_age_band
      when '6-8' then array['message', 'page-officielle']
      when '9-11' then array['message', 'page-officielle', 'date']
      when '12-15' then array['message', 'page-officielle', 'date', 'auteur']
      else array['message', 'page-officielle', 'date', 'auteur', 'source-croisee']
    end;
    if coalesce(jsonb_typeof(p_answers -> 'openedSources'), '') <> 'array' then
      raise exception 'Sources consultées invalides.' using errcode = '22023';
    end if;
    if jsonb_array_length(p_answers -> 'openedSources') > cardinality(v_expected_sources) or exists (
        select 1 from jsonb_array_elements_text(p_answers -> 'openedSources') as source(value)
        where not (source.value = any(v_expected_sources))
      ) then
      raise exception 'Sources consultées invalides.' using errcode = '22023';
    end if;
    if coalesce(p_answers ->> 'conclusion', '') not in ('confirmed', 'doubtful', 'impossible')
      or coalesce(p_answers ->> 'sharing', '') not in ('share', 'wait') then
      raise exception 'Conclusion ou décision de partage invalide.' using errcode = '22023';
    end if;
    select coalesce(array_agg(distinct source.value), array[]::text[]) into v_opened_sources
    from jsonb_array_elements_text(p_answers -> 'openedSources') as source(value);
    v_source_count := cardinality(v_opened_sources);
    v_conclusion := p_answers ->> 'conclusion';
    v_sharing := p_answers ->> 'sharing';
    v_score := least(v_source_count, 3) * 20
      + case when v_conclusion = 'impossible' then 20 else 0 end
      + case when v_sharing = 'wait' then 20 else 0 end;
    if v_source_count >= 2 and v_conclusion = 'impossible' and v_sharing = 'wait' then v_status := 'completed'; end if;
    v_criteria := jsonb_build_object(
      'compare_au_moins_deux_sources', v_source_count >= 2,
      'reconnait_limite_des_preuves', v_conclusion = 'impossible',
      'ne_partage_pas_sans_verifier', v_sharing = 'wait',
      'sources_consultees', v_source_count
    );
    v_responses := jsonb_build_object('openedSources', to_jsonb(v_opened_sources), 'conclusion', v_conclusion, 'sharing', v_sharing);
  else
    raise exception 'Mission inconnue.' using errcode = '22023';
  end if;

  v_score := least(100, greatest(0, v_score));
  insert into public.practice_attempts (
    learner_id, mission_code, age_band, attempt_number, status, score,
    demonstrated_criteria, responses
  ) values (
    v_learner_id, p_mission_code, v_age_band, v_attempt_number, v_status, v_score,
    v_criteria, v_responses
  ) returning id into v_attempt_id;

  return jsonb_build_object(
    'id', v_attempt_id,
    'mission_code', p_mission_code,
    'attempt_number', v_attempt_number,
    'status', v_status,
    'score', v_score,
    'demonstrated_criteria', v_criteria,
    'created_at', now()
  );
end;
$$;

revoke all on function public.submit_practice_attempt(text, jsonb) from public, anon;
grant execute on function public.submit_practice_attempt(text, jsonb) to authenticated;
