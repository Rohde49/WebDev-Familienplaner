package de.rohde.familienplaner.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

/**
 * Filter, der bei jeder Anfrage das JWT aus dem Authorization-Header prüft
 * und bei gültigem Token den SecurityContext setzt.
 */
@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

    companion object {
        private const val AUTH_HEADER = "Authorization"
        private const val BEARER_PREFIX = "Bearer "
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader(AUTH_HEADER)

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            // kein Bearer-Token vorhanden → Anfrage ungeändert weiterreichen
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.substringAfter(BEARER_PREFIX).trim()
        val username = jwtService.extractUsername(token)

        // nur authentifizieren, wenn noch kein User im SecurityContext hinterlegt ist
        if (username != null && SecurityContextHolder.getContext().authentication == null) {
            val userDetails = userDetailsService.loadUserByUsername(username)

            if (jwtService.isTokenValid(token, userDetails.username)) {
                val authToken = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                ).apply {
                    details = WebAuthenticationDetailsSource().buildDetails(request)
                }

                SecurityContextHolder.getContext().authentication = authToken
            }
        }

        filterChain.doFilter(request, response)
    }
}
