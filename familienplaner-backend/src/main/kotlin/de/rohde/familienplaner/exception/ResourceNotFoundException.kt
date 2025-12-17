package de.rohde.familienplaner.exception

/**
 * Wird geworfen, wenn eine angeforderte Ressource
 * (z. B. User, Rezept, Kategorie ...) nicht existiert.
 *
 * Beispiel:
 * - UserService.getUserById(id)
 * - RecipeService.getRecipeById(id)
 *
 * Diese Exception ersetzt NoSuchElementException im gesamten Projekt.
 */
class ResourceNotFoundException(
    override val message: String = "Die angeforderte Ressource wurde nicht gefunden."
) : RuntimeException(message)
