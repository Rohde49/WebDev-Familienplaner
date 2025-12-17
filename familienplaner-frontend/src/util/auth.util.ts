/*
 * ============================================================================
 * auth.util – Auth/Access Helper (keine Storage-Logik)
 * ============================================================================
 */

import type { User, UserRole } from "../types/index.types";

/**
 * True, wenn ein gültiger "auth state" vorliegt (Token-Existenz).
 * Hinweis: Validität (Ablauf/Signatur) prüft das Backend.
 */
export function isAuthenticated(token: string | null | undefined): boolean {
    return !!token && token.trim().length > 0;
}

/**
 * True, wenn ein User geladen ist und eine Rolle besitzt.
 */
export function hasRole(user: User | null | undefined, role: UserRole): boolean {
    return !!user && user.role === role;
}

/**
 * True, wenn User ADMIN ist.
 */
export function isAdmin(user: User | null | undefined): boolean {
    return hasRole(user, "ADMIN");
}

/**
 * Convenience: Prüft, ob der User eingeloggt ist UND (optional) eine Rolle hat.
 * Wenn role nicht gesetzt ist → reicht Authenticated.
 */
export function canAccess(
    token: string | null | undefined,
    user: User | null | undefined,
    role?: UserRole
): boolean {
    if (!isAuthenticated(token)) return false;
    if (!role) return true;
    return hasRole(user, role);
}
