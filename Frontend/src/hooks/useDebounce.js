import { useState, useCallback, useRef } from 'react';

export function useDebounce(fn, delay = 300) {
  const timer = useRef(null);

  return useCallback(
    (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );
}

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef(null);

  const update = useCallback(
    (v) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDebounced(v), delay);
    },
    [delay],
  );

  // Trigger update whenever value changes
  useState(() => { update(value); });

  return debounced;
}
