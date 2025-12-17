package de.rohde.familienplaner

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

//http://localhost:8080/swagger-ui/index.html

@SpringBootApplication
class BackendApplication

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}
