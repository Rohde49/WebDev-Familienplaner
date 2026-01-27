import type { Recipe } from "../types/index.types";

export type RecipeSortMode =
    | "TITLE_ASC"
    | "TITLE_DESC"
    | "OWNER_ASC";

/**
 * Sort recipes by selected mode.
 */
export function sortRecipes(
    recipes: Recipe[],
    mode: RecipeSortMode
): Recipe[] {
    const list = [...recipes];

    switch (mode) {
        case "TITLE_ASC":
            return list.sort((a, b) =>
                a.title.localeCompare(b.title, "de", {
                    sensitivity: "base",
                })
            );

        case "TITLE_DESC":
            return list.sort((a, b) =>
                b.title.localeCompare(a.title, "de", {
                    sensitivity: "base",
                })
            );

        case "OWNER_ASC":
            return list.sort((a, b) =>
                (a.owner ?? "").localeCompare(b.owner ?? "", "de", {
                    sensitivity: "base",
                })
            );

        default:
            return list;
    }
}
