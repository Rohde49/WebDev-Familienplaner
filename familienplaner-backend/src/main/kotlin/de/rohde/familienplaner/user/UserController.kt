package de.rohde.familienplaner.user

import de.rohde.familienplaner.user.dto.ChangePasswordRequestDto
import de.rohde.familienplaner.user.dto.UpdateUserProfileRequestDto
import de.rohde.familienplaner.user.dto.UserResponseDto
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

/**
 * Endpunkte für Benutzerverwaltung.
 *
 * - GET /api/users/me
 * - POST /api/auth/register → (Role.USER)
 * - POST /api/auth/login    → JWT-Login für bestehende User
 * - PATCH /api/users/me/profile
 * - PATCH /api/users/me/password
 * - DELETE /api/users/me
 */
@Tag(
    name = "User",
    description = "Benutzerprofil & Account-Verwaltung"
)
@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @Operation(
        summary = "Aktuellen Benutzer abrufen",
        description = "Liefert die Profildaten des aktuell angemeldeten Benutzers"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Benutzerdaten erfolgreich geladen"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert")
        ]
    )
    @GetMapping("/me")
    fun getCurrentUser(
        @AuthenticationPrincipal principal: UserDetails
    ): UserResponseDto =
        userService.getUserByUsername(principal.username)



    @Operation(
        summary = "Profil aktualisieren",
        description = "Aktualisiert die Profildaten des aktuell angemeldeten Benutzers"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Profil erfolgreich aktualisiert"),
            ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert")
        ]
    )
    @PatchMapping("/me/profile")
    fun updateCurrentUserProfile(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody update: UpdateUserProfileRequestDto
    ): UserResponseDto {
        val currentUser = userService.getUserByUsername(principal.username)
        return userService.updateUserProfile(currentUser.id, update)
    }



    @Operation(
        summary = "Passwort ändern",
        description = "Ändert das Passwort des aktuell angemeldeten Benutzers"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Passwort erfolgreich geändert"),
            ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert")
        ]
    )
    @PatchMapping("/me/password")
    fun changeCurrentUserPassword(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody request: ChangePasswordRequestDto
    ): UserResponseDto {
        val currentUser = userService.getUserByUsername(principal.username)
        return userService.changePassword(currentUser.id, request)
    }



    @Operation(
        summary = "Benutzerkonto löschen",
        description = "Löscht den aktuell angemeldeten Benutzer vollständig"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Benutzer erfolgreich gelöscht"),
            ApiResponse(responseCode = "401", description = "Nicht authentifiziert")
        ]
    )
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCurrentUser(
        @AuthenticationPrincipal userDetails: UserDetails
    ) {
        userService.deleteByUsername(userDetails.username)
    }

    /* -----------------------------------------------------------------------
     * Deprecated Admin-nahe Endpoints
     * --------------------------------------------------------------------- */

    @Deprecated("stattdessen GET /api/users/me für den eigenen Benutzer.")
    @GetMapping("/{id}")
    fun getUserById(
        @PathVariable id: Long
    ): UserResponseDto =
        userService.getUserById(id)

    @Deprecated("stattdessen PATCH /api/users/me/profile für den eigenen Benutzer.")
    @PatchMapping("/{id}/profile")
    fun updateUserProfile(
        @PathVariable id: Long,
        @Valid @RequestBody update: UpdateUserProfileRequestDto
    ): UserResponseDto =
        userService.updateUserProfile(id, update)

    @Deprecated("stattdessen PATCH /api/users/me/password für den eigenen Benutzer.")
    @PatchMapping("/{id}/password")
    fun changePassword(
        @PathVariable id: Long,
        @Valid @RequestBody request: ChangePasswordRequestDto
    ): UserResponseDto =
        userService.changePassword(id, request)
}
