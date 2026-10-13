begin;

create table if not exists public.capstone_report_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_attempt_number integer not null check (lesson_attempt_number > 0),
  report_type text not null check (report_type in ('scenario','final')),
  scenario_key text check (scenario_key in ('A','B','C','D','E','F')),
  run_id uuid references public.capstone_runs(id) on delete set null,
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  provider_message_id text,
  error_message text check (error_message is null or char_length(error_message) <= 500),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (user_id, lesson_attempt_number, report_type, scenario_key),
  check ((report_type = 'scenario' and scenario_key is not null and run_id is not null) or (report_type = 'final' and scenario_key is null))
);

create index if not exists capstone_report_deliveries_user_attempt_idx on public.capstone_report_deliveries(user_id, lesson_attempt_number, created_at desc);
alter table public.capstone_report_deliveries enable row level security;
drop policy if exists "Learners read own capstone report deliveries" on public.capstone_report_deliveries;
create policy "Learners read own capstone report deliveries" on public.capstone_report_deliveries for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.capstone_report_deliveries to authenticated;
grant select, insert, update, delete on public.capstone_report_deliveries to service_role;

notify pgrst, 'reload schema';
commit;
