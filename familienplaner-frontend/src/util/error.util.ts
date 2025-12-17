/*
 * ============================================================================
 * error.util – API/Axios Errors in UI-Message umwandeln
 * ============================================================================
 */

import axios from "axios";

/**
 * Entspricht Backend-Format: ApiErrorResponse
 */
export interface ApiErrorResponse {
    status: number;
    error: string;
    message?: string | null;
    path?: string | null;
    timestamp?: string; // LocalDateTime kommt als String
}

/**
 * Liefert eine userfreundliche Fehlermeldung aus beliebigen Errors.
 */
export function getErrorMessage(err: unknown, fallback = "Ein Fehler ist aufgetreten."): string {
    // Axios Error mit Backend-Body
    if (axios.isAxiosError(err)) {
        // Netzwerk / keine Response
        if (!err.response) {
            return "Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.";
        }

        const data = err.response.data as ApiErrorResponse | undefined;

        // Backend-Format: message ist am wichtigsten
        const backendMsg = data?.message;
        if (backendMsg && backendMsg.trim().length > 0) return backendMsg;

        // Sonst: Axios message / Status fallback
        const status = err.response.status;
        if (status === 401) return "Nicht autorisiert. Bitte erneut einloggen.";
        if (status === 403) return "Kein Zugriff auf diese Ressource.";
        if (status === 404) return "Nicht gefunden.";
        if (status >= 500) return "Serverfehler. Bitte später erneut versuchen.";

        return err.message || fallback;
    }

    // Standard Error
    if (err instanceof Error) {
        return err.message || fallback;
    }

    return fallback;
}

/**
 * Optional: gibt status/error auch zurück (für Logging/Debug)
 */
export function getApiError(err: unknown): ApiErrorResponse | null {
    if (!axios.isAxiosError(err)) return null;
    const data = err.response?.data as ApiErrorResponse | undefined;
    return data ?? null;
}
