import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["vanilla-antacid-overfed.ngrok-free.dev"],
    watch: {
      usePolling: true,
    },
    proxy: {
      "/admin": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/catalog": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/data": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/form": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
