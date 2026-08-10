# Sprint 19 — Search Logic Duplication & Refactoring Report

## Executive Summary
This report documents duplicated search state handling, `useEffect` url listeners, and custom setTimeout logic across features, proposing a unified `useSearchController()` custom hook.

---

## Identified Duplications

1. **Duplicated URL Sync Logic**: `useLeadOverviewFilters.js` and `MyLeadsFilterToolbar.jsx` both re-implement custom `new URLSearchParams(searchParams.toString())` serialization.
2. **Duplicated Debounce Logic**: `SearchSection.jsx` implements its own `setTimeout` timer cleanup logic instead of consuming a shared `useDebounce` hook.
3. **Duplicated Clear Handlers**: Every toolbar component writes custom resetting logic (`setSearch('')`, `updateUrl({ search: '' })`).

---

## Standardized Custom Hook Proposal (`useSearchController`)

The `useSearchController` hook manages search state, debouncing, and optional URL synchronization.

```javascript
export function useSearchController(options = {}) {
  const { initialValue = '', delay = 300, syncUrl = false, paramName = 'search' } = options;
  // ... implementation ...

  return { 
    search, 
    debouncedSearch, 
    setSearch, 
    clear, 
    loading, 
    isSearching, 
    hasValue, 
    urlSync, 
    filters 
  };
}
```

**Key Principle**: Not every search belongs in the URL. By decoupling URL sync from state management, `useSearchController` is fully reusable in Modals (no URL sync) and Pages (URL sync).
