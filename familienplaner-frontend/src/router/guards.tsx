/* ============================================================================
 * Router Guards – Zugriffsschutz für geschützte Routen
 * ============================================================================
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./paths";

interface GuardProps {
    children: React.ReactElement;
}

/**
 * Stellt sicher, dass der Benutzer eingeloggt ist.
 * Nicht eingeloggte Benutzer werden zur Login-Seite umgeleitet.
 */
export const RequireAuth: React.FC<GuardProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.login} replace />;
    }
    return children;
};

/**
 * Stellt sicher, dass der Benutzer ADMIN ist.
 * Nicht-Admin-Benutzer werden auf die Startseite umgeleitet.
 */
export const RequireAdmin: React.FC<GuardProps> = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== "ADMIN") {
        return <Navigate to={ROUTES.home} replace />;
    }
    return children;
};
