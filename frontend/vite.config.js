import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    nodePolyfills({
      include: ["buffer", "process", "util", "stream"],
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
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "scriptjs"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react-firebase-hooks", "firebase/auth", "scriptjs"],
  },
});
