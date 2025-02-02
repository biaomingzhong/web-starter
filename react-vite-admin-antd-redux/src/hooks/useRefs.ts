import { Ref } from "react";

// 同时处理多个 ref
export function useRefs<T>(...refs: Ref<T>[]) {
  return (instance: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        (ref as any).current = instance;
      }
    }
  };
}
