import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "CodeTier — Aprenda programação",
        short_name: "CodeTier",
        description:
          "App de ensino de programação com trilhas guiadas, aulas curtas, projetos e prática de código.",
        lang: "pt-BR",
        start_url: "/",
        display: "standalone",
        theme_color: "#0A0E0C",
        background_color: "#0A0E0C",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precache only the app shell (JS/CSS/HTML). Images — especially the
        // ~20 lesson infographics — are cached on demand below instead of
        // being downloaded upfront on install.
        globPatterns: ["**/*.{js,css,html}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|webp|jpg|jpeg|svg|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "capycode-images",
              expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "capycode-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@codemirror") || id.includes("codemirror")) return "editor";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("posthog")) return "analytics";
          if (id.includes("framer-motion") || id.includes("canvas-confetti")) return "motion";
          if (id.includes("@radix-ui") || id.includes("lucide-react")) return "ui";
          return "vendor";
        },
      },
    },
  },
}));
