import { defineConfig } from "vite";
import type { ConfigEnv } from "vite";
import { resolve } from "path";
import {
  createLegacy,
  createMock,
  createCompress,
  createImagemin,
  createVisualizer,
} from "./../plugins";
import pkg from "./../../package.json";

export default (configEnv: ConfigEnv, _: Record<string, string>) => {
  const { name, version } = pkg;
  const { command } = configEnv;

  const banner = `/*!
  * ${name} v${version} ${new Date()}
  * (c) 2022 @moocss.
  * Released under the MIT License.
  */`;

  return defineConfig({
    plugins: [
      createLegacy(),
      createMock(command === "build"),
      createCompress("gzip"),
      createImagemin(),
      createVisualizer(),
    ],
    // 生产环境打包配置
    build: {
      minify: false,
      // 去除 console debugger
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          banner,
          manualChunks(id) {
            // 将pinia的全局库实例打包进vendor, 避免和页面一起打包造成资源重复引入
            if (id.includes(resolve(__dirname, "../../src/store/index.ts"))) {
              return "vendor";
            }
          },
        },
      },
    },
  });
};
