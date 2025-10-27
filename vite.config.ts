import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      { find: "@shared", replacement: path.resolve(__dirname, "src/shared") },
      { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
      { find: "@widgets", replacement: path.resolve(__dirname, "src/widgets") },
      { find: "@app", replacement: path.resolve(__dirname, "src/app") },
      { find: "wasm", replacement: path.resolve(__dirname, "wasm") },
    ],
  },
});
