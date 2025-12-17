/*
 * ============================================================================
 * user.util – Helper rund um User-Daten (Anzeige/Checks)
 * ============================================================================
 */

import type { User } from "../types/index.types";

/**
 * Gibt einen sinnvollen Anzeigenamen zurück.
 * Priorität: Vorname+Nachname → Username → Fallback
 */
export function getDisplayName(user: User | null | undefined): string {
    if (!user) return "Gast";

    const first = (user.firstName ?? "").trim();
    const last = (user.lastName ?? "").trim();

    const full = `${first} ${last}`.trim();
    if (full.length > 0) return full;

    const username = (user.username ?? "").trim();
    if (username.length > 0) return username;

    return "Unbekannt";
}

/**
 * Formatiert das Alter für die UI.
 */
export function formatAge(age: number | null | undefined): string {
    if (age === null || age === undefined) return "—";
    if (!Number.isFinite(age) || age < 0) return "—";
    return `${age}`;
}

/**
 * Convenience: Prüft, ob Profil "vollständig" ist (für Hinweise im UI).
 * Du kannst die Regeln später easy anpassen.
 */
export function isProfileComplete(user: User | null | undefined): boolean {
    if (!user) return false;
    const emailOk = !!user.email && user.email.trim().length > 0;
    const nameOk =
        (!!user.firstName && user.firstName.trim().length > 0) ||
        (!!user.lastName && user.lastName.trim().length > 0);
    return emailOk && nameOk;
}
