package de.rohde.familienplaner.config

import de.rohde.familienplaner.security.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

/**
 * Zentrale Sicherheitskonfiguration (JWT, Rollen, CORS).
 *
 * - stateless Security (kein Session-Tracking)
 * - Auth-Endpunkte offen, Rest nur mit JWT
 * - Admin-Endpunkte nur für ROLE_ADMIN
 * - Integration des JwtAuthenticationFilter in die Filterkette
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter
) {

    /**
     * Konfiguriert die Spring Security Filter Chain.
     */
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            // CSRF ist bei stateless JWT-APIs nicht nötig
            .csrf { it.disable() }

            // CORS-Konfiguration aus CorsConfig verwenden
            .cors { }

            // keine HTTP-Session, reines JWT-Auth-Modell
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }

            // Zugriffskontrolle für alle API-Endpunkte
            .authorizeHttpRequests { auth ->
                auth
                    // Auth-Endpunkte (Login, Register) sind öffentlich
                    .requestMatchers("/api/auth/**").permitAll()

                    // Admin-Endpunkte nur für ROLE_ADMIN
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")

                    // alle anderen Endpunkte erfordern einen gültigen JWT
                    .anyRequest().authenticated()
            }

            // klassische Login-Mechanismen deaktivieren
            .httpBasic { it.disable() }
            .formLogin { it.disable() }

            // JWT-Filter vor dem Standard-Authentifizierungsfilter registrieren
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    /**
     * PasswordEncoder zur sicheren Speicherung von Passwörtern.
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    /**
     * Stellt den AuthenticationManager bereit.
     */
    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager
}
