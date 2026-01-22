import type { Recipe } from "@/types/index.types";

export type RecipeSortMode =
    | "UPDATED_DESC"
    | "UPDATED_ASC"
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
        case "UPDATED_ASC":
            return list.sort((a, b) => {
                const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return aTime - bTime;
            });

        case "OWNER_ASC":
            return list.sort((a, b) =>
                (a.owner ?? "").localeCompare(b.owner ?? "", "de", {
                    sensitivity: "base",
                })
            );

        case "UPDATED_DESC":
        default:
            return list.sort((a, b) => {
                const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return bTime - aTime;
            });
    }
}
