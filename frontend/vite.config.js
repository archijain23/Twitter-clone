import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "index.html",

    headers: {
      "Content-Type": "application/javascript",
    },
    host: true,
  },
  build: {
    outDir: "dist",
  },
});
