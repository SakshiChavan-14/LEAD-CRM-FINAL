"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook for reading and updating URL search parameters cleanly.
 * Uses router.replace with scroll: false to avoid polluting browser history.
 */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Reads a parameter value from current searchParams.
   */
  const getParam = useCallback((key, defaultValue = "") => {
    return searchParams.get(key) ?? defaultValue;
  }, [searchParams]);

  /**
   * Updates one or multiple query parameters while preserving unrelated parameters.
   * If resetPage is true (default), automatically resets 'page' to 0 (or '1' if 1-indexed) unless page is explicitly updated.
   * 
   * @param {Object} updates - Key/value pairs to update. Set value to '' / null / undefined to remove.
   * @param {Object} [options]
   * @param {boolean} [options.resetPage=true] - Whether to reset page parameter on filter update.
   * @param {string} [options.pageParamName='page'] - Parameter name for pagination.
   * @param {number|string} [options.defaultPageValue=0] - Default initial page value.
   * @param {boolean} [options.replace=true] - Use router.replace vs router.push.
   */
  const setParams = useCallback((updates, options = {}) => {
    const {
      resetPage = true,
      pageParamName = "page",
      defaultPageValue = 0,
      replace = true
    } = options;

    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === null || String(val).trim() === "") {
        params.delete(key);
      } else {
        params.set(key, String(val).trim());
      }
    });

    // Reset pagination parameter if filter changed and page wasn't explicitly updated in this call
    if (resetPage && updates[pageParamName] === undefined) {
      if (params.has(pageParamName)) {
        params.set(pageParamName, String(defaultPageValue));
      }
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (replace) {
      router.replace(targetUrl, { scroll: false });
    } else {
      router.push(targetUrl);
    }
  }, [searchParams, pathname, router]);

  /**
   * Removes one or multiple parameters while preserving remaining query params.
   */
  const removeParams = useCallback((keys, options = {}) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    const updates = {};
    keyArray.forEach((k) => { updates[k] = null; });
    setParams(updates, options);
  }, [setParams]);

  /**
   * Clears all filter parameters while preserving specified allowed keys (if any).
   */
  const clearAllParams = useCallback((preserveKeys = [], options = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    const keysToRemove = [];

    params.forEach((_, key) => {
      if (!preserveKeys.includes(key)) {
        keysToRemove.push(key);
      }
    });

    const updates = {};
    keysToRemove.forEach((k) => { updates[k] = null; });
    setParams(updates, options);
  }, [searchParams, setParams]);

  return {
    searchParams,
    getParam,
    setParams,
    removeParams,
    clearAllParams
  };
}
