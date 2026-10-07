---
name: cleanup
description: Simplify a selected branch, feature, or subsystem through six sequential cleanup stages, applying and verifying each stage while preserving agreed behavior.
---

# Cleanup

Follow repository instructions and the user's requested target. Preserve agreed behavior. Review, scan, and dry-run requests remain read-only.

Check the four companion skills by name in the skill catalog or local installation; read each `SKILL.md` at its stage. For missing skills, ask once to install from verified sources, stating scope and targets; reuse existing authorization and verify installations. Wait for approval or an explicit choice of built-in fallback guidance. Leftover cleanup is built in.

## Workflow

**At each stage: scope → assess current code → plan briefly → apply → verify.** Apply findings even from assessment-only companion skills. Fix verification failures introduced by the stage before advancing; the next stage assesses the updated code. No findings means no changes. For read-only requests, report findings and proposed changes instead.

| Stage / installed skill | Cleanup focus |
|---|---|
| 1. `ponytail` (ultra) | Necessity: remove avoidable implementation and prefer existing or native capabilities. |
| 2. `ponytail-review` | Concrete cuts: identify redundant code, speculative flexibility, and unnecessary dependencies. |
| 3. `codebase-design` | Abstractions: favor interfaces that hide complexity over added indirection. |
| 4. `improve-codebase-architecture` | Structure: assess responsibilities, dependencies, and coordinated changes within the target. |
| 5. Leftover cleanup | Completeness: trace removed paths; remove proven orphaned code, configuration, tests, docs, and generated artifacts. Search relevant hidden files too. |
| 6. Coding guide compliance | Read every guide in [this setup's coding directory](../../coding/) and check the scoped result against every applicable rule. Fix in-scope gaps and rerun affected checks. Report compliance evidence, non-applicability, or unresolved gaps for each guide. |

Keep stages within the user's target and skip unrelated surveys, reports, or interviews. Keep assessments brief; ask only about unresolved scope or behavior, not routine stage transitions.

Trace real consumers before deletion; missing textual callers do not prove code is unused. Preserve public contracts, safeguards, migration history, and stored data unless changes are agreed. Report uncertain or unrelated candidates separately.

For stage 6, resolve `../../coding/` from this skill's directory after following symlinks. If the skill was copied without the setup checkout, use the coding directory in the setup checkout referenced by the project's agent instructions. Resolve links within guides relative to their containing files. If the setup guides cannot be located, report the stage as incomplete.

Verify retained behavior; report changes, checks, limitations, and approved fallbacks briefly. Stop when scoped cleanup is complete. External actions require separate authorization.
