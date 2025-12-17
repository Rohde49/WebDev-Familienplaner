package de.rohde.familienplaner.user

import de.rohde.familienplaner.exception.InvalidCredentialsException
import de.rohde.familienplaner.exception.ResourceNotFoundException
import de.rohde.familienplaner.exception.UserAlreadyExistsException
import de.rohde.familienplaner.security.PasswordPolicy
import de.rohde.familienplaner.user.dto.*
import de.rohde.familienplaner.user.mapper.UserMapper
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * Business-Logik rund um Benutzer:
 * Registrierung, Login-Check, Laden, Profil-Updates und Passwortänderungen.
 */
@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    /**
     * Legt einen neuen User an (Role.USER).
     */
    @Transactional
    fun registerUser(request: CreateUserRequestDto): UserResponseDto {
        if (userRepository.existsByUsername(request.username)) {
            throw UserAlreadyExistsException("Username '${request.username}' wird bereits verwendet.")
        }

        // zentrale Passwort-Policy anwenden
        PasswordPolicy.validateNewPassword(request.password)

        val passwordHash = passwordEncoder.encode(request.password)
        val entity = UserMapper.toEntity(request, passwordHash)
        val saved = userRepository.save(entity)

        return UserMapper.toResponse(saved)
    }

    /**
     * Prüft Username + Passwort für den Login.
     * Wird vom AuthService genutzt.
     */
    @Transactional(readOnly = true)
    fun loginUser(username: String, rawPassword: String): UserResponseDto {
        val user = userRepository.findByUsername(username)
            ?: throw InvalidCredentialsException("Ungültiger Username oder Passwort.")

        val matches = passwordEncoder.matches(rawPassword, user.passwordHash)
        if (!matches) {
            throw InvalidCredentialsException("Ungültiger Username oder Passwort.")
        }

        return UserMapper.toResponse(user)
    }

    /**
     * Lädt einen User per ID.
     */
    @Transactional(readOnly = true)
    fun getUserById(id: Long): UserResponseDto {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User mit ID $id nicht gefunden.") }

        return UserMapper.toResponse(user)
    }

    /**
     * Lädt einen User per Username.
     */
    @Transactional(readOnly = true)
    fun getUserByUsername(username: String): UserResponseDto {
        val user = userRepository.findByUsername(username)
            ?: throw ResourceNotFoundException("User mit Username '$username' nicht gefunden.")

        return UserMapper.toResponse(user)
    }

    /**
     * Aktualisiert Profildaten eines Users.
     */
    @Transactional
    fun updateUserProfile(id: Long, update: UpdateUserProfileRequestDto): UserResponseDto {
        val existing = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User mit ID $id nicht gefunden.") }

        UserMapper.applyProfileUpdate(existing, update)
        existing.updatedAt = LocalDateTime.now()

        val saved = userRepository.save(existing)
        return UserMapper.toResponse(saved)
    }

    /**
     * Ändert das Passwort eines Benutzers.
     * Prüft:
     * - ob der User existiert
     * - ob das aktuelle Passwort korrekt ist
     * - ob das neue Passwort bestätigt wurde
     * - ob das neue Passwort die zentrale Passwort-Policy erfüllt
     */
    @Transactional
    fun changePassword(id: Long, request: ChangePasswordRequestDto): UserResponseDto {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User mit ID $id nicht gefunden.") }

        if (!passwordEncoder.matches(request.currentPassword, user.passwordHash)) {
            throw InvalidCredentialsException("Aktuelles Passwort ist falsch.")
        }

        if (request.newPassword != request.newPasswordConfirm) {
            throw InvalidCredentialsException("Die neuen Passwörter stimmen nicht überein.")
        }

        // zentrale Passwort-Policy anwenden (inkl. Vergleich mit aktuellem Passwort)
        PasswordPolicy.validateNewPassword(
            newPassword = request.newPassword,
            currentPassword = request.currentPassword
        )

        user.passwordHash = passwordEncoder.encode(request.newPassword)
        user.updatedAt = LocalDateTime.now()

        val saved = userRepository.save(user)
        return UserMapper.toResponse(saved)
    }
}
