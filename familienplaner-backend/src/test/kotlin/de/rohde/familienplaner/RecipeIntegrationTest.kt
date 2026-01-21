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
        // Sicherstellen, dass jeder Test mit leerer DB startet
        recipeRepository.deleteAll()
        userRepository.deleteAll()

        // Test-User anlegen und gültiges JWT erzeugen
        val authUtil = TestAuthUtil(
            userRepository,
            passwordEncoder,
            jwtService
        )
        jwt = authUtil.createUserAndGetToken()
    }

    // Testet, dass der RecipeController den Zugriff ohne JWT verweigert (Security-Check)
    @Test
    fun `GET recipes returns 403 without jwt`() {
        mockMvc.get("/api/recipes")
            .andExpect {
                status { isForbidden() }
            }
    }

    // Testet, dass der RecipeController bei gültigem JWT eine erfolgreiche Antwort liefert
    @Test
    fun `GET recipes returns 200 with valid jwt`() {
        mockMvc.get("/api/recipes") {
            header("Authorization", "Bearer $jwt")
        }.andExpect {
            status { isOk() }
        }
    }

    // Testet das Anlegen eines Rezepts über den Controller (POST) inkl. Persistenz
    @Test
    fun `POST recipes creates recipe and persists it`() {

        val json = """
            {
              "title": "Test-Rezept",
              "description": "Ein Rezept aus dem Integrationstest"
            }
        """.trimIndent()

        mockMvc.post("/api/recipes") {
            header("Authorization", "Bearer $jwt")
            contentType = MediaType.APPLICATION_JSON
            content = json
        }.andExpect {
            status { isCreated() }
        }

        // Prüft, ob das Rezept wirklich in der Datenbank gespeichert wurde
        val recipes = recipeRepository.findAll()
        assertEquals(1, recipes.size)
        assertEquals("Test-Rezept", recipes.first().title)
    }

    // Testet das Abrufen eines einzelnen Rezepts über den Controller (GET by ID)
    @Test
    fun `GET recipe by id returns recipe`() {

        // Arrange: Rezept anlegen
        val json = """
            {
              "title": "Einzel-Rezept",
              "description": "Detailansicht"
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

        // Act + Assert: Rezept über Controller abrufen
        mockMvc.get("/api/recipes/$recipeId") {
            header("Authorization", "Bearer $jwt")
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { value(recipeId) }
            jsonPath("$.title") { value("Einzel-Rezept") }
            jsonPath("$.owner") { isNotEmpty() }
        }
    }

    // Testet das partielle Aktualisieren eines Rezepts über den Controller (PATCH)
    @Test
    fun `PATCH recipe updates title`() {

        val createJson = """
            {
              "title": "Original Titel",
              "description": "Patch-Test"
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

        // Prüft, ob die Änderung in der Datenbank angekommen ist
        val updated = recipeRepository.findById(recipeId).get()
        assertEquals("Geänderter Titel", updated.title)
    }

    // Testet das Löschen eines Rezepts über den Controller (DELETE)
    @Test
    fun `DELETE recipe removes it`() {

        val json = """
            {
              "title": "Delete-Rezept",
              "description": "Wird gelöscht"
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

        // Prüft, ob das Rezept wirklich aus der Datenbank entfernt wurde
        assertTrue(recipeRepository.findById(recipeId).isEmpty)
    }
}
