-- Lesson 01 persistence repair and explicit server-side state columns.
-- Run once in the Supabase SQL Editor before deploying the matching frontend.

alter table public.lesson_progress
  add column if not exists progress_data jsonb not null default '{}'::jsonb,
  add column if not exists current_stage text not null default 'understand',
  add column if not exists updated_at timestamptz not null default now();

update public.lesson_progress
set current_stage = coalesce(nullif(progress_data ->> 'currentStage', ''), current_stage),
    updated_at = now();

grant select, insert, update, delete on table public.lesson_progress to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'lesson_progress_set_updated_at'
      and tgrelid = 'public.lesson_progress'::regclass
  ) then
    create trigger lesson_progress_set_updated_at
      before update on public.lesson_progress
      for each row execute procedure public.set_updated_at();
  end if;
end;
$$;

-- RLS remains authoritative: each learner can only operate on their own user_id.
alter table public.lesson_progress enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lesson_progress' and policyname = 'Learners can read own lesson progress') then
    create policy "Learners can read own lesson progress" on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lesson_progress' and policyname = 'Learners can insert own lesson progress') then
    create policy "Learners can insert own lesson progress" on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lesson_progress' and policyname = 'Learners can update own lesson progress') then
    create policy "Learners can update own lesson progress" on public.lesson_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
  end if;
end;
$$;

comment on column public.lesson_progress.current_stage is 'Furthest active learning stage; reviewing an earlier viewed stage does not reduce it.';
comment on column public.lesson_progress.progress_data is 'Learner-owned non-secret lesson state including viewed stage, completed stages and validation results.';

-- Ensure PostgREST sees newly added columns immediately.
notify pgrst, 'reload schema';
