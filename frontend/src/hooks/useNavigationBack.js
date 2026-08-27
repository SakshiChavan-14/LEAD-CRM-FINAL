"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSanitizedReturnTo } from "@/utils/navigationUtils";

/**
 * Custom hook for Back button navigation on detail views.
 * Decodes and validates returnTo query parameter from the URL.
 * Uses router.replace with scroll: false to avoid duplicate history entries.
 * 
 * @param {Object} options
 * @param {string} [options.fallback='/'] - Default fallback path if returnTo parameter is absent or invalid
 * @returns {Object} { goBack, returnToUrl }
 */
export function useNavigationBack(options = {}) {
  const { fallback = '/' } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawReturnTo = searchParams.get('returnTo');
  const targetUrl = getSanitizedReturnTo(rawReturnTo, fallback);

  /**
   * Executes back navigation using router.replace with scroll: false
   */
  const goBack = useCallback(() => {
    console.log(`[NAV_DEBUG] (4) Exact list URL after clicking Back: targetUrl = "${targetUrl}", rawReturnTo = "${rawReturnTo}"`);
    router.replace(targetUrl, { scroll: false });
  }, [router, targetUrl, rawReturnTo]);

  return {
    goBack,
    targetUrl,
    hasReturnTo: Boolean(rawReturnTo)
  };
}
