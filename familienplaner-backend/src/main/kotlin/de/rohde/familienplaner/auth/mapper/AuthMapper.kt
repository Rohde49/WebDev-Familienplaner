package de.rohde.familienplaner.auth.mapper

import de.rohde.familienplaner.auth.dto.LoginResponseDto
import de.rohde.familienplaner.auth.dto.RegisterRequestDto
import de.rohde.familienplaner.auth.dto.RegisterResponseDto
import de.rohde.familienplaner.user.dto.CreateUserRequestDto
import de.rohde.familienplaner.user.dto.UserResponseDto

/**
 * Mapping zwischen Auth-DTOs und User-Domain-DTOs.
 */
object AuthMapper {

    fun toCreateUserRequest(request: RegisterRequestDto): CreateUserRequestDto =
        CreateUserRequestDto(
            username = request.username,
            password = request.password
        )

    fun toRegisterResponse(user: UserResponseDto): RegisterResponseDto =
        RegisterResponseDto(
            id = user.id,
            username = user.username,
            role = user.role,
            createdAt = user.createdAt,
            updatedAt = user.updatedAt
        )

    fun toLoginResponse(user: UserResponseDto, token: String): LoginResponseDto =
        LoginResponseDto(
            token = token,
            user = user
        )
}
