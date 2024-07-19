import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import commonjs from "vite-plugin-commonjs";
import dotenv from "dotenv";

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
    "process.env": Object.keys(process.env).reduce((env, key) => {
      if (key.startsWith("VITE_")) {
        env[key] = JSON.stringify(process.env[key]);
      }
      return env;
    }, {}),
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
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
