import type { Recipe } from "../types/index.types";

/* ============================================================================
 * Helpers
 * ============================================================================
 */

function normalize(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();
}

function includesAll(text: string, terms: string[]): boolean {
    return terms.every((t) => text.includes(t));
}

/* ============================================================================
 * Public API
 * ============================================================================
 */

/**
 * Filters recipes by search query.
 *
 * Searches in:
 * - title
 * - owner
 * - tags
 */
export function filterRecipes(
    recipes: Recipe[],
    query: string
): Recipe[] {
    const q = normalize(query);

    if (!q) return recipes;

    const terms = q.split(/\s+/);

    return recipes.filter((r) => {
        const searchableText = normalize(
            [
                r.title,
                r.owner,
                ...(r.tags ?? []),
            ]
                .filter(Boolean)
                .join(" ")
        );

        return includesAll(searchableText, terms);
    });
}
