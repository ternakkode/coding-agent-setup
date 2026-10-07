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

## Delegation

- Actively delegate independent work to keep context focused and improve speed. Choose the number of agents by useful task boundaries, not a maximum headcount.
- Use separate subagents for production code and test writing. Give both the agreed behavior, interfaces, and Definition of Done; the test agent derives checks from user outcomes rather than copying implementation logic.
- Give each subagent a bounded task, relevant source locations, dependencies, and only the context it needs. Include shared decisions and constraints so a smaller context does not omit necessary information.
- Assign clear file ownership. Run code and test work in parallel when interfaces are settled; otherwise resolve dependencies first and sequence the handoff.
- The coordinating agent reviews evidence, integrates code and tests, and verifies the complete user journey. Return failed checks to the responsible agent and scope decisions to the product discussion.
- Preferred subagent models: GPT-6.1 for Codex and Opus 5.5 for Claude Code. Check the tool's available model identifiers; report an unavailable model or delegation capability before proposing a substitute.
