import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://cesde-academic-app-production.up.railway.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/analytics": {
        target: "https://cesde-academic-app-analytics.up.railway.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analytics/, ""),
      },
    },
  },
});


