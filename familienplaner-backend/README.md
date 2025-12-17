# 🧩 Familienplaner – Backend

Backend-API für den Familienplaner, entwickelt mit **Spring Boot 3**, **Kotlin**, **JWT Security**, **rollenbasierter Autorisierung** und einer sauberen modularen Architektur.

Dieses Backend stellt REST-Endpunkte für Registrierung, Login, Profilverwaltung und Rollenmanagement bereit.

---

## 🚀 Features

- 🔐 **JWT-Authentifizierung** (Login & Register)
- 🛡️ **Rollen & Berechtigungen** (`USER`, `ADMIN`)
- 👤 **Benutzerverwaltung**
  - Registrieren
  - Login
  - Profil aktualisieren
- ⚙️ **Saubere Architektur**
  - Getrennte Pakete für Auth, Security, User, Config, Role und Exception-Handling
- 🌐 **CORS** für das Vite-Frontend (`http://localhost:5173`)
- 💾 **H2-Datenbank (Dev)** – Postgres-ready
- 🧱 **Globales Exception Handling** (saubere JSON-Fehlerstruktur)
- 🏗️ **Admin-Bereich vorbereitet** (Role-Management)

---

## 🛠️ Technologie-Stack

- **Kotlin 1.9**
- **Spring Boot 3.3**
- Spring Web
- Spring Security (JWT)
- Spring Data JPA
- H2 Database (Dev)
- Gradle (KTS)
- Jakarta Validation

---

## 📁 Projektstruktur

```text
src/main/kotlin/de/rohde/familienplaner/

├── FamilienplanerApplication.kt

├── config/
│   ├── CorsConfig.kt
│   └── SecurityConfig.kt

├── security/
│   ├── JwtService.kt
│   ├── JwtAuthenticationFilter.kt
│   └── CustomUserDetailsService.kt

├── auth/
│   ├── AuthController.kt
│   ├── AuthService.kt
│   ├── mapper/
│   │   └── AuthMapper.kt
│   └── dto/
│       ├── LoginRequestDto.kt
│       ├── LoginResponseDto.kt
│       ├── RegisterRequestDto.kt
│       └── RegisterResponseDto.kt

├── user/
│   ├── UserEntity.kt
│   ├── UserRepository.kt
│   ├── UserService.kt
│   ├── UserController.kt
│   ├── dto/
│   │   ├── CreateUserRequestDto.kt
│   │   ├── UpdateUserProfileRequestDto.kt
│   │   └── UserResponseDto.kt
│   └── mapper/
│       └── UserMapper.kt

├── role/
│   └── Role.kt

└── exception/
    ├── ApiErrorResponse.kt
    ├── GlobalExceptionHandler.kt
    ├── InvalidCredentialsException.kt
    ├── ResourceNotFoundException.kt
    └── UserAlreadyExistsException.kt
````

---

## ⚙️ Installation & Setup

### 1. Repository klonen

```bash
git clone <repo-url>
cd familienplaner-backend
```

### 2. Anwendung starten

```bash
./gradlew bootRun
```

Backend läuft dann unter:
👉 `http://localhost:8080`

---

## 📡 API Endpoints

### 🔑 Auth

```
POST /api/auth/login
POST /api/auth/register
```

### 👤 User

```
GET    /api/users/{id}
PATCH  /api/users/{id}/profile
```

### 🛡️ Admin (ROLE_ADMIN)

```
GET     /api/admin/users
PATCH   /api/admin/users/{id}/role
DELETE  /api/admin/users/{id}
```

---

## ❗ Fehlerbehandlung (Beispiel)

```json
{
  "timestamp": "...",
  "status": 400,
  "error": "UserAlreadyExistsException",
  "message": "Username 'test' wird bereits verwendet.",
  "path": "/api/auth/register"
}
```
