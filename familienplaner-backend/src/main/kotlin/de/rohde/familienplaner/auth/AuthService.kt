package de.rohde.familienplaner.auth

import de.rohde.familienplaner.auth.dto.LoginRequestDto
import de.rohde.familienplaner.auth.dto.LoginResponseDto
import de.rohde.familienplaner.auth.dto.RegisterRequestDto
import de.rohde.familienplaner.auth.dto.RegisterResponseDto
import de.rohde.familienplaner.auth.mapper.AuthMapper
import de.rohde.familienplaner.security.JwtService
import de.rohde.familienplaner.user.UserService
import de.rohde.familienplaner.user.dto.UserResponseDto
import org.springframework.stereotype.Service

/**
 * Kapselt Login- und Registrierungslogik.
 */
@Service
class AuthService(
    private val userService: UserService,
    private val jwtService: JwtService
) {

    /**
     * Führt den Login durch und gibt ein JWT + Userdaten zurück.
     */
    fun login(request: LoginRequestDto): LoginResponseDto {
        val user: UserResponseDto = userService.loginUser(request.username, request.password)
        val token = jwtService.generateToken(user.username, user.role)

        return AuthMapper.toLoginResponse(user, token)
    }

    /**
     * Registriert einen neuen Benutzer über den UserService.
     */
    fun register(request: RegisterRequestDto): RegisterResponseDto {
        val createdUser = userService.registerUser(
            AuthMapper.toCreateUserRequest(request)
        )

        return AuthMapper.toRegisterResponse(createdUser)
    }
}
