package de.rohde.familienplaner.user.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/**
 * Basisdaten zum Anlegen eines neuen Users in der User-Domain
 *
 * Wird vom Auth-Bereich in den UserService weitergereicht.
 */
data class CreateUserRequestDto(

    @field:NotBlank(message = "Username darf nicht leer sein.")
    @field:Size(min = 3, max = 50, message = "Username muss zwischen 3 und 50 Zeichen lang sein.")
    val username: String,

    @field:NotBlank(message = "Passwort darf nicht leer sein.")
    @field:Size(min = 6, max = 100, message = "Passwort muss mindestens 6 Zeichen lang sein.")
    val password: String
)
