/*
 * ============================================================================
 * user.util – Helper rund um User-Daten
 * ============================================================================
 */

import type { User, UpdateUserProfileRequest } from "../types/index.types";
import { buildOptionalPayload, parseNullableInt, toNullableEmail, toNullableString } from "./form.util";

/**
 * Gibt einen sinnvollen Anzeigenamen zurück.
 * Priorität: Vorname+Nachname → Username → Fallback
 */
export function getDisplayName(user: User | null | undefined): string {
    if (!user) return "Gast";

    // (du hast das Fullname-Handling bewusst auskommentiert – lassen wir so)

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

/* ============================================================================
 * ProfilePage Helpers (User <-> Form <-> API Payload)
 * ============================================================================
 */

export type ProfileFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    age: string; // Input string, wird zentral geparst
};

export function toProfileForm(user: User): ProfileFormValues {
    return {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        age: user.age === null || user.age === undefined ? "" : String(user.age),
    };
}

export function toUpdateProfileRequest(
    form: ProfileFormValues
): { valid: true; payload: UpdateUserProfileRequest } | { valid: false; error: string } {
    const age = parseNullableInt(form.age, { min: 0, max: 150 });
    if (age === "invalid") {
        return { valid: false, error: "Bitte gib ein gültiges Alter ein (0–150)." };
    }

    // Leere Inputs werden zu null → Felder können aktiv “gelöscht” werden
    const base = buildOptionalPayload({
        firstName: toNullableString(form.firstName),
        lastName: toNullableString(form.lastName),
        email: toNullableEmail(form.email),
        age, // number | null
    });

    return { valid: true, payload: base as UpdateUserProfileRequest };
}
