# Work Planning

Identify the work type and agree on its first outcome:

| Work | First outcome |
|---|---|
| New product | Target user, problem, and one useful journey. |
| New feature | New user capability and how it fits the product. |
| Improvement | Before-and-after behavior and how to judge improvement. |
| Refactor | Structural improvement and behavior to preserve. |
| Bug fix | Expected versus actual behavior, supported by reproduction or evidence. |

## Plan Through Work Items

Use work items as the source of truth, rather than separate product or feature documents. Reuse existing items where available; keep local planning notes in Git-ignored `tmp/`.

- **Epic:** the broader user outcome.
- **Story:** a small, useful behavior we can demonstrate, with examples of success.
- **Task:** a bounded implementation step supporting a story, with a clear Definition of Done.

Work one hat at a time. State the current hat and finish its outcome before moving on:

1. **Product manager:** turn the idea into a clear epic and choose the smallest useful story for the first working version.
2. **Developer:** inspect existing code, identify reuse, and split the story into small, verifiable tasks. Define affected API and database shapes using [Data design](coding/data-design.md). Resolve material unknowns before coding; implement only authorized tasks with a clear Definition of Done.
3. **QA:** check task completion and the whole story using important Given–When–Then cases. Report what passed, failed, or remains untested; passing tasks alone do not prove the journey works.

Each task states its purpose and parent story, included and excluded scope, dependencies, and Definition of Done: observable result, relevant Given–When–Then checks, and required project checks.

Plan only the next iteration in detail. Keep later improvements brief, review the working result, and choose what comes next. Greater robustness is optional; a useful MVP can be the stopping point.

## Delegate Ready Tasks

- Give each agent a ready task, its parent-story context, relevant source locations, dependencies, and Definition of Done. Do not delegate vague epics for implementation.
- Split by meaningful, verifiable result, not by file count or arbitrary size. Parallelize independent tasks only after shared interfaces are agreed.
- Keep one coordinating agent responsible for integration and checking that the completed tasks satisfy the story.
- Return scope changes to the product discussion. Return failed checks to development, then recheck. Investigation can inform earlier decisions; continue already-authorized work without routine confirmation.
