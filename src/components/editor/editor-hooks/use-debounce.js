import { useMemo, useRef } from "react";

import { debounce } from "lodash";

export function useDebounce(fn, ms, maxWait) {
  const funcRef = useRef(null);
  funcRef.current = fn;

  return useMemo(() =>
    debounce((...args) => {
      if (funcRef.current) {
        funcRef.current(...args);
      }
    }, ms, { maxWait }), [ms, maxWait]);
}
