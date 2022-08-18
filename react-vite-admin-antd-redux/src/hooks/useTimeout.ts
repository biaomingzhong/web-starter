import { useEffect, useState } from "react";

/**
 * @internal
 * Helper to manage a browser timeout.
 * Ensures that the timeout isn't set multiple times at once,
 * and is cleaned up when the component is unloaded.
 *
 * @returns A pair of [setTimeout, clearTimeout] that are stable between renders.
 */
export function useTimeout() {
  const [timeout] = useState(() => ({
    id: undefined as ReturnType<typeof setTimeout> | undefined,
    set: (fn: () => void, delay: number) => {
      timeout.clear();
      timeout.id = setTimeout(fn, delay);
    },
    clear: () => {
      if (timeout.id !== undefined) {
        clearTimeout(timeout.id);
        timeout.id = undefined;
      }
    },
  }));

  // Clean up the timeout when the component is unloaded
  useEffect(() => timeout.clear, [timeout]);

  return [timeout.set, timeout.clear] as const;
}

/*
const [setTestTimeout, clearTestTimeout] = useTimeout();
setTestTimeout(()=> {
  
}, 1000);
clearTestTimeout();
*/