package de.rohde.familienplaner.user.dto

import de.rohde.familienplaner.role.Role
import java.time.LocalDateTime

/**
 * Basis-Userdaten für Antworten an das Frontend.
 */
data class UserResponseDto(
    val id: Long,
    val username: String,
    val role: Role,
    val email: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val age: Int? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
