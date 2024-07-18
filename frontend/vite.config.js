import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "@originjs/vite-plugin-commonjs";

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    nodePolyfills({
      include: ["process", "buffer", "util", "stream"],
    }),
  ],
  define: {
    "process.env": {},
    global: "window",
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
