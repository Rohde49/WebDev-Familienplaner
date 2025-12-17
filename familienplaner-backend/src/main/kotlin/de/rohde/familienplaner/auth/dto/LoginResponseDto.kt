package de.rohde.familienplaner.auth.dto

import de.rohde.familienplaner.user.dto.UserResponseDto

/**
 * Antwort auf erfolgreichen Login: JWT + Userdaten.
 */
data class LoginResponseDto(
    val token: String,
    val user: UserResponseDto
)
