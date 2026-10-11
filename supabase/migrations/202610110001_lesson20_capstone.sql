-- Lesson 20: production-style AI operations capstone.
-- Apply manually in the Supabase SQL Editor before enabling the live lesson.

begin;

create extension if not exists vector with schema extensions;

create table if not exists public.capstone_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_attempt_number integer not null default 1 check (lesson_attempt_number > 0),
  scenario_key text not null check (scenario_key in ('A','B','C','D','E','F','custom')),
  request_type text not null check (request_type in ('support_update','knowledge_question','refund_request','account_change')),
  input_summary jsonb not null default '{}'::jsonb,
  classification jsonb,
  ai_used boolean not null default false,
  rag_used boolean not null default false,
  citations jsonb not null default '[]'::jsonb,
  risk_level text check (risk_level in ('low','high','ambiguous')),
  approval_required boolean not null default false,
  status text not null default 'queued' check (status in ('queued','processing','pending_approval','completed','rejected','failed','handled_failure')),
  decision text check (decision in ('approved','rejected')),
  action_state text not null default 'not_requested' check (action_state in ('not_requested','blocked','claimed','executed')),
  retry_count integer not null default 0 check (retry_count >= 0),
  error_code text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.capstone_events (
  id bigint generated always as identity primary key,
  run_id uuid not null references public.capstone_runs(id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  event_type text not null,
  actor_type text not null check (actor_type in ('learner','system','ai','tool')),
  actor_id uuid references auth.users(id) on delete set null,
  outcome text not null,
  message text not null check (char_length(message) <= 500),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (run_id, sequence_number)
);

create table if not exists public.capstone_approvals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique references public.capstone_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  reason text check (reason is null or char_length(reason) <= 500),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null
);

