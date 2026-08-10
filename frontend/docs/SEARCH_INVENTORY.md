# Sprint 19 — Search System Inventory Report

## Executive Summary
This document provides a comprehensive inventory of all search inputs, toolbars, state hooks, React Query integration, API parameters, and functional statuses across the CRM frontend workspace (`frontend/src/`).

---

## Workspace Search Implementation Inventory

| Feature Module | Search Component / File | State & Filter Hook | API Endpoint & Parameter | URL Sync | Debounce Status | Operational Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Global Search** | `DashboardNavbar.jsx` | `globalSearchStore.js` (Zustand) | N/A (Triggers `window.location.href`) | Hard Reload (`?search=`) | None | **BROKEN / DISCONNECTED** |
| **Leads Management** | `SearchSection.jsx` / `LeadsOverviewTable.jsx` | `useLeadOverviewFilters.js` | `GET /leads?search=` | `useSearchParams` | Partial (Inline) | **WORKING (Fragmented)** |
| **User Directory** | `UserToolbar.jsx` | `useUsers.js` | `GET /users?search=` | None (State only) | **MISSING** (Instant API spam) | **WORKING (No Debounce)** |
| **Telecaller My Leads**| `MyLeadsFilterToolbar.jsx` | `useMyLeads.js` | `GET /telecaller/leads?search=` | `useSearchParams` | None | **WORKING** |
| **Follow-ups** | `FollowupsToolbar` (Inline) | `useFollowups.js` | `GET /telecaller/followups?search=` | None | None | **PARTIAL** |
| **Call Reports** | `StitchFilterToolbar.jsx` | `useCallReports.js` | `GET /call-reports/performance?search=` | None | None | **WORKING** |
| **Voice / Calls** | `VoiceHeader.jsx` | `useCallHistory.js` | `GET /telecaller/calls` | None | None | **BROKEN** (Missing Query Key Sync) |
| **Assign Leads Modal**| `AssignLeadsModal.jsx` | Local `useState` | Client-side filter | N/A | None | **WORKING (Client-side)** |

---

## Critical Observations

1. **Global Search Isolation**: Global Search relies on a bare Zustand store (`searchQuery`) and triggers a full browser window location change (`window.location.href = ...`) on Enter. It lacks an API service layer and cross-entity result aggregation.
2. **Debounce Absence**: 6 out of 7 feature search inputs send HTTP requests on every single keydown event without debouncing.
3. **URL Desynchronization**: Only Leads and My Leads sync search terms to `useSearchParams()`. Refreshing the page on Users or Follow-ups clears the search state completely.
