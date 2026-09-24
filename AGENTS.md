# DeTLeng Repository Instructions

For any task that creates, redesigns, modifies, audits or reviews learner lessons, lesson content, lesson UX, lesson verification flows or lesson-specific backend behavior:

1. Read `docs/curriculum-master-plan.md`.
2. Read `docs/DETLENG_LESSON_BUILD_PROCESS.md`.
3. Treat both documents as required lesson-design constraints.
4. Build and verify the workflow in the current n8n UI before designing the website lesson.
5. Use exact observed UI labels; never publish guessed steps or use “may vary” to hide uncertainty.
6. Preserve the rule: **DeTLeng guides; the learner works directly in n8n.**
7. For each hands-on task include: **Sample Input → Exact Action → Expected Output → Why → Verify → Continue.**
8. Keep learner credentials and external-service secrets in the learner's own n8n Credentials store.
9. Do not add forms, integrations or checkpoints unless they teach the lesson skill or provide necessary verification.
10. Do not weaken existing security, progress persistence, attempt history or live verification without explicit task need.

For unrelated code maintenance, read these documents only when the task affects learning content or lesson behavior.
