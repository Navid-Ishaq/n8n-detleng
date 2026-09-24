# DeTLeng Lesson Build Process

DeTLeng lessons must be easy to execute directly inside n8n. The website guides the learner; n8n is where the learner does the work.

> If YouTube, Google, ChatGPT or another tutorial is needed to fill a missing implementation step, **the lesson is not ready**.

## Source of truth

Use [`curriculum-master-plan.md`](curriculum-master-plan.md) to decide what a lesson teaches, why it exists and what capability it builds. Do not change the curriculum while researching or implementing an individual lesson unless the task explicitly requires a curriculum change.

## Build one lesson at a time

Do not design a website lesson from memory or assumptions. Before implementation:

1. Read that lesson's section in the curriculum.
2. Open the current n8n interface.
3. Build the complete workflow manually from a blank canvas.
4. Record every required click, node, field, type, option, value and expression.
5. Capture screenshots where text alone would not reliably show the location or setting.
6. Record the actual input and output shown by n8n.
7. Rebuild the workflow on a fresh canvas using only the recorded instructions.
8. Correct every missing, guessed or ambiguous step.
9. Only then design and implement the website lesson.

## Exact UI wording only

- Use the exact node, button, field, dropdown and option names observed in the tested n8n version.
- Never invent a label or replace it with an approximate phrase.
- Do not write “may vary by version” to cover an unverified instruction.
- Mention alternate wording only when that alternate version has also been verified.
- Record the n8n version or visible release context when it materially affects the instructions.

Example:

```text
Node: Webhook
Setting: Respond
Select: When Last Node Finishes
```

## Required teaching sequence

For every hands-on step, show only what the learner needs next:

1. **Open** — where the learner should go in n8n.
2. **Click** — the exact button, node or control.
3. **Create** — the exact node, workflow or field name.
4. **Configure** — the exact type, method, setting, value or expression and where it belongs.
5. **Run** — the exact action, such as Execute Step or Execute Workflow.
6. **See** — the exact expected input or output.
7. **Understand** — one short explanation of why it worked.
8. **Continue** — move to the next action only after the success target is clear.

In short:

**Sample Input → Exact Action → Expected Output → Why → Verify → Continue**

## Keep the learner in n8n

- The learner should spend most of the lesson building and running the workflow in n8n.
- DeTLeng should provide short instructions, known values, expected results and troubleshooting.
- Do not add forms, URLs, integrations, quizzes or checkpoints unless they teach the lesson skill or provide necessary verification.
- Do not make DeTLeng perform the practical action that the learner is supposed to learn.
- Use live verification only when it is simple, reliable and genuinely useful.
- Prefer a working five-minute guided build over an impressive but frustrating platform flow.

## Guided success first

Give the learner one complete path using known sample values before inviting experimentation. Never ask a beginner to explore freely before they have seen one successful workflow execution.

Each practical stage must answer:

- What am I building?
- Where do I click?
- What exact value do I enter?
- Where does that value go?
- What do I run?
- What should I see?
- Why did it work?

## Screenshots and research notes

Use screenshots only where they prevent confusion about a real n8n control or layout. Screenshots must come from the workflow being tested, not from guesses or unrelated examples.

Store lesson research notes in `docs/lesson-build-notes/lesson-XX.md`. Record tested UI wording, sample input, actual output, final workflow shape, required settings, screenshot references and problems found during the fresh-canvas replay. Only learner-useful screenshots should later become website assets.

## Verification and completion

- Never claim DeTLeng verified something it cannot observe.
- Learner confirmation is acceptable for an explained manual step.
- Deterministic verification is valuable when it does not create more friction than the lesson itself.
- Expected learning failures should be clearly explained and safe.
- Completion should reflect a working practical result, not a collection of unnecessary buttons.

## Security

Learner API keys, OAuth secrets, database passwords and production tokens remain inside the learner's own n8n Credentials store. Do not request or store them in DeTLeng. Preserve existing authentication, RLS, progress and backend security controls.

## Final readiness check

Before publishing a lesson, confirm:

- the workflow was completed in the current n8n UI;
- all labels and settings were observed, not guessed;
- a fresh-canvas replay succeeded using the lesson instructions alone;
- sample input and expected output are visible;
- every required action is explained from zero;
- unnecessary DeTLeng forms and checkpoints were removed;
- the learner performs the important work directly in n8n;
- the lesson is as short and simple as the skill allows.

If any missing step forces the learner to search elsewhere, return to n8n, verify the real workflow and improve the lesson before publishing it.
