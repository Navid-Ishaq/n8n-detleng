export type Level = {
  id: string
  number: string
  title: string
  eyebrow: string
  description: string
  outcome: string
  color: string
}

export type Lesson = {
  id: number
  slug: string
  title: string
  summary: string
  level: string
  interaction: 'webhook_lab' | 'self_run' | 'external_trigger' | 'checklist' | 'quiz_project'
  project: string
}

export const levels: Level[] = [
  { id: 'foundation', number: '01', title: 'Foundation', eyebrow: 'Think in workflows', description: 'Master n8n fundamentals, structured data, APIs, webhooks, requests and authentication.', outcome: 'Build reliable connected workflows', color: 'coral' },
  { id: 'code-data', number: '02', title: 'Code & Data', eyebrow: 'Shape real systems', description: 'Use JavaScript, Python, SQL and Supabase to transform and persist production data.', outcome: 'Engineer data-rich automations', color: 'indigo' },
  { id: 'ai-engineering', number: '03', title: 'AI Engineering', eyebrow: 'Design intelligent flows', description: 'Work with LLMs, agents, retrieval, vector databases and MCP without losing control.', outcome: 'Build grounded AI systems', color: 'violet' },
  { id: 'production', number: '04', title: 'Production', eyebrow: 'Operate with confidence', description: 'Debug, containerize, deploy, monitor and secure workflows with human approval where it matters.', outcome: 'Ship resilient automation', color: 'mint' },
]

export const lessons: Lesson[] = [
  { id: 1, slug: 'n8n-core', title: 'n8n Core', summary: 'Nodes, executions, expressions and the workflow mental model.', level: 'foundation', interaction: 'quiz_project', project: 'Operations intake workflow' },
  { id: 2, slug: 'json', title: 'JSON', summary: 'Read, map and reshape the language of automation data.', level: 'foundation', interaction: 'self_run', project: 'Customer payload normalizer' },
  { id: 3, slug: 'rest-apis', title: 'REST APIs', summary: 'Understand methods, endpoints, headers, status codes and pagination.', level: 'foundation', interaction: 'webhook_lab', project: 'Public API data collector' },
  { id: 4, slug: 'webhooks', title: 'Webhooks', summary: 'Receive events and return predictable, testable responses.', level: 'foundation', interaction: 'webhook_lab', project: 'Lead capture endpoint' },
  { id: 5, slug: 'http-request', title: 'HTTP Request Node', summary: 'Connect n8n to almost any well-designed API.', level: 'foundation', interaction: 'webhook_lab', project: 'Multi-service enrichment flow' },
  { id: 6, slug: 'authentication', title: 'Authentication', summary: 'Use API keys, OAuth and bearer tokens safely inside n8n.', level: 'foundation', interaction: 'self_run', project: 'Authenticated CRM sync' },
  { id: 7, slug: 'javascript', title: 'JavaScript', summary: 'Write focused code for transformations and workflow logic.', level: 'code-data', interaction: 'self_run', project: 'Lead scoring engine' },
  { id: 8, slug: 'python', title: 'Python', summary: 'Apply Python where its data and automation ecosystem fits.', level: 'code-data', interaction: 'self_run', project: 'Text analysis utility' },
  { id: 9, slug: 'sql', title: 'SQL', summary: 'Query, join and update relational data intentionally.', level: 'code-data', interaction: 'quiz_project', project: 'Pipeline reporting queries' },
  { id: 10, slug: 'postgresql-supabase', title: 'PostgreSQL / Supabase', summary: 'Persist automation state in a secure relational system.', level: 'code-data', interaction: 'self_run', project: 'Mini CRM data layer' },
  { id: 11, slug: 'llm-apis', title: 'LLM APIs', summary: 'Use OpenAI, Claude or Gemini with structured boundaries.', level: 'ai-engineering', interaction: 'self_run', project: 'Structured message classifier' },
  { id: 12, slug: 'ai-agents', title: 'AI Agents', summary: 'Give models tools, memory and explicit operating constraints.', level: 'ai-engineering', interaction: 'external_trigger', project: 'Support triage agent' },
  { id: 13, slug: 'rag', title: 'RAG', summary: 'Retrieve evidence before generating grounded answers.', level: 'ai-engineering', interaction: 'quiz_project', project: 'Knowledge assistant' },
  { id: 14, slug: 'vector-databases', title: 'Vector Databases', summary: 'Store embeddings and retrieve semantically useful context.', level: 'ai-engineering', interaction: 'self_run', project: 'Document search pipeline' },
  { id: 15, slug: 'mcp', title: 'MCP', summary: 'Connect AI systems to tools through a shared protocol.', level: 'ai-engineering', interaction: 'self_run', project: 'Tool-connected assistant' },
  { id: 16, slug: 'error-handling-debugging', title: 'Error Handling & Debugging', summary: 'Make failures visible, recoverable and educational.', level: 'production', interaction: 'quiz_project', project: 'Resilient order workflow' },
  { id: 17, slug: 'docker-self-hosting', title: 'Docker & Self-Hosting', summary: 'Run n8n predictably with durable configuration and storage.', level: 'production', interaction: 'checklist', project: 'Local production stack' },
  { id: 18, slug: 'git-github', title: 'Git & GitHub', summary: 'Version workflow assets, docs and engineering decisions.', level: 'production', interaction: 'checklist', project: 'Portfolio repository' },
  { id: 19, slug: 'cloud-vps-deployment', title: 'Cloud / VPS Deployment', summary: 'Deploy secure, reachable automation infrastructure.', level: 'production', interaction: 'checklist', project: 'Hosted n8n environment' },
  { id: 20, slug: 'monitoring-security-approval', title: 'Monitoring, Security & Human Approval', summary: 'Operate automation safely with observability and control.', level: 'production', interaction: 'external_trigger', project: 'Approval-gated operations flow' },
]

export const capstones = [
  { number: '01', title: 'Lead Automation Engine', combines: 'Foundation + Data', flow: 'Webhook → validate → enrich → score → database → notify' },
  { number: '02', title: 'AI Customer Support Desk', combines: 'AI + Workflows', flow: 'Request → classify → retrieve → draft → approve → reply' },
  { number: '03', title: 'RAG Knowledge Assistant', combines: 'AI + Data', flow: 'Documents → embeddings → retrieval → grounded answer' },
  { number: '04', title: 'Production Multi-Agent Operations', combines: 'Production', flow: 'Orchestrate → specialize → approve → audit → monitor' },
]
