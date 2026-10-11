# Lesson 20 — Production AI Operations System

## Release truth

Lesson 20 is a flagship portfolio/test preview. Lessons 03–19 are still planned. This lesson recreates the capabilities it needs locally and does not claim those lessons were completed.

Lesson 20 does not call or verify a learner n8n instance. Its live path is:

```text
Detleng frontend → authenticated Render API → OpenAI → Supabase PostgreSQL/pgvector → controlled internal tools
```

## Security invariant

```text
AI proposes.
Rules constrain.
Humans approve sensitive action.
The system records what happened.
```

The AI response is schema-validated. Financial/account operations and ambiguous output require approval. The action claim function independently verifies the authoritative database decision and enforces one action per run.

## Models

- LLM default: `gpt-5-mini`, configurable with `OPENAI_MODEL`.
- Embeddings: `text-embedding-3-small`, configurable with `OPENAI_EMBEDDING_MODEL`.
- Stored vector dimension: 1536.

The migration and backend must be changed together if a future embedding model uses another dimension.

## Knowledge fixtures

- `KB-REFUND-001`
- `KB-SECURITY-001`
- `KB-SUPPORT-001`
- `KB-RETRY-001`
- `KB-ACTION-001`

Document text is seeded by migration. Embeddings are generated once through the authenticated **Prepare RAG knowledge** action and are reused.

## Controlled tools

The backend implements narrow internal tools: `lookup_customer`, `lookup_policy`, `check_service_health`, and `simulate_action`. They are not described as MCP because this prototype does not implement the MCP transport/protocol. No tool receives shell, filesystem or arbitrary-network access.

## Live scenarios

- A — low-risk request executes one safe sandbox action.
- B — question embedding retrieves approved pgvector evidence and produces a grounded answer.
- C — deterministic 503 failures are recorded before recovery.
- D — sensitive request stops at pending approval.
- E — authenticated approval permits exactly one action.
- F — authenticated rejection permanently prevents action.

## Deployment step

Apply `supabase/migrations/202610110001_lesson20_capstone.sql` once in the Supabase SQL Editor. Render must already contain `OPENAI_API_KEY` and `SUPABASE_SECRET_KEY`; no secret belongs in Git or frontend JavaScript.
