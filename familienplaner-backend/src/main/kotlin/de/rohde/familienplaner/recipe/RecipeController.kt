package de.rohde.familienplaner.recipe

import de.rohde.familienplaner.recipe.dto.CreateRecipeRequestDto
import de.rohde.familienplaner.recipe.dto.RecipeResponseDto
import de.rohde.familienplaner.recipe.dto.UpdateRecipeRequestDto
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

/**
 * Endpunkte für Rezepte-Verwaltung.
 *
 * - GET /api/recipes
 * - GET /api/recipes/{id}
 * - POST /api/recipes
 * - PATCH /api/recipes/{id}
 * - DELETE /api/recipes/{id}
 */
@Tag(
    name = "Recipes",
    description = "Erstellen, Anzeigen, Bearbeiten und Löschen von Rezepten"
)
@RestController
@RequestMapping("/api/recipes")
class RecipeController(
    private val recipeService: RecipeService
) {

    @Operation(
        summary = "Alle Rezepte abrufen",
        description = "Liefert eine Liste aller vorhandenen Rezepte"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Rezepte erfolgreich geladen")
        ]
    )
    @GetMapping
    fun getAllRecipes(): List<RecipeResponseDto> {
        return recipeService.getAllRecipes()
    }



    @Operation(
        summary = "Rezept nach ID abrufen",
        description = "Liefert ein einzelnes Rezept anhand seiner ID"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Rezept gefunden"),
            ApiResponse(responseCode = "404", description = "Rezept nicht gefunden")
        ]
    )
    @GetMapping("/{id}")
    fun getRecipeById(
        @PathVariable id: Long
    ): RecipeResponseDto {
        return recipeService.getRecipeById(id)
    }



    @Operation(
        summary = "Rezept erstellen",
        description = "Erstellt ein neues Rezept für den aktuell angemeldeten Benutzer"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Rezept erfolgreich erstellt"),
            ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert")
        ]
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createRecipe(
        @Valid @RequestBody dto: CreateRecipeRequestDto,
        @AuthenticationPrincipal principal: UserDetails
    ): RecipeResponseDto {
        return recipeService.createRecipe(dto, principal)
    }



    @Operation(
        summary = "Rezept aktualisieren",
        description = "Aktualisiert ein bestehendes Rezept. Es werden nur gesetzte Felder geändert."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Rezept erfolgreich aktualisiert"),
            ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert"),
            ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
            ApiResponse(responseCode = "404", description = "Rezept nicht gefunden")
        ]
    )
    @PatchMapping("/{id}")
    fun updateRecipe(
        @PathVariable id: Long,
        @Valid @RequestBody dto: UpdateRecipeRequestDto,
        @AuthenticationPrincipal principal: UserDetails
    ): RecipeResponseDto {
        return recipeService.updateRecipe(id, dto, principal)
    }



    @Operation(
        summary = "Rezept löschen",
        description = "Löscht ein Rezept anhand seiner ID"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Rezept erfolgreich gelöscht"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert"),
            ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
            ApiResponse(responseCode = "404", description = "Rezept nicht gefunden")
        ]
    )
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteRecipe(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: UserDetails
    ) {
        recipeService.deleteRecipe(id, principal)
    }
}
