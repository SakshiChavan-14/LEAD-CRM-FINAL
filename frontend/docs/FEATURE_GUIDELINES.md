# Feature Guidelines

## Feature Structure Standard
Each domain feature in `src/features/<feature-name>` must follow this standard layout:

```
src/features/<feature-name>/
├── components/          # Presentational & container components
│   ├── dialogs/         # Modal and drawer components
│   ├── tables/          # Data tables and grids
│   └── ui/              # Domain-specific UI elements
├── hooks/               # Custom React hooks (React Query & state)
├── services/            # API call declarations & HTTP clients
├── utils/               # Feature-specific helpers & mappers
├── constants/           # Constants and domain configurations
└── index.js             # Public API boundary (Explicit Exports)
```

## Rules for Features
1. **Public API Boundary**: Only exports defined in `index.js` may be imported by other features or pages. Internal implementation details inside `components/`, `services/`, etc., remain private to the feature.
2. **Feature Isolation**: Never deep-import across features (e.g., `import { X } from '@/features/leads/components/ui/X'` is forbidden; use `import { X } from '@/features/leads'`).
3. **Feature Eviction Rule**: When a feature is deprecated or refactored, removing its directory should completely strip its domain logic without leaving dangling references in shared directories.
