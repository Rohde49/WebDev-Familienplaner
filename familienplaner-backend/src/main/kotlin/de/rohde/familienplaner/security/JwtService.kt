package de.rohde.familienplaner.security

import de.rohde.familienplaner.role.Role
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date

/**
 * Service zum Erzeugen und Validieren von JWT-Tokens.
 *
 * Nutzt:
 * - `security.jwt.secret` als HMAC-Schlüssel
 * - `security.jwt.expiration-minutes` für die Gültigkeitsdauer
 *
 * Aktuell wird nur der Username (subject) und Rolle (claim) abgelegt.
 */
@Service
class JwtService(

    @Value("\${security.jwt.secret}")
    private val jwtSecret: String,

    @Value("\${security.jwt.expiration-minutes}")
    private val expirationMinutes: Long
) {

    private fun getSigningKey() =
        Keys.hmacShaKeyFor(jwtSecret.toByteArray(StandardCharsets.UTF_8))

    /**
     * Erzeugt ein neues JWT für den gegebenen Username und die Rolle.
     */
    fun generateToken(username: String, role: Role): String {
        val now = Instant.now()
        val expiry = now.plus(expirationMinutes, ChronoUnit.MINUTES)

        return Jwts.builder()
            .subject(username)
            .claim("role", role.name) // z. B. "USER" oder "ADMIN"
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(getSigningKey())
            .compact()
    }

    /**
     * Liest den Username (Subject) aus dem Token.
     *
     * @return Username oder null bei ungültigem Token.
     */
    fun extractUsername(token: String): String? =
        try {
            parseClaims(token).subject
        } catch (_: Exception) {
            null
        }

    /**
     * Prüft, ob das Token zu einem Username passt und noch gültig ist.
     */
    fun isTokenValid(token: String, username: String): Boolean {
        val extracted = extractUsername(token)
        return extracted != null && extracted == username && !isTokenExpired(token)
    }

    private fun isTokenExpired(token: String): Boolean =
        try {
            val claims = parseClaims(token)
            claims.expiration.before(Date())
        } catch (_: Exception) {
            true
        }

    private fun parseClaims(token: String) =
        Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .payload
}
