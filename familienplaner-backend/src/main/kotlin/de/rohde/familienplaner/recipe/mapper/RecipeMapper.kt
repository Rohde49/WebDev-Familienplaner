package de.rohde.familienplaner.recipe.mapper

import de.rohde.familienplaner.recipe.RecipeEntity
import de.rohde.familienplaner.recipe.dto.CreateRecipeRequestDto
import de.rohde.familienplaner.recipe.dto.RecipeResponseDto
import de.rohde.familienplaner.recipe.dto.UpdateRecipeRequestDto
import java.time.LocalDateTime

object RecipeMapper {

    /**
     * Baut ein neues RecipeEntity basierend auf einem CreateRecipeRequestDto.
     */
    fun toEntity(dto: CreateRecipeRequestDto, owner: String): RecipeEntity {
        return RecipeEntity(
            title = dto.title.trim(),
            owner = owner,
            ingredients = dto.ingredients.map { it.trim() }.toMutableList(),
            instruction = dto.instruction.trim(),
            tags = dto.tags.toMutableSet()
        )
    }

    /**
     * Konvertiert ein RecipeEntity in eine Antwort für das Frontend.
     */
    fun toResponseDto(entity: RecipeEntity): RecipeResponseDto {
        val id = entity.id
            ?: throw IllegalStateException("RecipeEntity.id must not be null when mapping to response")

        return RecipeResponseDto(
            id = id,
            title = entity.title,
            owner = entity.owner,
            ingredients = entity.ingredients.toList(),
            instruction = entity.instruction,
            tags = entity.tags.toSet(),
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt
        )
    }

    /**
     * Wendet ein Update DTO auf eine bestehende Entity an.
     * Nur nicht-null Felder werden übernommen.
     */
    fun applyUpdate(
        entity: RecipeEntity,
        update: UpdateRecipeRequestDto
    ) {
        update.title?.let { entity.title = it.trim() }

        update.ingredients?.let { list ->
            entity.ingredients = list.map { it.trim() }.toMutableList()
        }

        update.instruction?.let { entity.instruction = it.trim() }

        update.tags?.let { set ->
            entity.tags = set.toMutableSet()
        }

        entity.updatedAt = LocalDateTime.now()
    }
}
