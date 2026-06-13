import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const devProxy = {
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
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    ...(mode === "development" ? { allowedHosts: ["vanilla-antacid-overfed.ngrok-free.dev"], proxy: devProxy } : {}),
    watch: {
      usePolling: true,
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          motion: ["framer-motion"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-toast"],
        },
      },
    },
  },
}));
