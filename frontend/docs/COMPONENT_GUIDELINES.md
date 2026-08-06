# Component Guidelines

## Classification Hierarchy
1. **Generic Design System (`src/components/ui/`, `src/components/table/`)**:
   - Pure presentational primitives (e.g., `Button`, `Input`, `Modal`, `DataTable`, `TablePagination`).
   - Domain-agnostic. No business logic or feature-specific API calls.
2. **Domain-Specific Primitives (`src/components/crm/`)**:
   - Domain layout containers & CRM-specific visual overlays (e.g., `CRMBadge`, `CRMStatusPill`).
3. **Feature Components (`src/features/<domain>/components/`)**:
   - Specialized components coupled to feature business logic and React Query hooks.

## Guidelines
- **No Early Generalization**: Do not promote a component to `src/components/ui` until it is actively required across 3 distinct feature domains.
- **Name Disambiguation**: Always prefix feature components with domain names to avoid generic collisions (e.g., `LeadsDataTable` instead of `DataTable`).
- **Composition over Monoliths**: Use slot pattern or `children` prop for reusable containers rather than internal conditional rendering flags.
