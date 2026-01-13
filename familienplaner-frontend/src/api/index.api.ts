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
export * from "./recipes.api";

// Weitere Module folgen:
//
// export * from "./admin.api";
