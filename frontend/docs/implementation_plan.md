# Implementation Plan — Sprint 19 Search System Architecture (READ-ONLY AUDIT COMPLETE)

Conduct a **read-only engineering audit** of all search implementations across the CRM frontend and present a standardized **Search System Architecture & Implementation Plan** to fix Global Search, eliminate API spamming, unify debouncing, ensure URL synchronization, and standardize React Query key cache invalidation.

> [!IMPORTANT]
> **READ-ONLY AUDIT STAGE COMPLETE**. Zero source files (`src/`) have been modified during this phase. This document details the audit findings, root cause analysis, architecture proposal, and proposed implementation plan for review prior to execution.

---

## User Review Required

> [!NOTE]
> **Primary Cause of Global Search Failure**: `DashboardNavbar.jsx` executes a hard browser window location change (`window.location.href = '/dashboard/management/leads?search=...'`) on Enter key press instead of utilizing Next.js SPA router navigation (`router.push`/`router.replace`). This destroys client-side React Query cache and causes full page reloads.

> [!IMPORTANT]
> **Zero Architectural Risk**: The implementation will introduce a shared `useSearch` hook, a 300ms `useDebounce` utility, and a non-disruptive `GlobalSearchModal` component without changing existing backend contracts, permissions, routing paths, or business logic.

---

## Open Questions

> [!NOTE]
> 1. **Global Search Results Scope**: Should the Global Search Modal query a unified backend cross-entity search endpoint (`GET /api/global-search?q=...`) or aggregate results client-side from React Query caches across Leads, Telecallers, and Call Logs?
> 2. **Global Hotkey Binding**: Should `Cmd+K` / `Ctrl+K` be registered globally at the root layout level (`src/app/layout.jsx`) to open the search modal from any page in the CRM?

---

## Proposed File Changes (Future Implementation Stage)

### Shared Search Hooks & Utilities (`src/hooks/`)

#### [NEW] [useDebounce.js](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/hooks/useDebounce.js)
- Shared 300ms value debouncing hook to prevent API spamming while typing.

#### [NEW] [useSearch.js](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/hooks/useSearch.js)
- Standardized search state management hook integrating 300ms debounce, URL query parameter synchronization (`useSearchParams`), non-blocking navigation (`router.replace`), and clear handlers.

---

### Global Search & Navigation Component (`src/components/layout/`)

#### [MODIFY] [DashboardNavbar.jsx](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/components/layout/DashboardNavbar.jsx)
- Replace `window.location.href` hard reload with Next.js router integration and `Cmd+K` search modal trigger button.

#### [NEW] [GlobalSearchModal.jsx](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/components/components/layout/GlobalSearchModal.jsx)
- Interactive overlay dialog modal rendering live debounced search suggestions, recent search history, categorized results (Leads, Users, Calls), and keyboard navigation (Arrow Up/Down, Enter, Esc).

---

### Feature Hooks & Components (`src/features/`)

#### [MODIFY] [useCallHistory.js](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/hooks/useCallHistory.js)
- Include search filters parameter in query key definition (`["telecaller", "calls", filters, page, size]`) ensuring automatic React Query refetch on search term updates.

#### [MODIFY] [UserToolbar.jsx](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/users/components/directory/UserToolbar.jsx)
- Refactor search input to consume shared 300ms `useSearch` hook, eliminating instant HTTP request firing on every keydown.

---

## Generated Deliverables Index (`frontend/docs/`)

All 11 required search audit deliverables have been compiled and saved under [frontend/docs/](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs):

1. [SEARCH_INVENTORY.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_INVENTORY.md) — Comprehensive inventory of search components, hooks, APIs, and statuses across 8 feature modules.
2. [SEARCH_FLOW.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_FLOW.md) — End-to-end data pipeline traces from input keydown to React Query refetch and table render.
3. [GLOBAL_SEARCH_AUDIT.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/GLOBAL_SEARCH_AUDIT.md) — Deep root cause analysis of Global Search failure (`window.location.href` hard reload, state isolation, missing aggregation layer).
4. [SEARCH_API_MATRIX.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_API_MATRIX.md) — Backend endpoint contract matrix mapping parameters (`search`), filters, and query key definitions.
5. [SEARCH_QUERY_AUDIT.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_QUERY_AUDIT.md) — React Query key completeness audit identifying missing key parameters in `useCallHistory`.
6. [SEARCH_DEBOUNCE_AUDIT.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_DEBOUNCE_AUDIT.md) — Identification of un-debounced inputs (e.g. `UserToolbar.jsx`) and 300ms standardization proposal.
7. [SEARCH_ROUTING_AUDIT.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_ROUTING_AUDIT.md) — URL query parameter synchronization audit (`useSearchParams`, `router.replace`) for refresh survival.
8. [SEARCH_UX_AUDIT.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_UX_AUDIT.md) — Usability audit evaluating input clear buttons (`X`), loading spinners, `Cmd+K` shortcuts, and focus rings.
9. [SEARCH_DUPLICATION_REPORT.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_DUPLICATION_REPORT.md) — Refactoring plan to eliminate duplicated search state logic into a unified `useSearch()` hook.
10. [SEARCH_ARCHITECTURE.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_ARCHITECTURE.md) — Architectural blueprint with Mermaid data flow diagram and ownership rules.
11. [SEARCH_IMPLEMENTATION_PLAN.md](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/docs/SEARCH_IMPLEMENTATION_PLAN.md) — Phased priority task list for implementation.

---

## Verification Plan

### Automated Verification
- Verify zero syntax or type errors across the project:
  ```bash
  npm run build
  ```
- Confirm `git status` verifies zero source files (`src/`) altered during the audit phase.

### Manual Verification
- Test Global Search overlay and keyboard shortcuts (`Cmd+K`, Esc).
- Verify single HTTP request per search query with 300ms debounce across Leads, Users, Telecaller, and Reports views.
- Verify search query survival on page refresh and browser Back/Forward navigation.
