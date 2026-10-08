# Example: Rename a Project

Assume the agreed task requires a trimmed, nonblank name, an existing project, and permission to rename it. These requirements illustrate the structure; use the real task's policies and interfaces.

## Pseudocode

```text
function renameProject(actorId, projectId, requestedName):
    name = validateProjectName(requestedName)
    project = retrieveProject(projectId)

    requireRenamePermission(actorId, project)

    updatedProject = saveProjectName(project.id, name)

    return presentProject(updatedProject)
```

The supporting contracts make the decisions explicit:

- `validateProjectName` returns a trimmed, nonblank name or fails with a validation error.
- `retrieveProject` returns the requested project or fails with a missing-project error.
- `requireRenamePermission` succeeds or fails with a forbidden-operation error.
- `saveProjectName` persists the name through the existing concurrency and error contract, returning the updated project.
- `presentProject` returns the existing public response shape.

## Supporting Rule

Validation and permission checks own business rules; retrieval and saving own persistence details; presentation owns the public representation. Expand a helper where its rule needs explanation:

```text
function validateProjectName(requestedName):
    // Normalize surrounding whitespace before applying the name requirement.
    name = trim(requestedName)

    if name is empty:
        fail with validationError("Project name must not be blank")

    return name
```

`fail` stops the operation before dependent work. The sketch leaves the language-specific error mechanism to implementation.

## Trace and Ownership

For an authorized actor and `"  Roadmap  "`, validation produces `"Roadmap"`; retrieval supplies the project used for authorization; saving returns the updated project for presentation. Blank input stops before retrieval. A missing project or forbidden actor stops before saving. Persistence errors follow the existing contract.

The entry point shows the order and the write. SQL construction belongs inside the persistence functions; permission rules belong inside `requireRenamePermission`. These functions may share one file when small. If query mechanics grow, place them in the existing project query module rather than splitting every step into a file.

Return to [code quality](../code-quality.md#examples).
