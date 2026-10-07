# Architecture

- Choose the simplest structure that fits the project. Do not require a fixed set of layers or design patterns.
- Organize modules around clear responsibilities and reasons to change. Keep related behavior together and expose small, clear interfaces.
- Use names that match the problem being solved. Where business rules exist, give each rule a clear owner and keep it independent of presentation, storage, and external services.
- Keep the main flow readable top to bottom. Separate high-level decisions from supporting technical details when that makes the flow easier to follow.
- Keep dependencies clear and avoid circular relationships. Isolate external formats and integrations where they would otherwise spread through unrelated code.
- Add layers, interfaces, and abstractions only when they serve a current need. Avoid pass-through modules and structures built for hypothetical reuse.
- Respect existing project boundaries. Discuss broader structural changes before expanding a task into an architecture migration.
