# WebDev – Familienplaner 🗓️

Ein moderner Full-Stack-Familienplaner als Webanwendung.  
Das Projekt entsteht im Rahmen des Studiums (Web Engineering / Software Engineering) und dient als praxisnahes Beispiel für eine saubere Trennung von **Backend** und **Frontend** inklusive Authentifizierung, Benutzerverwaltung und moderner Toolchains.

---

## 🚀 Tech-Stack

### Backend
- **Kotlin**
- **Spring Boot 3**
- **Spring Security (JWT)**
- **JPA / Hibernate**
- **Gradle (KTS)**
- **Java 21**

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Axios**
- **CSS (modular & strukturiert)**

### Tooling & Standards
- Git & GitHub
- `.gitignore` & `.gitattributes`
- Einheitliche Line Endings (LF)
- Klare Projektstruktur (Monorepo)

---

## 📁 Projektstruktur

```text
WebDev/
├── familienplaner-backend/     # Spring Boot Backend
├── familienplaner-frontend/    # React + Vite Frontend
├── .gitignore                  # Globale Git-Ignoreregeln
├── .gitattributes              # Line-Ending- & Text-Regeln
└── README.md                   # Diese Datei
```

---

## ⚙️ Voraussetzungen

### Allgemein
- **Git**
- **Node.js (empfohlen: LTS)**
- **Java 21**

### Optional
- **IntelliJ IDEA (Ultimate)**
- **Git Bash (Windows)**

---

## ▶️ Backend starten

```bash
cd familienplaner-backend
./gradlew bootRun
```

Standardmäßig läuft das Backend unter:
```arduino
http://localhost:8080
```

---

## ▶️ Frontend starten
```bash
cd familienplaner-frontend
npm install
npm run dev
```

Frontend läuft anschließend unter:
```arduino
http://localhost:5173
```

---

## 🔐 Environment Variables (Frontend)

Lege im Ordner familienplaner-frontend/ eine .env an
(basierend auf .env.example):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```
⚠️ .env-Dateien werden nicht ins Repository committed.

---

## ✨ Features (aktueller Stand)

- **Benutzerregistrierung & Login**
- **JWT-basierte Authentifizierung**
- **Geschützte Routen (Frontend & Backend)**
- **Benutzerprofil**
- **Admin-Bereich (Grundstruktur)**
- **Saubere Fehlerbehandlung (Backend & Frontend)**

---

## 🧠 Ziel des Projekts

- **Anwendung moderner Web-Technologien**
- **Saubere Architektur & Projektstruktur**
- **Nachvollziehbare Git-Historie**
- **Vorbereitung auf Team- & Open-Source-Projekte**

---

## 📄 Lizenz

Dieses Projekt wird aktuell zu Studienzwecken entwickelt.

---

## 👤 Autor

- **Jeremy Rohde**
- **Informatikstudent – Hochschule Zittau/Görlitz**