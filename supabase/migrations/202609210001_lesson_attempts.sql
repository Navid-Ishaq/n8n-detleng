-- Repeat practice attempts are separate from canonical curriculum completion.
-- Review and run manually in the Supabase SQL Editor.

create table if not exists public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check (lesson_id between 1 and 20),
  lesson_version integer not null check (lesson_version > 0),
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

create index if not exists lesson_attempts_user_lesson_idx
  on public.lesson_attempts (user_id, lesson_id, lesson_version, attempt_number desc);

alter table public.lesson_attempts enable row level security;

drop policy if exists "Learners can read own lesson attempts" on public.lesson_attempts;
create policy "Learners can read own lesson attempts"
  on public.lesson_attempts for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Learners can insert own lesson attempts" on public.lesson_attempts;
create policy "Learners can insert own lesson attempts"
  on public.lesson_attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Learners can update own lesson attempts" on public.lesson_attempts;
create policy "Learners can update own lesson attempts"
  on public.lesson_attempts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on table public.lesson_attempts to authenticated;

drop trigger if exists lesson_attempts_set_updated_at on public.lesson_attempts;
create trigger lesson_attempts_set_updated_at
  before update on public.lesson_attempts
  for each row execute procedure public.set_updated_at();

comment on table public.lesson_attempts is 'Learner-owned repeat practice attempts that never replace canonical lesson completion.';
notify pgrst, 'reload schema';
