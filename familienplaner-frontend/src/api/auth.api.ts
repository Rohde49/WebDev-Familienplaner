/*
 * ============================================================================
 * Kommunikation mit Backend-Endpunkten rund um Authentifizierung.
 * ============================================================================
 */

import axiosInstance from "./axios";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "../types/index.types";

/**
 * Meldet einen Benutzer mit Username + Passwort an.
 * Backend: POST /api/auth/login
 */
export async function login(
    credentials: LoginRequest
): Promise<LoginResponse> {
    const res = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
    return res.data;
}

/**
 * Registriert einen neuen Benutzer-Account.
 * Backend: POST /api/auth/register
 */
export async function register(
    payload: RegisterRequest
): Promise<RegisterResponse> {
    const res = await axiosInstance.post<RegisterResponse>("/auth/register", payload);
    return res.data;
}
