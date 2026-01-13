package de.rohde.familienplaner.recipe

import de.rohde.familienplaner.exception.ResourceNotFoundException
import de.rohde.familienplaner.recipe.dto.CreateRecipeRequestDto
import de.rohde.familienplaner.recipe.dto.RecipeResponseDto
import de.rohde.familienplaner.recipe.dto.UpdateRecipeRequestDto
import de.rohde.familienplaner.recipe.mapper.RecipeMapper
import de.rohde.familienplaner.role.Role
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Business-Logik rund um Rezepte:
 */
@Service
class RecipeService(
    private val recipeRepository: RecipeRepository
) {

    /**
     * Alle eingeloggten User dürfen alle Rezepte lesen.
     */
    @Transactional(readOnly = true)
    fun getAllRecipes(): List<RecipeResponseDto> {
        return recipeRepository.findAll()
            .map(RecipeMapper::toResponseDto)
    }

    /**
     * Alle eingeloggten User dürfen ein einzelnes Rezept lesen.
     */
    @Transactional(readOnly = true)
    fun getRecipeById(id: Long): RecipeResponseDto {
        val entity = recipeRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Recipe with id=$id not found") }

        return RecipeMapper.toResponseDto(entity)
    }

    /**
     * Rezept erstellen: Owner = eingeloggter User.
     */
    @Transactional
    fun createRecipe(
        dto: CreateRecipeRequestDto,
        principal: UserDetails
    ): RecipeResponseDto {
        val owner = principal.username

        val entity = RecipeMapper.toEntity(dto, owner)
        val saved = recipeRepository.save(entity)

        return RecipeMapper.toResponseDto(saved)
    }

    /**
     * Update: Nur Owner oder ADMIN.
     */
    @Transactional
    fun updateRecipe(
        id: Long,
        dto: UpdateRecipeRequestDto,
        principal: UserDetails
    ): RecipeResponseDto {
        val entity = recipeRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Recipe with id=$id not found") }

        ensureOwnerOrAdmin(entity, principal)

        RecipeMapper.applyUpdate(entity, dto)
        val saved = recipeRepository.save(entity)

        return RecipeMapper.toResponseDto(saved)
    }

    /**
     * Delete: Nur Owner oder ADMIN.
     */
    @Transactional
    fun deleteRecipe(id: Long, principal: UserDetails) {
        val entity = recipeRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Recipe with id=$id not found") }

        ensureOwnerOrAdmin(entity, principal)

        recipeRepository.delete(entity)
    }

    private fun ensureOwnerOrAdmin(
        entity: RecipeEntity,
        principal: UserDetails
    ) {
        val username = principal.username
        val isOwner = entity.owner == username

        val isAdmin = principal.authorities.any { auth ->
            auth.authority == "ROLE_${Role.ADMIN.name}"
        }

        if (!isOwner && !isAdmin) {
            throw AccessDeniedException("You are not allowed to modify this recipe")
        }
    }
}
