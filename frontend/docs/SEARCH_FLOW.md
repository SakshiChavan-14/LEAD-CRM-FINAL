# Sprint 19 — Search Flow Trace & Data Pipeline Audit

## Executive Summary
This document traces the complete end-to-end data pipeline for search interactions across all feature domains: Input -> State -> Debounce -> Filter Object -> React Query Hook -> Query Key -> Service Layer -> API -> Mapper -> UI Table / Cards.

---

## Detailed Search Flow Traces

### Flow 1: Global Navbar Search Flow (BROKEN)
```
[Navbar Input (DashboardNavbar.jsx)]
       ↓ (onChange -> setSearchQuery in globalSearchStore)
[Zustand Store]
       ↓ (onKeyDown Enter)
[window.location.href = '/dashboard/management/leads?search=...']  <-- HARD RELOAD (Bypasses React Router)
       ↓ (Page re-mounts)
[useLeadOverviewFilters.js]
       ↓ (Reads searchQuery from Zustand store & searchParams)
[useInfiniteLeadOverview / useLeadOverview]
       ↓ (queryKey: ['leads', 'overview', activeFilters])
[leadsService.getLeadsOverview(params)]
       ↓ (GET /api/leads?search=...)
[LeadsOverviewTable.jsx]
```
- **Failure Point**: Hard browser reload (`window.location.href`) destroys client-side React Query cache, resets component state, and prevents smooth single-page application (SPA) navigation.

---

### Flow 2: User Directory Search Flow (API SPAM RISK)
```
[Input (UserToolbar.jsx)]
       ↓ (onChange -> onSearchChange(e.target.value))
[Parent State (UserDirectoryPage.jsx: search state)]
       ↓ (NO DEBOUNCE — Instant state mutation)
[useUsers(page, size, search, status)]
       ↓ (queryKey: ["users", page, size, search, status])
[userService.getUsers({ search, page, size })]
       ↓ (GET /api/users?search=...)
[UserTable.jsx]
```
- **Failure Point**: Missing debounce causes 4 to 6 HTTP requests to be fired while typing a single 5-letter name (e.g. "J-o-h-n").

---

### Flow 3: Telecaller My Leads Search Flow
```
[Input (MyLeadsFilterToolbar.jsx)]
       ↓ (onChange -> updateUrl({ search }))
[useSearchParams() + router.replace()]
       ↓ (URL update triggers component re-render)
[useMyLeads({ page, size, search })]
       ↓ (queryKey: ["telecaller", "leads", filters, page, size])
[telecallerLeadService.getLeads({ search })]
       ↓ (GET /api/telecaller/leads?search=...)
[MyLeadsGrid.jsx]
```
- **Success Criteria Met**: URL synchronization works, but lacks a debounced state layer causing excessive URL push history.
