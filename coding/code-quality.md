# Code Quality

- Make inputs, business steps, and outputs visible in the main flow. Separate logical steps with blank lines; keep related statements together.
- Keep each rule with one owner. A policy, vendor, or formula change should touch its owner and necessary callers, not unrelated code. Keep vendor I/O, decoding, and pagination apart from business rules, which take supplied data. A runtime guarantee, such as ordering, idempotency, or no callback after a stop, is a rule too: enforce it once, in the component that relies on it, and keep the producers to their own work, such as teardown.
- Choose the smallest useful boundary: a function for a focused responsibility, a file for related functions, a folder for cohesive files. Client, DB, and repository folders are examples, not required layers.

## Contracts and Validation

- Decode uncertain external data at its input boundary and validate each invariant with its owner; downstream code trusts that guarantee. Keep guaranteed fields required, model genuine absence, and test malformed shapes at the decoder. Static types alone do not validate external data.
- Each runtime check addresses an identified uncertainty or business rule. Verify producer guarantees before removing a check, and never remove positivity, precision, authorization, or funds checks because a value has a primitive type.
- Avoid defaults or coercion that disguise invalid data. Reuse named domain values and business checks, and show checks in the caller's flow.

## Data Changes

Before changing an API contract or schema, show the affected shapes with realistic request and response examples, optional and nullable fields, validation, and errors. Describe changed fields, constraints, and how existing data is handled, and resolve compatibility and data-safety decisions before coding.

## Tests

Test the critical user journey and the likely or high-impact failures through observable behavior, at the lowest-cost level that proves the outcome. Use Given–When–Then and the project's existing conventions.

## Examples

Consult an example when its task shape needs clarification:

- [Small calculation](examples/small-calculation.md): a focused rule and empty input.
- [Rename a project](examples/rename-project.md): validation, authorization, persistence, and failures.
- [Temperature report](examples/temperature-report.md): script flow, existing structure, and mapping boundaries.
- [Performance serialization](examples/performance-serialization.md): established contracts and meaningful absence.
- [Business validation](examples/business-validation.md): reusable admin and funds checks.
