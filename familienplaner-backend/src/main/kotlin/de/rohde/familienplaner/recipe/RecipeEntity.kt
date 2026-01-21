package de.rohde.familienplaner.recipe

import de.rohde.familienplaner.role.RecipeTag
import de.rohde.familienplaner.user.UserEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "recipe")
class RecipeEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    // --- Pflichtfelder ---
    @Column(name = "title", nullable = false, length = 120)
    var title: String,

    @Column(name = "owner", nullable = false, length = 64, updatable = false)
    val owner: String,

    // --- Relation zu UserEntity ---
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    var user: UserEntity,

    // --- Optionale / erweiterbare Felder ---
    @ElementCollection
    @CollectionTable(
        name = "recipe_ingredients",
        joinColumns = [JoinColumn(name = "recipe_id")]
    )
    @Column(name = "ingredient", nullable = false, length = 255)
    var ingredients: MutableList<String> = mutableListOf(),

    @Column(name = "instruction", columnDefinition = "text", nullable = false)
    var instruction: String = "",

    @ElementCollection(targetClass = RecipeTag::class)
    @CollectionTable(
        name = "recipe_tags",
        joinColumns = [JoinColumn(name = "recipe_id")]
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "tag", nullable = false, length = 32)
    var tags: MutableSet<RecipeTag> = mutableSetOf(),

    // --- Timestamps ---
    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {

    @PrePersist
    fun prePersist() {
        val now = LocalDateTime.now()
        updatedAt = now
    }

    @PreUpdate
    fun preUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
