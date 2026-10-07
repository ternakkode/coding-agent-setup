# Data Design

- Before coding a task that changes data, define the affected API and database shapes in its work item. Inspect and reuse existing contracts and schema first.
- For JSON APIs, show concrete JSON request and response examples with realistic values, including relevant errors. Use the native format for other APIs. Specify field types, required or optional fields, nullability, and validation rules alongside the examples.
- For the database, define affected tables or collections, fields and types, keys, relationships, and necessary constraints. Explain how existing data is handled when the schema changes.
- Show how API fields map to stored data and where values are calculated or transformed. Make naming or type differences explicit.
- When it helps explain the mapping, show the corresponding stored record as JSON. Examples illustrate values; they do not replace database types, relationships, or constraints.
- Resolve decisions that affect callers, stored data, or compatibility before implementation. Keep the plan limited to the current task; reference unchanged structures instead of copying them.
