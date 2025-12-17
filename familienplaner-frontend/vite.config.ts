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
});