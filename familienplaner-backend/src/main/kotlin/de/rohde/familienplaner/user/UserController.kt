package de.rohde.familienplaner.user

import de.rohde.familienplaner.user.dto.ChangePasswordRequestDto
import de.rohde.familienplaner.user.dto.UpdateUserProfileRequestDto
import de.rohde.familienplaner.user.dto.UserResponseDto
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

/**
 * Endpunkte für Benutzerverwaltung.
 */
@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    /**
     * Liefert Daten des aktuell angemeldeten Benutzers.
     * GET /api/users/me
     */
    @GetMapping("/me")
    fun getCurrentUser(
        @AuthenticationPrincipal principal: UserDetails
    ): UserResponseDto =
        userService.getUserByUsername(principal.username)

    /**
     * Aktualisiert Profildaten des aktuell angemeldeten Benutzers.
     * PATCH /api/users/me/profile
     */
    @PatchMapping("/me/profile")
    fun updateCurrentUserProfile(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody update: UpdateUserProfileRequestDto
    ): UserResponseDto {
        val currentUser = userService.getUserByUsername(principal.username)
        return userService.updateUserProfile(currentUser.id, update)
    }

    /**
     * Ändert das Passwort des aktuell angemeldeten Benutzers.
     * PATCH /api/users/me/password
     */
    @PatchMapping("/me/password")
    fun changeCurrentUserPassword(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody request: ChangePasswordRequestDto
    ): UserResponseDto {
        val currentUser = userService.getUserByUsername(principal.username)
        return userService.changePassword(currentUser.id, request)
    }

    /**
     * Liefert Benutzerdaten zu einer ID.
     *
     * Eher für Admin-Funktionalität
     * bringt erhöhtes Sicherheitsrisiko
     */
    @Deprecated("stattdessen GET /api/users/me für den eigenen Benutzer.")
    @GetMapping("/{id}")
    fun getUserById(
        @PathVariable id: Long
    ): UserResponseDto =
        userService.getUserById(id)

    /**
     * Aktualisiert Profildaten eines Benutzers per ID.
     *
     * Eher für Admin-Funktionalität
     */
    @Deprecated("stattdessen PATCH /api/users/me/profile für den eigenen Benutzer.")
    @PatchMapping("/{id}/profile")
    fun updateUserProfile(
        @PathVariable id: Long,
        @Valid @RequestBody update: UpdateUserProfileRequestDto
    ): UserResponseDto =
        userService.updateUserProfile(id, update)

    /**
     * Ändert das Passwort eines Benutzers per ID.
     *
     * Eher für Admin-Funktionalität
     */
    @Deprecated("stattdessen PATCH /api/users/me/password für den eigenen Benutzer.")
    @PatchMapping("/{id}/password")
    fun changePassword(
        @PathVariable id: Long,
        @Valid @RequestBody request: ChangePasswordRequestDto
    ): UserResponseDto =
        userService.changePassword(id, request)
}
