# DeTLeng Repository Instructions

For any task that creates, redesigns, modifies, audits or reviews learner lessons, lesson content, lesson UX, lesson verification flows or lesson-specific backend behavior:

1. Read `docs/curriculum-master-plan.md`.
2. Read `docs/DETLENG_LESSON_TEACHING_STANDARD.md`.
3. Read `docs/DETLENG_AI_LESSON_GOLDEN_RULES.md`.
4. Treat all three documents as required lesson-design constraints.
5. Preserve the rule: **DeTLeng teaches before it verifies.**
6. Do not omit required practical instructions based on assumed knowledge from earlier lessons.
7. For each hands-on task include: **Sample Input → Exact Action → Expected Output → Why → Verify → Continue.**
8. Keep learner credentials and external-service secrets in the learner's own n8n Credentials store.
9. Do not weaken existing security, progress persistence, attempt/version history or live verification without explicit task need.

For unrelated code maintenance, read the lesson-design documents only when the task affects learning content or lesson behavior.
