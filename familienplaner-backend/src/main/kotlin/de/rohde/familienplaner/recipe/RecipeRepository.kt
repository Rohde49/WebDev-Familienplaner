package de.rohde.familienplaner.recipe

import de.rohde.familienplaner.role.RecipeTag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface RecipeRepository : JpaRepository<RecipeEntity, Long> {

    /**
     * Owner-Check: Existiert ein Rezept mit dieser ID und diesem Owner?
     */
    fun existsByIdAndOwner(id: Long, owner: String): Boolean

    /**
     * "Meine Rezepte" anzeigen
     */
    fun findAllByOwnerOrderByUpdatedAtDesc(owner: String): List<RecipeEntity>

    /**
     * Tag-Filter: Alle Rezepte, die mindestens eines der Tags haben.
     * DISTINCT ist wichtig, weil Join auf ElementCollection Duplikate erzeugen kann.
     */
    @Query(
        """
        select distinct r
        from RecipeEntity r
        join r.tags t
        where t in :tags
        order by r.updatedAt desc
        """
    )
    fun findAllByAnyTag(@Param("tags") tags: Set<RecipeTag>): List<RecipeEntity>
}
