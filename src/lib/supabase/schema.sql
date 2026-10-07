-- Initial schema for the learning platform. Apply through Supabase migrations.
create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('learner', 'educator', 'admin');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.age_band as enum ('6-8', '9-11', '12-15', '16-18');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role public.app_role not null default 'learner',
  age_band public.age_band,
  organization_id uuid,
  educator_id uuid references public.profiles(id) on delete set null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learner_must_have_age_band check (role <> 'learner' or age_band is not null)
);

create table if not exists public.learning_tracks (
  id uuid primary key default gen_random_uuid(),
  age_min smallint not null check (age_min >= 6),
  age_max smallint not null check (age_max <= 18 and age_max >= age_min),
  title text not null,
  description text not null default '',
  sort_order smallint not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.learning_tracks(id) on delete cascade,
  title text not null,
  summary text not null default '',
  content jsonb not null default '{}'::jsonb,
  estimated_minutes smallint not null default 5 check (estimated_minutes between 1 and 180),
  sort_order smallint not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  track_id uuid not null references public.learning_tracks(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (learner_id, track_id)
);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  score smallint check (score between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (learner_id, module_id)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null default '',
  icon text not null default '⭐'
);

create table if not exists public.learner_badges (
  learner_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (learner_id, badge_id)
);

create index if not exists modules_track_sort_idx on public.modules(track_id, sort_order);
create index if not exists enrollments_learner_idx on public.enrollments(learner_id);
create index if not exists module_progress_learner_idx on public.module_progress(learner_id);
create index if not exists profiles_educator_idx on public.profiles(educator_id);

-- Self-signup is intentionally limited to learner and educator accounts.
-- Platform administrators must be provisioned by a trusted operator.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  safe_role public.app_role;
begin
  safe_role := case when requested_role = 'educator' then 'educator'::public.app_role else 'learner'::public.app_role end;
  insert into public.profiles (id, display_name, role, age_band)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Jeune'),
    safe_role,
    case when safe_role = 'learner' then nullif(new.raw_user_meta_data ->> 'age_band', '')::public.age_band else null end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.learning_tracks enable row level security;
alter table public.modules enable row level security;
alter table public.enrollments enable row level security;
alter table public.module_progress enable row level security;
alter table public.badges enable row level security;
alter table public.learner_badges enable row level security;

create or replace function public.current_app_role()
returns public.app_role language sql stable security definer set search_path = ''
as $$ select role from public.profiles where id = (select auth.uid()) $$;

drop policy if exists "profiles_read_self_or_staff" on public.profiles;
create policy "profiles_read_self_or_staff" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.current_app_role() = 'admin' or (public.current_app_role() = 'educator' and educator_id = (select auth.uid())));
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists "published_tracks_read" on public.learning_tracks;
create policy "published_tracks_read" on public.learning_tracks for select to authenticated using (status = 'published' or public.current_app_role() = 'admin');
drop policy if exists "published_modules_read" on public.modules;
create policy "published_modules_read" on public.modules for select to authenticated using (status = 'published' or public.current_app_role() = 'admin');
drop policy if exists "enrollments_read_scoped" on public.enrollments;
create policy "enrollments_read_scoped" on public.enrollments for select to authenticated
using (learner_id = (select auth.uid()) or public.current_app_role() = 'admin' or (public.current_app_role() = 'educator' and exists (select 1 from public.profiles p where p.id = learner_id and p.educator_id = (select auth.uid()))));
drop policy if exists "learners_manage_own_enrollments" on public.enrollments;
create policy "learners_manage_own_enrollments" on public.enrollments for all to authenticated
using (learner_id = (select auth.uid())) with check (learner_id = (select auth.uid()));
drop policy if exists "progress_read_scoped" on public.module_progress;
create policy "progress_read_scoped" on public.module_progress for select to authenticated
using (learner_id = (select auth.uid()) or public.current_app_role() = 'admin' or (public.current_app_role() = 'educator' and exists (select 1 from public.profiles p where p.id = learner_id and p.educator_id = (select auth.uid()))));
drop policy if exists "learners_manage_own_progress" on public.module_progress;
create policy "learners_manage_own_progress" on public.module_progress for all to authenticated
using (learner_id = (select auth.uid())) with check (learner_id = (select auth.uid()));
drop policy if exists "badges_read_authenticated" on public.badges;
create policy "badges_read_authenticated" on public.badges for select to authenticated using (true);
drop policy if exists "learner_badges_read_scoped" on public.learner_badges;
create policy "learner_badges_read_scoped" on public.learner_badges for select to authenticated
using (learner_id = (select auth.uid()) or public.current_app_role() = 'admin' or (public.current_app_role() = 'educator' and exists (select 1 from public.profiles p where p.id = learner_id and p.educator_id = (select auth.uid()))));

-- Role assignments and content authoring must be implemented with trusted server-side
-- actions; never accept privileged roles or service keys from the browser.
