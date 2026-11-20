---
name: plan-work
description: Plan work problem-first into a concise plan with a short todo list. Use before multi-step implementation, or when asked to plan, scope, or design a fix or feature.
---

# Plan Work

Planning is read-only: inspect code and data, but change nothing until the plan is agreed.

1. **Problem.** State expected versus actual behavior and how to reproduce it, backed by evidence from real data or sources (read-only queries, logs, issues), or labelled as an assumption.
2. **Solution.** Recommend one approach after challenging the proposed one, including the user's. Name each rejected alternative with one reason.
3. **Plan.** Write the sections in [`${CLAUDE_PLUGIN_ROOT}/skills/plan-work/STRUCTURE.md`](STRUCTURE.md). Done when every edge case has a handling decision and verification is defined.
4. **Todo.** End with a checklist ordered by dependency: one line per task, each naming its observable done condition.
5. **Agree.** Present the plan in chat, save it to Git-ignored `tmp/plan-<topic>.md`, and list open decisions. Implement only after agreement.
