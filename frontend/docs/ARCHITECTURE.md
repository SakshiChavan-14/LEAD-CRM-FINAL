# Frontend Architecture Specification

## Overview
This codebase follows a **Feature-Driven Component Architecture** with clear boundaries, unidirectional dependency flow, and strict domain isolation.

## Architectural Layers
```
┌─────────────────────────────────────────────────────────┐
│                    App Layer (Pages)                    │
│                     (src/app/...)                       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Feature Domains                      │
│                   (src/features/...)                    │
│   [auth] [leads] [users] [telecaller] [callReports]...  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Domain Primitives & UI                  │
│                 (src/components/crm)                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Shared Design System                 │
│                 (src/components/ui, table)              │
└─────────────────────────────────────────────────────────┘
```

## Core Principles
1. **Ownership Before Reuse**: Keep code co-located within its feature domain until reuse across distinct features is proven.
2. **Feature Isolation**: Features cannot import from sibling features directly unless exposed via a public feature API (`index.js`).
3. **Unidirectional Dependency Flow**: App → Features → CRM Domain Components → Generic UI Components. Lower layers NEVER import from higher layers.
4. **Composite View Rule**: Pages (`src/app/`) serve as composite shells assembling feature components and layout containers.
5. **Generic Name Rule**: Generic names like `Header`, `Card`, or `Table` are reserved for `src/components/ui/`. Features must prefix generic names with domain scope (e.g., `LeadsHeader`, `TelecallerOverviewTable`).
