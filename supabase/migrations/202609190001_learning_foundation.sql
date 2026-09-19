-- Prepared migration: review and run manually in the Supabase SQL Editor.
-- Creates learner-owned records only; no privileged key is required by the frontend.

create type public.learning_status as enum ('Not Started', 'Learning', 'Practicing', 'Needs Review', 'Completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'learner' check (role in ('learner', 'admin')),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check (lesson_id between 1 and 20),
  status public.learning_status not null default 'Not Started',
  started_at timestamptz,
  completed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_activity_at timestamptz not null default now(),
  notes text,
  unique (user_id, lesson_id)
);

create table public.lesson_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check (lesson_id between 1 and 20),
  webhook_url text not null,
  connection_status text not null default 'untested' check (connection_status in ('untested', 'valid', 'invalid', 'error')),
  last_tested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.project_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  status public.learning_status not null default 'Not Started',
  notes text,
  updated_at timestamptz not null default now(),
  unique (user_id, project_id)
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_connections enable row level security;
alter table public.project_progress enable row level security;

create policy "Learners can read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Learners can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Learners can read own lesson progress" on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners can insert own lesson progress" on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners can update own lesson progress" on public.lesson_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners can delete own lesson progress" on public.lesson_progress for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Learners can read own lesson connections" on public.lesson_connections for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners can insert own lesson connections" on public.lesson_connections for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners can update own lesson connections" on public.lesson_connections for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners can delete own lesson connections" on public.lesson_connections for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Learners can read own project progress" on public.project_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners can insert own project progress" on public.project_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners can update own project progress" on public.project_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners can delete own project progress" on public.project_progress for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.protect_profile_privileges()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (select auth.uid()) is not null and (new.role <> old.role or new.plan <> old.plan) then
    raise exception 'Role and plan may only be changed by a trusted administrator';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_privileges before update on public.profiles for each row execute procedure public.protect_profile_privileges();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger lesson_connections_set_updated_at before update on public.lesson_connections for each row execute procedure public.set_updated_at();
create trigger project_progress_set_updated_at before update on public.project_progress for each row execute procedure public.set_updated_at();
