package de.rohde.familienplaner.auth

import de.rohde.familienplaner.auth.dto.LoginRequestDto
import de.rohde.familienplaner.auth.dto.LoginResponseDto
import de.rohde.familienplaner.auth.dto.RegisterRequestDto
import de.rohde.familienplaner.auth.dto.RegisterResponseDto
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*

/**
 * REST-Endpunkte für Login und Registrierung.
 *
 * - POST /api/auth/register → neuen Account anlegen (Role.USER)
 * - POST /api/auth/login    → JWT-Login für bestehende User
 */
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    /**
     * Registriert einen neuen Benutzer-Account.
     */
    @PostMapping("/register")
    fun register(
        @Valid @RequestBody request: RegisterRequestDto
    ): RegisterResponseDto =
        authService.register(request)

    /**
     * Authentifiziert einen Benutzer und liefert ein JWT zurück.
     */
    @PostMapping("/login")
    fun login(
        @Valid @RequestBody request: LoginRequestDto
    ): LoginResponseDto =
        authService.login(request)

}
