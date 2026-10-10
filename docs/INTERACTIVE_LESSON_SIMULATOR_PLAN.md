# Interactive Lesson Simulator — Product Decision Note

Status: Approved direction; implement one lesson at a time.

## Why this direction exists

Detleng lessons should not become passive reading screens or stop a learner because an external tool, temporary URL, listening window, credential, or network request is unavailable. The learner should perform the same conceptual work inside Detleng while mirroring it in their own n8n instance.

The simulator is a teaching companion, not a complete clone of n8n.

## Core learning experience

Each lesson presents a vertical workflow instead of a horizontal reading sequence. The learner can:

- attach the next node;
- open a node as an interactive panel;
- rename and configure the node;
- add fields and choose value types;
- enter JSON and expressions;
- execute an individual node or the workflow;
- inspect input, output, branches, and errors;
- deliberately break, diagnose, and repair the workflow;
- repeat the same actions in their own n8n instance.

The learning loop is:

```text
Build in Detleng
→ understand the action
→ repeat it in n8n
→ compare the output
→ break and repair
```

If n8n or an external integration is temporarily unavailable, the learner can still practise the concept in Detleng. Real n8n practice remains an important part of the lesson and is not replaced by the simulator.

## Proof-of-concept sequence

Do not attempt all 20 lessons at once.

### Phase 1 — Lesson 01 simulator

```text
Manual Trigger
→ Create Request
→ Check Priority (IF)
   ├── TRUE → Escalated
   └── FALSE → Standard
```

Lesson 01 is implemented, tested, and reviewed first.

### Phase 2 — Lesson 02 simulator

Only after Lesson 01 is working:

```text
Start Manually
→ Create Sample Order
→ Normalize Order
```

The reusable engine proven by Lessons 01 and 02 can then be evaluated for the remaining lessons.

## Default repeat-attempt requirement

Every completed lesson must show a clear learner-facing action such as:

```text
Practice Again
```

or:

```text
Start a New Attempt
```

This is a platform-wide default, not a special feature of one lesson.

Required behavior:

- completing a lesson must not trap the learner on the completion screen;
- the original completed record remains preserved;
- a new attempt starts from stage one with fresh practice state;
- repeat attempts are recorded separately where attempt history exists;
- starting a new attempt must not remove the learner's completed dashboard status;
- the learner can return to the completed summary without losing history;
- Lesson 02 must receive the same repeat-attempt capability already expected from Lesson 01;
- future lessons inherit this capability by default from the shared lesson engine.

## Product guardrails

- Keep the simulator simpler than n8n and focused on the current lesson.
- Do not reproduce every n8n setting or feature.
- Do not make an external integration mandatory for understanding a core concept.
- Preserve automatic progress tracking and learner history.
- Keep real n8n practice visible and encouraged.
- Build, test, and finish Lesson 01 before beginning Lesson 02.

## Immediate next step

Design and implement the Lesson 01 vertical simulator proof of concept. Do not begin the Lesson 02 simulator until Lesson 01 has been tested as a complete learner journey.
