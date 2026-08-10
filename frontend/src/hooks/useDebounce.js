import { useState, useEffect } from 'react';

/**
 * Standard debounce hook to delay state updates.
 * Used primarily for search inputs to prevent API spam.
 * 
 * @param {any} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds (default: 300).
 * @returns {any} The debounced value.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
