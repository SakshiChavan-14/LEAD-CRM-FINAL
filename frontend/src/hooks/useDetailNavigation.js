"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { saveScrollPosition } from "@/utils/scrollStorage";
import { buildReturnToUrl } from "@/utils/navigationUtils";

/**
 * Hook for standardizing forward list -> detail navigation.
 * Saves current scroll position in sessionStorage (keyed by exact canonical route)
 * and appends encoded returnTo parameter to the detail URL.
 */
export function useDetailNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Navigates to a detail page while capturing the current page origin and scroll position.
   * 
   * @param {string} targetUrl - Target detail path (e.g. /dashboard/management/leads/123)
   * @param {Object} [options]
   * @param {boolean} [options.replace=false] - Use router.replace instead of router.push
   */
  const navigateToDetail = useCallback((targetUrl, options = {}) => {
    if (!targetUrl || typeof targetUrl !== 'string') return;

    const currentY = window.scrollY || window.pageYOffset || 0;
    console.log(`[NAV_DEBUG] (1) Scroll position immediately before row navigation: window.scrollY = ${currentY}`);

    // 1. Save current window scroll position under exact route key
    saveScrollPosition(pathname, searchParams, currentY);

    // 2. Build returnTo URL parameter preserving current searchParams (and nested returnTo if any)
    const returnToParam = buildReturnToUrl(pathname, searchParams);

    // 3. Construct target URL with returnTo appended
    const separator = targetUrl.includes('?') ? '&' : '?';
    const finalUrl = `${targetUrl}${separator}returnTo=${returnToParam}`;

    console.log(`[NAV_DEBUG] (3) Exact returnTo URL: "${returnToParam}", finalUrl: "${finalUrl}"`);

    // 4. Navigate to detail page
    if (options.replace) {
      router.replace(finalUrl);
    } else {
      router.push(finalUrl);
    }
  }, [pathname, searchParams, router]);

  return { navigateToDetail };
}
