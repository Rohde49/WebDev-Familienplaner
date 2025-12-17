package de.rohde.familienplaner.exception

import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.ConstraintViolationException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.time.LocalDateTime

/**
 * GlobalExceptionHandler
 * -----------------------
 * Fängt Exceptions im gesamten Backend zentral ab
 * und wandelt sie in ein einheitliches JSON-Fehlerformat (ApiErrorResponse) um.
 */
@ControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    // -------------------------------------------------------------------------
    // Hilfsfunktion: Baut eine einheitliche Fehler-Response
    // -------------------------------------------------------------------------
    private fun buildResponse(
        status: HttpStatus,
        message: String?,
        path: String?
    ): ResponseEntity<ApiErrorResponse> {
        val body = ApiErrorResponse(
            status = status.value(),
            error = status.reasonPhrase,
            message = message,
            path = path,
            timestamp = LocalDateTime.now()
        )
        return ResponseEntity.status(status).body(body)
    }

    // -------------------------------------------------------------------------
    // 1) Authentifizierung / Sicherheit
    // -------------------------------------------------------------------------

    /**
     * Fehlerhafte Credentials (z. B. ungültige Login-Daten).
     */
    @ExceptionHandler(InvalidCredentialsException::class)
    fun handleInvalidCredentials(
        ex: InvalidCredentialsException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        logger.warn("Invalid credentials for request [path={}]: {}", request.requestURI, ex.message)
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.message, request.requestURI)
    }

    // -------------------------------------------------------------------------
    // 2) Business- / Domain-Logik
    // -------------------------------------------------------------------------

    /**
     * Fachlicher Fehler (z. B. Username bereits vergeben).
     */
    @ExceptionHandler(UserAlreadyExistsException::class)
    fun handleUserAlreadyExists(
        ex: UserAlreadyExistsException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        logger.info("Business error for request [path={}]: {}", request.requestURI, ex.message)
        return buildResponse(HttpStatus.BAD_REQUEST, ex.message, request.requestURI)
    }

    // -------------------------------------------------------------------------
    // 3) Validierung
    // -------------------------------------------------------------------------

    /**
     * Bean Validation Fehler (z. B. @Valid DTOs schlagen fehl).
     */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        ex: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        val errors = ex.bindingResult
            .allErrors
            .mapNotNull { error ->
                if (error is FieldError) {
                    "${error.field}: ${error.defaultMessage}"
                } else {
                    error.defaultMessage
                }
            }
            .joinToString("; ")

        logger.info(
            "Validation error for request [path={}]: {}",
            request.requestURI,
            errors
        )

        return buildResponse(HttpStatus.BAD_REQUEST, errors, request.requestURI)
    }

    /**
     * Validierungsfehler außerhalb von DTOs
     * (z. B. manuelle Validierung auf Service-Ebene).
     */
    @ExceptionHandler(ConstraintViolationException::class)
    fun handleConstraintViolation(
        ex: ConstraintViolationException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        val errors = ex.constraintViolations
            .joinToString("; ") { violation ->
                "${violation.propertyPath}: ${violation.message}"
            }

        logger.info(
            "Constraint violation for request [path={}]: {}",
            request.requestURI,
            errors
        )

        return buildResponse(HttpStatus.BAD_REQUEST, errors, request.requestURI)
    }

    /**
     * Schwaches oder ungültiges Passwort gemäß zentraler Passwort-Policy.
     */
    @ExceptionHandler(WeakPasswordException::class)
    fun handleWeakPassword(
        ex: WeakPasswordException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        logger.info(
            "Weak password for request [path={}]: {}",
            request.requestURI,
            ex.message
        )
        return buildResponse(HttpStatus.BAD_REQUEST, ex.message, request.requestURI)
    }

    // -------------------------------------------------------------------------
    // 4) Ressourcen / Not Found
    // -------------------------------------------------------------------------

    /**
     * Ressource wurde nicht gefunden (z. B. User-ID existiert nicht).
     */
    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleResourceNotFound(
        ex: ResourceNotFoundException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        logger.info(
            "Resource not found for request [path={}]: {}",
            request.requestURI,
            ex.message
        )
        return buildResponse(HttpStatus.NOT_FOUND, ex.message, request.requestURI)
    }

    // -------------------------------------------------------------------------
    // 5) Fallback / allgemeine Fehler
    // -------------------------------------------------------------------------

    /**
     * Fallback für alles, was nicht explizit abgefangen wird.
     * Sollte so weit unten wie möglich stehen.
     */
    @ExceptionHandler(Exception::class)
    fun handleGenericException(
        ex: Exception,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        logger.error(
            "Unexpected error for request [path={}]: {}",
            request.requestURI,
            ex.message,
            ex
        )
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.message, request.requestURI)
    }
}
