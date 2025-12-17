package de.rohde.familienplaner.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

/**
 * Konfiguriert CORS für das Frontend (Vite: http://localhost:5173).
 *
 * Erlaubt:
 * - Cookies / Credentials (für Auth)
 * - alle HTTP-Methoden
 * - alle Header
 */
@Configuration
class CorsConfig {

    @Bean
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration().apply {
            allowCredentials = true
            addAllowedOrigin("http://localhost:5173")
            addAllowedHeader("*")
            addAllowedMethod("*")
        }

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)

        return CorsFilter(source)
    }
}
