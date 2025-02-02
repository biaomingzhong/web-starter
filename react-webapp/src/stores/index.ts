// zustand 采用观察者模式，对组件进行订阅更新，因此不需要在最外层提供一个类似redux的Provider包裹层
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { StoreState } from "./types";
import { createAuthSlice } from "@/pages/auth/state/auth";
import { createGlobalsSlice } from "./modules/global";

export { default as useCounterStore } from "./modules/counter";

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createGlobalsSlice(...a),
      }),
      {
        name: "zustand-storage",
      }
    )
  )
);
