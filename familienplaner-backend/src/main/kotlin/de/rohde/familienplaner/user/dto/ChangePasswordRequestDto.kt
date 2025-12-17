package de.rohde.familienplaner.user.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/**
 * Request-Daten zum Ändern des Passworts.
 *
 * Enthält:
 * - aktuelles Passwort
 * - neues Passwort
 * - Bestätigung des neuen Passworts
 */
data class ChangePasswordRequestDto(

    @field:NotBlank(message = "Aktuelles Passwort darf nicht leer sein.")
    val currentPassword: String,

    @field:NotBlank(message = "Neues Passwort darf nicht leer sein.")
    @field:Size(min = 6, max = 100, message = "Neues Passwort muss mindestens 6 Zeichen lang sein.")
    val newPassword: String,

    @field:NotBlank(message = "Bitte das neue Passwort bestätigen.")
    val newPasswordConfirm: String
)
