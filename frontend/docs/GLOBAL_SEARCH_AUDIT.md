# Sprint 19 — Global Search Deep Audit & Root Cause Analysis

## Executive Summary
The Global Search component in `DashboardNavbar.jsx` is currently **failing to function as an enterprise global search**. This audit pinpoints the exact architectural root causes, data flow disconnections, and implementation gaps.

---

## Identified Root Causes of Global Search Failure

### 1. Hard Page Reload Execution
- **Location**: `src/components/layout/DashboardNavbar.jsx` (Lines 158–163)
- **Code Inspection**:
  ``jsx
  onKeyDown={(e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const basePath = pathname.includes('/dashboard') ? '/dashboard/management/leads' : '/telecaller/leads';
      window.location.href = \`\${basePath}?search=\${encodeURIComponent(searchQuery.trim())}\`;
    }
  }}
  ``
- **Impact**: Using `window.location.href` triggers a full browser reload, discarding in-memory React Query cache, re-executing auth checks, and causing visual flickering.

### 2. Disconnected Zustand State vs Feature Page Filters
- **Location**: `src/store/globalSearchStore.js`
- **Issue**: `globalSearchStore` holds `searchQuery` globally, but individual feature pages (Users, Follow-ups, Call Reports, Voice Logs) maintain their own isolated local `search` states and completely ignore `globalSearchStore`.
- **Result**: Global Search only attempts to redirect to Leads, making it impossible to globally search Users, Follow-ups, or Call Recordings.

### 3. Missing Global Search API & Aggregation Layer
- There is no unified backend endpoint (e.g. `GET /api/global-search?q=...`) to return cross-entity results (Leads, Telecallers, Calls, Follow-ups).
- Global Search currently lacks an overlay results dropdown, live suggestions, or search modal UI.

### 4. Missing Keyboard Shortcut & Accessibility
- No `Cmd+K` / `Ctrl+K` global hotkey listener is bound to focus the search input.
- Missing `aria-autocomplete`, `aria-controls`, and `role="search"` semantic markup.
