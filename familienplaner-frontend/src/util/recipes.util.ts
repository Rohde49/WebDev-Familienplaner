import type { RecipeTag, Recipe, User } from "../types/index.types";
import { isAdmin } from "./index.util";

/* ============================================================================
 * Recipes – Utilities für Recipe Pages
 * ============================================================================
 */
/**
 *
 */
export const RECIPE_TAG_LABELS: Record<RecipeTag, string> = {
    MEAL_PREP: "Meal-Prep",
    FRUEHSTUECK: "Frühstück",
    MITTAG: "Mittag",
    NACHTISCH: "Nachtisch",
    SCHNELL: "Schnell",
    WEIHNACHTEN: "Weihnachten",
};

/**
 *
 */
export const RECIPE_TAG_OPTIONS: { value: RecipeTag; label: string }[] = [
    { value: "MEAL_PREP", label: RECIPE_TAG_LABELS.MEAL_PREP },
    { value: "FRUEHSTUECK", label: RECIPE_TAG_LABELS.FRUEHSTUECK },
    { value: "MITTAG", label: RECIPE_TAG_LABELS.MITTAG },
    { value: "NACHTISCH", label: RECIPE_TAG_LABELS.NACHTISCH },
    { value: "SCHNELL", label: RECIPE_TAG_LABELS.SCHNELL },
    { value: "WEIHNACHTEN", label: RECIPE_TAG_LABELS.WEIHNACHTEN },
];

/**
 *
 * @param tag
 */
export function formatRecipeTag(tag: RecipeTag): string {
    return RECIPE_TAG_LABELS[tag] ?? tag;
}

/**
 * Erkennt, ob User berechtigt ist Rezept zu bearbeiten/löschen
 * @param user
 * @param recipe
 */
export function canEditOrDeleteRecipe(
    user: User | null | undefined,
    recipe: Recipe
): boolean {
    if (!user) return false;

    if (isAdmin(user)) return true;

    return recipe.owner === user.username;
}

/**
 * Konvertiert Textarea-Input (1 pro Zeile) in eine Zutatenliste.
 */
export function parseIngredients(text: string): string[] {
    return text
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

/**
 * Konvertiert Zutatenliste in Textarea-Format (1 pro Zeile).
 */
export function ingredientsToTextarea(ingredients: string[]): string {
    return (ingredients ?? []).join("\n");
}

/**
 * Sortiert Rezepte nach updatedAt (desc). updatedAt ist LocalDateTime als String.
 */
export function sortRecipesByUpdatedAtDesc(recipes: Recipe[]): Recipe[] {
    return [...recipes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

