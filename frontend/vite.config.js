import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import inject from "@rollup/plugin-inject";

export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
  resolve: {
    alias: {
      // Polyfills for Node.js modules
      util: "rollup-plugin-node-builtins",
      stream: "rollup-plugin-node-builtins",
      buffer: "rollup-plugin-node-globals",
      process: "rollup-plugin-node-globals",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser global polyfills
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://twitter-clone-xylb.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
