
/**
 * Typ für die Tags der Recipes
 */
export type RecipeTag =
    | "MEAL_PREP"
    | "FRUEHSTUECK"
    | "MITTAG"
    | "NACHTISCH"
    | "SCHNELL"
    | "WEIHNACHTEN";

/**
 * Basis-Recipe (Antworttyp vom Backend)
 */
export interface Recipe {
    id: number;
    title: string;
    owner: string;
    ingredients: string[];
    instruction: string;
    tags: RecipeTag[];
    createdAt: string; // LocalDateTime vom Backend
    updatedAt: string; // LocalDateTime vom Backend
}

/**
 * ein Recipe erstellen
 */
export interface CreateRecipeRequestDto {
    title: string;
    ingredients?: string[]; // default []
    instruction?: string; // default ""
    tags?: RecipeTag[]; // default []
}

/**
 * ein Recipe updaten -> nur gesetzte Werte werden geändert
 */
export interface UpdateRecipeRequestDto {
    title?: string;
    ingredients?: string[]; // [] => leeren
    instruction?: string;
    tags?: RecipeTag[]; // [] => alle Tags entfernen
}
