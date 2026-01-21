/**
 * Test starten
 * 1. Bash-Befehl ~ docker compose -f docker-compose.test.yml up -d ~
 * 2. Healthcheck ~ docker inspect --format='{{.State.Health.Status}}' familienplaner-postgres-test ~
 * 3. Test-Klasse starten
 * 4. Bash-Befehl ~ docker compose -f docker-compose.test.yml down ~
 * 5. Bash-Befehl ~ docker rm -f familienplaner-postgres-test ~
 */
package de.rohde.familienplaner

import de.rohde.familienplaner.recipe.RecipeRepository
import de.rohde.familienplaner.security.JwtService
import de.rohde.familienplaner.user.UserRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.*
import util.TestAuthUtil
import org.junit.jupiter.api.Assertions.*

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RecipeIntegrationTest(

    @Autowired val mockMvc: MockMvc,
    @Autowired val userRepository: UserRepository,
    @Autowired val recipeRepository: RecipeRepository,
    @Autowired val passwordEncoder: PasswordEncoder,
    @Autowired val jwtService: JwtService

) {

    private lateinit var jwt: String

    @BeforeEach
    fun setup() {
        recipeRepository.deleteAll()
        userRepository.deleteAll()

        val authUtil = TestAuthUtil(
            userRepository,
            passwordEncoder,
            jwtService
        )
        jwt = authUtil.createUserAndGetToken()
    }

    @Test
    fun `GET recipes returns 403 without jwt`() {
        mockMvc.get("/api/recipes")
            .andExpect {
                status { isForbidden() }
            }
    }

    @Test
    fun `GET recipes returns 200 with valid jwt`() {
        mockMvc.get("/api/recipes") {
            header("Authorization", "Bearer $jwt")
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    fun `POST recipes creates recipe and persists it`() {

        val json = """
            {
              "title": "Test-Rezept",
              "instruction": "Ein Rezept aus dem Integrationstest"
            }
        """.trimIndent()

        mockMvc.post("/api/recipes") {
            header("Authorization", "Bearer $jwt")
            contentType = MediaType.APPLICATION_JSON
            content = json
        }.andExpect {
            status { isCreated() }
        }

        val recipes = recipeRepository.findAll()
        assertEquals(1, recipes.size)
        assertEquals("Test-Rezept", recipes.first().title)
    }

    @Test
    fun `GET recipe by id returns recipe`() {

        val json = """
            {
              "title": "Einzel-Rezept",
              "instruction": "Detailansicht"
            }
        """.trimIndent()

        mockMvc.post("/api/recipes") {
            header("Authorization", "Bearer $jwt")
            contentType = MediaType.APPLICATION_JSON
            content = json
        }.andExpect {
            status { isCreated() }
        }

        val recipeId = recipeRepository.findAll().first().id!!

        mockMvc.get("/api/recipes/$recipeId") {
            header("Authorization", "Bearer $jwt")
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { value(recipeId) }
            jsonPath("$.title") { value("Einzel-Rezept") }
            jsonPath("$.owner") { isNotEmpty() }
        }
    }

    @Test
    fun `PATCH recipe updates title`() {

        val createJson = """
            {
              "title": "Original Titel",
              "instruction": "Patch-Test"
            }
        """.trimIndent()

        mockMvc.post("/api/recipes") {
            header("Authorization", "Bearer $jwt")
            contentType = MediaType.APPLICATION_JSON
            content = createJson
        }.andExpect {
            status { isCreated() }
        }

        val recipeId = recipeRepository.findAll().first().id!!

        val patchJson = """
            {
              "title": "Geänderter Titel"
            }
        """.trimIndent()

        mockMvc.patch("/api/recipes/$recipeId") {
            header("Authorization", "Bearer $jwt")
            contentType = MediaType.APPLICATION_JSON
            content = patchJson
        }.andExpect {
            status { isOk() }
            jsonPath("$.title") { value("Geänderter Titel") }
        }

        val updated = recipeRepository.findById(recipeId).get()
        assertEquals("Geänderter Titel", updated.title)
    }

    @Test
    fun `DELETE recipe removes it`() {

        val json = """
            {
              "title": "Delete-Rezept",
              "instruction": "Wird gelöscht"
            }
        """.trimIndent()

        mockMvc.post("/api/recipes") {
            header("Authorization", "Bearer $jwt")
            contentType = MediaType.APPLICATION_JSON
            content = json
        }.andExpect {
            status { isCreated() }
        }

        val recipeId = recipeRepository.findAll().first().id!!

        mockMvc.delete("/api/recipes/$recipeId") {
            header("Authorization", "Bearer $jwt")
        }.andExpect {
            status { isNoContent() }
        }

        assertTrue(recipeRepository.findById(recipeId).isEmpty)
    }
}
