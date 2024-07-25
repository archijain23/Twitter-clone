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
    // Inject process.env variables
    "process.env": JSON.stringify(import.meta.env),
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
    minify: "esbuild",
    target: "es2015",
  },
  optimizeDeps: {
    include: ["react-firebase-hooks/auth", "firebase/auth", "scriptjs"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://twitter-clone-xylb.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
