# 1. Feature-First Architecture

## Context
Previously, domain logic was dispersed across generic folders (`components/management`, `components/table`, `components/ui`), causing tight coupling, name collisions, and ambiguous component ownership.

## Decision
We adopt a **Feature-First Architecture** where domain components, hooks, services, and state are co-located under domain-specific directories (`src/features/<feature>`).

## Consequences
- Features are self-contained modules.
- Removing a feature domain requires minimal cleanup in shared folders.
- High developer clarity regarding where new code belongs.
