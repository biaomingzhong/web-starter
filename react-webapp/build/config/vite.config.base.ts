import { defineConfig } from "vite";
import type { ConfigEnv } from "vite";
import dayjs from "dayjs";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtml, createSvgr } from "./../plugins";
import pkg from "./../../package.json";

export default (configEnv: ConfigEnv, viteEnv: Record<string, string>) => {
  const { dependencies, devDependencies, name, version } = pkg;
  const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  const cmd = process.cwd();
  const { mode } = configEnv;
  const { VITE_APP_BASE_URL, VITE_APP_NAME } = viteEnv;

  return defineConfig({
    base: VITE_APP_BASE_URL,
    root: cmd,
    plugins: [
      tsconfigPaths(),
      react(),
      createSvgr(),
      createHtml(VITE_APP_NAME),
    ],
    define: {
      "process.env": {},
      __APP_ENV__: JSON.stringify(mode),
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
  });
};
