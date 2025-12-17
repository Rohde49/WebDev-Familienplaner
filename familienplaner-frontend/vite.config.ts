/*
 * ============================================================================
 * Zentrale Konfigurationsdatei für Vite
 * bestimmt, wie das Frontend:
 * gebaut, entwickelt, optimiert, gestartet wird
 * ============================================================================
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        host: true,
        port: 5173,
        hmr: {
            clientPort: 5173,
        },
        watch: {
            usePolling: true,
            interval: 200,
        },
    },
    build: {
        target: "es2022",
    },
});