create table if not exists public.capstone_actions (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique references public.capstone_runs(id) on delete cascade,
  action_type text not null,
  status text not null check (status in ('claimed','executed','blocked')),
  payload_summary jsonb not null default '{}'::jsonb,
  receipt text unique,
  executed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source_id text not null unique,
  title text not null,
  version text not null,
  category text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  embedding extensions.vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index if not exists capstone_runs_user_attempt_idx on public.capstone_runs(user_id, lesson_attempt_number, created_at desc);
create index if not exists capstone_runs_status_idx on public.capstone_runs(status, created_at desc);
create index if not exists capstone_events_run_sequence_idx on public.capstone_events(run_id, sequence_number);
create index if not exists capstone_approvals_user_status_idx on public.capstone_approvals(user_id, status);
create index if not exists knowledge_chunks_embedding_hnsw_idx on public.knowledge_chunks using hnsw (embedding extensions.vector_cosine_ops) where embedding is not null;

alter table public.capstone_runs enable row level security;
alter table public.capstone_events enable row level security;
alter table public.capstone_approvals enable row level security;
alter table public.capstone_actions enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;

drop policy if exists "Learners read own capstone runs" on public.capstone_runs;
drop policy if exists "Learners read own capstone events" on public.capstone_events;
drop policy if exists "Learners read own capstone approvals" on public.capstone_approvals;
drop policy if exists "Learners read own capstone actions" on public.capstone_actions;

create policy "Learners read own capstone runs" on public.capstone_runs for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners read own capstone events" on public.capstone_events for select to authenticated using (exists (select 1 from public.capstone_runs r where r.id = run_id and r.user_id = (select auth.uid())));
create policy "Learners read own capstone approvals" on public.capstone_approvals for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners read own capstone actions" on public.capstone_actions for select to authenticated using (exists (select 1 from public.capstone_runs r where r.id = run_id and r.user_id = (select auth.uid())));

grant select on public.capstone_runs, public.capstone_events, public.capstone_approvals, public.capstone_actions to authenticated;
revoke all on public.knowledge_documents, public.knowledge_chunks from anon, authenticated;

-- The Render API uses the server-only Supabase secret key. Declare its
-- privileges explicitly instead of relying on project default grants.
grant usage on schema public, extensions to service_role;
grant select, insert, update, delete on
  public.capstone_runs,
  public.capstone_events,
  public.capstone_approvals,
  public.capstone_actions,
  public.knowledge_documents,
  public.knowledge_chunks
to service_role;
grant usage, select on sequence public.capstone_events_id_seq to service_role;

create or replace function public.match_capstone_knowledge(
  query_embedding extensions.vector(1536),
  match_threshold double precision default 0.45,
  match_count integer default 4
)
returns table (chunk_id uuid, source_id text, title text, content text, similarity double precision)
language sql stable security definer set search_path = ''
as $$
  select c.id, d.source_id, d.title, c.content,
         1 - (c.embedding OPERATOR(extensions.<=>) query_embedding)
  from public.knowledge_chunks c
  join public.knowledge_documents d on d.id = c.document_id
  where c.embedding is not null
    and 1 - (c.embedding OPERATOR(extensions.<=>) query_embedding) >= match_threshold
  order by c.embedding OPERATOR(extensions.<=>) query_embedding
  limit least(greatest(match_count, 1), 8);
$$;

create or replace function public.decide_capstone_approval(p_run_id uuid, p_user_id uuid, p_decision text, p_reason text default null)
returns text language plpgsql security definer set search_path = ''
as $$
declare v_status text;
begin
  if p_decision not in ('approved','rejected') then raise exception 'invalid decision'; end if;
  update public.capstone_approvals
  set status = p_decision, reason = left(p_reason, 500), decided_at = now(), decided_by = p_user_id
  where run_id = p_run_id and user_id = p_user_id and status = 'pending'
  returning status into v_status;
  if v_status is null then raise exception 'approval is not pending'; end if;
  update public.capstone_runs set decision = p_decision, updated_at = now() where id = p_run_id and user_id = p_user_id;
  return v_status;
end;
$$;

create or replace function public.claim_capstone_action(p_run_id uuid, p_action_type text, p_payload_summary jsonb)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare v_run public.capstone_runs%rowtype; v_action_id uuid;
begin
  select * into v_run from public.capstone_runs where id = p_run_id for update;
  if v_run.id is null then raise exception 'run not found'; end if;
  if v_run.approval_required and v_run.decision is distinct from 'approved' then raise exception 'approval required'; end if;
  if v_run.status = 'rejected' or v_run.decision = 'rejected' then raise exception 'rejected run cannot execute'; end if;
  insert into public.capstone_actions(run_id, action_type, status, payload_summary)
  values (p_run_id, p_action_type, 'claimed', coalesce(p_payload_summary, '{}'::jsonb))
  on conflict (run_id) do nothing returning id into v_action_id;
  if v_action_id is null then raise exception 'action already claimed'; end if;
  update public.capstone_runs set action_state = 'claimed', updated_at = now() where id = p_run_id;
  return v_action_id;
end;
$$;

revoke all on function public.match_capstone_knowledge(extensions.vector, double precision, integer) from public, anon, authenticated;
revoke all on function public.decide_capstone_approval(uuid, uuid, text, text) from public, anon, authenticated;
revoke all on function public.claim_capstone_action(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.match_capstone_knowledge(extensions.vector, double precision, integer) to service_role;
grant execute on function public.decide_capstone_approval(uuid, uuid, text, text) to service_role;
grant execute on function public.claim_capstone_action(uuid, text, jsonb) to service_role;

insert into public.knowledge_documents(source_id,title,version,category,content,metadata) values
('KB-REFUND-001','Refund and Approval Policy','1.0','refunds','Refund requests within 30 days may be considered. Refunds above EUR 100 always require human approval. Requests after 30 days require a policy exception and human review.', '{"public":true}'::jsonb),
('KB-SECURITY-001','Sensitive Account and Data-Change Rules','1.0','security','Account deletion, identity changes, permission changes and sensitive data exports always require authenticated human approval. Ambiguous requests must fail closed.', '{"public":true}'::jsonb),
('KB-SUPPORT-001','Support Escalation Policy','1.0','support','Normal support notes may be recorded automatically. High-priority incidents must be escalated to an operator and must include a concise safe summary.', '{"public":true}'::jsonb),
('KB-RETRY-001','External Service Retry Policy','1.0','reliability','Transient HTTP 503 failures may be retried up to three total attempts. Every failed attempt and the final outcome must be recorded.', '{"public":true}'::jsonb),
('KB-ACTION-001','Permitted Automated Actions','1.0','actions','The sandbox may automatically record support notes and low-impact demonstrations. Financial actions and account changes require approval and are simulated only.', '{"public":true}'::jsonb)
on conflict (source_id) do update set title=excluded.title, version=excluded.version, category=excluded.category, content=excluded.content, metadata=excluded.metadata, updated_at=now();

insert into public.knowledge_chunks(document_id,chunk_index,content,metadata)
select id, 0, content, jsonb_build_object('source_id',source_id,'version',version)
from public.knowledge_documents
on conflict (document_id,chunk_index) do update set content=excluded.content, metadata=excluded.metadata;

notify pgrst, 'reload schema';
commit;
