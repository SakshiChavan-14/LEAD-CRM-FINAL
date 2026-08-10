# Sprint 19 — Search System Architecture Implementation Plan

## Executive Summary
This implementation plan outlines the prioritized, phased plan for standardizing the search architecture across all CRM feature modules.

---

## Phased Implementation Plan

### Phase 1: Critical Bug Fixes
- **Global Search**: Remove `window.location.href` hard reloads. Investigate backend capabilities for global search endpoints.
- **Query Keys**: Fix missing React Query keys (e.g., add search filter parameters to `useCallHistory`).
- **Broken Search Bars**: Ensure all search inputs correctly trigger data refetches without page reloads.

### Phase 2: Architecture Standardization
- **`useSearchController`**: Build the unified hook returning `{ search, debouncedSearch, setSearch, clear, loading, isSearching, hasValue, urlSync, filters }`.
- **`useDebounce`**: Implement standard 300ms debounce utility.
- **URL Sync Strategy**: Apply opt-in URL synchronization via the controller for page-level searches (Leads, Users) while keeping modal searches local.

### Phase 3: Search UX
- **Global Hotkey**: Implement `Cmd+K` / `Ctrl+K` listener.
- **Loading & Clear States**: Add universal clear buttons (`X`) and loading spinners to all search inputs.
- **Suggestions & Empty States**: Improve empty state UI and add basic suggestion handling.

### Phase 4: Advanced Features
- **Global Search Implementation**: Based on Phase 1 investigation, choose either A) Unified Global Endpoint or B) Client Aggregation, and build the `GlobalSearchModal`.
- **Recent Searches**: Implement standardized local storage caching (5 recent, 30-day expiry).
- **Ranking System**: Implement search result ranking weights.
- **Analytics**: Add telemetry for search tracking.

---

## Verification Plan

### Automated Verification
- Run `npm run lint` and `npm run build` to verify zero syntax, type, or compilation errors.

### Manual Verification
- Test debouncing and state machine transitions (Idle -> Typing -> Debouncing -> Loading -> Success/Empty).
- Verify opt-in URL sync (updates URL on pages, does not update URL on modals).
