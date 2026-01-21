package de.rohde.familienplaner.auth

import de.rohde.familienplaner.auth.dto.LoginRequestDto
import de.rohde.familienplaner.auth.dto.LoginResponseDto
import de.rohde.familienplaner.auth.dto.RegisterRequestDto
import de.rohde.familienplaner.auth.dto.RegisterResponseDto
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*

/**
 * Endpunkte für Login und Registrierung.
 *
 * - POST /api/auth/register → neuen Account anlegen (Role.USER)
 * - POST /api/auth/login    → JWT-Login für bestehende User
 */
@Tag(
    name = "Auth",
    description = "Authentifizierung & Registrierung"
)
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @Operation(
        summary = "Benutzer registrieren",
        description = "Legt einen neuen Benutzeraccount mit der Rolle USER an"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Registrierung erfolgreich"),
            ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten"),
            ApiResponse(responseCode = "409", description = "Benutzername bereits vergeben")
        ]
    )
    @PostMapping("/register")
    fun register(
        @Valid @RequestBody request: RegisterRequestDto
    ): RegisterResponseDto =
        authService.register(request)



    @Operation(
        summary = "Benutzer anmelden",
        description = "Authentifiziert einen Benutzer und gibt ein JWT zurück"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Login erfolgreich"),
            ApiResponse(responseCode = "401", description = "Ungültige Zugangsdaten")
        ]
    )
    @PostMapping("/login")
    fun login(
        @Valid @RequestBody request: LoginRequestDto
    ): LoginResponseDto =
        authService.login(request)

}
