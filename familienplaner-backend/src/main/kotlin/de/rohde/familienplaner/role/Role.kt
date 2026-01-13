package de.rohde.familienplaner.role

/**
 * User-Rollen
 *
 * USER - normaler Benutzer
 * ADMIN - volle Administrationsrechte
 */
enum class Role {
    USER,
    ADMIN
}

/**
 * Recipe Tags
 */
enum class RecipeTag {
    MEAL_PREP,
    FRUEHSTUECK,
    MITTAG,
    NACHTISCH,
    SCHNELL,
    WEIHNACHTEN
}
