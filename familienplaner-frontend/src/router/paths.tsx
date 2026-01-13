/* ============================================================================
 * ROUTES – zentrale Pfad-Definitionen der App
 * ============================================================================
 */

export const ROUTES = {
    // öffentlich
    home: "/",
    login: "/login",
    register: "/register",

    // User
    profile: "/profile",

    // Recipes
    recipes: "/recipes",
    addRecipe: "/recipes/new",
    editRecipe: "/recipes/:id/edit",              // <-- Route pattern
    recipeEdit: (id: number) => `/recipes/${id}/edit`, // <-- Link builder
    detailRecipe: "/recipes/:id",
    recipeDetail: (id: number) => `/recipes/${id}`,

    // Admin
    admin: "/admin",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
