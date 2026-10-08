# Code Quality

- Make inputs, business steps, and outputs clear. Use the simplest complete implementation for the agreed scope.
- Separate logical steps with blank lines; keep related statements together.
- For JavaScript or TypeScript, run project checks and the [device Oxfmt and Oxlint checks](../linting/oxlint/README.md) before completion. Format before checking spacing; device rules run independently of project configuration. Review business-step grouping beyond the static conventions.
- Reuse existing implementations, keep business rules consistent, and check effects on callers.
- Apply [cohesion and coupling](architecture.md#cohesion-and-coupling) when writing, refactoring, or reviewing code.
- Fix root causes, preserve unrelated behavior, and verify outcomes. Passing tests and formatting alone do not prove readability.
- Names convey business meaning, units, and timing where relevant. Comments explain intent, rules, or assumptions; preserve required documentation.

## Contracts and Validation

- Decode uncertain external data at its input boundary; validate each invariant with its owner, and let downstream code trust that guarantee unless new uncertainty arises. Keep guaranteed fields required, model genuine absence, and test malformed shapes at the decoder. Static types alone do not validate external data.
- Reuse existing contracts and named domain values. Each runtime check must address an identified uncertainty or business rule; verify producer guarantees before removing checks.
- Preserve business decisions and response omission rules. Avoid defaults or coercion that disguise invalid data.
- Reuse named business checks from existing validation modules. Pass required data explicitly and show checks in the caller's flow.

## Pseudocode

Pseudocode is the smallest complete explanation of behavior, leaving language and library choices open. Use it when decisions, state, or effects need explanation:

1. State the contract, assumptions, relevant failures, and unresolved decisions.
2. Sketch meaningful actions at a consistent level of detail. Expand rules needed for correctness.
3. Show branches, data flow, external effects, and cumulative versus per-iteration state.
4. Trace representative inputs, boundaries, and failures. Each important rule and result must be understandable from the flow and supporting contracts.

Keep working sketches under the [temporary-documentation policy](../documentation.md), linked to task requirements.

## Examples

Consult an example when its task shape needs clarification; adapt its contracts to the agreed requirements:

- [Small calculation](examples/small-calculation.md): a focused rule and empty input.
- [Rename a project](examples/rename-project.md): validation, authorization, persistence, and failures.
- [Temperature report](examples/temperature-report.md): script flow, existing structure, and mapping boundaries.
- [Performance serialization](examples/performance-serialization.md): established contracts and meaningful absence.
- [Business validation](examples/business-validation.md): reusable admin and funds checks.
