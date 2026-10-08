-- Attribue automatiquement des badges après les quiz validés.
-- À exécuter après schema.sql dans Supabase > SQL Editor.
-- Le script est idempotent et prend aussi en compte la progression existante.

insert into public.badges (code, title, description, icon) values
  ('premier-reflexe', 'Premier bon réflexe', 'Tu as validé ta première activité et commencé ton parcours.', '🌱'),
  ('explorateur-numerique', 'Explorateur numérique', 'Tu as validé quatre activités et renforcé tes réflexes.', '🧭'),
  ('allie-du-numerique', 'Allié du numérique', 'Tu as validé huit activités et tu peux aider les autres à mieux naviguer.', '🛡️')
on conflict (code) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon;

create or replace function public.award_completion_badges()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  completed_total integer;
begin
  if new.completed_at is null then
    return new;
  end if;

  select count(*) into completed_total
  from public.module_progress
  where learner_id = new.learner_id and completed_at is not null;

  insert into public.learner_badges (learner_id, badge_id)
  select new.learner_id, badge.id
  from public.badges as badge
  where (badge.code = 'premier-reflexe' and completed_total >= 1)
     or (badge.code = 'explorateur-numerique' and completed_total >= 4)
     or (badge.code = 'allie-du-numerique' and completed_total >= 8)
  on conflict (learner_id, badge_id) do nothing;

  return new;
end;
$$;

revoke all on function public.award_completion_badges() from public, anon, authenticated;
drop trigger if exists award_badges_after_module_completion on public.module_progress;
create trigger award_badges_after_module_completion
  after insert or update of completed_at on public.module_progress
  for each row execute function public.award_completion_badges();

-- Attribue aussi les badges correspondant aux progressions déjà enregistrées.
with completed_by_learner as (
  select learner_id, count(*)::integer as completed_total
  from public.module_progress
  where completed_at is not null
  group by learner_id
)
insert into public.learner_badges (learner_id, badge_id)
select progress.learner_id, badge.id
from completed_by_learner as progress
join public.badges as badge on
  (badge.code = 'premier-reflexe' and progress.completed_total >= 1)
  or (badge.code = 'explorateur-numerique' and progress.completed_total >= 4)
  or (badge.code = 'allie-du-numerique' and progress.completed_total >= 8)
on conflict (learner_id, badge_id) do nothing;

select code, title, description, icon
from public.badges
where code in ('premier-reflexe', 'explorateur-numerique', 'allie-du-numerique')
order by code;
