/*
 * ============================================================================
 * Kommunikation mit Backend-Endpunkten rund um Benutzerdaten.
 * ============================================================================
 */
import axiosInstance from "./axios";
import type {
    User,
    UpdateUserProfileRequest,
    ChangePasswordRequest,
} from "../types/index.types";


/**
 * Lädt den aktuell eingeloggten Benutzer.
 * Backend: GET /api/users/me
 */
export async function getCurrentUser(): Promise<User> {
    const res = await axiosInstance.get<User>("/users/me");
    return res.data;
}

/**
 * Aktualisiert das Profil des aktuell eingeloggten Benutzers.
 * Backend: PATCH /api/users/me/profile
 */
export async function updateCurrentUserProfile(
    payload: UpdateUserProfileRequest
): Promise<User> {
    const res = await axiosInstance.patch<User>("/users/me/profile", payload);
    return res.data;
}

/**
 * Ändert das Passwort des aktuell eingeloggten Benutzers.
 * Backend: PATCH /api/users/me/password
 */
export async function changeCurrentUserPassword(
    payload: ChangePasswordRequest
): Promise<User> {
    const res = await axiosInstance.patch<User>("/users/me/password", payload);
    return res.data;
}