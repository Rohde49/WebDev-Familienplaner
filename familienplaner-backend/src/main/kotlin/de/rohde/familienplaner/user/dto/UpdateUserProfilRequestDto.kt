package de.rohde.familienplaner.user.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size

/**
 * Profildaten, die ein User ändern kann.
 *
 * Alle Felder sind optional – nur gesetzte Werte werden aktualisiert.
 */
data class UpdateUserProfileRequestDto(

    @field:Email(message = "Bitte eine gültige E-Mail-Adresse angeben.")
    val email: String? = null,

    @field:Size(max = 50, message = "Vorname darf maximal 50 Zeichen lang sein.")
    val firstName: String? = null,

    @field:Size(max = 50, message = "Nachname darf maximal 50 Zeichen lang sein.")
    val lastName: String? = null,

    @field:Min(value = 1, message = "Alter muss mindestens 1 Jahr sein.")
    @field:Max(value = 120, message = "Alter darf maximal 120 Jahre sein.")
    val age: Int? = null
)
