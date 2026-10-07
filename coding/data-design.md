# Data Design

- Before changing an API contract or database schema, describe the affected shapes in the work item. Reuse existing definitions and reference unchanged structures.
- Show realistic JSON request and response examples for JSON APIs. Explain relevant types, optional or nullable fields, validation, and errors; use the native format for other APIs.
- Describe changed database fields, relationships, constraints, and how existing data will be handled.
- Explain API-to-storage mapping where it is not obvious. A sample record can help, but does not replace schema definitions.
- Resolve material compatibility and data-safety decisions before coding. Keep detail proportional to the change.
