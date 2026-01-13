/* ============================================================================
 * AppRouter – zentrale Routenübersicht der Anwendung
 * ============================================================================
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Öffentlich
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// User
import ProfilePage from "../pages/user/ProfilePage";

// Recipes
import RecipesPage from "../pages/recipes/RecipesPage";
import AddRecipePage from "../pages/recipes/AddRecipePage";
import EditRecipePage from "../pages/recipes/EditRecipePage";
import DetailRecipePage from "../pages/recipes/DetailRecipePage";

// Admin
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

            {/* User */}
            <Route
                path={ROUTES.profile}
                element={
                    <RequireAuth>
                        <ProfilePage />
                    </RequireAuth>
                }
            />

            {/* Recipes */}
            <Route
                path={ROUTES.recipes}
                element={
                    <RequireAuth>
                        <RecipesPage />
                    </RequireAuth>
                }
            />

            <Route
                path={ROUTES.addRecipe}
                element={
                    <RequireAuth>
                        <AddRecipePage />
                    </RequireAuth>
                }
            />

            <Route
                path={ROUTES.editRecipe}
                element={
                    <RequireAuth>
                        <EditRecipePage />
                    </RequireAuth>
                }
            />

            <Route
                path={ROUTES.detailRecipe}
                element={
                    <RequireAuth>
                        <DetailRecipePage />
                    </RequireAuth>
                }
            />

            {/* Admin */}
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
