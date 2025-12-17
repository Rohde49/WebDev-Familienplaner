package de.rohde.familienplaner.user.mapper

import de.rohde.familienplaner.role.Role
import de.rohde.familienplaner.user.UserEntity
import de.rohde.familienplaner.user.dto.CreateUserRequestDto
import de.rohde.familienplaner.user.dto.UpdateUserProfileRequestDto
import de.rohde.familienplaner.user.dto.UserResponseDto
import java.time.LocalDateTime

/**
 * Konvertiert zwischen User-Entities und User-bezogenen DTOs.
 */
object UserMapper {

    /**
     * Baut ein neues UserEntity basierend auf einem CreateUserRequestDto.
     * Passwort-Hash wird vorher vom Service erzeugt.
     */
    fun toEntity(request: CreateUserRequestDto, passwordHash: String): UserEntity =
        UserEntity(
            username = request.username,
            passwordHash = passwordHash,
            role = Role.USER,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

    /**
     * Konvertiert ein UserEntity in eine Antwort für das Frontend.
     * (passwordHash wird nicht ausgegeben)
     */
    fun toResponse(entity: UserEntity): UserResponseDto =
        UserResponseDto(
            id = entity.id
                ?: throw IllegalStateException("UserEntity id must not be null when mapping to response."),
            username = entity.username,
            role = entity.role,
            email = entity.email,
            firstName = entity.firstName,
            lastName = entity.lastName,
            age = entity.age,
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt
        )

    /**
     * Übernimmt nur die Werte aus dem Update-DTO,
     * die tatsächlich gesetzt wurden (non-null).
     */
    fun applyProfileUpdate(
        entity: UserEntity,
        update: UpdateUserProfileRequestDto
    ) {
        update.email?.let { entity.email = it }
        update.firstName?.let { entity.firstName = it }
        update.lastName?.let { entity.lastName = it }
        update.age?.let { entity.age = it }

        entity.updatedAt = LocalDateTime.now()
    }
}
