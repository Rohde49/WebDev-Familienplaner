/* ============================================================================
 * ROUTES – zentrale Pfad-Definitionen der App
 * ============================================================================
 */

export const ROUTES = {
    home: "/",
    login: "/login",
    register: "/register",
    profile: "/profile",
    recipes: "/recipes",
    admin: "/admin",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
