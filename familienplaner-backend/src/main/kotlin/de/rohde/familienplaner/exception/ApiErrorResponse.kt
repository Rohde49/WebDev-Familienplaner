package de.rohde.familienplaner.exception

import java.time.LocalDateTime

data class ApiErrorResponse(
    val status: Int,
    val error: String,
    val message: String?,
    val path: String?,
    val timestamp: LocalDateTime = LocalDateTime.now()
)
