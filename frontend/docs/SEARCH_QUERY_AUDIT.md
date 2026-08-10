# Sprint 19 — React Query Search Key & Cache Invalidation Audit

## Executive Summary
React Query requires search parameters to be explicitly included inside `queryKey` arrays. This audit checks every search hook in `frontend/src/` to verify query key completeness.

---

## Query Key Audit Matrix

| Feature Hook | File Location | Declared Query Key | Search Param Included? | Cache Refetch On Search? | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useUsers` | `src/features/users/hooks/useUsers.js` | `["users", page, size, search, status]` | **YES** | **YES** | PASS |
| `useMyLeads` | `src/features/telecaller/hooks/useMyLeads.js` | `["telecaller", "leads", filters, page, size]` | **YES** (Inside `filters`) | **YES** | PASS |
| `useLeadOverview`| `src/features/leads/hooks/useLeadOverview.js` | `["leads", "overview", activeFilters]` | **YES** (Inside `activeFilters`) | **YES** | PASS |
| `useFollowups` | `src/features/telecaller/hooks/useFollowups.js` | `["followups", tab, filters]` | **YES** (Inside `filters`) | **YES** | PASS |
| `useCallReports`| `src/features/callReports/hooks/useCallReports.js`| `["callReports", "performance", filters, page, size]` | **YES** (Inside `filters`) | **YES** | PASS |
| `useCallHistory` | `src/features/telecaller/voice/hooks/useCallHistory.js` | `["telecaller-calls"]` | **NO** | **NO (STALE DATA)** | **HIGH** |

---

## Recommendations
1. **Fix `useCallHistory` Query Key**: Update query key from `["telecaller-calls"]` to `["telecaller", "calls", filters, page, size]`.
2. **Standardize Query Key Factories**: Enforce key factory objects (e.g. `userKeys.list(filters)`, `leadKeys.list(filters)`) to prevent accidental cache key collisions across modules.
