package de.rohde.familienplaner.exception

/**
 * Wird geworfen, wenn ein Passwort nicht den
 * definierten Sicherheitsanforderungen entspricht.
 */
class WeakPasswordException(
    message: String
) : RuntimeException(message)
