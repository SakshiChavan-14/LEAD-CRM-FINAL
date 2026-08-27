"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getSavedScrollPosition, saveScrollPosition, clearSavedScrollPosition } from "@/utils/scrollStorage";

/**
 * Custom hook for page-level scroll position restoration.
 * Uses a bounded retry loop to wait for async data rendering and DOM layout height readiness.
 * 
 * @param {Object} options
 * @param {boolean} [options.ready=true] - Flag indicating list data has loaded and table/DOM is rendered.
 * @param {React.RefObject} [options.containerRef=null] - Optional scroll container ref if not window.
 * @param {number} [options.delay=0] - Optional initial delay in ms.
 * @param {number} [options.maxRetries=20] - Maximum retries while waiting for DOM height.
 */
export function useScrollRestoration(options = {}) {
  const { ready = true, containerRef = null, delay = 0, maxRetries = 20 } = options;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasRestoredRef = useRef(false);
  const routeKeyRef = useRef(`${pathname}?${searchParams.toString()}`);

  // Reset restoration flag when route or searchParams change
  const currentRouteKey = `${pathname}?${searchParams.toString()}`;
  if (routeKeyRef.current !== currentRouteKey) {
    routeKeyRef.current = currentRouteKey;
    hasRestoredRef.current = false;
  }

  // 1. Auto-save scroll position on scroll (debounced) and before unload.
  // CRITICAL: Do NOT auto-save if restoration is pending for a saved target position > 0!
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId = null;
    const target = containerRef?.current || window;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // If restoration is still pending, do not overwrite saved target with intermediate 0/small scroll Y
        const pendingSavedY = getSavedScrollPosition(pathname, searchParams);
        if (!hasRestoredRef.current && pendingSavedY !== null && pendingSavedY > 0) {
          return;
        }

        const y = containerRef?.current
          ? containerRef.current.scrollTop
          : window.scrollY || window.pageYOffset || 0;

        if (y > 0 || hasRestoredRef.current) {
          saveScrollPosition(pathname, searchParams, y);
        }
      }, 150);
    };

    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);

      // Save position on unmount ONLY if window.scrollY > 0 and restoration is complete
      const finalY = containerRef?.current
        ? containerRef.current.scrollTop
        : window.scrollY || window.pageYOffset || 0;
      
      if (hasRestoredRef.current && finalY > 0) {
        saveScrollPosition(pathname, searchParams, finalY);
      }
    };
  }, [pathname, searchParams, containerRef]);

  // 2. Perform scroll restoration with bounded retry when data and DOM height are ready
  useEffect(() => {
    if (typeof window === "undefined" || !ready || hasRestoredRef.current) return;

    const savedY = getSavedScrollPosition(pathname, searchParams);

    if (savedY === null || savedY === undefined || savedY <= 0) {
      hasRestoredRef.current = true;
      return;
    }

    let retryCount = 0;
    let timerId = null;
    let rafId = null;

    const attemptRestoration = () => {
      const getDocHeight = () => containerRef?.current
        ? containerRef.current.scrollHeight
        : Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
          );

      const getWinHeight = () => containerRef?.current
        ? containerRef.current.clientHeight
        : window.innerHeight;

      const docHeight = getDocHeight();
      const winHeight = getWinHeight();
      const maxScroll = Math.max(0, docHeight - winHeight);

      // Height Readiness Check: If DOM height is not yet tall enough for savedY, wait and retry
      if (maxScroll < savedY - 30 && retryCount < maxRetries) {
        retryCount++;
        timerId = setTimeout(attemptRestoration, 100);
        return;
      }

      // Height is ready or max retries reached -> apply scroll
      const clampedY = Math.max(0, Math.min(savedY, maxScroll));
      const beforeY = containerRef?.current
        ? containerRef.current.scrollTop
        : window.scrollY || window.pageYOffset || 0;

      console.log(`[NAV_DEBUG] (6a) Scroll position immediately BEFORE restoration: window.scrollY = ${beforeY}, targetClampedY = ${clampedY}`);

      rafId = requestAnimationFrame(() => {
        if (containerRef?.current) {
          containerRef.current.scrollTop = clampedY;
        } else {
          window.scrollTo({
            top: clampedY,
            left: 0,
            behavior: "instant",
          });
        }

        const actualY = containerRef?.current
          ? containerRef.current.scrollTop
          : window.scrollY || window.pageYOffset || 0;

        console.log(`[NAV_DEBUG] (6b) Scroll position immediately AFTER scrollTo: window.scrollY = ${actualY}`);

        setTimeout(() => {
          const y500 = containerRef?.current
            ? containerRef.current.scrollTop
            : window.scrollY || window.pageYOffset || 0;
          console.log(`[NAV_DEBUG] (6c) Scroll position 500ms AFTER scrollTo: window.scrollY = ${y500}`);
        }, 500);

        // Verify restoration succeeded
        const isSuccess = Math.abs(actualY - clampedY) < 50 || maxScroll === 0;

        if (isSuccess || retryCount >= maxRetries) {
          hasRestoredRef.current = true;
          clearSavedScrollPosition(pathname, searchParams);
        } else {
          // If browser didn't accept scroll, schedule one last retry
          retryCount++;
          timerId = setTimeout(attemptRestoration, 100);
        }
      });
    };

    if (delay > 0) {
      timerId = setTimeout(attemptRestoration, delay);
    } else {
      attemptRestoration();
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ready, pathname, searchParams, containerRef, delay, maxRetries]);

  return {
    hasRestored: hasRestoredRef.current,
  };
}
