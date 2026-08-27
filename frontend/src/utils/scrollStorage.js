/**
 * Storage helpers for window/container scroll restoration.
 * Uses sessionStorage with canonicalized, sorted URL keys.
 */

/**
 * Constructs a canonical storage key from pathname and searchParams.
 * Sorts query parameter keys alphabetically so parameter order does not affect the key.
 * 
 * @param {string} pathname - Route pathname (e.g., /dashboard/management/leads)
 * @param {URLSearchParams|string|Object} searchParams - Current search params
 * @returns {string} Canonical scroll storage key
 */
export function getCanonicalScrollKey(pathname = '', searchParams = '') {
  if (typeof window === 'undefined') return '';

  const cleanPath = (pathname || window.location.pathname || '').trim();
  let paramsObj = new URLSearchParams();

  if (typeof searchParams === 'string') {
    paramsObj = new URLSearchParams(searchParams.startsWith('?') ? searchParams.slice(1) : searchParams);
  } else if (searchParams instanceof URLSearchParams) {
    paramsObj = new URLSearchParams(searchParams.toString());
  } else if (searchParams && typeof searchParams === 'object') {
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        paramsObj.set(k, String(v));
      }
    });
  } else if (window.location.search) {
    paramsObj = new URLSearchParams(window.location.search);
  }

  // Sort parameter keys alphabetically for canonical key generation
  const sortedKeys = Array.from(paramsObj.keys()).sort();
  const sortedPairs = [];
  
  sortedKeys.forEach((key) => {
    // Collect all values for multi-value keys if any
    const values = paramsObj.getAll(key).sort();
    values.forEach((val) => {
      sortedPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    });
  });

  const canonicalQuery = sortedPairs.length > 0 ? `?${sortedPairs.join('&')}` : '';
  return `scroll:${cleanPath}${canonicalQuery}`;
}

/**
 * Saves current vertical scroll position in sessionStorage under a canonical key.
 * 
 * @param {string} pathname 
 * @param {URLSearchParams|string|Object} searchParams 
 * @param {number} [scrollY] - If omitted, reads current window.scrollY
 */
export function saveScrollPosition(pathname, searchParams, scrollY) {
  if (typeof window === 'undefined') return;

  try {
    const key = getCanonicalScrollKey(pathname, searchParams);
    if (!key) return;

    const y = typeof scrollY === 'number' ? scrollY : window.scrollY || window.pageYOffset || 0;
    const roundedY = Math.max(0, Math.round(y));
    console.log(`[NAV_DEBUG] (2) Save Storage Key: "${key}", Stored Value: "${roundedY}" (input scrollY: ${scrollY}, window.scrollY: ${window.scrollY})`);
    sessionStorage.setItem(key, String(roundedY));
  } catch (err) {
    console.warn('[NAV_DEBUG] Save failed:', err);
  }
}

/**
 * Retrieves saved scroll position for a canonical route key.
 * 
 * @param {string} pathname 
 * @param {URLSearchParams|string|Object} searchParams 
 * @returns {number|null} Saved scroll Y coordinate or null if not stored
 */
export function getSavedScrollPosition(pathname, searchParams) {
  if (typeof window === 'undefined') return null;

  try {
    const key = getCanonicalScrollKey(pathname, searchParams);
    if (!key) return null;

    const val = sessionStorage.getItem(key);
    console.log(`[NAV_DEBUG] (5) Restore Storage Key: "${key}", Retrieved Value: "${val}"`);
    if (val !== null && val !== undefined) {
      const num = parseInt(val, 10);
      return isNaN(num) ? 0 : Math.max(0, num);
    }
  } catch (err) {
    console.warn('[NAV_DEBUG] Read failed:', err);
  }
  return null;
}

/**
 * Clears saved scroll position for a canonical route key.
 * 
 * @param {string} pathname 
 * @param {URLSearchParams|string|Object} searchParams 
 */
export function clearSavedScrollPosition(pathname, searchParams) {
  if (typeof window === 'undefined') return;

  try {
    const key = getCanonicalScrollKey(pathname, searchParams);
    if (key) {
      console.log(`[NAV_DEBUG] Clear Storage Key: "${key}"`);
      sessionStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('[NAV_DEBUG] Clear failed:', err);
  }
}
