/**
 * Utility functions for validating and constructing internal returnTo URLs.
 */

/**
 * Validates whether a string is a safe, internal application path.
 * Rejects external URLs, protocol-relative URLs (//), data URIs, javascript: schemes, etc.
 * 
 * @param {string} url - The URL string to validate.
 * @returns {boolean} True if the URL is a safe internal path.
 */
export function isInternalUrl(url) {
  if (typeof url !== 'string' || !url) return false;
  
  // Trim spaces
  const trimmed = url.trim();
  
  // Must start with '/'
  if (!trimmed.startsWith('/')) return false;
  
  // Reject protocol-relative URLs starting with '//' or '\\'
  if (trimmed.startsWith('//') || trimmed.startsWith('\\\\') || trimmed.startsWith('/\\')) return false;
  
  // Reject URLs containing protocol specifiers before path or control characters
  if (/^[a-z0-9+.-]+:/i.test(trimmed)) return false;
  
  return true;
}

/**
 * Encodes the current full relative path (pathname + searchParams) for use as a returnTo parameter.
 * 
 * @param {string} pathname - Current pathname (e.g. /dashboard/management/leads)
 * @param {URLSearchParams|string} searchParams - Current search params
 * @returns {string} Encoded relative URL string
 */
export function buildReturnToUrl(pathname, searchParams) {
  if (!pathname) return '';
  
  let searchStr = '';
  if (typeof searchParams === 'string') {
    searchStr = searchParams;
  } else if (searchParams && typeof searchParams.toString === 'function') {
    searchStr = searchParams.toString();
  }
  
  // Strip leading '?' if present
  if (searchStr.startsWith('?')) {
    searchStr = searchStr.substring(1);
  }
  
  const fullUrl = searchStr ? `${pathname}?${searchStr}` : pathname;
  return encodeURIComponent(fullUrl);
}

/**
 * Safely decodes and returns the returnTo URL if valid, or returns the fallback route.
 * 
 * @param {string|null} returnToParam - Raw returnTo query param value
 * @param {string} fallbackUrl - Default fallback route
 * @returns {string} Sanitized target URL
 */
export function getSanitizedReturnTo(returnToParam, fallbackUrl = '/') {
  if (!returnToParam) return fallbackUrl;
  
  try {
    const decoded = decodeURIComponent(returnToParam);
    if (isInternalUrl(decoded)) {
      return decoded;
    }
  } catch (err) {
    console.warn('[NavigationUtils] Failed to decode returnTo param:', err);
  }
  
  return fallbackUrl;
}
