<a id="top"></a>

<h1 align="center">n8n Detleng</h1>

<h2 align="center">AI Automation Engineer Master Curriculum</h2>

<p align="center"><strong>A practical learning platform for n8n AI Automation Engineering</strong></p>

<p align="center"><em>From your first click to a production-grade, secure, monitored AI automation system.</em></p>

<p align="center"><strong>Built by Muhammad Naveed Ishaque</strong></p>

<table>
  <tr>
    <td align="center"><a href="https://n8n.detleng.com/signup/"><strong>Start Learning →</strong></a></td>
    <td align="center"><a href="https://n8n.detleng.com/"><strong>Visit n8n Detleng →</strong></a></td>
    <td align="center"><a href="#curriculum-map"><strong>Explore Curriculum ↓</strong></a></td>
    <td align="center"><a href="https://network.detleng.com"><strong>DeTLeng Network ↗</strong></a></td>
  </tr>
</table>

> **Independent learning project. Not affiliated with or endorsed by n8n GmbH.**

---

## How to Read This Document

This is the master curriculum blueprint for n8n Detleng. It is written to serve four purposes at once:

1. **Curriculum Master Blueprint** — the pedagogical spine of the platform.
2. **Learning Experience Design** — the emotional and narrative shape of every lesson.
3. **Workflow Specification** — detailed enough that a lesson can be built directly from this document.
4. **Portfolio Roadmap** — what the learner walks away with, and how they prove it.

Everything here is organized around one idea: **the learner is not collecting 20 tutorials — they are growing one system, and growing into one engineer.**

> **[VERIFY IN CURRENT n8n UI]** — wherever a specific node label, menu option, or response-mode setting could vary between n8n versions, this document flags it rather than guessing. The engineering concept underneath never changes even when a button moves.

### Implementation and Verification Status

This document is the authoritative curriculum and implementation blueprint. Lesson 01 has a working Detleng live-verification path; Lessons 02–20 describe the acceptance contracts to implement and test as those lessons are built. A section titled **Detleng Live Verification** therefore means “the deterministic behavior Detleng must verify when this lesson ships,” not a claim that every verifier is already available in production.

Detleng verifies only behavior it can observe through an explicit interface: an authenticated Detleng session, a learner-supplied HTTPS production webhook, a deterministic response payload, or a purpose-built challenge/evidence endpoint. It cannot inspect a learner's n8n editor, execution history, local machine, private repository, database, or third-party account unless a later implementation adds narrowly scoped, informed authorization. Manual checks are labeled honestly and are never represented as automatic proof.

The current n8n terminology and webhook behavior in this blueprint are grounded in the official documentation for [Edit Fields (Set)](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/), [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/), and [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/). The Webhook node provides separate test and production URLs; the production URL becomes registered when the workflow is published, and deterministic response data must be returned using the configured response mode or Respond to Webhook node.

---

<a id="curriculum-map"></a>
## Curriculum Map

Use this map to read the curriculum in order or jump directly to a level or lesson. Each lesson title links to its full specification below.

### [Level 1 — Foundation · Lessons 01–06](#level-1)

