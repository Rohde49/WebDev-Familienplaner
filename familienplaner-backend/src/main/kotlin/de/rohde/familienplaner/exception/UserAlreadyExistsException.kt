package de.rohde.familienplaner.exception

class UserAlreadyExistsException(
    override val message: String = "Der angegebene Benutzer existiert bereits."
) : RuntimeException(message)