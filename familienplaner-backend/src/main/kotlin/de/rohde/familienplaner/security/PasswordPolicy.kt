package de.rohde.familienplaner.security

import de.rohde.familienplaner.exception.WeakPasswordException

/**
 * Zentrale Passwort-Policy.
 */
object PasswordPolicy {

    /**
     * Prüft ein neues Passwort anhand definierter Mindestanforderungen.
     *
     * @param newPassword  das neu gewünschte Passwort
     * @param currentPassword optional – falls gesetzt, wird geprüft,
     *                        dass das neue Passwort nicht identisch ist
     *
     * @throws WeakPasswordException bei Verstößen gegen die Policy
     */
    fun validateNewPassword(newPassword: String, currentPassword: String? = null) {

        // Mindestlänge
        if (newPassword.length < 6) {
            throw WeakPasswordException("Passwort muss mindestens 6 Zeichen lang sein.")
        }

        // Großbuchstabe
        if (!newPassword.any { it.isUpperCase() }) {
            throw WeakPasswordException("Passwort muss mindestens einen Großbuchstaben enthalten.")
        }

        // Kleinbuchstabe
        if (!newPassword.any { it.isLowerCase() }) {
            throw WeakPasswordException("Passwort muss mindestens einen Kleinbuchstaben enthalten.")
        }

        // Zahl
        if (!newPassword.any { it.isDigit() }) {
            throw WeakPasswordException("Passwort muss mindestens eine Zahl enthalten.")
        }

//        // Sonderzeichen (optional – aber empfehlenswert)
//        val specialChars = "!§$%&/()=?*+#-_.:,;<>|@"
//        if (!newPassword.any { it in specialChars }) {
//            throw WeakPasswordException("Passwort muss mindestens ein Sonderzeichen enthalten.")
//        }

        // Verhindert versehentlich führende oder abschließende Leerzeichen
        if (newPassword != newPassword.trim()) {
            throw WeakPasswordException("Passwort darf nicht mit Leerzeichen beginnen oder enden.")
        }

        // Nicht identisch mit bisherigem Passwort (nur bei Passwort-Änderung relevant)
        if (currentPassword != null && newPassword == currentPassword) {
            throw WeakPasswordException("Neues Passwort darf nicht mit dem alten Passwort identisch sein.")
        }
    }
}
