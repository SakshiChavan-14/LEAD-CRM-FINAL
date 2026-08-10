# Sprint 19 — Search Input Debounce System Audit

## Executive Summary
Firing API requests on every single keydown event creates unnecessary server load, race conditions, and UI jank. This audit evaluates search input debouncing across all CRM features.

---

## Current Debounce Audit Findings

| Component | File Path | Current Debounce Strategy | Audit Finding | Recommended Fix |
| :--- | :--- | :--- | :--- | :--- |
| **Global Search** | `DashboardNavbar.jsx` | Enter key press only | No debounced auto-suggest dropdown | Implement 300ms debounced live search |
| **User Directory** | `UserToolbar.jsx` | **NONE** (Direct `onChange`) | Fires HTTP request per character | Wrap search state in `useDebounce(300ms)` |
| **Leads Directory** | `SearchSection.jsx` | Internal `setTimeout` (300ms) | Custom inline setTimeout logic | Replace with standard `useDebounce` hook |
| **Telecaller Leads**| `MyLeadsFilterToolbar.jsx`| **NONE** (Direct `updateUrl`) | Updates URL search params per keydown | Debounce URL update execution |
| **Follow-ups** | `FollowupsToolbar` | **NONE** | Un-debounced state updates | Apply standard `useDebounce` |

---

## Standardized Debounce Policy
- **Standard Delay**: **300ms** across all search inputs (optimal balance between responsiveness and network efficiency).
- **Standard Hook**: Introduce `useDebounce(value, delay = 300)` as a shared design system utility hook.
