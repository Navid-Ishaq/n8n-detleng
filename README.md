# n8n Detleng

A practical learning platform for n8n AI Automation Engineering. The product is an independent DeTLeng project created by Muhammad Naveed Ishaque and is not affiliated with or endorsed by n8n GmbH.

## Architecture

- Static React + TypeScript frontend hosted on GitHub Pages at `n8n.detleng.com`
- Supabase Auth and Postgres with Row Level Security for learner identity and progress
- Separate Render API for trusted webhook execution, validation, rate limiting and SSRF controls
- Learner-owned n8n instances and credentials

The current implementation stage is the public experience. Supabase and Render values are intentionally not required yet.

## GitHub Pages deployment

The site is built and deployed by `.github/workflows/deploy-pages.yml`. GitHub Pages must use **GitHub Actions** as its publishing source; serving the repository root directly will expose the Vite source entry point instead of the compiled application.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Planned repository shape

```text
n8n-detleng/
├── apps/
│   ├── web/              # Static GitHub Pages frontend (current root, moved when API begins)
│   └── api/              # Trusted Render API
├── packages/
│   └── curriculum/       # Typed lesson content and validation contracts
├── supabase/
│   └── migrations/       # Schema and RLS policies
├── docs/                 # Architecture, authoring, integration and deployment guides
└── public/               # Static assets and CNAME
```

## Security boundary

Learners configure OpenAI, Claude, Gemini, Gmail, Telegram and other credentials only inside their own n8n credential store. DeTLeng stores learning state and learner-provided workflow connection metadata, protected by Supabase RLS. Trusted outbound workflow tests will run only in the Render API with authentication, URL validation, request limits, timeouts and private-network SSRF protections.
