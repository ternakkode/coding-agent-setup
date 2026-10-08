# Architecture

- Reuse existing project patterns. Client, DB, and repository folders are examples, not required layers.
- Use the [pseudocode guide](code-quality.md#pseudocode) for readable main flows. Collection or reporting workflows have an obvious script function or file using existing invocation conventions.
- Add abstractions for current needs. Follow [Scope of work](../scope-of-work.md) before adding behavior or broadening a redesign.

## Cohesion and Coupling

Apply these principles to functions, modules, scripts, and packages:

- **High cohesion:** group logic serving one responsibility and changing for the same reason, with a clear owner for each rule.
- **Low coupling:** expose small contracts with explicit inputs and results; keep source-specific details and mutable state with their owner.

Review a representative policy, vendor, or formula change: it should affect its owner and necessary callers without spreading into unrelated responsibilities. See the [report](examples/temperature-report.md#cohesion-and-coupling) and [validation](examples/business-validation.md#cohesion-and-coupling) examples.

## Responsibility Boundaries

Choose the smallest useful boundary: a **function** for a focused responsibility, a **file** for related functions, a **folder** for cohesive files. Boundaries should reduce caller complexity; keep complete small rules together.

Where substantial, distinguish:

- Domain queries from in-memory filtering, mapping, and deduplication. Queries may encode agreed eligibility rules with consistent ownership.
- Vendor HTTP, decoding, and pagination from fetch selection, batching, and rate limits.
- Collection processing from individual calculations. Business rules take supplied data; adapters own I/O mechanics.
