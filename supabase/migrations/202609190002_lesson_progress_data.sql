-- Lesson engine state for deterministic labs.
-- Review and run manually in the Supabase SQL Editor.
-- Existing lesson rows and RLS policies are preserved.

alter table public.lesson_progress
  add column if not exists progress_data jsonb not null default '{}'::jsonb;

comment on column public.lesson_progress.progress_data is
  'Non-secret learner-owned lesson stage state, validation results and reflections.';
