package de.rohde.familienplaner.user

import de.rohde.familienplaner.role.Role
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Persistierter Benutzer der Anwendung.
 *
 * Enthält Login-Daten, Rolle, optionale Profildaten
 * sowie Audit-Felder (createdAt, updatedAt).
 */
@Entity
@Table(name = "users")
class UserEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    // --- Login-Daten ---
    @Column(name = "username", nullable = false, unique = true)
    val username: String,

    @Column(name = "password_hash", nullable = false)
    var passwordHash: String,

    // --- Berechtigungen ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: Role = Role.USER,

    // --- Profile ---
    @Column(name = "email")
    var email: String? = null,

    @Column(name = "first_name")
    var firstName: String? = null,

    @Column(name = "last_name")
    var lastName: String? = null,

    @Column(name = "age")
    var age: Int? = null,

    // --- Timestamps ---
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
