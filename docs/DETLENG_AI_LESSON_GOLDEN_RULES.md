# DeTLeng AI Lesson Golden Rules

DeTLeng does not exist merely to show information. It exists to take a learner from:

> “I don't know how to do this.”

to:

> “I built it myself, I understand why it works, I broke it, I fixed it, and I can prove it works.”

## Related documents

- Teaching implementation standard: [`docs/DETLENG_LESSON_TEACHING_STANDARD.md`](DETLENG_LESSON_TEACHING_STANDARD.md)
- Curriculum and 20-lesson journey: [`docs/curriculum-master-plan.md`](curriculum-master-plan.md)

## 1. Each lesson must stand alone

Previous lessons may make a learner faster, but must never justify omitting an action required now. If the learner must add a node, configure a setting, enter an expression or inspect output, teach enough of that action in the current lesson.

## 2. Design beginner-first

The designer may be an expert; the learner may be at ABC level. Expert knowledge must not create hidden steps. Name the node, panel, field, type, value, setting and click required for success.

## 3. Guide success before experimentation

Start with known sample input, exact actions and a known expected result. Invite learners to experiment with their own values only after they have completed one successful path.

## 4. Use the teaching loop for every hands-on task

Explain what is being done, where it happens, what is created, the exact setting/value and where it belongs, what to click, what should appear, why it worked, how it is verified and when to continue.

## 5. Always show input and output

Use sample input cards, before/after comparisons, field/type/value layouts and expected execution output. A learner should never wonder what data entered or what should leave.

## 6. Explain why

Do not create a copy/paste course. After an important action, explain the result briefly enough to build a transferable mental model without turning the lesson into a lecture.

## 7. Prefer real work over fake checkpoints

Prefer real Webhook calls, API responses, database records, execution behavior, output validation and break/fix cycles. Do not use screenshots, quizzes or “I did it” buttons as primary proof when deterministic verification is possible. Never claim DeTLeng observed something it cannot observe.

## 8. Build, test, break, repair and verify

Where useful, let the learner build, run, observe, live-test, encounter a deliberate logical failure, diagnose it, repair it and prove the repair. Expected learning failures are engineering evidence, not catastrophic errors. Network failure is not intended logical failure.

## 9. Open with purpose

Answer why the skill matters, what the learner will build and what they can do afterward. Use a clear mission or story, while allowing each lesson its own visual character.

## 10. Close with realization

Show what the learner built, proved and can now explain; the mental model they own; how it transfers to real work; and what comes next. Do more than display “lesson complete.”

## 11. Use professional realism

Use realistic customers, orders, support requests, APIs, databases, authentication, failures, AI outputs and production constraints. Prepare learners for jobs, freelance work and real client systems.

## 12. Protect credentials and teach safety

Learner API keys, OAuth secrets, database passwords and production tokens remain in the learner's own n8n Credentials store. Teach least privilege, HTTPS, safe logs, no secrets in Git, input validation and human approval for sensitive operations.

## 13. Do not fake mastery

“Zero to Master” means guiding the learner from zero knowledge of the lesson's practical requirement to a working, understood result. It does not mean pretending one lesson creates an industry master.

## 14. Design for job transfer

The learner should be able to recognize the pattern in a client workflow, explain why the solution works, debug a related failure, adapt it to different data and discuss it in a technical interview.

## 15. DeTLeng teaches before it examines

Never test a skill the lesson failed to teach. The sequence is:

**Teach → Practice → Observe → Verify**

It is not:

**Guess → Fail → Search outside DeTLeng**

## Final lesson quality test

Before declaring a lesson ready, confirm:

1. A learner new to the exact feature can finish using DeTLeng alone.
2. The learner knows the exact input data.
3. The learner knows where to click and what to enter.
4. The learner can see the expected result.
5. The learner understands why the result occurred.
6. The learner performed real work rather than only reading.
7. DeTLeng verifies actual behavior wherever technically possible.
8. Debugging or safe failure is included where pedagogically useful.
9. Completion helps the learner explain what they built and transfer the pattern.

If YouTube, Google, ChatGPT or another tutorial is needed to fill a missing implementation step, **the lesson is not ready**.