| Lesson | Focus | Lesson build |
|---|---|---|
| [01 — n8n Core](#lesson-01) | Workflow anatomy, triggers, data flow, and branching | Operations Intake Workflow |
| [02 — JSON](#lesson-02) | Reading and transforming structured automation data | Order Payload Normalizer |
| [03 — REST APIs](#lesson-03) | Requests, responses, methods, endpoints, and status codes | Customer Information API Explorer |
| [04 — Webhooks](#lesson-04) | Event-driven intake and production webhook behavior | Multi-Event Intake Endpoint |
| [05 — HTTP Request Node](#lesson-05) | Calling and handling external services from n8n | Request Enrichment Workflow |
| [06 — Authentication](#lesson-06) | Protecting integrations and handling credentials safely | Protected Customer API Integration |

### [Level 2 — Code & Data · Lessons 07–10](#level-2)

| Lesson | Focus | Lesson build |
|---|---|---|
| [07 — JavaScript](#lesson-07) | Custom transformations and workflow logic | Order Intelligence Transformer |
| [08 — Python](#lesson-08) | Data cleanup and analysis inside automation | Data Cleanup & Analysis Step |
| [09 — SQL](#lesson-09) | Querying and reporting over operational data | Operations Reporting Database |
| [10 — PostgreSQL / Supabase](#lesson-10) | Persistent state and learner-owned records | Persistent Operations Database |

### [Level 3 — AI Engineering · Lessons 11–15](#level-3)

| Lesson | Focus | Lesson build |
|---|---|---|
| [11 — LLM APIs](#lesson-11) | Deterministic use of language-model APIs in workflows | AI Request Triage |
| [12 — AI Agents](#lesson-12) | Bounded agents that choose and use tools | Operations Assistant Agent |
| [13 — RAG](#lesson-13) | Answers grounded in approved source material | Company Knowledge Assistant |
| [14 — Vector Databases](#lesson-14) | Embeddings, semantic retrieval, and vector storage | Semantic Knowledge Search |
| [15 — MCP](#lesson-15) | Standardized tool discovery and invocation | MCP-Connected Operations Agent |

### [Level 4 — Production Engineering · Lessons 16–20](#level-4)

| Lesson | Focus | Lesson build |
|---|---|---|
| [16 — Error Handling & Debugging](#lesson-16) | Failure paths, retries, diagnosis, and recovery | Resilient API Workflow |
| [17 — Docker & Self-Hosting](#lesson-17) | A reproducible n8n runtime and supporting services | Local n8n Engineering Stack |
| [18 — Git & GitHub](#lesson-18) | Version-controlled workflow assets and documentation | Automation Portfolio Repository |
| [19 — Cloud / VPS Deployment](#lesson-19) | Hosting n8n with a domain, HTTPS, and backups | Production-Style Hosted n8n |
| [20 — Monitoring, Security & Human Approval](#lesson-20) | Safe, observable, human-governed production operation | Production AI Operations System |

### Recommended Reading Paths

- **New learner:** begin with [Level 1](#level-1) and follow the lessons in numerical order.
- **Returning learner:** use the lesson links above to resume from the exact specification you need.
- **Platform builder or reviewer:** read the [Curriculum Consistency Contract](#curriculum-consistency-contract), then inspect each lesson's **Detleng Live Verification** and completion sections.
- **Employer or client:** scan the **Lesson build** column above, then review the portfolio and workplace relevance sections inside the lessons that matter most.

---

## Core Vision

The learner starts with little or no practical n8n engineering experience.

By the end of Lesson 20, they will be able to:

- Design real automation workflows, not toy demos
- Work confidently inside n8n's trigger → logic → action model
- Understand JSON and structured data at a native level
- Consume REST APIs and reason about status codes and payload shapes
- Build and receive Webhooks as real integration surfaces
- Use the HTTP Request node to reach any external system
- Handle authentication (API keys, Bearer tokens, Basic Auth, OAuth2) securely
- Write useful JavaScript and Python inside automation, without becoming "just a coder"
- Query and reason about data with SQL
- Persist state with PostgreSQL / Supabase
- Integrate LLMs (OpenAI / Claude / Gemini) as workflow components, not chat toys
- Build AI agents with bounded, deliberate tool access
- Implement Retrieval-Augmented Generation grounded in real documents
- Understand vector databases as infrastructure, not magic
- Work with MCP as a standardized tool-discovery layer
- Design error handling and resilient, self-recovering workflows
- Use Docker to make their environment reproducible
- Use Git and GitHub the way a professional automation engineer does
- Deploy n8n to a cloud VPS with HTTPS, backups, and a real domain
- Monitor workflows, log responsibly, and secure production systems
- Design human approval into sensitive, high-risk actions
- Explain their own architecture clearly to an employer, a client, or a collaborator
- Show real portfolio evidence — not certificates, not screenshots, but working systems
- Handle realistic freelance and client requirements
- Step into junior-to-mid practical AI Automation Engineering work with genuine confidence

Every level adds a new engineering capability to the same learning journey.

---

## The Learning Philosophy

Detleng teaches by doing. The loop that repeats, lesson after lesson, is:

```text
BUILD → RUN → OBSERVE → CONNECT → TEST → BREAK → DEBUG → REPAIR → VERIFY → REFLECT
```

What this rules out:

- Textbook-heavy teaching and long theory dumps
- Meaningless quizzes and artificial exercises
- Copy-paste workflows the learner doesn't understand
- Passive "read this, click next" pacing
- Toy projects disconnected from real engineering

What this requires instead:

- Every important concept becomes visible inside a real n8n workflow
- The learner opens n8n, follows the lesson, does the work themselves, and succeeds because they understand it — not because they memorized clicks
- Every lesson contains a controlled failure the learner must diagnose and repair
- Every lesson ends with the learner able to say, in their own words, what they built and why it works

---

## The Signature Detleng Experience

Every lesson is a mission, not a chapter. The shape below repeats, but the tone, story, and stakes change from lesson to lesson so the course never feels mechanical.

**Opening Story** — a realistic scenario that makes the learner ask "how would I even do that?" before any definition appears.

**The Mission** — a plain statement of what gets built and why it matters.

**Hands-On Build** — real work inside n8n, in clearly named stages, each one small enough to complete and verify before moving to the next.

**Test It Yourself** — the learner runs their own workflow and learns to read an execution before anyone else checks their work.

**Detleng Live Verification** — wherever technically honest and implemented for that lesson, Detleng interacts with the learner's real, running workflow: sending it events, validating its returned payload, or receiving a challenge signal from it. A screenshot is never treated as deterministic proof of workflow behavior.

**Deliberate Break** — the learner breaks something realistic on purpose.

**Diagnose → Repair → Verify** — not just "fix it," but investigate why it failed, correct it, and prove the fix with a second real execution.

**Engineering Explanation** — the mental model the learner now owns, stated simply enough to repeat to a colleague.

**Completion Story** — a real recap: what was built, what was proven, what the learner can now do that they couldn't this morning.

**Next Lesson Bridge** — a direct, narrative link into what comes next.

Once a lesson is completed, the learner can always return to **View Mission · Review Lesson · Repeat Lesson**.

---

## Curriculum Consistency Contract

Every lesson follows the same learning contract while allowing the practical work to determine its exact number of build stages:

1. **Identity and prerequisite** — the learner knows where the lesson fits and what must already be understood.
2. **Story and mission** — the problem appears before the tool instructions.
3. **Lesson build** — a focused artifact contributes a reusable capability to the progressive Operations Intake system.
4. **Build and self-test** — the learner performs and observes the work inside their own environment.
5. **Observable verification** — Detleng checks only deterministic behavior available through an explicit verification interface.
6. **Break, diagnose, repair, verify** — failure investigation is separate from initial success.
7. **Evidence and explanation** — the learner records what was built without exposing credentials or sensitive endpoints.
8. **Completion and bridge** — the lesson closes with a capability statement and a direct reason for the next lesson.

The shared structure is intentional; repeated filler is not. Each section must add lesson-specific information rather than restating the same promise in different words.

---

## The Four-Level Journey

| Level | Lessons | Learner Transformation | Prerequisite Skills | Portfolio Value |
|---|---|---|---|---|
| **Level 1 — Foundation** | 01–06 | "I can build and connect real workflows." | None — true beginner entry point | A working, authenticated, event-driven intake system |
| **Level 2 — Code & Data** | 07–10 | "I can manipulate, query, and persist real data." | Level 1 complete | A workflow with real logic and a real memory (database) |
| **Level 3 — AI Engineering** | 11–15 | "I can add LLMs, agents, knowledge, and tools responsibly." | Level 1–2 complete | An AI system that classifies, retrieves, and acts with bounded tools |
| **Level 4 — Production Engineering** | 16–20 | "I can make automation resilient, deployable, observable, and safe." | Level 1–3 complete | A deployed, monitored, secured, human-approved production system |

Each level is described in full at the start of its section below, including job/freelance relevance and what the learner can credibly claim on a CV or a client call at that point.

---

## The Progressive Project

One core system grows across all 20 lessons. Some lessons use a focused supporting build to teach one skill safely; that build then contributes a reusable pattern, workflow, data model, or infrastructure layer to the progressive Operations Intake system. The learner does not maintain 20 unrelated demo projects.

```text
L01  Basic Operations Intake workflow (manual → webhook)
 ↓
L02  Rich, nested JSON payloads
 ↓
L03  Understanding the APIs the workflow will eventually call
 ↓
L04  A true event-driven, multi-event webhook intake
 ↓
L05  Calling external APIs to enrich incoming requests
 ↓
L06  Securing that external call with real authentication
 ↓
L07  Custom JavaScript transformation logic
 ↓
L08  Python data cleanup and analysis
 ↓
L09  SQL reporting over operational data
 ↓
L10  A persistent PostgreSQL / Supabase memory
 ↓
L11  LLM-based classification of incoming requests
 ↓
L12  An agent that can choose and use tools
 ↓
L13  RAG grounded in real company knowledge
 ↓
L14  A real vector database powering that retrieval
 ↓
L15  MCP as the standardized tool layer for the agent
 ↓
L16  Failure resilience: retries, backoff, error branches
 ↓
L17  A reproducible Dockerized environment
 ↓
L18  Version-controlled workflow assets on GitHub
 ↓
L19  Real deployment to a cloud VPS with HTTPS
 ↓
L20  Monitoring, security, and human-approved production operation
```

By Lesson 20, the simple two-branch workflow from Lesson 01 has become a monitored, secured, human-in-the-loop AI operations platform — and the learner built every layer of it themselves.


---

<a id="level-1"></a>
# LEVEL 1 — FOUNDATION

**Lessons 01–06**

### Level Purpose
Turn someone who has never opened n8n into someone who can build, trigger, connect, and secure a real workflow end to end.

### What Changes in the Learner
They stop thinking of automation as "connecting boxes" and start thinking in terms of events, data, decisions, and external systems talking to each other.

### Prerequisite Skills
None. This is the true entry point. Only a free n8n instance (cloud or self-hosted) and a browser are required.

### Skills Gained
Workflow anatomy, JSON literacy, REST API literacy, inbound webhooks, outbound HTTP requests, and secure authentication.

### Portfolio Value
A working, authenticated, event-driven "Operations Intake" system that accepts real HTTP events, branches on priority, and calls a real external API securely.

### Job / Freelance Relevance
This alone is enough to take on simple freelance automations: "when X happens, call Y, branch on Z." Most beginner automation gigs never go further than Level 1 skills applied well.

### Level Completion Capability
"I can build and connect real workflows."

---

<a id="lesson-01"></a>
# 01 — n8n Core
## From Your First Click to a Live Automation

### Lesson Identity
- **Level:** 1 — Foundation
- **Core skill:** Workflow anatomy — triggers, nodes, data, decisions
- **Difficulty:** Entry point
- **Lesson build:** Operations Intake Workflow
- **Prerequisites:** None

### Opening Story
A request arrives. Nobody clicks anything. Your workflow wakes up, looks at what arrived, decides what matters, and acts. That is automation — and today you build the smallest real version of it with your own hands.

### The Mission
Build a workflow that receives an operations request, decides whether it is escalated or standard, and eventually accepts that request from the open internet — not just from you clicking a button.

### Where You Start
An empty n8n canvas.

### Where You Finish
A live, publicly reachable webhook that a real HTTP call — from Detleng, from Postman, from anywhere — can trigger, and that responds correctly based on the data it receives.

### What You Will Learn
- What a workflow, a node, a trigger, and an execution actually are
- How data moves from one node to the next
- How to make a decision inside a workflow using an IF / branch node
- How a Manual Trigger differs from a Webhook trigger, and why that difference matters
- How to take a workflow from "only I can run this" to "anything on the internet can run this"

### What You Will Build
**Operations Intake Workflow** — the workflow every future lesson will keep evolving.

### Workflow Architecture
```text
Manual Trigger (later: Webhook)
      ↓
Create Request
      ↓
Check Priority
   ↙        ↘
Escalated  Standard
   ↘        ↙
 Respond to Webhook
```

### Concepts Introduced
Workflow, node, trigger, execution, data item, IF/branch logic, test URL vs production URL.

### Sample Data
```json
{ "customerName": "Ali Khan", "department": "Support", "priority": "high", "budget": 1500 }
```
```json
{ "customerName": "Sara Ahmed", "department": "Support", "priority": "normal", "budget": 300 }
```

### Build Stage 1 — Understand the Pieces
Before touching n8n, map the vocabulary to the mission: the **trigger** is "how does this wake up," the **nodes** are "what happens next," the **data** is "what it's working with," and the **branch** is "what decision it makes."

### Build Stage 2 — Build It Manually
Add a **Manual Trigger** node. Add an **Edit Fields (Set)** node ("Create Request") that defines `customerName`, `department`, `priority`, and `budget`. Add an **IF** node ("Check Priority") that checks whether `priority` equals `high`, producing an Escalated branch and a Standard branch. The Escalated branch must return `route: "escalated"` and `status: "ready"`; the Standard branch must return `route: "standard"` and `status: "ready"`.

### Build Stage 3 — Run It Yourself
Execute the workflow once with `priority: high`, `budget: 1500` and once with `priority: normal`, `budget: 300` (change the Edit Fields node values between runs). Confirm each run takes the correct branch by inspecting the execution.

### Build Stage 4 — Upgrade to a Webhook
Replace the Manual Trigger with a **Webhook** node configured to accept `POST` requests, with a path such as `operations-intake`. Configure the workflow to return the selected branch's final JSON after processing (using **Respond to Webhook** or the equivalent response mode in the current n8n UI). This is the moment the workflow stops depending on you clicking anything.

### Build Stage 5 — First Live Event
Using the Webhook node's **Test URL**, Detleng (or you, with a simple HTTP client) sends a real POST request containing the sample JSON above. Confirm the workflow captures it correctly.

### Build Stage 6 — Publish and Connect
Publish/activate the workflow so the **Production URL** is live. Save the production URL; this becomes the address Detleng will call in verification. The current Lesson 01 verifier accepts HTTPS n8n Cloud production webhook hosts and rejects temporary `/webhook-test/` URLs.

### Test It Yourself
Trigger both the Test URL and the Production URL with a High and a Normal payload. In each execution, open the IF node's output and confirm the item landed in the branch you expect.

### Detleng Live Verification
Through the authenticated Render backend, Detleng sends one High-priority event and one Normal-priority event to your production webhook URL. It validates the returned JSON: High must return `route: "escalated"`, Normal must return `route: "standard"`, and both must return `status: "ready"`.

**What Detleng can verify:** that the allowed production webhook is reachable and returns the expected deterministic result for both payloads.
**What Detleng cannot inspect:** the learner's n8n execution history or editor. Correct branch behavior is inferred from the live response contract, not privileged n8n access.
**What you must do manually:** publish/activate the workflow and provide its production URL.

### Deliberate Break
Rename the field the IF node checks from `priority` to `priorityLevel` inside the Edit Fields node, without updating the IF node's condition.

### Diagnose the Failure
Run the workflow again. The IF condition now evaluates against a field that no longer exists, so every request — even High priority — falls into the wrong branch, or the condition resolves as empty/false.

### Repair
Update the IF node's condition to reference `priorityLevel`, or rename the field back. Either fix is valid — the point is recognizing *why* the mismatch happened.

### Verify the Repair
Re-run both test payloads and confirm the branches are correct again, and re-trigger the live webhook once more to prove the fix under real conditions, not just inside the editor.

### Common Mistakes
Forgetting to activate the workflow before testing the production URL. Testing the Test URL and assuming the Production URL behaves identically without checking. Leaving the workflow deactivated after publishing.

### Security / Safety Notes
> **SECURITY NOTE** — At this stage the webhook is intentionally open with no authentication, because the concept being taught is "events arrive from outside." Lesson 06 will secure it properly. Never treat an unauthenticated webhook as production-ready.

### Professional Engineering Notes
> **ENGINEERING NOTE** — A workflow that only works when you personally click "Execute" isn't automation yet. The webhook conversion in Stage 4 is the real beginning of engineering: the system now works without you.

### Portfolio Evidence
Export the workflow JSON. Save it as `lesson-01-operations-intake.json`. Write two sentences in a README describing what it does, but do not publish the full production webhook URL. An unauthenticated webhook URL is a capability endpoint and should be treated as sensitive.

### Freelance Scenario
> **CLIENT THINKING** — "I want an intake form to notify my team differently depending on urgency." This lesson's skeleton — trigger, decision, branch — is the literal shape of that request.

### Job Interview / Workplace Relevance
Be able to explain, without notes: what a trigger is, why webhooks matter for event-driven systems, and how a branch decision is made from incoming data.

### What You Just Proved
That you can take a request from "arrives on the internet" to "correctly routed" without manually touching anything.

### What You Can Now Do
Build a triggerable, branching workflow and expose it to the outside world safely enough to test.

### Engineering Mental Model
```text
Event → Trigger → Data → Decision → Action → Result
```

### Completion Story
You started with an empty canvas. You now have a live, internet-reachable workflow that makes a real decision on real data — and you already found and fixed a real bug in it.

### Next Lesson Bridge
Today you already moved JSON through a workflow without naming it. Next, you learn exactly what that data actually is — and how to handle it when it's messier than four flat fields.

---

<a id="lesson-02"></a>
# 02 — JSON
## Learn the Language Your Automations Speak

### Lesson Identity
- **Level:** 1 — Foundation
- **Core skill:** Reading, navigating, and transforming JSON, including nested objects and arrays
- **Difficulty:** Beginner
- **Lesson build:** Order Payload Normalizer
- **Prerequisites:** Lesson 01

### Opening Story
Your webhook received `customerName`, `priority`, `budget` — four flat fields, easy to read. Real systems don't send you that kindness. They send you customers with addresses, orders with arrays of items, and objects nested inside objects. Today you learn to read that shape instead of getting lost in it.

### The Mission
Take a realistically messy, nested order payload and normalize it into a clean, flat structure your workflow can actually use.

### Where You Start
Comfortable with flat JSON objects from Lesson 01.

### Where You Finish
Able to read and reshape deeply nested JSON, including arrays of line items, inside n8n expressions.

### What You Will Learn
- The building blocks of JSON: object, key, value, string, number, boolean, null, array
- How to read nested paths like `customer.name` or `order.items[0].price`
- How to map real webhook fields into n8n expressions
- How to transform a nested structure into a clean, normalized output

### What You Will Build
**Order Payload Normalizer**

### Workflow Architecture
```text
Webhook (receives raw order)
      ↓
Inspect Structure
      ↓
Normalize Fields (Set/Edit Fields)
      ↓
Handle Line Items (array)
      ↓
Return Clean Order
```

### Concepts Introduced
Object vs array, nested key paths, dot notation, array indexing, `null` vs missing field.

### Sample Data
**Normal case:**
```json
{
  "customer": { "name": "Ali Khan", "country": "ES" },
  "order": {
    "id": "ORD-101",
    "items": [
      { "name": "Keyboard", "qty": 2, "price": 50 },
      { "name": "Mouse", "qty": 1, "price": 25 }
    ]
  }
}
```
**Missing data case:** the same payload with `customer.country` absent entirely.

**Invalid case:** `items` sent as an object instead of an array.

### Build Stage 1 — Meet JSON Visually
Using n8n's JSON view on a captured execution, identify every object, array, string, number, and boolean in the sample payload before writing any expression.

### Build Stage 2 — Read Nested Data
In an **Edit Fields (Set)** node, write expressions that pull `customer.name` and `order.id` into flat top-level fields.

### Build Stage 3 — Work With Arrays
Reference `order.items[0].name` and `order.items[0].price` directly. Then use a **Split Out** (or equivalent array-handling) node to process each item as its own item in the workflow.

### Build Stage 4 — Map Real Webhook Fields
Replace the hard-coded sample with a live Webhook node so incoming POSTed JSON is the real source, not a pasted example.

### Build Stage 5 — Transform the Structure
Produce a clean, flat output object: `customerName`, `customerCountry`, `orderId`, `itemCount`, `orderTotal` — calculated from the nested items.

### Test It Yourself
Send the Normal case payload and confirm `orderTotal` equals 125 (2×50 + 1×25) and `itemCount` equals 2.

### Detleng Live Verification
Detleng sends several different order payloads with varying item counts and checks your workflow's output structure, field values, and calculated totals against the expected result.

**What Detleng can verify:** output shape and correctness of calculated fields.
**What you must do manually:** confirm you understand *why* each expression resolves the way it does — Detleng cannot verify your understanding, only your output.

### Deliberate Break
Send a payload where `customer.name` has been renamed to `customer.fullName`.

### Diagnose the Failure
Your `customer.name` expression resolves to `undefined`/empty, silently producing a broken `customerName` field instead of an obvious crash — the most common real-world JSON bug.

### Repair
Add a fallback expression (e.g., using an OR/default pattern) or correct the path once you confirm the real field name from the payload.

### Verify the Repair
Re-send the renamed-field payload and confirm the workflow now resolves the value correctly — and re-send the original shape to confirm you didn't break the working case while fixing the broken one.

### Common Mistakes
Assuming a field always exists; hard-coding array index `[0]` without checking the array actually has items; confusing `null` (present but empty) with a missing key entirely.

### Security / Safety Notes
> **WATCH FOR THIS** — never trust the shape of incoming data. A field you expect as a string could arrive as `null`, a number, or missing. This lesson's break/fix is your first taste of defensive data handling, a habit Lesson 16 formalizes.

### Professional Engineering Notes
> **WHY THIS MATTERS** — nearly every real automation bug that "shouldn't have happened" is a JSON shape mismatch. Learning to read structure precisely is the single highest-leverage debugging skill in this entire course.

### Portfolio Evidence
Save the workflow JSON export and a short `sample-payloads.json` file containing your Normal, Missing, and Invalid test cases.

### Freelance Scenario
> **CLIENT THINKING** — "Our e-commerce platform sends nested order data and I need a summary line total." This lesson is exactly that requirement, with real numbers.

### Job Interview / Workplace Relevance
Be able to explain the difference between an object and an array, and why "the field is missing" and "the field is null" require different handling.

### What You Just Proved
That you can take unpredictable, nested real-world data and produce a reliable, flat, calculated output.

### What You Can Now Do
Read unfamiliar JSON confidently, navigate arrays and nesting, and reshape data inside n8n expressions.

### Engineering Mental Model
> "JSON is not curly brackets — it is the shape data takes when it travels between systems."

### Completion Story
This morning, nested JSON was intimidating. Now you can normalize it, calculate over it, and defend against its missing pieces.

### Next Lesson Bridge
You've been receiving JSON — but where does it actually come from? Next, you learn how systems like Stripe, CRMs, and weather services structure their conversations: REST APIs.


---

<a id="lesson-03"></a>
# 03 — REST APIs
## Learn How Systems Talk to Each Other

### Lesson Identity
- **Level:** 1 — Foundation
- **Core skill:** Reading and reasoning about REST API requests, responses, and status codes
- **Difficulty:** Beginner
- **Lesson build:** Customer Information API Explorer
- **Prerequisites:** Lessons 01–02

### Opening Story
Your workflow understands data now. But Google, Stripe, CRMs, weather services, and AI providers don't live inside your n8n instance — they live behind APIs. Today you learn the shared language every one of them speaks.

### The Mission
Interact with a safe practice API, read its real responses, and build a mental model that transfers to any REST API you'll ever encounter.

### Where You Start
Comfortable reading JSON, no experience calling external services.

### Where You Finish
Able to read API documentation and immediately understand: method, URL, headers, body, and expected response.

### What You Will Learn
- The client/server relationship — and that your workflow can be a client
- Endpoint anatomy: domain, path, query parameters
- HTTP methods and their practical meaning: GET, POST, PUT/PATCH, DELETE
- Requests and responses: headers, body, JSON
- Status codes: 200, 201, 400, 401, 404, 429, 500 — and what each demands you do next

### What You Will Build
**Customer Information API Explorer**, against a safe Detleng-provided practice API:
```text
GET  /customers/42
GET  /orders?status=open
POST /requests
```
No learner secrets required for this lesson.

### Workflow Architecture
```text
Manual Trigger
      ↓
HTTP Request → GET /customers/42
      ↓
Inspect Response
      ↓
HTTP Request → GET /orders?status=open
      ↓
Inspect Response
```

### Concepts Introduced
Client vs server, endpoint, query parameter, HTTP method, request/response cycle, status code families (2xx/4xx/5xx).

### Sample Data
Known customer: `GET /customers/42` → `200 OK` with a customer JSON object.
Unknown customer: `GET /customers/9999` → `404 Not Found`.
Malformed request: missing required field on `POST /requests` → `400 Bad Request`.

### Build Stage 1 — Client vs Server
Establish explicitly: n8n is the client here; the practice API is the server. Your workflow initiates every call.

### Build Stage 2 — Endpoint Anatomy
Break down the practice API's base domain, the `/customers/{id}` path pattern, and the `?status=open` query parameter.

### Build Stage 3 — HTTP Methods
Use GET to read `/customers/42` and `/orders?status=open`. Use POST to create a request via `/requests`.

### Build Stage 4 — Requests and Responses
Inspect the raw response in the HTTP Request node: headers, status, and JSON body, side by side with what was sent.

### Build Stage 5 — Status Codes in Practice
Deliberately call `/customers/9999` and observe the `404`. Deliberately POST an incomplete body and observe the `400`.

### Build Stage 6 — First Real API Interaction
Fetch the known customer and known open orders successfully, and pass the customer's name into an **Edit Fields (Set)** node to prove the data flowed through correctly.

### Test It Yourself
Confirm that the known customer request returns `200` with the expected fields, and that you can explain, before running it, what status code the unknown-customer request will return.

### Detleng Live Verification
Detleng checks that your workflow correctly calls the known and unknown customer endpoints and correctly branches or reports based on the status code received — not just that a call was made.

**What Detleng can verify:** that your workflow reacts appropriately to different real status codes.
**What you must do manually:** read the actual response body, not just the status code, to understand what happened.

### Deliberate Break
Point the GET request at `/custmers/42` (typo) instead of `/customers/42`.

### Diagnose the Failure
A `404` returns. The temptation is to assume "the customer doesn't exist" — but the real cause is a broken endpoint path, not missing data.

### Repair
Correct the endpoint path and re-run.

### Verify the Repair
Confirm the corrected call now returns `200` with real customer data, and articulate out loud the difference between "this resource doesn't exist" and "this URL is wrong" — they produce the same status code but mean very different things.

### Common Mistakes
Treating every `404` as "the data isn't there" instead of checking the URL first. Ignoring the response body and only looking at the status code. Assuming POST always needs the same body shape as GET's response.

### Security / Safety Notes
> **SECURITY NOTE** — this lesson deliberately uses a keyless practice API. Real APIs almost always require credentials — that's Lesson 06, and you will never paste a personal API key into Detleng itself.

### Professional Engineering Notes
> **PRODUCTION NOTE** — professional automation engineers read API documentation before writing a single node. The habit you're building here — method + URL + headers + body → response — is literally how to read any API doc you'll ever encounter.

### Portfolio Evidence
Save a short `api-notes.md` capturing the endpoints you tested, the methods used, and the status codes you observed for each case.

### Freelance Scenario
> **CLIENT THINKING** — "Can you check our order status via our shipping provider's API?" This lesson is the exact skill: reading their docs and translating them into method + URL + headers + body.

### Job Interview / Workplace Relevance
Be able to explain, unprompted, what a `401` versus a `404` versus a `429` means, and what a correctly-behaving client should do in each case.

### What You Just Proved
That you can read unfamiliar API documentation and correctly predict and interpret real responses.

### What You Can Now Do
```text
METHOD + URL + HEADERS + BODY
              ↓
          RESPONSE
```

### Engineering Mental Model
Every external system in this course — and in your career — reduces to this same shape.

### Completion Story
This morning APIs were a black box labeled "connect to other services." Now you can read their documentation and predict their behavior before you even run the call.

### Next Lesson Bridge
So far you've called out to APIs. Next, you flip the direction: instead of asking, you let other systems tell you when something happens — inbound Webhooks, properly understood.

---

<a id="lesson-04"></a>
# 04 — Webhooks
## Stop Asking. Let Events Come to You.

### Lesson Identity
- **Level:** 1 — Foundation
- **Core skill:** Designing and routing inbound, event-driven webhook intake
- **Difficulty:** Beginner–Intermediate
- **Lesson build:** Multi-Event Intake Endpoint
- **Prerequisites:** Lessons 01–03

### Opening Story
In Lesson 01 you used a Webhook without truly understanding it. Today that changes — because the difference between "asking a system for updates" and "letting it tell you" is the difference between a toy and a real integration.

### The Mission
Build a single endpoint that correctly receives and routes three distinct event types, the way a real production intake system does.

### Where You Start
You know webhooks exist and can receive one event type.

### Where You Finish
You can design, route, and correctly respond to multiple distinct real-world event types on one endpoint.

### What You Will Learn
- Polling versus webhooks — "asking every minute" vs "being told"
- Webhook anatomy: method, path, headers, body
- The real difference between Test and Production webhook URLs
- Responding immediately versus responding after the workflow finishes — and why that choice matters
- Routing by an `eventType` field into different branches

### What You Will Build
**Multi-Event Intake Endpoint**, handling:
```text
customer.created
order.created
order.cancelled
```

### Workflow Architecture
```text
Webhook (single endpoint)
      ↓
Read eventType
      ↓
   ┌────────────┼─────────────┐
customer.created  order.created  order.cancelled
      ↓                ↓               ↓
 Handle Customer   Handle Order    Handle Cancellation
```

### Concepts Introduced
Polling vs push, webhook response modes, event routing, event IDs, retries, duplicate events, idempotency (introduced lightly here, deepened in Lessons 16 and 20).

### Sample Data
```json
{ "eventType": "customer.created", "customerId": "C-501", "name": "Nadia Iqbal" }
```
```json
{ "eventType": "order.created", "orderId": "ORD-330", "amount": 210 }
```
```json
{ "eventType": "order.cancelled", "orderId": "ORD-330", "reason": "customer_request" }
```

### Build Stage 1 — Polling vs Webhook
Contrast, explicitly: "check every minute whether anything changed" against "be notified the instant it does." Name the cost of polling (wasted calls, delay, rate limits) that webhooks avoid.

### Build Stage 2 — Webhook Anatomy
Inspect method, path, headers, and body on an incoming call, this time treating each as meaningful rather than incidental.

### Build Stage 3 — Test vs Production URLs
Confirm both URLs independently by sending the same event to each and comparing behavior. **[VERIFY IN CURRENT n8n UI]** for the exact listen/activation behavior of each URL in your installed version.

### Build Stage 4 — Responding Correctly
Configure the webhook's response mode so it replies only after the workflow has finished processing, rather than immediately — and explain when the opposite choice would be correct.

### Build Stage 5 — Event Routing
Use a Switch (or equivalent multi-branch) node keyed on `eventType` to route to three distinct handling paths.

### Build Stage 6 — Multiple Live Events
Receive all three sample events in sequence and confirm each took its correct branch.

### Test It Yourself
Send each of the three event types yourself and check, in the execution log, that each one reached the correct branch and that no branch silently swallowed an event it shouldn't have received.

### Detleng Live Verification
Detleng sends three different event types to your live production webhook and checks that your workflow routed each to the correct branch and returned an appropriate response.

**What Detleng can verify:** correct routing and response behavior for real events.
**What you must do manually:** design the branch logic so it's actually correct, not just present.

### Deliberate Break
Send an event with `eventType: "Order.Created"` (wrong casing) or misspelled as `order.creatd`.

### Diagnose the Failure
The event falls through every branch unmatched, landing in a default/fallback path or nowhere at all — a silent failure, which is more dangerous than a loud one.

### Repair
Add a default/fallback branch that logs unmatched event types instead of silently dropping them, and correct the matching logic to be case-insensitive where appropriate.

### Verify the Repair
Re-send the malformed event and confirm it's now caught and logged rather than disappearing, then re-send a correctly-formed event to confirm normal routing still works.

### Common Mistakes
No fallback branch for unrecognized event types. Responding to the webhook before the workflow logic has actually finished. Assuming event delivery is always exactly-once (it usually isn't — see idempotency, below).

### Security / Safety Notes
> **PRODUCTION NOTE** — real event providers (Stripe, GitHub, Shopify) retry failed deliveries and can send the same event more than once. This lesson introduces that reality lightly; Lessons 16 and 20 build the idempotency and dead-letter thinking to handle it properly.

### Professional Engineering Notes
> **WHY THIS MATTERS** — a silent unmatched-event branch is one of the most common causes of "why didn't this run?" support tickets in real automation systems. A visible fallback branch turns invisible failures into debuggable ones.

### Portfolio Evidence
Export the workflow JSON, plus a short `event-routing-notes.md` listing the event types handled and the fallback behavior.

### Freelance Scenario
> **CLIENT THINKING** — "We get several kinds of Shopify events and need each handled differently." This lesson's routing pattern is the direct answer.

### Job Interview / Workplace Relevance
Be able to explain why webhooks are preferred over polling for event-driven integrations, and what "idempotency" means at a conceptual level even before Lesson 16 formalizes it.

### What You Just Proved
That you can design an endpoint that correctly receives and routes multiple real event types — and doesn't silently lose the ones it doesn't recognize.

### What You Can Now Do
Receive, inspect, route, and correctly respond to external events.

### Engineering Mental Model
```text
Event arrives → Identify type → Route → Handle → Respond
```

### Completion Story
This morning, a webhook was "the thing from Lesson 01." Now it's a properly designed intake surface that can grow to handle any number of real event types without collapsing.

### Next Lesson Bridge
Your workflow can now receive events beautifully. Next, it needs to reach *outward* — calling a real external API to enrich the data it receives.

---

<a id="lesson-05"></a>
# 05 — HTTP Request
## Make Your Workflow Reach Outside n8n

### Lesson Identity
- **Level:** 1 — Foundation
- **Core skill:** Outbound API orchestration using the HTTP Request node
- **Difficulty:** Intermediate
- **Lesson build:** Request Enrichment Workflow
- **Prerequisites:** Lessons 01–04

### Opening Story
Your intake system can receive events beautifully. But right now it only knows what arrives in the request body. Real operations systems enrich incoming data by reaching out and asking other systems for more context. Today your workflow learns to reach outward.

### The Mission
Receive a lightweight incoming request, call an external API to fetch full customer details, and merge the two into one enriched record.

### Where You Start
You can call APIs manually and understand REST responses (Lesson 03).

### Where You Finish
Your workflow calls an external API dynamically, using data from the incoming request itself, and merges the result back in.

### What You Will Learn
- HTTP Request node anatomy in depth
- Building dynamic GET requests using data from earlier nodes
- Query parameters as dynamic expressions, not hard-coded strings
- Sending headers and a body on a POST request
- Chaining an API response back into the rest of the workflow
- Why pagination exists (introduced, not mastered — full depth arrives in a later capstone-style build)

### What You Will Build
**Request Enrichment Workflow**

### Workflow Architecture
```text
Webhook
   ↓
Incoming Request (customerId + department + priority)
   ↓
HTTP Request → GET Customer API
   ↓
Merge / Shape Result
   ↓
Decision (priority)
```

### Concepts Introduced
Dynamic URL construction, query parameters as expressions, request headers vs body, response chaining, pagination (conceptual).

### Sample Data
```json
{ "customerId": "C-501", "department": "billing", "priority": "high" }
```
Expected enriched output:
```json
{
  "customerId": "C-501",
  "customerName": "Nadia Iqbal",
  "department": "billing",
  "priority": "high",
  "accountTier": "Enterprise"
}
```

### Build Stage 1 — HTTP Request Node Anatomy
Walk through method, URL, query parameters, headers, and body fields on the node before wiring anything dynamic.

### Build Stage 2 — Dynamic GET Request
Build the URL as `.../customers/{{ $json.customerId }}` so the call uses the real incoming ID, not a hard-coded one.

### Build Stage 3 — Query Parameters
Add a query parameter (for example, `include=accountTier`) as a proper parameter field rather than string-concatenating it into the URL.

### Build Stage 4 — Headers and Body
Add a JSON `Content-Type` header. Build a request body for a POST call from dynamic expressions rather than a static example.

### Build Stage 5 — POST Request
Send a POST to log the enriched request against a practice "requests" endpoint.

### Build Stage 6 — Chain the Response
Merge the original incoming fields with the new fields returned by the API call into a single clean object.

### Build Stage 7 — Break/Fix Rehearsal
Before the formal break below, briefly try an intentionally malformed body to see the API's `400` response shape — this primes the diagnosis skill.

### Test It Yourself
Send `customerId: "C-501"` through your webhook and confirm the final merged object contains both the original fields and the freshly fetched `customerName` and `accountTier`.

### Detleng Live Verification
Detleng sends a `customerId` to your production webhook and checks that your workflow calls the external API and returns a correctly enriched, merged response.

**What Detleng can verify:** that the enrichment actually happened and the merge is structurally correct.
**What you must do manually:** confirm the URL and parameters are built dynamically, not hard-coded to pass this one test case.

### Deliberate Break
Change the dynamic URL expression to reference `customerID` (wrong casing) instead of `customerId`.

### Diagnose the Failure
The expression resolves to `undefined`, the request goes to a malformed or empty-ID URL, and the API responds with `404` or `400` — a classic expression-typo bug that looks like an API problem at first glance.

### Repair
Correct the expression's field name casing.

### Verify the Repair
Re-run with the original `customerId` payload and confirm the enrichment succeeds again.

### Common Mistakes
Hard-coding a URL that only works for one test customer. String-concatenating query parameters instead of using proper parameter fields. Forgetting to merge the original request data back in, losing context from the incoming event.

### Security / Safety Notes
> **SECURITY NOTE** — never build a URL by directly interpolating unvalidated user input without considering what a malicious or malformed value could do to that URL. Lesson 06 builds on this with proper credential handling.

### Professional Engineering Notes
> **CLIENT THINKING** — a huge share of real freelance automation work is exactly this shape: "get event, look up more context, act on the combined picture." Master this pattern and you can quote for a large share of real client requests.

### Portfolio Evidence
Export the workflow JSON and a short `enrichment-spec.md` describing the input shape, the external call, and the output shape.

### Freelance Scenario
> **CLIENT THINKING** — "When a support ticket comes in, look up the customer's plan tier and route accordingly." This lesson is that exact architecture with different labels.

### Job Interview / Workplace Relevance
Be able to explain how you'd design an enrichment step for an unfamiliar API, using only its documentation and this lesson's method.

### What You Just Proved
That your workflow can reach outward, fetch real context, and combine it correctly with what it already had.

### What You Can Now Do
Use n8n as a true **API orchestration engine**, not just an internal-node tool.

### Engineering Mental Model
```text
Incoming Data → External Lookup → Merge → Enriched Result
```

### Completion Story
This morning your workflow only knew what arrived in the request. Now it can reach out, ask another system for more, and combine both into something more useful than either alone.

### Next Lesson Bridge
Right now your practice API asked for nothing. Real APIs almost always demand proof of who's calling. Next: Authentication.

---

<a id="lesson-06"></a>
# 06 — Authentication
## Open the Right Doors Without Exposing the Keys

### Lesson Identity
- **Level:** 1 — Foundation
- **Core skill:** Secure API authentication using n8n's Credentials Store
- **Difficulty:** Intermediate
- **Lesson build:** Protected Customer API Integration
- **Prerequisites:** Lessons 01–05

### Opening Story
Every API you've called so far let you in for free. Real systems don't. Today your workflow learns to prove who it is — without ever exposing the secret that proves it.

### The Mission
Call a protected practice endpoint correctly, storing the credential the right way — never inside a workflow field, never inside Detleng.

### Where You Start
Comfortable making dynamic HTTP requests (Lesson 05).

### Where You Finish
Able to configure and use API Key, Bearer Token, and Basic Auth credentials properly, and to explain OAuth2 conceptually.

### The Golden Rule
> **SECURITY NOTE** — Your credentials are never saved inside Detleng. Secrets live only in your own n8n **Credentials Store**. Detleng verifies *behavior*, never asks to see or receive your keys.

### What You Will Learn
- Why authentication exists at all
- API Key authentication (header or query parameter)
- Bearer Token authentication
- Basic Authentication
- OAuth2 at a mental-model level: proving access without sharing a password
- How to use n8n's Credentials Store instead of hard-coding secrets into node fields
- The real difference between **Authentication** ("who are you?") and **Authorization** ("what are you allowed to do?")

### What You Will Build
**Protected Customer API Integration**, against a disposable, demo-credentialed practice endpoint provided for this lesson only.

### Workflow Architecture
```text
Webhook
   ↓
HTTP Request (authenticated) → Protected Customer API
   ↓
Handle 200 / 401 / 403
```

### Concepts Introduced
API Key, Bearer Token, Basic Auth, OAuth2 (conceptual), Credentials Store, `401 Unauthorized` vs `403 Forbidden`.

### Sample Data
Valid demo token → `200 OK` with customer data.
Invalid/expired token → `401 Unauthorized`.
Valid token, insufficient scope → `403 Forbidden`.

### Build Stage 1 — Why Authentication Exists
Frame it plainly: without it, anyone could call any API as anyone. Authentication is the door; authorization is what's allowed once you're through it.

### Build Stage 2 — API Key
Configure an API Key credential in n8n's Credentials Store, attached as a header, and use it on a practice request.

### Build Stage 3 — Bearer Token
Configure a Bearer Token credential and reuse the same HTTP Request node pattern with a different auth type.

### Build Stage 4 — Basic Auth
Configure Basic Auth credentials for a third practice endpoint variant.

### Build Stage 5 — OAuth2 Mental Model
Without necessarily wiring a full OAuth2 flow, walk through what happens conceptually: authorization request → user consent → token issued → token used → token refreshed — access without ever sharing a password.

### Build Stage 6 — The Credentials Store
Move any provisional hard-coded secret out of node fields entirely and into a proper n8n credential, referenced by the node instead of pasted into it.

### Test It Yourself
Call the protected endpoint with the correct credential and confirm `200`. Deliberately use an empty credential and confirm you get a clean `401`, not a crash.

### Detleng Live Verification
Detleng verifies that your production webhook, when triggered, successfully calls the protected practice endpoint and correctly distinguishes between an authorized (`200`) and unauthorized (`401`/`403`) response — without ever receiving your actual credential values.

**What Detleng can verify:** that authenticated calls succeed and unauthenticated ones fail predictably.
**What you must do manually:** confirm your secret is stored only in the n8n Credentials Store, never in an Edit Fields node, a webhook body, or committed anywhere.

### Deliberate Break
Deliberately provide an invalid or expired token in the credential.

### Diagnose the Failure
The call returns `401 Unauthorized`. Distinguish this from `403 Forbidden`, which would mean the token is valid but lacks permission for this action.

### Repair
Restore the correct demo credential in the Credentials Store.

### Verify the Repair
Re-run the workflow and confirm `200 OK` returns with real data again.

### Common Mistakes
Pasting a token directly into a node field "just to test," then forgetting to move it to the Credentials Store. Confusing `401` with `403` and misdiagnosing a permissions issue as a login issue (or vice versa). Assuming OAuth2 tokens never expire.

### Security / Safety Notes
> **SECURITY NOTE** — never commit credentials to Git, paste them into documentation, or include them in a screenshot. Lesson 18 formalizes this with `.gitignore` discipline; the habit starts here.

### Professional Engineering Notes
> **PRODUCTION NOTE** — "Authentication = who are you? Authorization = what may you do?" is one of the most interview-tested distinctions in this entire field. Be able to state it instantly and explain a real example of each.

### Portfolio Evidence
Save a short `auth-notes.md` describing which auth type was used, why, and how the credential is stored — never the credential value itself.

### Freelance Scenario
> **CLIENT THINKING** — "Our internal API requires a Bearer token — can you connect to it?" This lesson is that exact competency, demonstrated safely.

### Job Interview / Workplace Relevance
Be able to explain the differences between API Key, Bearer Token, Basic Auth, and OAuth2, and when each is typically used.

### What You Just Proved
That you can securely authenticate against a protected API without ever exposing a secret.

### What You Can Now Do
Configure credentials properly and connect to authenticated APIs with confidence.

### Engineering Mental Model
```text
Authentication = Who are you?
Authorization  = What may you do?
```

### Completion Story
This morning, every API you called let you walk right in. Now you can prove who you are securely — and you know exactly where that proof is allowed to live.

### Next Lesson Bridge
**Level 1 complete.** You can build, connect, route, enrich, and authenticate real workflows. Level 2 begins where "nodes aren't quite enough" — starting with JavaScript.


---

<a id="level-2"></a>
# LEVEL 2 — CODE & DATA

**Lessons 07–10**

### Level Purpose
Move the learner from "node user" to "automation engineer" by adding real code and real persistence to the system.

### What Changes in the Learner
They stop being limited by what a pre-built node happens to offer and gain the ability to shape data exactly the way a problem requires — and to give their system a memory that survives beyond a single execution.

### Prerequisite Skills
Level 1 complete: workflow anatomy, JSON, REST APIs, webhooks, HTTP requests, authentication.

### Skills Gained
Practical JavaScript and Python for data transformation, SQL for precise questions, and PostgreSQL/Supabase for persistent state.

### Portfolio Value
A workflow with real transformation logic and a real, queryable, persistent database behind it.

### Job / Freelance Relevance
This is the point where the learner can credibly say "I don't just connect APIs — I can transform and store data correctly," which is what separates automation hobbyists from automation engineers in client conversations.

### Level Completion Capability
"I can manipulate, query, and persist real data."

---

<a id="lesson-07"></a>
# 07 — JavaScript
## When Nodes Are Not Enough

### Lesson Identity
- **Level:** 2 — Code & Data
- **Core skill:** Practical, automation-focused JavaScript inside the Code node
- **Difficulty:** Intermediate
- **Lesson build:** Order Intelligence Transformer
- **Prerequisites:** Lessons 01–06

### Opening Story
Ninety percent of what you'll ever need in n8n can be done with nodes alone. But sometimes the shape you need is specific enough that no pre-built node quite gets you there. Today you learn exactly enough JavaScript to close that gap — not to become a software developer.

### The Mission
Transform a batch of raw orders into a structured intelligence summary: totals, counts, priority tags, and validation state — all computed correctly by code you write yourself.

### Where You Start
Comfortable with n8n's built-in nodes and expressions; no formal programming background required.

### Where You Finish
Able to write small, reliable JavaScript transformations inside a Code node whenever a standard node becomes awkward.

### What You Will Learn
- Variables and values in practical automation contexts
- Working with objects and arrays in JavaScript
- `map`, `filter`, and simple loops applied to real data
- Writing conditions in code, not just IF nodes
- The Code node's input/output contract in n8n
- A real, end-to-end transformation task

### What You Will Build
**Order Intelligence Transformer**

### Workflow Architecture
```text
Webhook (batch of orders)
      ↓
Code Node (JavaScript)
      ↓
   total amount / item count /
   priority tag / normalized names /
   validation state
      ↓
Return Summary
```

### Concepts Introduced
Code node input (`$input.all()` / `items`) and output contract, array methods (`map`, `filter`, `reduce`), truthy/falsy pitfalls, defensive property access.

### Sample Data
```json
[
  { "customer": " ali khan ", "amount": 150, "priority": "high" },
  { "customer": "Sara Ahmed", "amount": 40 },
  { "customer": "", "amount": -10, "priority": "normal" }
]
```

### Build Stage 1 — Variables and Values
Establish the basics inside the Code node: declaring variables, reading input values, returning a value.

### Build Stage 2 — Objects and Arrays in JS
Read and construct plain objects and arrays matching the shapes seen in earlier lessons' JSON.

### Build Stage 3 — `map`, `filter`, and Loops
Use `.map()` to normalize customer names (trim whitespace, fix capitalization), `.filter()` to exclude invalid orders (negative amounts, empty names).

### Build Stage 4 — Conditions in Code
Write a priority-tagging rule in plain JavaScript rather than a chain of IF nodes, and explain when code is clearer than nodes and when it isn't.

### Build Stage 5 — The Code Node Contract
Confirm exactly what shape the Code node expects to receive and return in this n8n version. **[VERIFY IN CURRENT n8n UI]** for the precise `$input`/`items` API in your installed version.

### Build Stage 6 — Real Transformation Task
Produce a single summary object: `totalAmount`, `itemCount`, `validOrderCount`, `flaggedHighPriorityCount`, and an array of `normalizedOrders`.

### Test It Yourself
Run the sample batch and confirm the invalid order (empty name, negative amount) is excluded from the totals but still visible somewhere as a "rejected" record, not silently vanished.

### Detleng Live Verification
Detleng sends a batch of orders, including at least one deliberately invalid record, and checks that your computed totals, counts, and validation results are all correct.

**What Detleng can verify:** the correctness of your computed output for known input.
**What you must do manually:** decide and justify how invalid records are handled — dropped, flagged, or both — since that's a design decision, not a right-or-wrong fact.

### Deliberate Break
Reference a property that doesn't exist on one order object — for example, `order.customerName` when the real field is `order.customer`.

### Diagnose the Failure
Depending on how it's accessed, this throws `undefined` errors that crash the transformation, or silently propagates `undefined` into your totals — the two classic JavaScript failure modes for bad property access.

### Repair
Correct the property name, and add defensive checks (e.g., optional chaining or explicit existence checks) so a future missing field doesn't crash the whole batch.

### Verify the Repair
Re-run the same batch and confirm the transformation completes cleanly and the totals are correct again.

### Common Mistakes
Returning the wrong shape from the Code node (a bare array where an array of `{ json: ... }` items is expected, or vice versa). Mutating input arrays destructively instead of building new output. Assuming every order object has every field.

### Security / Safety Notes
> **WATCH FOR THIS** — Code nodes can technically do almost anything, which means they can also silently hide bugs that a visual node would have made obvious. Keep Code node logic small, named clearly, and single-purpose.

### Professional Engineering Notes
> **ENGINEERING NOTE** — this lesson is not a programming course. The rule is: only reach for code when a standard node becomes genuinely awkward, and even then, keep the code small and legible enough that a colleague could read it in thirty seconds.

### Portfolio Evidence
Export the workflow JSON. Save the Code node's script separately as `order-intelligence-transformer.js` with a one-line comment explaining its purpose.

### Freelance Scenario
> **CLIENT THINKING** — "I need order data cleaned and summarized before it hits my dashboard." This lesson's transformer is exactly that deliverable.

### Job Interview / Workplace Relevance
Be able to explain, live, why you chose a Code node over a chain of built-in nodes for a specific transformation.

### What You Just Proved
That when standard nodes become awkward, you can write small, reliable JavaScript that gets the job done without turning your workflow into unreadable code.

### What You Can Now Do
Reach for JavaScript exactly when it's the right tool — and know when it isn't.

### Engineering Mental Model
> "Nodes for structure. Code for the 10% nodes can't cleanly express."

### Completion Story
This morning, an awkward transformation would have meant fighting with a chain of nodes. Now you can write ten clean lines of JavaScript and move on.

### Next Lesson Bridge
JavaScript solved your problem — but it's not the only language automation engineers reach for. Next, the same engineering thinking, expressed in Python.

---

<a id="lesson-08"></a>
# 08 — Python
## Add a Second Coding Tool to Your Automation Belt

### Lesson Identity
- **Level:** 2 — Code & Data
- **Core skill:** Practical, automation-focused Python inside n8n's Python execution environment
- **Difficulty:** Intermediate
- **Lesson build:** Data Cleanup & Analysis Step
- **Prerequisites:** Lessons 01–07

### Opening Story
You just proved you can reshape data with JavaScript. Today you do the same job with a different tool — and discover something more valuable than syntax: the underlying thinking barely changes at all.

### The Mission
Clean and summarize a batch of genuinely messy records: inconsistent names, duplicate values, and numbers stored as text.

### Where You Start
Comfortable transforming data with JavaScript (Lesson 07).

### Where You Finish
Able to write small, reliable Python transformations for automation tasks, and to recognize that the *thinking* — not the language — is the real skill.

### What You Will Learn
- Python syntax essentials relevant to automation
- Variables, lists, and dictionaries
- Conditions and loops
- Writing small functions
- n8n's Python execution environment and its input/output contract
- Transforming real incoming automation data

### What You Will Build
**Data Cleanup & Analysis Step**

### Workflow Architecture
```text
Webhook (messy records)
      ↓
Python Code Node
      ↓
  deduplicate / normalize /
  convert numeric strings /
  categorize
      ↓
Return Clean Report
```

### Concepts Introduced
Lists vs dictionaries, type coercion (string-to-number), deduplication logic, Python's Code node contract in n8n.

### Sample Data
```json
[
  { "name": "ALI KHAN", "amount": "150" },
  { "name": "ali khan", "amount": "150" },
  { "name": "Sara Ahmed", "amount": "not-a-number" },
  { "name": "Zara Malik", "amount": "75.50" }
]
```

### Build Stage 1 — Python Syntax Essentials
Cover just enough: indentation-based blocks, `print` for debugging, basic data types.

### Build Stage 2 — Variables, Lists, Dictionaries
Represent the incoming records as Python dictionaries inside a list, mirroring the JSON shapes from earlier lessons.

### Build Stage 3 — Conditions and Loops
Loop over records, using conditions to identify and flag the "not-a-number" case rather than letting it crash the summary.

### Build Stage 4 — Functions
Extract a small `normalize_name(name)` function so the same logic isn't repeated inline.

### Build Stage 5 — n8n's Python Execution Environment
Confirm exactly how input arrives and how output must be returned in this environment. **[VERIFY IN CURRENT n8n UI]** for the exact Python execution contract in your installed version, since this differs meaningfully from the JavaScript Code node.

### Build Stage 6 — Real Transformation Task
Deduplicate by normalized name, convert valid numeric strings to real numbers, flag invalid ones, and produce a clean summary report.

### Test It Yourself
Confirm the two "ali khan" variants (different casing) are correctly recognized as duplicates and merged, and that the invalid amount is flagged rather than silently treated as zero.

### Detleng Live Verification
Detleng sends a batch containing duplicates, valid numeric strings, and at least one invalid numeric string, and checks that your deduplication and type-conversion logic produced the correct summary.

**What Detleng can verify:** correctness of deduplication and numeric handling against known input.
**What you must do manually:** decide how an invalid value should be reported — as an error, a zero, or an excluded record — since context determines the "correct" business answer.

### Deliberate Break
Access a dictionary key that doesn't exist on one record — for example, `record["email"]` when no record has that key.

### Diagnose the Failure
Python raises a `KeyError`, halting the entire batch rather than just skipping the one problematic record — a stricter and louder failure mode than JavaScript's silent `undefined`.

### Repair
Use `.get("email")` with a sensible default, or explicitly check for the key's existence before accessing it.

### Verify the Repair
Re-run the batch and confirm it now completes without crashing, correctly handling records with and without the optional field.

### Common Mistakes
Returning the wrong output structure for n8n's Python contract. Assuming Python and JavaScript handle missing data the same way (they don't — this is a genuinely useful contrast to internalize). Comparing numeric strings without explicit conversion.

### Security / Safety Notes
> **WATCH FOR THIS** — Python's stricter failure behavior (`KeyError`, `TypeError`) is a feature, not an annoyance: it surfaces data problems loudly instead of letting them silently corrupt downstream calculations.

### Professional Engineering Notes
> **ENGINEERING NOTE** — the real lesson here isn't Python syntax. It's proof that once you understand data-flow thinking — input, transform, validate, output — the specific language becomes a secondary detail you can pick up as needed.

### Portfolio Evidence
Export the workflow JSON and save the Python script as `data-cleanup-analysis.py` with a short header comment.

### Freelance Scenario
> **CLIENT THINKING** — "Our spreadsheet exports have duplicate customers with inconsistent formatting." This lesson's cleanup logic solves that directly.

### Job Interview / Workplace Relevance
Be able to explain one concrete difference between how Python and JavaScript handled a missing-field scenario in your own testing — a strong, specific interview answer.

### What You Just Proved
That you can perform reliable data-processing tasks in a second language, and that your engineering thinking transfers.

### What You Can Now Do
Apply small, reliable Python transformations wherever they fit naturally into an automation.

### Engineering Mental Model
> "The language is secondary. Data-flow thinking is primary."

### Completion Story
This morning, Python inside an automation tool might have sounded unusual. Now you've used it to solve a real, messy data problem — and noticed how familiar the thinking already felt.

### Next Lesson Bridge
You've processed data. Now it's time to *ask* data precise questions — SQL.

---

<a id="lesson-09"></a>
# 09 — SQL
## Ask Data Precise Questions

### Lesson Identity
- **Level:** 2 — Code & Data
- **Core skill:** Writing precise, safe SQL queries against operational data
- **Difficulty:** Intermediate
- **Lesson build:** Operations Reporting Database
- **Prerequisites:** Lessons 01–08

### Opening Story
You've cleaned and transformed data inside a single execution. But real operations need to answer questions across *all* the data that's ever come in — questions like "how many high-priority requests did we get this week from the billing department?" That's what SQL is for.

### The Mission
Turn plain business questions into precise SQL queries against a small operations reporting database.

### Where You Start
Comfortable transforming data in code (Lessons 07–08); no prior database experience assumed.

### Where You Finish
Able to translate a real business question into a correct, safe SQL query.

### What You Will Learn
- Tables, rows, and columns as the shape of relational data
- `SELECT` to retrieve exactly the data you need
- `WHERE`, `ORDER BY`, and `LIMIT` to filter and shape results
- `INSERT` and `UPDATE` to change data safely
- Aggregations: `COUNT`, `SUM`, `AVG`
- `JOIN` to combine related tables — customers with their requests
- The professional habit of inspecting rows before running `UPDATE` or `DELETE`

### What You Will Build
**Operations Reporting Database**, using example tables:
```text
customers
requests
departments
```

### Workflow Architecture
```text
Manual/Webhook Trigger
      ↓
Execute Query (SQL)
      ↓
Format Report
```

### Concepts Introduced
Relational tables, primary/foreign keys (conceptually), filtering, sorting, aggregation, joins, the "look before you write" habit.

### Sample Data
```text
customers(id, name, department_id)
requests(id, customer_id, priority, status, created_at)
departments(id, name)
```
Example rows: a Billing customer with two High-priority requests, and a Support customer with one Standard request marked resolved.

### Build Stage 1 — Tables, Rows, Columns
Map the three example tables visually before writing any query, and identify how `customer_id` in `requests` relates to `id` in `customers`.

### Build Stage 2 — `SELECT`
Retrieve all requests, then only their `priority` and `status` columns.

### Build Stage 3 — `WHERE`, `ORDER BY`, `LIMIT`
Find only High-priority, unresolved requests, ordered by creation date, limited to the 5 most recent.

### Build Stage 4 — `INSERT`, `UPDATE`
Insert a new request row. Update a request's `status` from `open` to `resolved` — after first selecting and confirming the exact row.

### Build Stage 5 — Aggregations
Count total requests per department, sum priority-weighted request counts, and compute the average time-to-resolution conceptually.

### Build Stage 6 — `JOIN`
Join `requests` to `customers` to `departments` to answer: "which department generated the most High-priority requests this month?"

### Build Stage 7 — Produce a Real Report
Combine the above into a single query (or small query chain inside the workflow) that produces an actual operations report.

### Test It Yourself
Run your report query and manually verify at least one row against the raw table data, confirming the join and aggregation logic actually matches reality rather than just "returning something."

### Detleng Live Verification
Detleng seeds a known small dataset into your practice database and checks that your report query returns the mathematically correct counts, sums, and joined results.

**What Detleng can verify:** the numeric correctness of your query results against known seed data.
**What you must do manually:** inspect rows before any `UPDATE`/`DELETE` you run — Detleng cannot verify a habit, only an outcome.

### Deliberate Break
Write an `UPDATE requests SET status = 'resolved'` with a missing or wrong `WHERE` clause.

### Diagnose the Failure
Every row in the table gets updated, not just the intended one — one of the most common and most damaging real-world SQL mistakes.

### Repair
Add the correct `WHERE id = ...` condition, and — critically — first re-run the equivalent `SELECT` to confirm exactly which rows would be affected before running the `UPDATE` again.

### Verify the Repair
Confirm only the intended row's status changed, and that the other rows retained their original values.

### Common Mistakes
Running `UPDATE`/`DELETE` without a `WHERE` clause. Joining on the wrong key and silently duplicating or dropping rows. Confusing `COUNT(*)` with `COUNT(column)` when the column can contain nulls.

### Security / Safety Notes
> **PRODUCTION NOTE** — "always `SELECT` before you `UPDATE` or `DELETE`" is not a beginner rule — it's a habit senior engineers still follow, because the cost of skipping it can be catastrophic and irreversible.

### Professional Engineering Notes
> **ENGINEERING NOTE** — SQL is the skill that turns "we have data" into "we can answer questions about our business." It's one of the most consistently valuable skills across every level of this course.

### Portfolio Evidence
Save your queries as `operations-reporting.sql` with comments explaining what business question each answers.

### Freelance Scenario
> **CLIENT THINKING** — "Can you give me a weekly report of open high-priority tickets by department?" This lesson is that exact deliverable, in SQL.

### Job Interview / Workplace Relevance
Be able to write a `JOIN` with an aggregation live, on a whiteboard or a shared screen, and explain each clause as you write it.

### What You Just Proved
That you can convert an ambiguous business question into a precise, correct query.

### What You Can Now Do
Turn "how many...", "which...", and "what's the average..." into working SQL.

### Engineering Mental Model
> "SQL doesn't process data. It asks data precise questions."

### Completion Story
This morning, "query the database" might have sounded intimidating. Now you can write joins and aggregations that answer real operational questions correctly.

### Next Lesson Bridge
So far, every workflow forgot everything the moment it finished running. Next, you give it a real memory: PostgreSQL and Supabase.

---

<a id="lesson-10"></a>
# 10 — PostgreSQL / Supabase
## Give Your Automation a Memory

### Lesson Identity
- **Level:** 2 — Code & Data
- **Core skill:** Persisting and retrieving real application state
- **Difficulty:** Intermediate–Advanced
- **Lesson build:** Persistent Operations Database
- **Prerequisites:** Lessons 01–09

### Opening Story
Until now, every workflow run started from zero and forgot everything the moment it finished. Production systems have to remember what happened before. Today your automation gets a real memory.

### The Mission
Store an incoming request permanently, look it up later, and update its state — proving your automation now remembers across separate, independent runs.

### Where You Start
Comfortable writing SQL queries (Lesson 09).

### Where You Finish
A workflow that stores, retrieves, and updates real persistent records in PostgreSQL/Supabase.

### What You Will Learn
- What PostgreSQL is and how Supabase packages it with useful tooling
- Supabase project and database anatomy
- Creating schemas and tables intentionally
- IDs, timestamps, and relationships between tables
- Connecting n8n to a real database
- Inserting, retrieving, and updating real records
- An early, practical introduction to indexes, Row-Level Security (RLS), migrations, and least privilege — deepened later in Level 4

### What You Will Build
**Persistent Operations Database**

### Workflow Architecture
```text
Incoming Request
      ↓
Store in PostgreSQL/Supabase
      ↓
Lookup Customer
      ↓
Update Status
      ↓
Return Record
```

### Concepts Introduced
Schema design, primary keys, timestamps, foreign key relationships, n8n's database connection/credential pattern, indexes, RLS, migrations, least privilege (introduced, deepened in Level 4).

### Sample Data
```text
requests(id, customer_id, priority, status, created_at, updated_at)
```
Request A: `{ customer_id: "C-501", priority: "high", status: "open" }`
Request B (later, separate execution): a lookup for the same `customer_id`, expected to find Request A.

### Build Stage 1 — PostgreSQL Concept
Establish PostgreSQL as a real, production-grade relational database — not a toy — and Supabase as a hosted platform that packages it with a friendly interface and instant APIs.

### Build Stage 2 — Supabase Project Anatomy
Walk through creating a Supabase project and locating its database connection details.

### Build Stage 3 — Schema and Table Creation
Create the `requests` table with proper types: UUID or serial `id`, `text` fields, `timestamp` fields defaulting sensibly.

### Build Stage 4 — IDs, Timestamps, Relationships
Add `created_at` and `updated_at` columns, and discuss why every persistent table should have both from day one.

### Build Stage 5 — n8n ↔ Database Connection
Configure n8n's PostgreSQL credential and connection, following the Credentials Store discipline established in Lesson 06.

### Build Stage 6 — Insert + Retrieve + Update
Insert Request A. In a **separate, later execution**, retrieve it by `customer_id`. Then update its `status` from `open` to `in_progress`.

### Build Stage 7 — Introduce Production Concepts Lightly
Add an index on `customer_id`. Discuss RLS conceptually (deepened in Level 4). Discuss the idea of a migration as a versioned schema change. Discuss least-privilege database roles.

### Test It Yourself
Run the insert workflow once. Independently, minutes later, run the retrieval workflow and confirm the exact same record comes back — proving persistence, not just in-memory continuity within one execution.

### Detleng Live Verification
Detleng makes Request A against your live workflow. Later, in a separate call, Detleng asks your workflow to retrieve Request A by its known identifier and checks that the correct, previously-stored record is returned.

**What Detleng can verify:** that a record genuinely persisted across two independent, separate interactions.
**What you must do manually:** design the schema sensibly — Detleng verifies behavior, not schema elegance.

> **This is the best live proof in the entire lesson:** if Request B can find Request A, your automation has memory.

### Deliberate Break
Attempt to insert a second record with a duplicate primary key, or use a wrong column type (e.g., text where a timestamp is expected).

### Diagnose the Failure
The database rejects the operation — a duplicate key violation or a type mismatch error — rather than silently corrupting data. Recognize this as the database protecting your data's integrity, not a random error.

### Repair
Correct the key or the type mismatch, and re-run.

### Verify the Repair
Confirm the corrected insert succeeds and the retrieval workflow still returns clean, correct data.

### Common Mistakes
Forgetting `updated_at` entirely. Using an overly permissive database role for a workflow that only needs read access. Not testing retrieval in a genuinely separate execution, which can hide bugs that only appear across real persistence boundaries.

### Security / Safety Notes
> **SECURITY NOTE** — apply least privilege at the database credential level: a workflow that only reads should use a role that can only read. RLS (Row-Level Security), introduced conceptually here, becomes a full production requirement by Lesson 20.

### Professional Engineering Notes
> **ENGINEERING NOTE** — "my automation has memory" is a genuine milestone. Everything from Level 3 onward — agents, RAG, MCP tools — depends on the system being able to remember and retrieve real state, exactly as you just built.

### Portfolio Evidence
Save your schema as `operations-schema.sql`, plus a short `database-notes.md` describing the table design and access pattern.

### Freelance Scenario
> **CLIENT THINKING** — "We need every support request logged permanently, not just processed once." This lesson is that exact requirement.

### Job Interview / Workplace Relevance
Be able to explain why timestamps and least-privilege roles matter from day one of a schema's life, not as an afterthought.

### What You Just Proved
That your automation can remember across time, not just within a single execution.

### What You Can Now Do
Design a simple schema, connect n8n to a real database, and reliably store, retrieve, and update state.

### Engineering Mental Model
> "A workflow without persistence is a reflex. A workflow with persistence is a system."

### Completion Story
This morning, every workflow forgot everything the second it finished. Now Request A is still there, waiting, when Request B comes looking for it.

### Next Lesson Bridge
**Level 2 complete.** Your system can manipulate, query, and remember real data. Level 3 begins where deterministic logic ends and reasoning begins — Large Language Models.


---

<a id="level-3"></a>
# LEVEL 3 — AI ENGINEERING

**Lessons 11–15**

### Level Purpose
Add a reasoning layer on top of deterministic automation — responsibly, with bounded tools and grounded knowledge, never as unaccountable magic.

### What Changes in the Learner
They learn to distinguish **deterministic logic** (predictable, rule-based) from **probabilistic AI output** (useful, but requiring validation), and to design systems where each is used where it belongs.

### Prerequisite Skills
Level 1–2 complete: workflows, data transformation, and persistence.

### Skills Gained
LLM integration with structured output, agent design with bounded tools, RAG grounded in real documents, vector database fundamentals, and MCP as a standardized tool-discovery layer.

### Portfolio Value
An AI system that classifies requests, retrieves grounded knowledge, and acts through a deliberately limited set of tools — not an unconstrained chatbot wrapper.

### Job / Freelance Relevance
This is the skill set clients and employers currently pay the most attention to. Being able to say "I design AI systems with validated structured output and bounded agent tools" is a materially different, more credible claim than "I've used ChatGPT."

### Level Completion Capability
"I can add LLMs, agents, knowledge, and tools responsibly."

---

<a id="lesson-11"></a>
# 11 — LLM APIs
## Give Your Workflow Language Intelligence

### Lesson Identity
- **Level:** 3 — AI Engineering
- **Core skill:** Structured, validated LLM output as a workflow component
- **Difficulty:** Intermediate–Advanced
- **Lesson build:** AI Request Triage
- **Prerequisites:** Lessons 01–10

### Opening Story
Your workflow has been deterministic so far: given the same input, it always does the same thing. Today it gains the ability to *understand* language — but only if you force that understanding into a shape your workflow can trust.

### The Mission
Feed a free-text customer request to an LLM and receive back a structured, validated classification your workflow can act on directly.

### Where You Start
A working, persistent operations system (Level 1–2 complete).

### Where You Finish
An LLM integration — using OpenAI, Claude, or Gemini, provider-neutral — that returns reliable structured JSON, not just conversational text.

### What You Will Learn
- A working mental model of what an LLM actually does
- The difference between a prompt, an instruction, and input data
- System context versus user context
- Structured output / JSON schema techniques
- Temperature and why deterministic-feeling output requires deliberate constraint
- Integrating an LLM call into an existing intake workflow

### What You Will Build
**AI Request Triage** — turning free text like:
> "Our production payment system has stopped working and customers cannot checkout."

into:
```json
{
  "category": "technical",
  "urgency": "high",
  "summary": "Production payment system outage blocking customer checkout.",
  "recommendedTeam": "engineering"
}
```

### Workflow Architecture
```text
Webhook (free-text request)
      ↓
LLM Call (structured prompt)
      ↓
Validate JSON Schema
      ↓
Route by category / urgency
```

### Concepts Introduced
Prompt vs instruction vs input, system/user roles, structured output constraints, temperature, deterministic logic vs probabilistic AI output.

> **DEBUGGING MOMENT** — the credential for your chosen provider (OpenAI, Claude, or Gemini) lives in your own n8n Credentials Store, exactly as established in Lesson 06. Detleng never asks for or stores that key.

### Sample Data
Normal: "My invoice total looks wrong, can someone check it?" → `category: billing, urgency: normal`.
High: the payment outage example above.
Ambiguous: "This is so frustrating, nothing works." → tests whether your schema forces a valid category even when the input is vague.

### Build Stage 1 — The LLM Mental Model
Establish plainly: an LLM predicts likely continuations of text based on patterns in its training. It does not "know" your business — it responds to what you give it.

### Build Stage 2 — Prompt vs Instruction vs Input
Separate the system instruction ("classify this request into exactly these categories") from the actual user input (the free-text request itself).

### Build Stage 3 — System/User Context
Structure the call with a clear system message defining the task and allowed values, and a user message containing only the request text.

### Build Stage 4 — Structured Output / JSON Schema
Constrain the model to return only the four required fields, with `category` and `urgency` restricted to an explicit enumerated list.

### Build Stage 5 — Temperature and Determinism
Set a low temperature and explain why: triage should be consistent, not creative.

### Build Stage 6 — Integrate Into the Existing Workflow
Feed the validated structured output into the same routing logic pattern used since Lesson 04, so classification results in real branching, not just a printed label.

### Test It Yourself
Run all three sample cases and confirm the returned JSON always has exactly the required fields, with `category` and `urgency` always one of the allowed values — never something invented.

### Detleng Live Verification
When this verifier is implemented, Detleng sends a fixed evaluation set to the production webhook and checks the returned structure: valid JSON, all required fields present, correct types, and only allowed enum values. Any assessment of free-text relevance uses a disclosed rubric or human review rather than an undocumented exact match.

**What Detleng can verify:** JSON validity, required fields, correct types, and allowed values — free text is never exact-matched.
**What you must do manually:** judge whether the `summary` is actually useful, since usefulness is a human judgment Detleng cannot fully automate.

### Deliberate Break
Use a vague, unconstrained prompt (no enumerated categories, no schema) and send the same three sample requests.

### Diagnose the Failure
The output becomes inconsistent between runs: sometimes `"category": "Technical"`, sometimes `"technical issue"`, sometimes missing a field entirely — the classic symptom of unconstrained AI output feeding a deterministic system.

### Repair
Reintroduce the explicit schema and enumerated values, and re-test until output is consistently well-formed across repeated runs of the same input.

### Verify the Repair
Run the same request multiple times and confirm the structure and field values remain stable and valid every time.

### Common Mistakes
Trusting free-text output without validating its structure. Letting the model invent category values not in your allowed list. Using a high temperature for a task that needs consistency.

### Security / Safety Notes
> **PRODUCTION NOTE** — never paste real customer PII into an LLM prompt without understanding your provider's data-handling terms. This becomes a formal concern again in Lesson 20's security section.

### Professional Engineering Notes
> **WHY THIS MATTERS** — the entire discipline of "AI engineering" versus "using a chatbot" is the difference between this lesson's validated, schema-constrained call and an unconstrained prompt hoping for the best.

### Portfolio Evidence
Save your system prompt as `triage-system-prompt.md` and the JSON schema as `triage-schema.json`, along with example inputs and outputs.

### Freelance Scenario
> **CLIENT THINKING** — "We get hundreds of support emails and need them auto-categorized." This lesson is that exact deliverable, built correctly.

### Job Interview / Workplace Relevance
Be able to explain why you validate LLM output structurally rather than trusting it, and give a real example of inconsistent output you personally observed and fixed.

### What You Just Proved
That you can turn a "chat toy" into a genuine, trustworthy **workflow component**.

### What You Can Now Do
Integrate an LLM into deterministic automation with validated, structured output.

### Engineering Mental Model
```text
DETERMINISTIC LOGIC        PROBABILISTIC AI OUTPUT
(always the same result)   (validate before you trust)
```

### Completion Story
This morning, "add AI" might have meant "hope the text makes sense." Now it means a validated, schema-constrained component your workflow can rely on exactly like any other node.

### Next Lesson Bridge
Your LLM can classify. Next, it learns to act — deciding, on its own, which tools it needs to answer a question. AI Agents.

---

<a id="lesson-12"></a>
# 12 — AI Agents
## From One Prompt to Tool-Using Automation

### Lesson Identity
- **Level:** 3 — AI Engineering
- **Core skill:** Designing bounded, tool-using AI agents
- **Difficulty:** Advanced
- **Lesson build:** Operations Assistant Agent
- **Prerequisites:** Lessons 01–11

### Opening Story
Classification was a single question, single answer. Real operational questions are messier: "Is a refund possible for this order?" answering that requires looking things up, checking a policy, and doing a calculation — in whatever order actually makes sense. That's what an agent does.

### The Mission
Build an agent that can decide, on its own, which of a small set of safe tools it needs, in what order, to answer a real operational question correctly.

### Where You Start
Comfortable with structured LLM output (Lesson 11).

### Where You Finish
An agent with a deliberately limited toolset that reasons through a multi-step question.

### What You Will Learn
- The real difference between an LLM call and an agent
- The agent loop: think → request a tool → observe the result → continue or answer
- Writing clear, unambiguous tool descriptions
- Giving an agent only the safe, deterministic tools it actually needs
- Agent memory boundaries — what it remembers within one run versus across runs
- Building and testing a real multi-tool scenario

### What You Will Build
**Operations Assistant Agent**, with controlled tools:
```text
Lookup Customer
Lookup Order
Check Refund Policy
Calculate Eligibility
```
Example question: *"Is a refund possible for order ORD-204?"*

### Workflow Architecture
```text
Webhook (question)
      ↓
Agent (LLM + tool access)
   ↙        ↓        ↘
Lookup   Lookup    Check Refund
Customer  Order      Policy
      ↘     ↓      ↙
   Calculate Eligibility
              ↓
         Final Answer
```

### Concepts Introduced
Agent loop, tool descriptions, tool scoping, agent memory boundaries, multi-step reasoning.

### Sample Data
`ORD-204`: purchased 20 days ago, policy allows refunds within 30 days → eligible.
`ORD-118`: purchased 90 days ago → not eligible, with the policy reason stated.
Unknown order ID → agent should report it cannot find the order rather than guessing.

### Build Stage 1 — LLM vs Agent
Contrast Lesson 11's single-shot classification against a task that genuinely requires multiple steps and decisions about *what to check first*.

### Build Stage 2 — The Agent Loop
Walk through the loop explicitly: the agent reasons about what it needs, calls a tool, observes the real result, and decides whether it has enough information to answer or needs another tool.

### Build Stage 3 — Tool Descriptions
Write clear, specific descriptions for each of the four tools — vague descriptions are the single biggest cause of an agent choosing the wrong tool.

### Build Stage 4 — Give the Agent Safe, Deterministic Tools
Wire each tool to real, already-built n8n logic: `Lookup Customer` and `Lookup Order` hit your Lesson 10 database; `Check Refund Policy` is a deterministic lookup, not an AI guess; `Calculate Eligibility` is plain date-math logic, not left to the LLM to "figure out."

### Build Stage 5 — Agent Memory Boundaries
Confirm what the agent retains within a single run (the results of tools it has already called) versus what it does not retain across separate runs.

### Build Stage 6 — Multi-Tool Scenario
Run the full refund-eligibility question end to end and confirm the agent calls the tools in a sensible order and arrives at a correct, explainable answer.

### Test It Yourself
Ask about `ORD-204` and `ORD-118` separately and confirm the agent reaches the mathematically correct eligibility conclusion for each, referencing the actual policy and actual order date — not a guess.

### Detleng Live Verification
When this verifier is implemented, Detleng sends known refund-eligibility scenarios to the production endpoint and checks the final answer against deterministic fixture data. Tool use can be verified only when the workflow returns a sanitized tool trace or purpose-built evidence fields; a final answer alone cannot prove which tools ran.

**What Detleng can verify:** the correctness of the final answer and, when explicit trace evidence is returned, whether the expected tools were used.
**What you must do manually:** write tool descriptions precise enough that the agent chooses correctly — this is a design skill Detleng surfaces failures in, but cannot write for you.

### Deliberate Break
Rewrite the `Check Refund Policy` tool description vaguely — for example, just "policy" instead of a clear description of what it checks and returns.

### Diagnose the Failure
The agent either skips the tool entirely, calls the wrong tool, or guesses at policy details instead of retrieving them — producing a confident-sounding but factually wrong answer.

### Repair
Rewrite the tool description precisely: what it does, what input it needs, what it returns.

### Verify the Repair
Re-run the same refund questions and confirm the agent now reliably calls the correct tool and produces the correct, grounded answer.

### Common Mistakes
Giving the agent tools it doesn't need "just in case." Vague tool descriptions. Letting the agent calculate something (like date math) that should be deterministic code instead.

### Security / Safety Notes
> **SECURITY NOTE — the critical lesson:** an agent should never have unlimited power. Give it exactly the tools it needs for its job, and nothing more. An agent with a "delete customer" tool it never needed to have is a real, unnecessary risk.

### Professional Engineering Notes
> **ENGINEERING NOTE** — the quality of an agent is determined far more by tool scoping and tool descriptions than by which LLM provider you chose. This is the single highest-leverage skill in agent design.

### Portfolio Evidence
Save your tool descriptions as `agent-tools.md` and export the workflow JSON, including a note on why each tool was scoped the way it was.

### Freelance Scenario
> **CLIENT THINKING** — "Can support staff ask a bot about refund eligibility instead of checking three systems manually?" This lesson is exactly that agent, built with real guardrails.

### Job Interview / Workplace Relevance
Be able to explain the agent loop from memory, and to describe a real case where a vague tool description caused a wrong tool choice — and how you fixed it.

### What You Just Proved
That you can build an agent that reasons through a multi-step real question using only the tools it actually needs.

### What You Can Now Do
Design agents with deliberate, minimal tool access rather than open-ended power.

### Engineering Mental Model
```text
Think → Call Tool → Observe → Continue or Answer
```

### Completion Story
This morning, "AI agent" might have sounded like an unpredictable black box. Now you've built one with real boundaries that reasons correctly and explainably.

### Next Lesson Bridge
Your agent can act. Next, it learns to answer from your actual knowledge — not its training data. Retrieval-Augmented Generation.

---

<a id="lesson-13"></a>
# 13 — RAG
## Let AI Answer From Your Knowledge, Not Its Memory

### Lesson Identity
- **Level:** 3 — AI Engineering
- **Core skill:** Retrieval-Augmented Generation grounded in real documents
- **Difficulty:** Advanced
- **Lesson build:** Company Knowledge Assistant
- **Prerequisites:** Lessons 01–12

### Opening Story
An LLM's training data doesn't know your refund policy, your escalation procedure, or your onboarding guide. If you ask it anyway, it may answer confidently — and wrongly. Today you teach it to answer only from what you actually gave it.

### The Mission
Build a knowledge assistant that answers real questions grounded in your own small document set, and that admits it doesn't know when the answer isn't there.

### Where You Start
Comfortable with agents and structured LLM output (Lessons 11–12).

### Where You Finish
A working RAG pipeline: retrieve relevant knowledge, then answer strictly from it.

### What You Will Learn
- Why an LLM's general knowledge is insufficient for company-specific questions
- The RAG mental model: question → retrieve → provide context → answer
- Loading real documents into a retrievable form
- Chunking documents sensibly
- The concept of embeddings (deepened in Lesson 14)
- Producing grounded answers with source citation

### What You Will Build
**Company Knowledge Assistant**, over a small document set:
```text
refund policy
escalation procedure
onboarding guide
product limits
```

### Workflow Architecture
```text
Question
   ↓
Retrieve Relevant Knowledge
   ↓
Provide Context to LLM
   ↓
Answer (with source)
```

### Concepts Introduced
Grounding, chunking, embeddings (conceptual), retrieval, citation, "insufficient evidence" responses.

### Sample Data
"Can a customer get a refund after 45 days?" → should retrieve the refund policy and answer accurately from it.
"What's our company's founding year?" → not in any document → should honestly report insufficient information rather than guessing.

### Build Stage 1 — Why General Knowledge Isn't Enough
Ask the LLM directly, without any retrieval, about your refund policy, and observe it either declines or invents a plausible-sounding but wrong answer.

### Build Stage 2 — The RAG Mental Model
Walk the loop explicitly: a question comes in, relevant chunks of your own documents are retrieved, those chunks are handed to the LLM as context, and only then does it answer.

### Build Stage 3 — Document Loading
Load the four practice documents into your pipeline as plain text.

### Build Stage 4 — Chunking
Split documents into reasonably sized chunks rather than feeding entire documents at once, and discuss why chunk size affects retrieval quality.

### Build Stage 5 — Embeddings Concept
Introduce embeddings as "turning meaning into numbers so similar meanings land near each other" — full depth arrives in Lesson 14.

### Build Stage 6 — Retrieval + Grounded Answer
Retrieve the top relevant chunks for a question, provide them as context, and require the answer to cite which document it came from.

### Test It Yourself
Ask the 45-day refund question and confirm the answer correctly reflects your actual policy document's real terms, with the source named.

### Detleng Live Verification
When this verifier is implemented, Detleng asks questions against a known, versioned fixture document set — some answerable, one deliberately not — and checks that answerable questions cite the expected source identifier and that the unanswerable one is honestly reported as such.

**What Detleng can verify:** correct grounding and correct citation for known questions.
**What you must do manually:** curate the document set itself — Detleng verifies retrieval behavior, not the completeness of your knowledge base.

### Deliberate Break
Deliberately chunk documents far too small (splitting mid-sentence) or retrieve from the wrong document entirely.

### Diagnose the Failure
Retrieved context becomes fragmented or irrelevant, producing a weak, vague, or subtly wrong answer even though the correct information technically exists somewhere in the document set.

### Repair
Adjust chunk size to preserve coherent meaning per chunk, and re-verify retrieval is pulling from the correct document.

### Verify the Repair
Re-ask the same question and confirm the answer is now accurate and properly grounded.

### Common Mistakes
Feeding entire documents as context regardless of relevance (expensive and noisy). Not requiring citation, making it impossible to verify grounding. Letting the model answer when nothing relevant was actually retrieved.

### Security / Safety Notes
> **PRODUCTION NOTE** — the golden rule of RAG: if the information isn't in the source, the AI should say it doesn't have enough evidence — never invent a plausible-sounding answer.

### Professional Engineering Notes
> **ENGINEERING NOTE** — RAG is not "search plus AI." It's a discipline of only ever answering from evidence you can point to, which is exactly what makes it trustworthy enough for real operational use.

### Portfolio Evidence
Save your four practice documents, your chunking approach as `rag-notes.md`, and example question/answer/citation triples.

### Freelance Scenario
> **CLIENT THINKING** — "We want a bot that answers from our internal policy docs, not the open internet." This lesson is that exact system.

### Job Interview / Workplace Relevance
Be able to explain, with a real example from your own testing, what happens when RAG retrieval fails — and why "the model made something up" is usually a retrieval problem, not a model problem.

### What You Just Proved
That you can build an AI system that answers only from real evidence, and honestly reports when it has none.

### What You Can Now Do
Design retrieval-grounded AI answers instead of trusting raw model knowledge.

### Engineering Mental Model
```text
Question → Retrieve → Ground → Answer (with source)
```

### Completion Story
This morning, an AI's confident wrong answer about your own policy would have been indistinguishable from a correct one. Now your system only speaks from evidence — and says so when it can't.

### Next Lesson Bridge
Retrieval just worked like magic. Next, you open that box: Vector Databases.

---

<a id="lesson-14"></a>
# 14 — Vector Databases
## Understand the Engine Behind Semantic Search

### Lesson Identity
- **Level:** 3 — AI Engineering
- **Core skill:** Vector database fundamentals for semantic retrieval
- **Difficulty:** Advanced
- **Lesson build:** Semantic Knowledge Search
- **Prerequisites:** Lessons 01–13

### Opening Story
In Lesson 13, retrieval felt like a magic box that just knew which chunk to fetch. Today that box opens — and it turns out to be built from ideas you already understand: numbers, storage, and search.

### The Mission
Build real semantic search over your knowledge base — one that finds the right answer even when the question doesn't share a single word with the source document.

### Where You Start
Comfortable with the RAG pipeline built in Lesson 13.

### Where You Finish
Understanding vector infrastructure well enough to configure, tune, and debug it — not just plug in a pre-built node and hope.

### What You Will Learn
- Embeddings as numerical representations of meaning
- Vector similarity search versus keyword search
- Storing embeddings alongside text and metadata
- Performing similarity search
- Filtering results by metadata
- Managing the knowledge base over time: upsert, update, delete

### What You Will Build
**Semantic Knowledge Search**, preferably using Supabase's `pgvector` extension so your Lesson 10 database knowledge carries forward directly.

### Workflow Architecture
```text
Document → Chunk → Embed → Store (text + vector + metadata)
                                    ↓
Question → Embed → Similarity Search → Top Matches → Answer
```

### Concepts Introduced
Embeddings, vector similarity, `pgvector` (or equivalent), metadata filtering, upsert/update/delete of knowledge.

### Sample Data
Query: *"customer wants money back"* — contains no word matching "refund" verbatim, and should still retrieve the refund policy document through semantic similarity rather than keyword overlap.

### Build Stage 1 — Embeddings as Meaning
Explain plainly: an embedding turns text into a list of numbers positioned so that similar *meanings* land near each other in that numerical space — regardless of exact wording.

### Build Stage 2 — Vector vs Keyword Search
Run the same "customer wants money back" query through a plain keyword search (which finds nothing useful) and then through vector search (which correctly finds the refund policy), side by side.

### Build Stage 3 — Store Embedding + Text + Metadata
For each chunk, store the original text, its embedding vector, and metadata such as source document name and section.

### Build Stage 4 — Similarity Search
Query with a new embedded question and retrieve the closest-matching stored chunks.

### Build Stage 5 — Metadata Filtering
Add a filter — for example, restrict results to only the "policy" category of documents — and confirm it correctly narrows results.

### Build Stage 6 — Upsert / Update / Delete
Update a document's content and confirm the corresponding stored embedding is refreshed, not left stale. Delete an obsolete document's chunks entirely.

### Test It Yourself
Run the "customer wants money back" query and confirm the refund policy is retrieved even though the word "refund" never appears in the question.

### Detleng Live Verification
When this verifier is implemented, Detleng runs semantically phrased queries against a controlled, versioned fixture corpus and checks that the expected source identifiers appear in the returned top results. It does not claim to inspect an arbitrary private knowledge base without an explicit verification interface.

**What Detleng can verify:** retrieval correctness for known semantic queries.
**What you must do manually:** tune chunk size and similarity thresholds, since "good enough" retrieval quality is a judgment call, not a pass/fail fact.

### Deliberate Break
Set an overly strict similarity threshold, or apply a metadata filter that excludes the correct category by mistake.

### Diagnose the Failure
Relevant results are silently excluded — the system returns "no good matches" or unrelated documents, even though the correct information exists in the database.

### Repair
Loosen the threshold to a sensible value, and correct the metadata filter.

### Verify the Repair
Re-run the same query and confirm the correct document is retrieved again.

### Common Mistakes
Treating vector search as infallible rather than tunable. Forgetting to update embeddings after editing source content. Applying metadata filters that unintentionally exclude everything relevant.

### Security / Safety Notes
> **WATCH FOR THIS** — a stale vector database (content updated in the source but not re-embedded) is a subtle, dangerous failure mode: it looks like it's working, but it's answering from outdated information.

### Professional Engineering Notes
> **ENGINEERING NOTE** — understanding this infrastructure is what separates "I plugged in a vector node" from "I can debug why retrieval quality degraded." Employers and clients notice the difference immediately.

### Portfolio Evidence
Save your `pgvector` schema as `vector-schema.sql` and a `retrieval-benchmark.md` documenting your test queries and results.

### Freelance Scenario
> **CLIENT THINKING** — "Our search only works if customers type the exact words in our docs." This lesson is the direct fix — real semantic search.

### Job Interview / Workplace Relevance
Be able to explain, in plain language, why vector search finds "money back" when the document says "refund" — and what a similarity threshold actually controls.

### What You Just Proved
That you understand the real infrastructure behind semantic retrieval, not just how to call a pre-built node.

### What You Can Now Do
Configure, tune, and debug a real vector database powering AI retrieval.

### Engineering Mental Model
```text
Meaning → Numbers → Nearness → Relevant Result
```

### Completion Story
This morning, retrieval was a black box. Now you understand — and can tune — the engine inside it.

### Next Lesson Bridge
Your agent has tools. Your system has knowledge. Next, you learn the standardized way modern AI systems discover and use tools at all: MCP.

---

<a id="lesson-15"></a>
# 15 — MCP
## Give AI a Standard Way to Discover and Use Tools

### Lesson Identity
- **Level:** 3 — AI Engineering
- **Core skill:** Connecting agents to tools via the Model Context Protocol
- **Difficulty:** Advanced
- **Lesson build:** MCP-Connected Operations Agent
- **Prerequisites:** Lessons 01–14

### Opening Story
In Lesson 12, every tool your agent used was custom-wired by hand. That works for four tools. It doesn't scale to forty, across different teams and systems, each built differently. MCP exists to solve exactly that problem.

### The Mission
Connect your agent to a standardized MCP server, discover its available tools dynamically, and use one intelligently inside a real scenario.

### Where You Start
Comfortable building agents with custom, hand-wired tools (Lesson 12).

### Where You Finish
Understanding MCP's client/server/tool model well enough to connect an agent to any compliant MCP server.

### What You Will Learn
- The problem MCP solves: why "every tool integration is custom" doesn't scale
- The MCP mental model: Client ↔ MCP Server ↔ Tools/Resources
- Connecting an n8n agent to an MCP server
- Discovering available tools dynamically rather than hard-coding them
- Calling a read-only tool safely
- Letting the agent choose an MCP tool intelligently within a real scenario

### What You Will Build
**MCP-Connected Operations Agent**, against a safe Detleng-provided practice MCP server exposing:
```text
get_customer
get_order
check_service_status
create_demo_note
```

### Workflow Architecture
```text
Agent (n8n)
   ↕ (MCP protocol)
MCP Server
   ↓
Tools / Resources
```

### Concepts Introduced
MCP client/server model, tool discovery, tool schemas exposed by the server rather than hand-written by you, read-only vs write tools.

### Sample Data
Question: *"What's the status of the checkout service, and does customer C-501 have an open order?"* — requires the agent to discover and correctly call `check_service_status` and `get_customer`/`get_order` without you having manually wired those specific calls.

### Build Stage 1 — Why Not Just Custom Integrations?
Contrast Lesson 12's hand-wired tools against a hypothetical forty-tool, multi-team system, and identify exactly why hand-wiring stops scaling.

### Build Stage 2 — The MCP Mental Model
Establish the three-part model explicitly: your agent is the client, the MCP server exposes tools/resources, and the protocol standardizes how they talk.

### Build Stage 3 — Connect to an MCP Server
Configure your n8n agent to connect to the practice MCP server. **[VERIFY IN CURRENT n8n UI]** for the exact MCP connection configuration in your installed version.

### Build Stage 4 — Discover Available Tools
Have the agent list the tools the server exposes, rather than you hard-coding what you assume is available.

### Build Stage 5 — Call a Read-Only Tool
Manually trigger `check_service_status` once to confirm the connection and response shape before letting the agent decide on its own.

### Build Stage 6 — Agent Uses MCP Tools Intelligently
Ask the combined question above and confirm the agent discovers, selects, and correctly calls the right MCP tools to answer it.

### Test It Yourself
Ask the combined status-and-order question and confirm the agent's final answer correctly reflects both the real service status and the real order lookup.

### Detleng Live Verification
When this verifier is implemented, Detleng sends a controlled scenario requiring at least two distinct MCP tool calls. It checks the combined answer and any sanitized tool-call evidence explicitly returned by the workflow; it cannot infer tool discovery reliably from answer text alone.

**What Detleng can verify:** correct output and, when trace evidence is exposed for the lab, the expected tool selection and use.
**What you must do manually:** confirm your agent connects to the MCP server dynamically rather than you having silently hard-coded the tool calls yourself.

### Deliberate Break
Request a tool name that doesn't exist on the server, or pass an invalid argument to a real tool (e.g., a malformed order ID).

### Diagnose the Failure
The server returns an explicit "tool not found" or "invalid argument" error rather than silently failing — confirm the agent surfaces this clearly instead of guessing an answer anyway.

### Repair
Correct the tool name or argument, relying on the discovery step rather than assumption.

### Verify the Repair
Re-run the scenario and confirm the agent now calls the correct, valid tool and produces a correct answer.

### Common Mistakes
Hard-coding tool names instead of discovering them. Assuming an MCP server's tools never change. Letting the agent call a write tool (`create_demo_note`) when a read-only lookup would have sufficed.

### Security / Safety Notes
> **SECURITY NOTE** — the same "give it exactly the tools it needs" principle from Lesson 12 applies here at the server level too: an MCP server should expose only the tools a given agent genuinely needs, not everything it's capable of.

### Professional Engineering Notes
> **WHY THIS MATTERS** — REST APIs and MCP are not the same thing. A REST API is a general application communication interface. MCP is a standardized interaction layer specifically for AI/tool ecosystems — being able to state this distinction clearly is a real signal of genuine understanding, not memorized buzzwords.

### Portfolio Evidence
Save `mcp-integration-notes.md` describing the server's exposed tools, your discovery process, and the scenario you tested.

### Freelance Scenario
> **CLIENT THINKING** — "We already have several internal tools exposed via MCP — can you connect an assistant to them?" This lesson is the direct, transferable skill.

### Job Interview / Workplace Relevance
Be able to state, precisely, the difference between a REST API and MCP, and why standardized tool discovery matters as an AI ecosystem grows.

### What You Just Proved
That your agent can dynamically discover and correctly use tools from a standardized external server.

### What You Can Now Do
Connect any MCP-compliant agent to any MCP-compliant tool server.

### Engineering Mental Model
```text
REST API = application communication interface
MCP      = standardized AI/tool interaction layer
```

### Completion Story
This morning, every tool your agent used had to be wired by hand. Now it can discover and use tools from a standardized server it's never seen configured before.

### Next Lesson Bridge
**Level 3 complete.** Your system can reason, retrieve, and act. Level 4 begins where demos become production — starting with the thing every real system eventually faces: failure.


---

<a id="level-4"></a>
# LEVEL 4 — PRODUCTION ENGINEERING

**Lessons 16–20**

### Level Purpose
Take the AI-powered operations system built across Levels 1–3 and make it resilient, deployable, observable, and safe enough to trust with real, sensitive actions.

### What Changes in the Learner
They stop thinking "does it work on my machine, right now" and start thinking "will it survive failure, redeployment, and scrutiny — and can I prove what it did, to whom, and why."

### Prerequisite Skills
Level 1–3 complete.

### Skills Gained
Error handling and resilience, containerized reproducibility, professional version control, real cloud deployment, monitoring, security hardening, and human-approval design for sensitive actions.

### Portfolio Value
A deployed, monitored, secured, version-controlled, human-approved production AI automation system — the capstone artifact of the entire course.

### Job / Freelance Relevance
This is precisely the difference between "I built a demo" and "I can ship and operate a real system," which is what employers and serious clients are actually paying for.

### Level Completion Capability
"I can make automation resilient, deployable, observable, and safe."

---

<a id="lesson-16"></a>
# 16 — Error Handling & Debugging
## Build Automations That Survive Failure

### Lesson Identity
- **Level:** 4 — Production Engineering
- **Core skill:** Designing resilient workflows that survive real-world failure
- **Difficulty:** Advanced
- **Lesson build:** Resilient API Workflow
- **Prerequisites:** Lessons 01–15

### Opening Story
A happy-path workflow is easy to build. Production engineering begins the moment another system fails on you — and every system eventually does.

### The Mission
Build a workflow that keeps working, or fails safely and visibly, when the external API it depends on starts misbehaving.

### Where You Start
A working, feature-complete system across Levels 1–3.

### Where You Finish
A workflow with real retry logic, backoff, error branches, and a genuine alert path — not a system that silently breaks.

### What You Will Learn
- The real types of failure: transient versus permanent
- Timeouts and why they matter
- Retries and retry-delay/backoff strategy
- Designing explicit error branches
- Building an error workflow / alert path
- Why you should never blindly retry everything

### What You Will Build
**Resilient API Workflow**, against a practice API deliberately configured to sometimes return `500`, `429`, a timeout, or a malformed response.

### Workflow Architecture
```text
Request
   ↓
Call External API
   ↓ success        ↓ failure
Continue      Classify Failure
                 ↓          ↓
            Transient   Permanent
                 ↓          ↓
        Retry w/ Backoff  Alert Path
```

### Concepts Introduced
Transient vs permanent error, exponential backoff, dead-letter concept, idempotency (formalized here after Lesson 04's light introduction), "don't retry everything blindly."

### Sample Data
Simulated responses: `500 Internal Server Error` (transient — worth retrying), `429 Too Many Requests` (transient, but requires a backoff delay), a connection timeout (transient), and a `400 Bad Request` from malformed input (permanent — retrying won't help).

### Build Stage 1 — Types of Failure
Classify each simulated response as transient (worth retrying) or permanent (retrying won't fix a fundamentally bad request).

### Build Stage 2 — Timeouts
Configure an explicit timeout on the HTTP Request node so a hanging call doesn't stall the entire workflow indefinitely.

### Build Stage 3 — Retries
Add retry logic for transient failures, with a maximum retry count rather than infinite retries.

### Build Stage 4 — Retry Delay / Backoff
Implement increasing delay between retries (backoff) rather than immediate, rapid-fire retries that can worsen an already-struggling external system.

### Build Stage 5 — Error Branches
Route permanent failures to a distinct branch immediately, without wasting retries on them.

### Build Stage 6 — Error Workflow / Alert Path
Build a genuine alert path — logging the failure with enough context (what failed, why, when) to be actionable, without leaking secrets into that log.

### Build Stage 7 — Chaos Test
Trigger the workflow repeatedly against the practice API's deliberately unstable behavior and confirm the workflow reacts correctly to each failure type it encounters.

### Test It Yourself
Trigger enough runs to personally observe at least one transient retry-and-recover sequence and one permanent immediate-alert sequence, and confirm both matched your design intent.

### Detleng Live Verification
Detleng triggers your workflow against the deliberately unstable practice API multiple times and checks that transient failures are retried with backoff and permanent failures are routed immediately to the alert path without wasted retries.

**What Detleng can verify:** correct classification and correct handling behavior for real, injected failures.
**What you must do manually:** decide your retry limits and backoff timing — these are engineering judgment calls with real tradeoffs, not a single correct answer.

### Deliberate Break
Retry a permanent `400 Bad Request` failure as if it were transient, with an aggressive retry loop.

### Diagnose the Failure
The workflow wastes time and resources retrying a request that will never succeed, delaying the point at which anyone is actually alerted to the real, permanent problem.

### Repair
Correctly classify `400`-class client errors as permanent, and route them to the alert path immediately instead of retrying.

### Verify the Repair
Re-run the chaos test and confirm permanent failures are now reported immediately, while transient ones still retry sensibly.

### Common Mistakes
Retrying everything indiscriminately. No maximum retry limit, risking infinite loops. Alert logs that either leak sensitive data or contain so little context they're useless for debugging.

### Security / Safety Notes
> **SECURITY NOTE** — a useful log is not the same as a leaky log. Never log full request bodies containing credentials, tokens, or personal data — log what failed and why, not everything that was sent.

### Professional Engineering Notes
> **PRODUCTION NOTE** — idempotency, introduced lightly in Lesson 04, matters urgently here: a retried request must not cause a duplicate real-world effect (like charging a customer twice). Design retried operations to be safely repeatable.

### Portfolio Evidence
Save `error-handling-design.md` describing your failure classification logic, retry/backoff strategy, and alert path.

### Freelance Scenario
> **CLIENT THINKING** — "Our automation broke silently last month and nobody noticed for two days." This lesson's alert path is the direct answer to that exact, common client complaint.

### Job Interview / Workplace Relevance
Be able to explain the difference between a transient and a permanent error with real examples, and why blind universal retrying is a common, damaging anti-pattern.

### What You Just Proved
That your workflow doesn't collapse the moment something external goes wrong — it reacts appropriately and tells someone.

### What You Can Now Do
Design workflows that survive realistic failure conditions instead of assuming a perfect world.

### Engineering Mental Model
```text
Transient  → Retry with backoff
Permanent  → Alert immediately
```

### Completion Story
This morning, a flaky external API would have quietly broken your workflow. Now it retries what's worth retrying, gives up on what isn't, and always tells someone what happened.

### Next Lesson Bridge
Your workflow survives failure. Next, make its entire *environment* reproducible, so "works on my machine" stops being a risk: Docker.

---

<a id="lesson-17"></a>
# 17 — Docker & Self-Hosting
## Make Your Automation Environment Reproducible

### Lesson Identity
- **Level:** 4 — Production Engineering
- **Core skill:** Containerized, reproducible n8n environments
- **Difficulty:** Advanced
- **Lesson build:** Local n8n Engineering Stack
- **Prerequisites:** Lessons 01–16

### Opening Story
"It works on my machine" is not an engineering answer — it's a warning sign. Today you make your entire environment reproducible, so it works the same way on any machine, every time.

### The Mission
Run n8n and PostgreSQL together in Docker, with real persistent storage, and prove that data survives a container restart.

### Where You Start
n8n has, until now, run in whatever environment you happened to have.

### Where You Finish
A reproducible, version-defined local stack anyone — including future-you — can recreate identically.

### What You Will Learn
- The difference between an image and a container
- Ports and why they matter for reaching your services
- Volumes and persistent storage
- Environment variables for configuration
- Docker Compose for multi-service stacks
- Launching a local n8n + PostgreSQL environment

### What You Will Build
**Local n8n Engineering Stack**, roughly:
```text
n8n
PostgreSQL
persistent volumes
```

### Workflow Architecture
```text
docker-compose.yml
   ↓
n8n container ←→ PostgreSQL container
        ↓                  ↓
   named volume        named volume
   (n8n data)          (database data)
```

### Concepts Introduced
Image vs container, port mapping, named volumes, environment variables, Docker Compose service definitions.

### Sample Data
N/A — this lesson's "sample data" is the persisted state itself: a workflow you create, and the request records from Lesson 10's schema.

### Build Stage 1 — Image vs Container
Explain plainly: an image is the blueprint; a container is a running instance of that blueprint.

### Build Stage 2 — Ports
Map n8n's internal port to a local port you can reach in your browser.

### Build Stage 3 — Volumes
Define named volumes so both n8n's internal data and PostgreSQL's database files survive beyond the container's lifetime.

### Build Stage 4 — Environment Variables
Configure database connection details and any other required settings via environment variables, not hard-coded values baked into an image.

### Build Stage 5 — Docker Compose
Write a `docker-compose.yml` defining both services, their volumes, their ports, and their environment variables together.

### Build Stage 6 — Launch the Stack
Bring the stack up, confirm n8n is reachable locally, and confirm it can connect to the containerized PostgreSQL instance.

### Test It Yourself
Create a test workflow and a test database record. Stop and remove the containers (not the volumes). Bring the stack back up and confirm both the workflow and the database record are still there.

### Detleng Live Verification
Because Detleng cannot reach your `localhost` directly, the planned verifier uses a challenge pattern: your local n8n container, once you trigger it, sends a short-lived, single-use challenge value to an authenticated Detleng verification endpoint. Detleng confirms receipt and expiry; the challenge contains no credentials or workflow data.

**What Detleng can verify:** that your local stack is genuinely running and able to reach the internet outbound, via the challenge signal.
**What you must do manually:** the actual restart-and-persist test above — this is real engineering proof no external service can observe on your behalf, and no screenshot substitutes for it.

### Deliberate Break
Remove the named volume definitions from `docker-compose.yml` and recreate the containers.

### Diagnose the Failure
All prior workflows and database records are gone — proving, painfully, that without named volumes, a container's data is not actually persistent.

### Repair
Restore the volume definitions and understand, concretely now, why they're not optional for anything meant to persist.

### Verify the Repair
Recreate a test workflow and record, restart the containers again, and confirm this time the data genuinely survives.

### Common Mistakes
Forgetting volumes entirely and being surprised data disappears. Hard-coding secrets directly into `docker-compose.yml` instead of using environment variables or an ignored `.env` file. Mapping the wrong ports and being unable to reach the service.

### Security / Safety Notes
> **SECURITY NOTE** — never commit a `.env` file containing real database passwords or credentials to version control. Lesson 18 formalizes this with `.gitignore`.

### Professional Engineering Notes
> **ENGINEERING NOTE** — the volume-loss break/fix in this lesson is one of the most viscerally memorable lessons in the entire course: nothing teaches "volumes matter" like actually losing your test data once.

### Portfolio Evidence
Save `docker-compose.yml` and a short `environment-setup.md` explaining how to bring the stack up — with any secrets represented only as placeholder variable names.

### Freelance Scenario
> **CLIENT THINKING** — "I need to hand this project off to another developer and it needs to just work on their machine." This lesson is the direct answer.

### Job Interview / Workplace Relevance
Be able to explain the difference between an image and a container, and why named volumes are non-negotiable for anything meant to persist.

### What You Just Proved
That you can recreate your entire n8n environment predictably, and that its data genuinely survives container recreation when configured correctly.

### What You Can Now Do
Define and run a reproducible, multi-service local automation environment.

### Engineering Mental Model
> "Containers are disposable. Volumes are not. Confusing the two costs you your data."

### Completion Story
This morning, your environment lived only on your machine, in your head. Now it's a `docker-compose.yml` file anyone — including future you — can bring up identically.

### Next Lesson Bridge
Your environment is now reproducible. Next, your *history* becomes reproducible too: Git and GitHub.

---

<a id="lesson-18"></a>
# 18 — Git & GitHub
## Treat Automations Like Engineering Assets

### Lesson Identity
- **Level:** 4 — Production Engineering
- **Core skill:** Version control discipline for automation projects
- **Difficulty:** Intermediate–Advanced
- **Lesson build:** Automation Portfolio Repository
- **Prerequisites:** Lessons 01–17

### Opening Story
Every artifact you've built so far has lived only on your machine, one accidental overwrite away from being lost. Today you give your work the same discipline every professional engineering team relies on.

### The Mission
Turn your growing collection of workflow exports, SQL scripts, and Docker configuration into a real, versioned, shareable repository — with secrets kept safely out of it.

### Where You Start
Files scattered locally with no history and no safe way to share them.

### Where You Finish
A real GitHub repository a recruiter, client, or collaborator could actually open and understand.

### What You Will Learn
- The Git mental model: working tree → staging → commit
- `.gitignore` and why it matters from the very first commit
- Branching for safe, isolated changes
- Creating and pushing to a GitHub repository
- Versioning a workflow export, a config file, or a script properly
- Inspecting a diff and safely restoring a previous version after an accidental bad change

### What You Will Build
**Automation Portfolio Repository**, containing:
```text
README
workflow exports
docs/
architecture/
docker-compose.yml
sample env file
```
**Never secrets.**

### Workflow Architecture
```text
Working Tree → git add → Staging → git commit → Local History → git push → GitHub
```

### Concepts Introduced
Working tree, staging, commit, `.gitignore`, branching, diff inspection, safe restoration.

### Sample Data
N/A — the "data" here is your own real project files: your Lesson 01–17 exports, scripts, and configuration.

### Build Stage 1 — The Git Mental Model
Walk through working tree, staging, and commit using one small real file from your project before touching anything else.

### Build Stage 2 — `.gitignore`
Create a `.gitignore` before your first real commit, explicitly excluding `.env`, credential exports, and any local-only files.

### Build Stage 3 — Branching
Create a branch for one specific change (for example, updating the README) rather than committing directly to your main line of history.

### Build Stage 4 — GitHub Repository
Create the remote repository and push your local history to it.

### Build Stage 5 — Version a Real Asset
Commit a workflow export, then modify it, then commit the change again — building real, inspectable history.

### Build Stage 6 — Break/Fix: Bad Change, Safe Restore
Deliberately make a change that breaks something (see below), inspect the diff to understand exactly what changed, and restore safely from history.

### Test It Yourself
Confirm your `.gitignore` is actually working by attempting to stage a fake `.env` file and confirming Git correctly ignores it rather than tracking it.

### Detleng Live Verification
For a public repository—or a private repository only after a future, narrowly scoped GitHub authorization—the planned verifier checks expected files, parses workflow JSON, reviews commit-history shape, and performs best-effort secret-pattern scanning.

**What Detleng can verify:** repository structure, parseable artifacts, commit-history shape, and whether known secret patterns are detected. A clean scan is not proof that no secret exists.
**What you must do manually:** actually understand each diff you commit — Detleng cannot verify that you know why a change was made, only that history exists.

### Deliberate Break
Make an accidental bad change to a committed workflow export — for example, corrupt a JSON file's structure — and commit it without noticing.

### Diagnose the Failure
Realize, on the next attempt to use the file, that it's broken. Use `git diff` (or the GitHub UI's diff view) against the previous commit to see exactly what changed.

### Repair
Restore the previous, working version of the file from history rather than trying to manually reconstruct it from memory.

### Verify the Repair
Confirm the restored file is valid and usable again, and commit the restoration with a clear message explaining why.

### Common Mistakes
Committing `.env` or credential files before setting up `.gitignore`. Vague, unhelpful commit messages like "update." Never branching, so every change — good or bad — goes straight into the main history.

### Security / Safety Notes
> **SECURITY NOTE — critical and absolute:** never commit `.env` files, API keys, tokens, database passwords, or OAuth secrets. If a secret is ever accidentally committed, treat it as compromised and rotate it — removing it from a later commit does not remove it from history.

### Professional Engineering Notes
> **PRODUCTION NOTE** — a portfolio repository with clean structure, a real README, and coherent commit history is often the single most persuasive artifact in a freelance pitch or a job application — more persuasive than a certificate.

### Portfolio Evidence
The repository itself is the evidence: a real README, clean structure, and a commit history that shows genuine incremental engineering work.

### Freelance Scenario
> **CLIENT THINKING** — "Can you hand off the project with proper documentation and version history?" This lesson is the literal, professional answer to that request.

### Job Interview / Workplace Relevance
Be able to walk through your own commit history live and explain what changed and why at any point in it.

### What You Just Proved
That your work is no longer one accidental mistake away from being lost, and that it's now something a stranger could actually inspect and understand.

### What You Can Now Do
Version, branch, and safely recover automation assets like a professional engineer.

### Engineering Mental Model
```text
Working Tree → Staging → Commit → History you can always return to
```

### Completion Story
This morning, your work lived only on your machine with no history. Now it's a real portfolio repository — recoverable, inspectable, and shareable.

### Next Lesson Bridge
Your project is reproducible and versioned. Next, it goes somewhere the whole internet can reach: real cloud deployment.

---

<a id="lesson-19"></a>
# 19 — Cloud / VPS Deployment
## Put Your Automation on the Internet Properly

### Lesson Identity
- **Level:** 4 — Production Engineering
- **Core skill:** Real, secure deployment to a cloud VPS
- **Difficulty:** Advanced
- **Lesson build:** Production-Style Hosted n8n
- **Prerequisites:** Lessons 01–18

### Opening Story
Your local Docker stack from Lesson 17 works beautifully — on your machine, on your network. Today it becomes reachable from anywhere on Earth, safely, with a real domain and real HTTPS.

### The Mission
Deploy n8n to a provider-neutral VPS, reachable over HTTPS at a real domain, and prove it recovers correctly after a restart.

### Where You Start
A working, reproducible local Docker stack (Lesson 17) and version-controlled project (Lesson 18).

### Where You Finish
A live, internet-reachable, HTTPS-secured n8n instance you deployed and can maintain yourself.

### What You Will Learn
- What a VPS actually is
- DNS and domain basics
- Basic server firewall configuration
- Deploying your Docker stack to the VPS
- Persistent storage on a real server
- HTTPS configuration
- Backups, update strategy, avoiding root where practical, and exposed-port discipline

### What You Will Build
**Production-Style Hosted n8n**

### Workflow Architecture
```text
Internet
   ↓
Domain
   ↓
HTTPS / Reverse Proxy
   ↓
n8n
   ↓
Persistent Database / Volume
```

### Concepts Introduced
VPS fundamentals, DNS records, firewall rules, reverse proxy, HTTPS/TLS, backup strategy, update strategy, least-privilege server access.

### Sample Data
N/A — the proof here is a real, publicly reachable health/test endpoint on your own domain.

### Build Stage 1 — What a VPS Is
Establish it plainly: a VPS is a real, always-on computer you rent, distinct from your local machine, reachable by anyone on the internet who knows its address.

### Build Stage 2 — DNS / Domain
Point a real domain (or subdomain) at your VPS's IP address.

### Build Stage 3 — Server Firewall Basics
Configure the firewall to expose only the ports actually needed (typically 80/443), closing everything else.

### Build Stage 4 — Docker Deployment
Deploy the same Docker Compose stack from Lesson 17 onto the VPS itself.

### Build Stage 5 — Persistent Storage
Confirm named volumes on the server behave the same way they did locally — surviving container restarts.

### Build Stage 6 — HTTPS
Configure a reverse proxy with a real TLS certificate so your domain is reachable securely over HTTPS, not plain HTTP.

### Build Stage 7 — Deployment Failure Test
Restart the service (or the entire server) and confirm n8n and its data come back correctly, without manual repair.

### Test It Yourself
From a device that has never touched your local network, visit your domain over HTTPS and confirm n8n loads correctly and securely.

### Detleng Live Verification
When this verifier is implemented, Detleng calls a dedicated public health/test endpoint over HTTPS and checks DNS reachability, TLS certificate validity, response status, timeout behavior, and an expected non-sensitive response contract.

**What Detleng can verify:** that the endpoint is reachable through valid HTTPS and responds as expected. This does not prove the entire host is securely configured, backed up, patched, or protected by a correct firewall.
**What you must do manually:** the restart-and-recover test — proving your deployment survives real operational events, not just a happy first boot.

### Deliberate Break
Restart the VPS itself (not just the containers) without a proper container restart policy configured.

### Diagnose the Failure
n8n does not automatically come back up after the server reboots, because nothing was configured to restart the containers on boot.

### Repair
Configure a proper restart policy on your containers so they relaunch automatically after a server reboot.

### Verify the Repair
Restart the server again and confirm n8n comes back online without any manual intervention.

### Common Mistakes
Leaving unnecessary ports open on the firewall. Running everything as `root` unnecessarily. No backup strategy for the production database. Forgetting a restart policy, as in the break/fix above.

### Security / Safety Notes
> **SECURITY NOTE** — avoid running as `root` where practical, keep the firewall minimal, keep the system and Docker images updated, and have an actual backup strategy before you have real users depending on this system.

### Professional Engineering Notes
> **PRODUCTION NOTE** — "being online isn't enough. Now make it safe and observable" is the exact bridge into Lesson 20 — deployment alone is not production-readiness.

### Portfolio Evidence
Save `deployment-architecture.md` describing your DNS, firewall, reverse proxy, and backup approach — with no real credentials or IP addresses included if the repository is public.

### Freelance Scenario
> **CLIENT THINKING** — "We need this hosted properly, not just running on someone's laptop." This lesson is the direct, professional answer.

### Job Interview / Workplace Relevance
Be able to explain your deployment architecture end to end, including how HTTPS is terminated and how the system recovers from a restart.

### What You Just Proved
That your system is genuinely reachable from the internet, secured, and resilient to a real restart — not just a local demo.

### What You Can Now Do
Deploy and maintain a real, internet-facing n8n production instance.

### Engineering Mental Model
```text
Internet → Domain → HTTPS → Your System → Persistent State
```

### Completion Story
This morning, your system only existed on your own machine. Now it's live on the internet, secured, and survives a real restart without you touching anything.

### Next Lesson Bridge
Being online isn't enough. Now make it safe and observable — the final graduation lab.

---

<a id="lesson-20"></a>
# 20 — Monitoring, Security & Human Approval
## Production Capstone

This is not another lesson. This is the final graduation mission.

### Lesson Identity
- **Level:** 4 — Production Engineering
- **Core skill:** Monitoring, security hardening, and human-in-the-loop design, combined into one production system
- **Difficulty:** Capstone
- **Lesson build:** Production AI Operations System
- **Prerequisites:** Lessons 01–19 (all of them)

### Opening Story
Every skill from the last nineteen lessons has been building toward one true statement: **AI proposes. Rules constrain. Humans approve sensitive action. The system records what happened.** Today you build the system that proves you've internalized that sentence.

### The Mission
Combine everything — intake, persistence, AI classification, retrieval, agent tools, error handling, deployment — into one production-style AI operations system that never lets a sensitive action happen without a human's explicit approval, and that can always show, afterward, exactly what happened and why.

### Where You Start
A deployed, resilient, version-controlled AI automation system spanning all of Levels 1–3, live on a real VPS (Level 4, Lessons 16–19).

### Where You Finish
A monitored, secured, human-approved, fully auditable production AI operations system — your capstone portfolio artifact.

### What You Will Learn
- Real monitoring: run ID, status, duration, success/failure, over time
- Useful logging that never leaks secrets
- Security fundamentals applied end to end: least privilege, secret handling, webhook protection, input validation
- Rate limiting and abuse-prevention thinking
- Designing human approval for sensitive actions
- Building a genuine audit trail: who, what, when, why
- Designing and running a full, multi-scenario final verification

### What You Will Build
**Production AI Operations System**

### Workflow Architecture
```text
Incoming Request
        ↓
Validation
        ↓
Database / Context
        ↓
AI Classification
        ↓
Knowledge Retrieval
        ↓
Agent / Decision
        ↓
Risk Check
        ↓
Human Approval
   ↙             ↘
Reject           Approve
                   ↓
                 Action
                   ↓
              Audit Record
                   ↓
               Monitoring
```

### Concepts Introduced
Run-level monitoring, structured logging discipline, layered security (input validation, webhook protection, least privilege), rate limiting, human-in-the-loop design, audit trail design.

### Sample Data
A realistic mix of requests spanning every scenario below, including at least one clearly low-risk request, one clearly high-risk/sensitive request, one request requiring RAG-grounded knowledge, and one request that should trigger a simulated external-service failure.

### Build Stage 1 — Monitoring
Instrument every run with a run ID, status, start/end timestamps, and success/failure outcome, queryable later — reusing your Lesson 09–10 database skills.

### Build Stage 2 — Logging
Log enough context to debug a real problem later, while deliberately never logging credentials, tokens, or full sensitive payloads.

### Build Stage 3 — Security End to End
Apply least privilege to every credential and database role in the system. Protect the webhook (building on Lesson 06's authentication). Validate every incoming field before it's trusted (building on Lesson 02's defensive habits).

### Build Stage 4 — Rate Limits / Abuse Thinking
Add basic protection against a flood of requests overwhelming the system or an external API you depend on.

### Build Stage 5 — Human Approval
Design the point at which a sensitive action (for example, a refund, an account change, or any action with real financial or customer impact) pauses and waits for an explicit human decision before proceeding.

### Build Stage 6 — Audit Trail
Record who requested the action, what the AI proposed, what risk level was assigned, who approved or rejected it, and when — a complete, honest record of what happened.

### Build Stage 7 — Final Break Test
Send a suspicious, high-risk request and confirm, absolutely, that it does **not** execute without explicit human approval.

### Build Stage 8 — Final Graduation Verification
Run the full scenario set below and confirm every one behaves correctly, with evidence saved for each.

### Test It Yourself
Before Detleng's verification, personally run through every scenario below at least once, and inspect the monitoring and audit records each one produced.

### Detleng Live Verification
When this capstone verifier is implemented, Detleng runs a fixed scenario suite against a dedicated production test endpoint. Audit behavior is checked only through sanitized record identifiers or a purpose-built learner-controlled verification response; Detleng does not receive database credentials or unrestricted database access.

**What Detleng can verify:** observable endpoint behavior and the sanitized audit evidence explicitly exposed for each test scenario.
**What you must do manually:** the human approval decision itself in the relevant scenarios — a real human must approve or reject, by design, since automating that step away would defeat the entire lesson.

**Scenario A — Normal Request**
A low-risk request processes automatically, end to end, with a complete monitoring and audit record.

**Scenario B — AI Needs Knowledge**
A request requiring company knowledge correctly triggers RAG and returns a grounded, cited answer.

**Scenario C — External Service Failure**
A simulated external failure correctly triggers your Lesson 16 retry/error-handling logic rather than crashing the system.

**Scenario D — Sensitive Action**
A high-risk request correctly stops and waits at the human-approval step, taking no action automatically.

**Scenario E — Approval Granted**
Once approved, the action executes, and a complete audit record is created reflecting the approval.

**Scenario F — Rejected**
Once rejected, the action never executes, and the rejection itself is recorded in the audit trail.

### Deliberate Break
Attempt to route a clearly sensitive action so it bypasses the human-approval step entirely — for example, by misclassifying its risk level.

### Diagnose the Failure
The sensitive action executes automatically, with no human in the loop — the single most serious possible failure mode in this entire system, and exactly the failure this lesson exists to prevent.

### Repair
Correct the risk classification logic so genuinely sensitive actions are reliably routed to human approval, and add a conservative default: when risk is ambiguous, require approval rather than assuming safety.

### Verify the Repair
Re-run the same request and confirm it now correctly stops for human approval, and re-run your full scenario set to confirm nothing else regressed.

### Common Mistakes
Treating "AI said it's low risk" as sufficient justification to skip human approval. Logging so much detail that secrets leak, or so little that the audit trail is useless. Forgetting that a rejected action must be recorded, not just silently discarded.

### Security / Safety Notes
> **SECURITY NOTE — the entire lesson in one sentence:** AI proposes. Rules constrain. Humans approve sensitive action. The system records what happened. Every one of those four clauses must hold, every time, for every sensitive request.

### Professional Engineering Notes
> **PRODUCTION NOTE** — this is the system design pattern currently expected of serious, responsible AI automation work in real organizations. Being able to describe and defend this architecture is a genuine, current, in-demand professional skill.

### Portfolio Evidence
The complete capstone repository: workflow exports, schema, Docker configuration, deployment notes, and — critically — real audit/monitoring records from your six-scenario verification run (with any sensitive data redacted before sharing publicly).

### Freelance Scenario
> **CLIENT THINKING** — "We want AI to help with refunds, but we're not comfortable letting it act alone." This lesson is the literal, complete, professional answer to that very common, very real concern.

### Job Interview / Workplace Relevance
Be able to walk an interviewer through this entire architecture end to end, using your own real audit trail as evidence, and explain exactly how a sensitive action is guaranteed to require human approval.

### What You Just Proved
That you can design and operate a real production AI system that is monitored, secured, and safe enough to be trusted with actions that actually matter.

### What You Can Now Do
Design, build, deploy, monitor, secure, and operate a human-approved AI automation system end to end.

### Engineering Mental Model
> AI proposes. Rules constrain. Humans approve sensitive action. The system records what happened.

### Completion Story

You started by clicking Execute.

Now you can design, connect, code, deploy, and protect an AI automation system.

**What you built, across 20 lessons and 4 engineering levels:**
```text
real workflows
APIs
Webhooks
JavaScript
Python
SQL
PostgreSQL
LLMs
Agents
RAG
Vectors
MCP
Docker
Git
Cloud
Monitoring
Security
Human Approval
```

You are not finished learning. But you are no longer starting as a beginner.

### Next Lesson Bridge
There is no next lesson. There is a next system — one you now know how to design, build, break, repair, deploy, and explain, on your own.


---

# The Complete Skill Map

| Skill Area | Introduced | Deepened | Used in Capstone |
|---|---|---|---|
| Workflow anatomy & branching | L01 | — | L20 |
| JSON & nested data | L02 | L07–08 | L20 |
| REST APIs | L03 | L05 | L20 |
| Webhooks & event routing | L01, L04 | L16 (idempotency) | L20 |
| HTTP Request / API orchestration | L05 | L16 (resilience) | L20 |
| Authentication & credentials | L06 | L19, L20 | L20 |
| JavaScript for automation | L07 | — | throughout |
| Python for automation | L08 | — | throughout |
| SQL | L09 | L10 | L20 |
| PostgreSQL / Supabase persistence | L10 | L14 (pgvector) | L20 |
| LLM integration & structured output | L11 | L12, L13 | L20 |
| AI agents & tool scoping | L12 | L15 (MCP) | L20 |
| RAG | L13 | L14 | L20 |
| Vector databases | L14 | — | L20 |
| MCP | L15 | — | L20 |
| Error handling & resilience | L16 | L19, L20 | L20 |
| Docker | L17 | L19 | L20 |
| Git / GitHub | L18 | — | L20 |
| Cloud / VPS deployment | L19 | — | L20 |
| Monitoring, security, human approval | L20 | — | L20 |

Every skill above converges in the Lesson 20 capstone. Nothing learned earlier is left behind.

---

# Portfolio Graduation Checklist

- [ ] Workflow JSON exports for all 20 lessons, organized clearly
- [ ] SQL schema files from Lessons 09, 10, and 14
- [ ] `docker-compose.yml` and environment setup notes from Lesson 17
- [ ] A real GitHub repository with clean structure and honest commit history (Lesson 18)
- [ ] A live, HTTPS-secured production deployment (Lesson 19)
- [ ] Real monitoring and audit records from the Lesson 20 capstone's six scenarios
- [ ] A top-level README explaining the system's architecture in plain language
- [ ] No secrets, credentials, or `.env` files committed anywhere

---

# Freelance Readiness Checklist

- [ ] Can clarify a vague client request into concrete input/output requirements
- [ ] Understands that credentials belong to the client, in their own systems, never handed to you permanently
- [ ] Can read unfamiliar API documentation and identify method, auth type, and expected shapes
- [ ] Sets realistic expectations around rate limits and provider costs
- [ ] Writes real test cases, including edge cases, before calling something "done"
- [ ] Produces clear handoff documentation a client's next developer could actually use
- [ ] Distinguishes test environments from production environments explicitly
- [ ] Sets clear maintenance and ownership expectations before starting paid work
- [ ] Names and versions workflows sensibly instead of "Workflow (1) (2) (final) (final2)"

---

# Job Readiness Checklist

- [ ] Can explain workflow architecture, triggers, and branching to a non-technical interviewer
- [ ] Can explain API orchestration and authentication choices with real examples
- [ ] Can explain a data transformation decision (JS or Python) and justify why code was the right tool
- [ ] Can explain database design choices: keys, timestamps, indexes, least privilege
- [ ] Can explain the difference between deterministic logic and probabilistic AI output
- [ ] Can explain agent tool-scoping decisions with a real example of a fixed mistake
- [ ] Can explain RAG grounding and what "insufficient evidence" behavior looks like
- [ ] Can explain vector search versus keyword search in plain language
- [ ] Can explain the REST API vs MCP distinction precisely
- [ ] Can explain transient vs permanent error handling with real examples
- [ ] Can explain their deployment architecture end to end
- [ ] Can explain the human-approval design of their capstone system, using real audit records as evidence

---

# Production Engineering Checklist

- [ ] Retries with backoff for transient failures; immediate alerting for permanent ones
- [ ] Timeouts configured on all outbound calls
- [ ] Reproducible environment via Docker Compose with real named volumes
- [ ] Version-controlled project with a working `.gitignore` and no committed secrets
- [ ] Deployed behind HTTPS with a minimal, correctly configured firewall
- [ ] Automatic restart policy so the system recovers from a server reboot unattended
- [ ] Backup strategy for persistent data
- [ ] Monitoring: run ID, status, duration, and outcome for every execution
- [ ] Logging that is useful without ever leaking secrets
- [ ] Least-privilege credentials and database roles throughout
- [ ] Input validation on every externally-reachable entry point
- [ ] Human approval required for every action with real financial, customer, or account impact
- [ ] A genuine, inspectable audit trail: who, what, when, why, approved-or-rejected

---

# What the Learner Is Ready to Build

With all 20 lessons complete, the learner can realistically design and ship systems such as:

- An event-driven customer support triage system that classifies, enriches, and routes tickets by real urgency and department
- A refund/eligibility assistant that reasons through policy and order data using a tightly scoped agent, with human approval before any actual refund executes
- A company knowledge assistant grounded in real internal documents, honestly reporting when it doesn't know something
- An order-processing pipeline that enriches incoming orders from an external API, persists them, and survives that API's outages gracefully
- A monitored, secured internal operations dashboard fed by a resilient, self-healing backend workflow
- A freelance client's "connect Shopify/CRM/support-desk events to internal systems" integration, built with real authentication, error handling, and handoff documentation
- Their own MCP-exposed internal tool server for a team's existing systems, so future agents can discover and use those tools safely

---

# Recommended Portfolio Structure

```text
n8n-ai-automation-engineer-portfolio/
  README.md
  lesson-01/
    workflow-export.json
    notes.md
  lesson-02/
    ...
  ...
  lesson-20/
    workflow-export.json
    audit-sample.json
    verification-notes.md
  architecture/
    system-diagram.md
  workflows/
    all-exports/
  sql/
    operations-schema.sql
    vector-schema.sql
  docker/
    docker-compose.yml
  docs/
    deployment-architecture.md
    security-notes.md
  capstone/
    production-ai-operations-system/
```

**Commit:** workflow exports, SQL schema, Docker configuration, documentation, architecture diagrams, and sanitized sample data.

**Never commit:** `.env` files, API keys, OAuth secrets, database passwords, production customer data, or anything that would let a stranger reach your real accounts or your real customers' data.

### Presenting the Portfolio

**To an employer:** lead with the Lesson 20 capstone and its audit trail. It demonstrates architecture judgment, not just node-clicking — walk them through one real scenario end to end.

**To a freelance client:** lead with a lesson that maps directly to their stated problem (enrichment, triage, knowledge assistants, and resilient integrations are the most commonly requested shapes), and show the corresponding real workflow export.

**To a technical collaborator:** open the repository itself. Clean structure, a real README, honest commit history, and a working `docker-compose.yml` say more in five minutes than any conversation could.

---

# Where the Learner Goes Next

Completing this curriculum is not the end of learning — it's the end of starting as a beginner. Reasonable next directions, in no particular order:

- Deepen agent architecture: multi-agent coordination, longer-horizon planning, and tool-use evaluation
- Go deeper on retrieval quality: hybrid search, re-ranking, and evaluation datasets for RAG systems
- Formal observability: structured tracing across a distributed automation system, not just per-run logs
- Infrastructure-as-code for deployment, replacing manual VPS setup with reproducible, versioned infrastructure definitions
- Deeper security work: threat modeling automation systems specifically, not just general web security
- Specializing in one vertical (e-commerce operations, support operations, sales operations) and building deeper domain expertise on top of these general engineering skills
- Contributing to or building custom n8n nodes for tools not yet well supported

The learner is not finished learning. But they are no longer starting as a beginner — and everything above builds on a foundation they built, broke, repaired, deployed, and can explain, themselves.

---

<h2 align="center">n8n Detleng</h2>

<p align="center"><strong>A practical learning platform for n8n AI Automation Engineering.</strong></p>

<p align="center">Built by <strong>Muhammad Naveed Ishaque</strong></p>

<p align="center">DeTLeng helps learners build, test, debug, verify, and explain real automation systems through guided engineering practice.</p>

<table>
  <tr>
    <td align="center"><a href="https://n8n.detleng.com/signup/"><strong>Start Learning →</strong></a></td>
    <td align="center"><a href="https://n8n.detleng.com/"><strong>Visit n8n Detleng →</strong></a></td>
    <td align="center"><a href="#curriculum-map"><strong>Explore Curriculum ↑</strong></a></td>
    <td align="center"><a href="https://network.detleng.com"><strong>Explore DeTLeng Network ↗</strong></a></td>
  </tr>
</table>

<p align="center"><strong>Independent learning project. Not affiliated with or endorsed by n8n GmbH.</strong></p>

<p align="center"><a href="#top">Back to top ↑</a></p>
