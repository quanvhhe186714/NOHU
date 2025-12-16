import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config cho project hiện tại (dùng luôn index.html ở root)
export default defineConfig({
  plugins: [react()],
  root: ".",
  server: {
    port: 3000,   // giống CRA
    open: true,   // tự mở trình duyệt khi npm run dev
  },
  build: {
    outDir: "dist",
  },
});



