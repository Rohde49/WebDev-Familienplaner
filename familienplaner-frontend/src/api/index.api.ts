/* ============================================================================
 * API Layer – zentrale Schnittstelle für alle Backend-Aufrufe
 * ============================================================================
 * Sorgt für Kommunikation zwischen Frontend & Backend.
 * ============================================================================
 */

// zentraler HTTP-Client
export { default as apiClient } from "./axios";
export * from "./axios";

// APIs
export * from "./auth.api";
export * from "./user.api";

// Weitere Module folgen:
// export * from "./recipes.api";
// export * from "./admin.api";
