package de.rohde.familienplaner.recipe

import de.rohde.familienplaner.recipe.dto.CreateRecipeRequestDto
import de.rohde.familienplaner.recipe.dto.RecipeResponseDto
import de.rohde.familienplaner.recipe.dto.UpdateRecipeRequestDto
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

/**
 * Endpunkte für Rezepte-Verwaltung.
 */
@RestController
@RequestMapping("/api/recipes")
class RecipeController(
    private val recipeService: RecipeService
) {

    /**
     * Liefert alle vorhandenen Rezepte.
     * GET /api/recipes
     */
    @GetMapping
    fun getAllRecipes(): List<RecipeResponseDto> {
        return recipeService.getAllRecipes()
    }

    /**
     * Liefert ein Rezept anhand seiner ID.
     * GET /api/recipes/{id}
     */
    @GetMapping("/{id}")
    fun getRecipeById(
        @PathVariable id: Long
    ): RecipeResponseDto {
        return recipeService.getRecipeById(id)
    }

    /**
     * Erstellt ein Rezept
     * POST /api/recipes
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createRecipe(
        @Valid @RequestBody dto: CreateRecipeRequestDto,
        @AuthenticationPrincipal principal: UserDetails
    ): RecipeResponseDto {
        return recipeService.createRecipe(dto, principal)
    }

    /**
     * Updated ein Rezept anhand seiner ID
     * Patch-style Update: nur Felder, die gesetzt sind, werden geändert.
     * PATCH /api/recipes/{id}
     */
    @PatchMapping("/{id}")
    fun updateRecipe(
        @PathVariable id: Long,
        @Valid @RequestBody dto: UpdateRecipeRequestDto,
        @AuthenticationPrincipal principal: UserDetails
    ): RecipeResponseDto {
        return recipeService.updateRecipe(id, dto, principal)
    }

    /**
     * Löscht ein Rezept anhand seiner ID
     * DELETE /api/recipes/{id}
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteRecipe(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: UserDetails
    ) {
        recipeService.deleteRecipe(id, principal)
    }
}
