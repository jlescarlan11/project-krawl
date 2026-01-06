# 🗺️ Krawl - The Living Map of Filipino Culture

**A community-driven Progressive Web App (PWA) that maps authentic Filipino culture through user-curated points of interest ("Gems") and guided trails ("Krawls").**

---

## 📋 Project Overview

Krawl is a Progressive Web App designed to help users discover and share authentic Filipino cultural experiences, starting with Cebu City. The platform enables community members to:

- **Discover Gems** - Authentic cultural locations and experiences.
- **Follow Krawls** - Guided cultural trails connecting multiple Gems.
- **Share Culture** - Create and contribute to the living map of Filipino culture.
- **Explore Offline** - Download Krawls for offline exploration with integrated map tiles.
- **Krawl Mode** - Location-aware, interactive guided experience.

### Current Status
- **Date:** January 6, 2026
- **Phase:** Core Development & Community Features (Week 8+)
- **Status:** Active development. Authentication, SEO, UI Component Library, Landing Page, and Gem Creation are implemented. Krawl Mode and Offline features are in progress.

---

## 🛠️ Technology Stack

### Backend
- **Language:** Java 25 LTS
- **Framework:** Spring Boot 3.5.7
- **Database:** PostgreSQL with PostGIS (Aiven/Local)
- **Migration:** Flyway
- **Security:** Spring Security OAuth2 + JWT (JJWT)
- **Documentation:** SpringDoc OpenAPI (Swagger)
- **Email/SMS:** Brevo

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **Language:** TypeScript 5.x
- **React:** React 19.2.0
- **Styling:** Tailwind CSS v4 (CSS-based configuration)
- **State Management:** Zustand 5.x
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Maps:** Mapbox GL JS 3.x
- **Monitoring:** Sentry

### Testing
- **Frontend:** Vitest + Testing Library
- **Backend:** JUnit 5 + Mockito
- **E2E:** Playwright (6 browser configurations)

---

## 🏗️ Project Structure

```
project-krawl/
├── backend/                # Spring Boot REST API
│   ├── src/main/java       # Java source code
│   ├── src/main/resources  # Configuration & Flyway migrations
│   └── scripts/            # Database and refactoring scripts
├── frontend/               # Next.js Application
│   ├── app/                # App Router pages and layouts
│   ├── components/         # UI Component Library
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API clients
│   └── stores/             # Zustand state management
├── e2e/                    # Playwright E2E tests
└── docs/                   # Comprehensive project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 20.x or 22.x LTS
- **Java:** 25 LTS
- **Maven:** 3.9.x
- **PostgreSQL:** 15+ (with PostGIS extension)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-krawl
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file based on `env-example`.
3. Start the backend using the recommended script (Windows):
   ```powershell
   .\start-backend.ps1
   ```
   *Note: This script loads environment variables and runs `mvn spring-boot:run`.*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `env-example`.
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at [http://localhost:3000](http://localhost:3000).*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`: Database connection details.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: OAuth2 credentials.
- `JWT_SECRET`: Secret for signing JWT tokens.
- `CLOUDINARY_URL`, `BREVO_API_KEY`: Third-party service credentials.

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8080`).
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`: NextAuth.js configuration.
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox API token.
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry error tracking DSN.

---

## 🧪 Running Tests

### Frontend
```bash
cd frontend
npm test                 # Run Vitest tests
npm run test:coverage    # Check coverage
```

### Backend
```bash
cd backend
mvn test                 # Run JUnit tests
```

### E2E (Root)
```bash
cd e2e
npm test                 # Run Playwright tests
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` and `frontend/docs/` directories:

- **[Architecture & Design](./docs/SYSTEM_DESIGN.md)** - System architecture and data flow.
- **[API Documentation](http://localhost:8080/swagger-ui.html)** - Available when backend is running.
- **[UI/UX Design System](./docs/design/UI_UX_DESIGN_SYSTEM.md)** - Design principles and components.
- **[Offline-First Guide](./frontend/docs/PWA_TEST_PLAN.md)** - PWA and offline implementation details.
- **[SEO Strategy](./docs/private-docs/tasks/TASK-038_SEO_IMPLEMENTATION_PLAN.md)** - Search engine optimization roadmap.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (to be added).

## 📞 Contact
Project Team: Solo Developer – `hello@krawl.app`
Last Updated: January 6, 2026