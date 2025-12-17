/*
 * ============================================================================
 * form.util – kleine Helper für Formularwerte & Payloads
 * ============================================================================
 */

/**
 * Trimmt einen String sicher.
 * - null/undefined → ""
 */
export function safeTrim(value: unknown): string {
    if (typeof value !== "string") return "";
    return value.trim();
}

/**
 * Entfernt "leere" Strings → null
 * (praktisch für optionale Felder wie email, firstName, lastName)
 */
export function emptyToNull(value: string): string | null {
    const v = value.trim();
    return v.length === 0 ? null : v;
}

/**
 * Entfernt Whitespace innerhalb eines Strings vollständig.
 * (praktisch für Username, falls du keine Leerzeichen erlaubst)
 */
export function removeAllWhitespace(value: string): string {
    return value.replace(/\s+/g, "");
}

/**
 * Normalisiert Username (empfohlen):
 * - trim
 * - keine Leerzeichen
 * - optional: lowercase (aktuell NICHT aktiviert)
 */
export function normalizeUsername(username: string): string {
    const trimmed = username.trim();
    return removeAllWhitespace(trimmed);
}

/**
 * Baut ein PATCH-Payload aus optionalen Feldern:
 * - undefined bleibt undefined (wird nicht gesendet)
 * - "" wird zu null (wenn du emptyToNull nutzt)
 */
export function buildOptionalPayload<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const payload: Partial<T> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) continue;
        (payload as any)[key] = value;
    }

    return payload;
}
