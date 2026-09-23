-- One maintained lesson, one canonical progress row per learner.
-- Review and run manually in the Supabase SQL Editor before deploying the matching frontend.

begin;

-- Make this migration safe for projects where the earlier repeat-attempt
-- migration was prepared but not yet applied.
create table if not exists public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check (lesson_id between 1 and 20),
  lesson_version integer not null default 2 check (lesson_version > 0),
  attempt_number integer not null check (attempt_number >= 2),
  status public.learning_status not null default 'Learning',
  current_stage text not null default 'understand',
  progress_data jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id, lesson_version, attempt_number)
);

alter table public.lesson_attempts enable row level security;
drop policy if exists "Learners can read own lesson attempts" on public.lesson_attempts;
create policy "Learners can read own lesson attempts" on public.lesson_attempts
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Learners can insert own lesson attempts" on public.lesson_attempts;
create policy "Learners can insert own lesson attempts" on public.lesson_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Learners can update own lesson attempts" on public.lesson_attempts;
create policy "Learners can update own lesson attempts" on public.lesson_attempts
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
grant select, insert, update on table public.lesson_attempts to authenticated;

drop trigger if exists lesson_attempts_set_updated_at on public.lesson_attempts;
create trigger lesson_attempts_set_updated_at before update on public.lesson_attempts
  for each row execute procedure public.set_updated_at();

-- Keep the newest maintained lesson payload, while preserving completion if any
-- earlier version row was already complete.
with rollup as (
  select
    user_id,
    lesson_id,
    (array_agg(id order by (status = 'Completed'::public.learning_status) desc, lesson_version desc, last_activity_at desc, updated_at desc))[1] as keep_id,
    bool_or(status = 'Completed'::public.learning_status) as was_completed,
    min(started_at) as first_started_at,
    max(completed_at) as last_completed_at,
    max(last_activity_at) as last_activity,
    max(attempt_count) as prior_attempt_count
  from public.lesson_progress
  group by user_id, lesson_id
), consolidated as (
  update public.lesson_progress progress
  set status = case when rollup.was_completed then 'Completed'::public.learning_status else progress.status end,
      started_at = coalesce(rollup.first_started_at, progress.started_at),
      completed_at = case when rollup.was_completed then coalesce(rollup.last_completed_at, progress.completed_at, now()) else progress.completed_at end,
      attempt_count = greatest(rollup.prior_attempt_count, case when rollup.was_completed then 1 else 0 end),
      last_activity_at = greatest(progress.last_activity_at, rollup.last_activity),
      updated_at = now()
  from rollup
  where progress.id = rollup.keep_id
  returning progress.id
)
delete from public.lesson_progress progress
where not exists (select 1 from consolidated kept where kept.id = progress.id)
  and exists (
    select 1 from public.lesson_progress kept
    where kept.user_id = progress.user_id
      and kept.lesson_id = progress.lesson_id
      and kept.id <> progress.id
  );

-- A production connection is also canonical per learner and lesson. Keep the
-- most recently maintained row when old version-scoped duplicates exist.
with ranked as (
  select id, row_number() over (
    partition by user_id, lesson_id
    order by lesson_version desc, updated_at desc, created_at desc
  ) as position
  from public.lesson_connections
)
delete from public.lesson_connections connection
using ranked
where connection.id = ranked.id and ranked.position > 1;

-- Attempt history is retained. Only an accidental cross-version duplicate of
-- the same attempt number is consolidated, preferring the newest record.
with ranked as (
  select id, row_number() over (
    partition by user_id, lesson_id, attempt_number
    order by lesson_version desc, updated_at desc, created_at desc
  ) as position
  from public.lesson_attempts
)
delete from public.lesson_attempts attempt
using ranked
where attempt.id = ranked.id and ranked.position > 1;

drop index if exists public.lesson_progress_user_lesson_version_key;
drop index if exists public.lesson_connections_user_lesson_version_key;
drop index if exists public.lesson_attempts_user_lesson_idx;

alter table public.lesson_progress drop constraint if exists lesson_progress_user_lesson_version_key;
alter table public.lesson_connections drop constraint if exists lesson_connections_user_lesson_version_key;
alter table public.lesson_attempts drop constraint if exists lesson_attempts_user_id_lesson_id_lesson_version_attempt_number_key;

do $$
declare item record;
begin
  for item in
    select ns.nspname as schema_name, cls.relname as table_name, con.conname
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    where ns.nspname = 'public'
      and cls.relname in ('lesson_progress', 'lesson_connections', 'lesson_attempts')
      and pg_get_constraintdef(con.oid) ilike '%lesson_version%'
  loop
    execute format('alter table %I.%I drop constraint %I', item.schema_name, item.table_name, item.conname);
  end loop;
end;
$$;

alter table public.lesson_progress drop column if exists lesson_version;
alter table public.lesson_connections drop column if exists lesson_version;
alter table public.lesson_attempts drop column if exists lesson_version;

create unique index if not exists lesson_progress_user_id_lesson_id_key
  on public.lesson_progress (user_id, lesson_id);
create unique index if not exists lesson_connections_user_id_lesson_id_key
  on public.lesson_connections (user_id, lesson_id);
create unique index if not exists lesson_attempts_user_lesson_attempt_key
  on public.lesson_attempts (user_id, lesson_id, attempt_number);
create index if not exists lesson_attempts_user_lesson_idx
  on public.lesson_attempts (user_id, lesson_id, attempt_number desc);

comment on table public.lesson_progress is 'One canonical maintained progress record per learner and lesson.';
comment on table public.lesson_attempts is 'Learner-owned practice sessions with attempt-specific stage, test and evidence state.';

create or replace function public.ensure_completed_lesson_attempt_count()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'Completed'::public.learning_status then
    new.attempt_count = greatest(new.attempt_count, 1);
  end if;
  return new;
end;
$$;

drop trigger if exists lesson_progress_ensure_attempt_count on public.lesson_progress;
create trigger lesson_progress_ensure_attempt_count
  before insert or update of status, attempt_count on public.lesson_progress
  for each row execute procedure public.ensure_completed_lesson_attempt_count();

-- Completing a practice attempt refreshes the canonical lesson summary without
-- replacing canonical stage evidence or deleting attempt history.
create or replace function public.refresh_lesson_progress_from_attempt()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'Completed'::public.learning_status
     and (tg_op = 'INSERT' or (tg_op = 'UPDATE' and old.status is distinct from new.status)) then
    update public.lesson_progress
    set status = 'Completed'::public.learning_status,
        completed_at = coalesce(completed_at, new.completed_at, now()),
        last_activity_at = now(),
        attempt_count = greatest(
          attempt_count,
          1 + (
            select count(*)::integer
            from public.lesson_attempts attempts
            where attempts.user_id = new.user_id
              and attempts.lesson_id = new.lesson_id
              and attempts.status = 'Completed'::public.learning_status
          )
        ),
        updated_at = now()
    where user_id = new.user_id and lesson_id = new.lesson_id;
  end if;
  return new;
end;
$$;

drop trigger if exists lesson_attempts_refresh_progress on public.lesson_attempts;
create trigger lesson_attempts_refresh_progress
  after insert or update of status, completed_at on public.lesson_attempts
  for each row execute procedure public.refresh_lesson_progress_from_attempt();

notify pgrst, 'reload schema';
commit;
