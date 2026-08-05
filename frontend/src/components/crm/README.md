# CRM Shared Presentation Components

This directory contains reusable CRM-specific presentation components shared across multiple business features (e.g., Leads, Telecaller, Call Reports).

## Architectural Guidelines

To prevent code coupling and maintain clear domain boundaries, all components in this folder must adhere to these rules:

1. **Strictly Presentational**: These components must only render UI based on props. They must not maintain global state or bind directly to APIs/services.
2. **No Feature Hooks or Services**: They must NOT import any hooks, services, utils, or constants from specific features (e.g., `features/leads/`, `features/telecaller/`).
3. **No Direct API Calls**: All mutations (edit, delete, create) must be triggered via callback functions passed as props from parent feature containers.
4. **Permissible Imports**:
   - Shared UI elements (`@/components/ui/...`)
   - Table layouts (`@/components/table/...`)
   - React & core libraries
   - Third-party packages (e.g., Lucide icons)
