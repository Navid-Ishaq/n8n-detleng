-- Non-destructive Lesson 01 versioning. Review and run manually in Supabase SQL Editor.
-- Existing rows become version 1; the redesigned live Lesson 01 writes version 2.

alter table public.lesson_progress add column if not exists lesson_version integer not null default 1 check (lesson_version > 0);
alter table public.lesson_connections add column if not exists lesson_version integer not null default 1 check (lesson_version > 0);

alter table public.lesson_progress drop constraint if exists lesson_progress_user_id_lesson_id_key;
alter table public.lesson_connections drop constraint if exists lesson_connections_user_id_lesson_id_key;

create unique index if not exists lesson_progress_user_lesson_version_key on public.lesson_progress (user_id, lesson_id, lesson_version);
create unique index if not exists lesson_connections_user_lesson_version_key on public.lesson_connections (user_id, lesson_id, lesson_version);

comment on column public.lesson_progress.lesson_version is 'Lesson content version. Earlier completion rows remain preserved.';
comment on column public.lesson_connections.lesson_version is 'Connection ownership scoped to a specific lesson version.';
notify pgrst, 'reload schema';
