package de.rohde.familienplaner.user

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Datenzugriff für UserEntity.
 *
 * Bietet Abfragen nach Username und Existenzprüfungen.
 */
@Repository
interface UserRepository : JpaRepository<UserEntity, Long> {

    fun findByUsername(username: String): UserEntity?

    fun existsByUsername(username: String): Boolean
}
