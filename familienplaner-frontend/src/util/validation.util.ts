/*
 * ============================================================================
 * validation.util – zentrale Validierungen (Frontend)
 * ============================================================================
 * Hinweis: Frontend validiert für UX. Backend ist Source of Truth.
 * Policy ist gespiegelt aus PasswordPolicy (Backend).
 * ============================================================================
 */

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Username: minimal sinnvoll (kannst du später verschärfen)
 */
export function validateUsername(username: string): ValidationResult {
    const value = username.trim();

    const errors: string[] = [];
    if (value.length < 3) errors.push("Benutzername muss mindestens 3 Zeichen lang sein.");
    if (value.length > 30) errors.push("Benutzername darf höchstens 30 Zeichen lang sein.");
    if (/\s/.test(username)) errors.push("Benutzername darf keine Leerzeichen enthalten.");

    return { valid: errors.length === 0, errors };
}

/**
 * Passwort-Policy (gespiegelt aus Backend PasswordPolicy):
 * - min 6 Zeichen
 * - mind. 1 Großbuchstabe
 * - mind. 1 Kleinbuchstabe
 * - mind. 1 Zahl
 * - darf nicht mit Leerzeichen beginnen/enden
 * - optional: nicht identisch zu currentPassword (bei Passwort-Änderung)
 */
export function validateNewPassword(
    newPassword: string,
    currentPassword?: string | null
): ValidationResult {
    const errors: string[] = [];

    if (newPassword.length < 6) {
        errors.push("Passwort muss mindestens 6 Zeichen lang sein.");
    }
    if (!/[A-Z]/.test(newPassword)) {
        errors.push("Passwort muss mindestens einen Großbuchstaben enthalten.");
    }
    if (!/[a-z]/.test(newPassword)) {
        errors.push("Passwort muss mindestens einen Kleinbuchstaben enthalten.");
    }
    if (!/[0-9]/.test(newPassword)) {
        errors.push("Passwort muss mindestens eine Zahl enthalten.");
    }
    if (newPassword !== newPassword.trim()) {
        errors.push("Passwort darf kein Leerzeichen enthalten.");
    }
    if (currentPassword != null && newPassword === currentPassword) {
        errors.push("Neues Passwort darf nicht mit dem alten Passwort identisch sein.");
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Helper für Password confirm
 */
export function validatePasswordConfirmation(
    password: string,
    confirm: string
): ValidationResult {
    const errors: string[] = [];
    if (confirm.length === 0) errors.push("Bitte Passwort bestätigen.");
    if (password !== confirm) errors.push("Passwörter stimmen nicht überein.");
    return { valid: errors.length === 0, errors };
}

/**
 * Validiert den kompletten Passwort-Change Flow:
 * - currentPassword muss gesetzt sein
 * - newPassword muss Policy erfüllen (und optional != currentPassword)
 * - confirm muss passen
 *
 * Ergebnis-Format bleibt identisch (valid + errors[]).
 */
export function validatePasswordChange(input: {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}): ValidationResult {
    const errors: string[] = [];

    const current = input.currentPassword;
    const next = input.newPassword;
    const confirm = input.newPasswordConfirm;

    if (current.trim().length === 0) {
        errors.push("Bitte aktuelles Passwort eingeben.");
        return { valid: false, errors };
    }

    const pw = validateNewPassword(next, current);
    if (!pw.valid) errors.push(...pw.errors);

    const conf = validatePasswordConfirmation(next, confirm);
    if (!conf.valid) errors.push(...conf.errors);

    return { valid: errors.length === 0, errors };
}