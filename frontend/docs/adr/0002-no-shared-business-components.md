# 2. No Shared Business Components

## Context
Shared component directories tend to turn into dumping grounds for domain-specific components with hardcoded flags, leading to brittle conditional logic.

## Decision
Generic directories (`src/components/ui`, `src/components/table`) must contain only domain-agnostic presentational primitives. No business logic or feature API dependencies are permitted in shared components.

## Consequences
- Shared components remain small, testable, and reusable.
- Business rules remain encapsulated within their respective feature boundaries.
