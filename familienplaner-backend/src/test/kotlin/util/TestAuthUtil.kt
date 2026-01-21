package util

import de.rohde.familienplaner.role.Role
import de.rohde.familienplaner.security.JwtService
import de.rohde.familienplaner.user.UserEntity
import de.rohde.familienplaner.user.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder

class TestAuthUtil(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun createUserAndGetToken(
        username: String = "testuser_${System.nanoTime()}",
        role: Role = Role.USER
    ): String {
        val user = UserEntity(
            username = username,
            passwordHash = passwordEncoder.encode("password"),
            role = role
        )

        userRepository.save(user)
        return jwtService.generateToken(username, role)
    }
}
