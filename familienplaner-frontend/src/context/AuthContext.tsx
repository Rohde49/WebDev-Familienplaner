/* ============================================================================
 * AuthContext – zentrale Authentifizierung- und Session-Verwaltung
 * ============================================================================
 * Stellt globale Auth-Funktionalität bereit:
 *   - Speichert den eingeloggten Benutzer (User-Objekt)
 *   - Speichert & verwaltet das JWT-Token
 *   - Rehydration: stellt Session nach Seiten-Reload automatisch wieder her
 *   - Bietet login() und logout() für Komponenten an
 *   - Entlastet Komponenten: keine Token- oder LocalStorage-Logik nötig
 * ============================================================================
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";
import type { PropsWithChildren } from "react";

import type { User, LoginResponse } from "../types/index.types";
import { getAuthToken, setAuthToken, getCurrentUser } from "../api/index.api";

/**
 * Öffentliche API des Contexts
 */
interface AuthContextValue {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: LoginResponse) => void;
    logout: () => void;
}

/**
 * Interner React Context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ============================================================================
 * AuthProvider – stellt Auth-Daten und Login/Logout-Methoden bereit
 * ============================================================================
 * Verantwortlichkeiten:
 *   - Initialisiert den Auth-Zustand aus localStorage
 *   - Führt automatische Session-Rehydration bei vorhandenem Token durch
 *   - Speichert Änderungen im Token & User im Context
 *   - Kapselt gesamte Authentifizierungslogik zentral
 * ============================================================================
 */
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {

    // gespeicherter Benutzer
    const [user, setUser] = useState<User | null>(null);

    //gespeichertes JWT-Token
    const [token, setTokenState] = useState<string | null>(getAuthToken());

    //abgeleiteter Zustand: ist der Benutzer eingeloggt?
    const isAuthenticated = !!token;

    //Rehydration – lädt bei Seiten-Reload automatisch den aktuellen Benutzer
    useEffect(() => {
        if (!token) return;

        getCurrentUser()
            .then((fetchedUser) => {
                setUser(fetchedUser);
            })
            .catch(() => {
                // Token ungültig → komplett ausloggen
                setAuthToken(null);
                setTokenState(null);
                setUser(null);
            });
    }, [token]);

    /**
     * Login – setzt Token & User-Daten nach erfolgreichem Backend-Login
     */
    const login = (data: LoginResponse) => {
        setAuthToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
    };

    /**
     * Logout – entfernt Token & Benutzerinformation vollständig
     */
    const logout = () => {
        setAuthToken(null);
        setTokenState(null);
        setUser(null);
    };

    const value: AuthContextValue = {
        user,
        token,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ============================================================================
 * useAuth – Hook zum Zugriff auf AuthState & AuthMethoden
 * ============================================================================
 * Nutzung:
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 * Muss innerhalb eines <AuthProvider> verwendet werden.
 * ============================================================================
 */
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
