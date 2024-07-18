import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["buffer", "process", "util", "stream", "ua-parser-js"],
    }),
  ],
  define: {
    "process.env": {},
    global: "globalThis",
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
    },
  },
  build: {
    rollupOptions: {
      external: ["fsevents", "ua-parser-js"],
    },
  },
  optimizeDeps: {
    include: ["ua-parser-js"],
  },
});
