# DeTLeng Lesson Teaching Standard

Every practical lesson must take a learner from uncertainty to a verified result without requiring an outside tutorial.

## Related documents

- Curriculum source: [`docs/curriculum-master-plan.md`](curriculum-master-plan.md)
- Golden lesson philosophy: [`docs/DETLENG_AI_LESSON_GOLDEN_RULES.md`](DETLENG_AI_LESSON_GOLDEN_RULES.md)

## Core learning journey

**Zero → Guided practice → Confidence → Real verification**

Previous lessons may make a learner faster, but they are never an excuse to omit a practical step required by the current lesson.

## Teaching loop for every hands-on task

1. **Sample input** — show the exact data the learner is using.
2. **Purpose** — explain in plain language what they are about to do.
3. **Location** — name the node, panel, field, setting or dropdown.
4. **Exact action** — provide the field name, type, value/expression and where it belongs.
5. **Click** — name the action such as Execute Step, Listen for Test Event or Publish.
6. **Expected output** — show the exact result the learner should see.
7. **Why** — explain briefly why that result occurred.
8. **Verify** — distinguish deterministic Detleng verification from learner confirmation.
9. **Continue** — unlock progression only after the learner has a clear success target.

Use this loop independently in every lesson. Earlier lessons may provide familiarity, but the current lesson must still teach every action it requires.

## Language rules

- Define a technical term when it first appears.
- Prefer numbered actions, field/type/value layouts, transformation diagrams and readable output examples.
- If an n8n label varies by version, explain the purpose of the setting and acknowledge that wording may vary.
- Never use expert shorthand where a beginner needs a specific UI action.
- Never claim Detleng verified something it cannot observe.
- Teach one known successful path before inviting experimentation.
- Prefer real workflow behavior and deterministic validation over screenshots, quizzes or unverified completion buttons.

## Final lesson test

Ask: **Can someone who has never used this exact n8n feature complete the task by carefully following DeTLeng?**

If they would need YouTube, Google, ChatGPT or another tutorial to fill a missing implementation step, the lesson is not complete.
