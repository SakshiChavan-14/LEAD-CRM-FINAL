# Folder Structure & Directory Map

```
frontend/
├── docs/                      # Architectural & developer standards documentation
├── public/                    # Static assets & illustrations
└── src/
    ├── app/                   # Next.js App Router (composite view shells)
    │   ├── api/               # Server-side API endpoints & logging proxy
    │   ├── dashboard/         # Admin & Management composite routes
    │   └── telecaller/        # Telecaller workspace composite routes
    ├── components/            # Shared UI components
    │   ├── crm/               # CRM domain layout primitives
    │   ├── dashboard-ui/      # Generic dashboard widget containers
    │   ├── layout/            # Site-wide header/sidebar layout shells
    │   ├── management/        # Generic search bars & filter drawers
    │   ├── table/             # Generic data table & pagination controls
    │   └── ui/                # Low-level design system primitives (Button, Modal, etc.)
    ├── config/                # Global configuration & breadcrumb maps
    ├── features/              # Modular domain features
    │   ├── auth/              # Authentication & session state
    │   ├── callReports/       # Call analytics & supervisor reporting
    │   ├── dashboard/         # High-level management metrics
    │   ├── leads/             # Lead management, tables & detail views
    │   ├── reports/           # Exportable reporting logic
    │   ├── telecaller/        # Telecaller dialer, calls, follow-ups & voice integration
    │   └── users/             # User directory & user modal management
    ├── hooks/                 # Global non-domain custom hooks
    ├── lib/                   # Utility libraries & HTTP client setup
    ├── services/              # Global infrastructure services
    └── styles/                # Tailwind & global CSS definitions
```
