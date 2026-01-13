package de.rohde.familienplaner.recipe.dto

import de.rohde.familienplaner.role.RecipeTag
import java.time.LocalDateTime

data class RecipeResponseDto(
    val id: Long,
    val title: String,
    val owner: String,
    val ingredients: List<String>,
    val instruction: String,
    val tags: Set<RecipeTag>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
