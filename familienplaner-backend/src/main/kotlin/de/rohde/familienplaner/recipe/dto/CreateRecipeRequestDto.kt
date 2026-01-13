package de.rohde.familienplaner.recipe.dto

import de.rohde.familienplaner.role.RecipeTag
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateRecipeRequestDto(

    @field:NotBlank(message = "title must not be blank")
    @field:Size(max = 120, message = "title must be at most 120 characters long")
    val title: String,

    // Optional: leer ist ok
    val ingredients: List<
            @NotBlank(message = "ingredient must not be blank")
            @Size(max = 255, message = "ingredient must be at most 255 characters long")
            String
            > = emptyList(),

    // Optional: leer ist ok
    @field:Size(max = 10_000, message = "instruction must be at most 10000 characters long")
    val instruction: String = "",

    // Optional: leer ist ok
    val tags: Set<RecipeTag> = emptySet()
)
