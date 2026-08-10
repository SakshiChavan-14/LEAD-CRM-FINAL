# Sprint 19 — URL Synchronization & Search Routing Audit

## Executive Summary
This audit evaluates how search terms interact with Next.js App Router (`useSearchParams`, `router.push`, `router.replace`), browser history, refresh survival, and deep-linking.

---

## Routing Audit Matrix

| Feature View | Route Path | URL Search Sync (`?search=`) | Refresh Survival | Browser Back/Forward | Bookmark Sharing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Leads Directory** | `/dashboard/management/leads` | **YES** (`?search=john`) | **PASS** | **PASS** | **PASS** |
| **Telecaller Leads**| `/telecaller/leads` | **YES** (`?search=john`) | **PASS** | **PASS** | **PASS** |
| **User Directory** | `/dashboard/management/user-directory` | **NO** (Local state only) | **FAIL** (Clears on refresh) | **FAIL** | **FAIL** |
| **Follow-ups** | `/telecaller/follow-ups` | **NO** | **FAIL** | **FAIL** | **FAIL** |
| **Call Reports** | `/dashboard/management/call-reports` | **NO** | **FAIL** | **FAIL** | **FAIL** |

---

## Key Routing Recommendations
1. **URL as Single Source of Truth**: All searchable list views must derive initial search state from `useSearchParams()`.
2. **Non-Polluting History**: Use `router.replace(url, { scroll: false })` instead of `router.push` during search debouncing to avoid clogging browser back-button history.
