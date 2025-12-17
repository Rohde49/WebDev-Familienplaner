package de.rohde.familienplaner.exception

class InvalidCredentialsException(
    override val message: String = "Ungültige Zugangsdaten."
) : RuntimeException(message)
