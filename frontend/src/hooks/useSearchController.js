import { useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from './useDebounce';

/**
 * A unified controller for search state, debouncing, and optional URL synchronization.
 * 
 * @param {Object} options
 * @param {string} [options.initialValue=''] - Initial search value. If syncUrl is true, URL query takes precedence.
 * @param {number} [options.delay=300] - Debounce delay in ms.
 * @param {boolean} [options.syncUrl=false] - Whether to automatically sync search state to the URL.
 * @param {string} [options.paramName='search'] - The URL query parameter name to use if syncUrl is true.
 * @returns {Object} Controller methods and state.
 */
export function useSearchController(options = {}) {
  const {
    initialValue = '',
    delay = 300,
    syncUrl = false,
    paramName = 'search'
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // If syncUrl is true, use the URL parameter as the source of truth for initial state
  const urlValue = syncUrl ? searchParams.get(paramName) || '' : '';
  const startingValue = syncUrl ? urlValue : initialValue;

  const [search, setSearchState] = useState(startingValue);
  
  // Debounce the search input
  const debouncedSearch = useDebounce(search, delay);

  // State machine flags
  const isSearching = search !== debouncedSearch; // User is actively typing
  const hasValue = search.trim().length > 0;

  // Set Search (and optionally sync URL)
  const setSearch = useCallback((val) => {
    setSearchState(val);

    if (syncUrl) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (val.trim()) {
        current.set(paramName, val.trim());
      } else {
        current.delete(paramName);
      }
      
      const searchStr = current.toString();
      const query = searchStr ? `?${searchStr}` : '';
      
      // Use router.replace to avoid cluttering browser history with every keystroke/search change
      router.replace(`${pathname}${query}`, { scroll: false });
    }
  }, [syncUrl, searchParams, paramName, pathname, router]);

  // Clear search
  const clear = useCallback(() => {
    setSearch('');
  }, [setSearch]);

  return {
    search,
    debouncedSearch,
    setSearch,
    clear,
    isSearching,
    hasValue,
    urlSync: syncUrl,
  };
}
