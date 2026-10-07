# Architecture

- Fit the structure to the project and its existing conventions. Do not force a fixed set of layers or patterns.
- Group related behavior around clear responsibilities, with small interfaces and clear ownership of business rules.
- Make the main flow readable top to bottom, separating decisions from supporting technical details where useful.
- Keep dependencies clear. Isolate storage and external-service details where they would otherwise spread through unrelated code.
- Add abstractions for current needs, not hypothetical reuse. Follow [Scope of work](../scope-of-work.md) before broadening a task into a structural redesign.
