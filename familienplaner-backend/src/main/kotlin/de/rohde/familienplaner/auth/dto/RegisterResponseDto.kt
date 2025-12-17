package de.rohde.familienplaner.auth.dto

import de.rohde.familienplaner.role.Role
import java.time.LocalDateTime

/**
 * Antwort auf erfolgreiche Registrierung.
 */
data class RegisterResponseDto(
    val id: Long,
    val username: String,
    val role: Role,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
