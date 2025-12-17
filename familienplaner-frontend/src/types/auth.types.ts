import type { UserRole, User } from "./index.types";


/**
 * Login-Daten (Username + Passwort)
 */
export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * Antwort auf erfolgreichen Login: JWT + Userdaten.
 */
export interface LoginResponse {
    token: string;
    user: User;
}

/**
 * Daten für die Registrierung eines neuen Accounts.
 */
export interface RegisterRequest {
    username: string;
    password: string;
}

/**
 * Antwort auf erfolgreiche Registrierung.
 */
export interface RegisterResponse {
    id: number;
    username: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

