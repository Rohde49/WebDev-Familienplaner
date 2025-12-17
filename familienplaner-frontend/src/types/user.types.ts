import type { UserRole } from "./global.types";


/**
 * Basis-User (Antworttyp vom Backend)
 */
export interface User {
    id: number;
    username: string;
    role: UserRole;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    age: number | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * für Vollständigkeit
 */
export interface CreateUserRequest {
    username: string;
    password: string;
}

/**
 * Alle Felder optional → nur gesetzte Werte werden geändert
 */
export interface UpdateUserProfileRequest {
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    age?: number | null;
}

/**
 *
 */
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}
