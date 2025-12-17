package de.rohde.familienplaner.auth.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/**
 * Daten für die Registrierung eines neuen Accounts.
 */
data class RegisterRequestDto(

    @field:NotBlank(message = "Username darf nicht leer sein.")
    @field:Size(min = 3, max = 50, message = "Username muss zwischen 3 und 50 Zeichen lang sein.")
    val username: String,

    @field:NotBlank(message = "Passwort darf nicht leer sein.")
    @field:Size(min = 6, message = "Passwort muss mindestens 6 Zeichen lang sein.")
    val password: String
)
