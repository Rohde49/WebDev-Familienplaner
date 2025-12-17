package de.rohde.familienplaner.security

import de.rohde.familienplaner.user.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/**
 * Lädt Benutzer für Spring Security und wandelt Role in Authorities um.
 */
@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User '$username' nicht gefunden.")

        val authorities = listOf(
            SimpleGrantedAuthority("ROLE_${user.role.name}")
        )

        return User(
            user.username,
            user.passwordHash,
            authorities
        )
    }
}
