import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Strip debug logging from production bundles. We keep console.error so
    // genuine failures still surface in the browser console / monitoring,
    // but drop console.log / console.warn / console.debug noise that was
    // leaking storage paths and table names to anyone with DevTools open.
    esbuild: isProd
      ? { drop: ["debugger"], pure: ["console.log", "console.warn", "console.debug", "console.info"] }
      : undefined,
    build: {
      // Split big, rarely-needed code out of the main bundle so the public
      // marketing/shop pages load far less JS. Admin + PDF libs are only
      // pulled in when an admin actually navigates to those routes.
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-supabase": ["@supabase/supabase-js"],
            "vendor-charts": ["recharts"],
            "vendor-pdf": ["jspdf"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
