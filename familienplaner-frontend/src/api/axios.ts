/* ============================================================================
 * Axios Client – zentraler HTTP-Client des Frontends
 * ============================================================================
 * Stellt eine Axios-Instanz bereit:
 *   - Basis-URL für alle API-Requests
 *   - automatisches Anhängen des JWT-Tokens an jede Anfrage
 *   - zentrale Stelle für zukünftiges Error-/Response-Handling
 *   - Dadurch müssen Komponenten und Contexts keine Header, Tokens oder URLs kennen.
 * ============================================================================
 */
import axios from "axios";
import type { AxiosInstance } from "axios";


/**
 * Basis-URL
 */
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

/**
 * Schlüssel, unter dem das Token gespeichert wird
 */
const TOKEN_KEY = "familienplaner_token";

/**
 * Token aus localStorage lesen
 */
export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null; // Safety, falls mal SSR oder Tests
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Token in localStorage speichern / entfernen
 * @param token
 */
export function setAuthToken(token: string | null) {
    if (typeof window === "undefined") return;

    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

/**
 * zentraler Axios-Client
 */
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
});

/**
 * Interceptor: hängt das JWT automatisch an alle Requests
 */
axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Optional: Response-Interceptor (z.B. für 401-Handling) später möglich:
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // z.B. auto-Logout oder Redirect zum Login
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
