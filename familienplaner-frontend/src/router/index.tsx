/* ============================================================================
 * AppRouter – zentrale Routenübersicht der Anwendung
 * ============================================================================
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProfilePage from "../pages/user/ProfilePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

import { RequireAuth, RequireAdmin } from "./guards";
import { ROUTES } from "./paths";

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* öffentliche Routen */}
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.register} element={<RegisterPage />} />

            {/* geschützte Routen */}
            <Route
                path={ROUTES.profile}
                element={
                    <RequireAuth>
                        <ProfilePage />
                    </RequireAuth>
                }
            />

            <Route
                path={ROUTES.admin}
                element={
                    <RequireAuth>
                        <RequireAdmin>
                            <AdminDashboardPage />
                        </RequireAdmin>
                    </RequireAuth>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
    );
};
