package de.rohde.familienplaner.auth.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/**
 * Login-Daten (Username + Passwort).
 */
data class LoginRequestDto(

    @field:NotBlank(message = "Username darf nicht leer sein.")
    val username: String,

    @field:NotBlank(message = "Passwort darf nicht leer sein.")
    @field:Size(min = 6, max = 100, message = "Passwort muss mindestens 6 Zeichen lang sein.")
    val password: String
)
