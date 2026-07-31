import { useEffect, useState } from 'react';

/**
 * Trails `value` by `delay` ms.
 *
 * Use it for anything that feeds a query key from a text input — without it
 * every keystroke mints a new key and fires a new request.
 */
export const useDebouncedValue = <T>(value: T, delay = 350): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
