# Work Planning

Start with the outcome appropriate to the work:

| Work | First outcome |
|---|---|
| New product | Target user, problem, and one useful journey. |
| New feature | New user capability and how it fits the product. |
| Improvement | Before-and-after behavior and how to judge improvement. |
| Refactor | Structural improvement and behavior to preserve. |
| Bug fix | Expected versus actual behavior, supported by reproduction or evidence. |

Use work items as the source of truth. For larger work, use epics for broad outcomes, stories for demonstrable user behavior, and tasks for bounded implementation steps. A small fix can be one task.

Keep discussions in order, one hat at a time. Keep stages brief when decisions are already clear:

1. **Product manager:** agree on the outcome and smallest useful iteration.
2. **Developer:** inspect existing code and propose concrete steps. Resolve material unknowns before coding; each task needs a clear scope and Definition of Done.
3. **QA:** verify the agreed outcome, including the whole journey, and report what passed, failed, or remains untested.

A task's Definition of Done states the observable result and relevant checks. Add dependencies and parent-story context where needed. Plan only the next iteration in detail, then review the working result before expanding it.

When delegating, provide ready tasks with relevant context and source locations. Parallelize only independent work with agreed shared interfaces. One coordinating agent owns integration. Return failed checks to development and scope decisions to the product discussion.
