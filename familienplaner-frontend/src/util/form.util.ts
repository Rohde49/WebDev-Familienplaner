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
 * Konvertiert beliebige Werte zu einem optionalen String:
 * - nicht-string → null
 * - whitespace/"" → null
 * - sonst trimmed string
 */
export function toNullableString(value: unknown): string | null {
    const v = safeTrim(value);
    return v.length === 0 ? null : v;
}

/**
 * Normalisiert E-Mail (optional, für konsistente Speicherung)
 * - nicht-string → null
 * - "" → null
 * - trimmed + lowercased
 */
export function toNullableEmail(value: unknown): string | null {
    const v = safeTrim(value);
    if (v.length === 0) return null;
    return v.toLowerCase();
}

/**
 * Parst eine optionale Ganzzahl aus einem Form-Input:
 * - ""/whitespace → null
 * - keine Zahl / keine Ganzzahl → "invalid"
 * - optional min/max Grenzen
 */
export function parseNullableInt(
    value: unknown,
    opts?: { min?: number; max?: number }
): number | null | "invalid" {
    const v = safeTrim(value);
    if (v.length === 0) return null;

    // Nur Ganzzahlen zulassen (kein "3.14", kein "1e2")
    if (!/^-?\d+$/.test(v)) return "invalid";

    const n = Number(v);
    if (!Number.isFinite(n)) return "invalid";

    if (opts?.min !== undefined && n < opts.min) return "invalid";
    if (opts?.max !== undefined && n > opts.max) return "invalid";

    return n;
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
export function buildOptionalPayload<T extends object>(obj: T): Partial<T> {
    const payload: Partial<T> = {};

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (value === undefined) continue;
        (payload as any)[key] = value;
    }

    return payload;
}
