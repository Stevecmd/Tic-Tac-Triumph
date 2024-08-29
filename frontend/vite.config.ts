import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      contexts: path.resolve(__dirname, "./src/contexts"),
      components: path.resolve(__dirname, "./src/components"),
      styles: path.resolve(__dirname, "./src/styles"),
      utils: path.resolve(__dirname, "./src/utils"),
      sounds: path.resolve(__dirname, "./src/sounds"),
    },
  },
  server: {
    port: 2000,
  },
});
