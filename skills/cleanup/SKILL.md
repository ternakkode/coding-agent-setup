---
name: cleanup
description: Coordinate six sequential cleanup stages, each with its own scope, assessment, and plan. Use for simplifying a selected branch, feature, or subsystem while preserving agreed behavior.
---

# Cleanup

Follow repository instructions and the user's requested target. Preserve agreed behavior. Review, scan, and dry-run requests remain read-only.

Check the five companion skills below before starting. Ask once to install missing skills from verified sources, stating the installation scope and targets; reuse existing authorization. Wait for the decision and verify approved installations. Use built-in stage guidance only if the user explicitly chooses a fallback. Leftover cleanup is built in.

## Workflow

Run these stages sequentially. **Each stage defines its own bounded cleanup scope, assesses the current code, and makes a concise plan** covering proposed changes and relevant verification. Carry findings forward and account for earlier changes. Follow each skill's role: assessment stages propose changes; execution stages apply them. No findings means no work is needed.

| Stage | Cleanup focus |
|---|---|
| 1. [Ponytail ultra](https://github.com/DietrichGebert/ponytail) | Necessity: remove avoidable implementation and prefer existing or native capabilities. |
| 2. [Ponytail review](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail-review/SKILL.md) | Concrete cuts: identify redundant code, speculative flexibility, and unnecessary dependencies. |
| 3. [Codebase design](https://www.aihero.dev/skills-codebase-design) | Abstractions: assess which interfaces hide useful complexity and which merely add indirection. |
| 4. [Improve codebase architecture](https://www.aihero.dev/skills-improve-codebase-architecture) | Structure: assess responsibilities, dependencies, and coordinated changes within the target. |
| 5. [Codebase Simplifier](https://mcpmarket.com/tools/skills/codebase-simplifier) | Implementation: reconcile earlier proposals and simplify the affected code. |
| 6. Leftover cleanup | Completeness: trace removed paths and remove proven orphaned code, configuration, tests, documentation, and applicable generated artifacts. Include relevant hidden files in searches. |

Keep each stage's scope within the user's target. Use companion skills without importing unrelated surveys, reports, or interviews. Keep assessments and plans brief; request decisions only when needed to resolve scope or behavior, not between every stage.

Search broadly, edit within scope. Trace real consumers before deletion; a missing textual caller does not prove code is unused. Preserve public contracts, required safeguards, migration history, and stored data unless changes are agreed. Report uncertain or unrelated candidates separately.

Verify retained behavior and briefly report changes, checks, limitations, and approved fallbacks. Stop when the scoped cleanup is complete. External actions require their own authorization.
