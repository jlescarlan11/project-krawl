# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Krawl is a Progressive Web App (PWA) for discovering and sharing authentic Filipino cultural experiences in Cebu City. Users can discover "Gems" (cultural points of interest), follow "Krawls" (guided cultural trails), and contribute to the community-driven map. The application follows a microservices architecture with a Spring Boot backend and Next.js frontend.

## Tech Stack Summary

**Backend:**
- Java 25 LTS + Spring Boot 3.5.7 + Maven 3.9.x
- PostgreSQL with PostGIS (Aiven managed database)
- Flyway for database migrations
- Spring Security OAuth2 + JWT (JJWT 0.12.5)
- SpringDoc OpenAPI for API documentation

**Frontend:**
- Next.js 16.0.3 (App Router) + React 19.2.0 + TypeScript 5.x
- Tailwind CSS v4 (CSS-based configuration with `@theme` directive)
- NextAuth.js v5 (Auth.js) for OAuth2 authentication
- Zustand 5.x for state management
- Mapbox GL JS 3.x for maps
- Sentry for error monitoring
- Vitest for testing

## Development Commands

### Frontend (from `frontend/` directory)

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run dev:trace        # Start dev server with deprecation warnings

# Building & Production
npm run build            # Create production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm test                 # Run tests with Vitest
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate test coverage report
```

### Backend (from `backend/` directory)

```bash
# Development
./mvnw spring-boot:run   # Start backend server (http://localhost:8080)
# On Windows: mvnw.cmd spring-boot:run

# Building
./mvnw clean install     # Clean and build the project
./mvnw package           # Package the application

# Testing
./mvnw test              # Run all tests
./mvnw test -Dtest=ClassName  # Run a single test class
./mvnw test -Dtest=ClassName#methodName  # Run a single test method

# Database
# Flyway migrations run automatically on startup
./mvnw flyway:info       # Show migration status
./mvnw flyway:validate   # Validate migrations
```

### E2E Testing (from `e2e/` directory)

```bash
# Run E2E tests with Playwright
npm test                 # Run all E2E tests (auto-starts frontend & backend)
npm run test:ui          # Run tests with Playwright UI
npm run test:debug       # Run tests in debug mode
npm run test:headed      # Run tests with browser visible
npm run test:chromium    # Run tests only in Chromium
npm run test:firefox     # Run tests only in Firefox
npm run test:webkit      # Run tests only in WebKit (Safari)
npm run test:mobile      # Run tests on mobile emulators (iPhone 13, Pixel 5)
npm run report           # Show test report from last run
```

## Architecture

### Backend Architecture (Spring Boot)

**Package Structure:**
```
com.krawl/
├── config/              # Configuration classes (CORS, Security, OpenAPI, WebClient, Async)
├── constants/           # Constant values (GemCategory, Landing)
├── controller/          # REST API controllers
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs
│   └── response/        # Response DTOs
├── entity/              # JPA entities (database models)
├── exception/           # Custom exceptions and error handling
├── repository/          # Spring Data JPA repositories
├── security/            # Security filters and utilities (JWT)
└── service/             # Business logic layer
```

**Key Components:**

1. **Authentication Flow:**
   - Frontend obtains Google OAuth token via NextAuth.js
   - Frontend exchanges Google token for backend JWT via `/api/auth/google` endpoint
   - Backend validates Google token with Google's API
   - Backend returns JWT (access token) + refresh token
   - JWT stored in httpOnly cookies for security

2. **Database Migrations:**
   - Flyway handles schema changes automatically
   - Migration files: `backend/src/main/resources/db/migration/V{version}__{description}.sql`
   - Migrations run on application startup in sequential order
   - Never modify existing migration files; create new ones for changes

3. **API Documentation:**
   - Swagger UI available at: `http://localhost:8080/swagger-ui.html`
   - OpenAPI spec at: `http://localhost:8080/v3/api-docs`
   - Use Swagger annotations for documenting endpoints

### Frontend Architecture (Next.js)

**Directory Structure:**
```
frontend/
├── app/                    # Next.js App Router (pages and routing)
│   ├── globals.css         # Design tokens (Tailwind @theme)
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── map/                # Map view
│   ├── search/             # Search & discovery
│   ├── gems/               # Gem pages (detail, create)
│   ├── krawls/             # Krawl pages (detail, create, mode)
│   ├── users/              # User profile and settings
│   ├── auth/               # Authentication pages
│   ├── onboarding/         # Onboarding flow
│   └── offline/            # Offline downloads
├── components/             # React components
│   ├── ui/                 # Base UI components (button, input, card, etc.)
│   ├── navigation/         # Header, Footer, BottomNav, MobileMenu
│   ├── layout/             # Container, Section, PageLayout
│   ├── hero/               # Landing hero components
│   ├── landing/            # Landing page components
│   ├── auth/               # Authentication components
│   ├── map/                # Map-related components
│   ├── gems/               # Gem display components
│   ├── krawls/             # Krawl display components
│   ├── gem-creation/       # Gem creation workflow
│   ├── krawl-creation/     # Krawl creation workflow
│   ├── search/             # Search components
│   ├── onboarding/         # Onboarding components
│   └── shared/             # Shared utilities
├── lib/                    # Utility libraries
│   ├── auth.ts             # Auth utilities (token exchange)
│   ├── routes.ts           # Route constants and metadata
│   ├── route-utils.ts      # Route utility functions
│   ├── design-tokens.ts    # TypeScript design token exports
│   ├── breakpoints.ts      # Responsive breakpoint hooks
│   ├── utils.ts            # General utilities (cn helper)
│   ├── format.ts           # Formatting utilities
│   └── error-codes.ts      # Error code mappings
├── stores/                 # Zustand state management
│   ├── auth-store.ts       # Authentication state
│   ├── map-store.ts        # Map state
│   ├── ui-store.ts         # UI state (mobile menu, toast, etc.)
│   ├── gem-creation-store.ts    # Gem creation state
│   ├── krawl-creation-store.ts  # Krawl creation state
│   └── search-store.ts     # Search state
└── hooks/                  # Custom React hooks
```

**Key Frontend Patterns:**

1. **Authentication State:**
   - NextAuth.js handles OAuth flow and session management
   - Zustand `auth-store.ts` syncs with NextAuth session for global state
   - Token refresh handled automatically via `lib/token-refresh.ts`
   - Session expiration and multi-tab sync via `lib/session-utils.ts`

2. **Protected Routes:**
   - Route protection defined in `lib/routes.ts` via `requiresAuth` flag
   - `ProtectedRoute` component wraps protected pages
   - Redirects to sign-in with return URL preservation

3. **State Management:**
   - Use Zustand stores for global state (auth, map, UI, creation flows)
   - Stores use `persist` middleware for localStorage persistence
   - Each store has typed actions and selectors

4. **Design Tokens:**
   - CSS custom properties in `app/globals.css` using Tailwind v4 `@theme`
   - TypeScript exports in `lib/design-tokens.ts` for programmatic access
   - Breakpoints: mobile (<768px), tablet (768-1023px), desktop (≥1024px)

5. **API Communication:**
   - Fetch API with error handling via `lib/api-error-handler.ts`
   - JWT token automatically sent in httpOnly cookies
   - Backend API base URL: `process.env.NEXT_PUBLIC_API_URL` (default: http://localhost:8080)

6. **Offline-First Architecture (PWA):**
   - Service Worker registered at app startup (`public/sw.js`)
   - IndexedDB for offline data storage (14 utility files in `lib/offline/`)
   - Offline data schema: `lib/offline/schemas.ts` with versioned migrations
   - Downloadable krawls with map tiles for offline exploration
   - Background sync queue for changes made while offline
   - Auto-upload service syncs data when connectivity restored
   - Offline map fallback with cached Mapbox tiles

7. **Krawl Mode (Interactive Location Tracking):**
   - GPS-based location tracking during active krawl sessions
   - Geofencing to detect gem arrivals (30m radius)
   - Real-time progress updates stored in `krawl_progress` table
   - Location history recorded in `krawl_location_history` for route playback
   - Battery-aware tracking with configurable update intervals
   - Completion statistics and achievements

## Database Schema

The database uses PostgreSQL with PostGIS extension for geospatial features.

**Core Tables:**
- `users` - User accounts with Google OAuth integration
- `gems` - Points of interest (cultural locations)
- `gem_photos` - Photos for gems (Cloudinary integration)
- `gem_scores` - Community scores for gems
- `gem_drafts` - Draft gems before approval
- `krawls` - Guided trails connecting gems
- `krawl_gems` - Junction table for krawl stops with ordering
- `krawl_drafts` - Draft krawls before approval
- `krawl_ratings` - User ratings for krawls
- `krawl_sessions` - Active krawl mode sessions
- `krawl_progress` - User progress through krawls
- `krawl_location_history` - GPS tracking during krawl mode
- `gem_comments` - Comments on gems
- `krawl_comments` - Comments on krawls
- `reports` - User-submitted content reports for moderation
- `saved_krawls` - User-saved krawls for later
- `revoked_tokens` - JWT token revocation for sign-out

**Important Constraints:**
- Gems must have coordinates within Cebu City bounds
- Krawls must have 2-12 stops
- Photos stored in Cloudinary with `cloudinary_public_id`
- Geospatial queries use PostGIS `geography` type

## Key Architectural Patterns

### Next.js API Routes as Backend Proxy
- All frontend API calls go through Next.js API routes (`app/api/*/route.ts`)
- API routes forward requests to Spring Boot backend with JWT cookies
- This pattern solves CORS issues and centralizes auth token handling
- Never call Spring Boot backend directly from client-side code

### IndexedDB Offline Storage Schema
The offline system uses a structured IndexedDB schema with versioned migrations:
- **downloadedKrawls** - Full krawl data for offline access
- **syncQueue** - Pending changes to sync when online
- **drafts** - Locally created gems/krawls before upload
- **mapTiles** - Cached Mapbox tiles for offline maps
- **userSettings** - Offline-accessible user preferences

Migrations managed in `lib/offline/migrations.ts` - follow pattern when adding new stores.

### Multi-Tab Session Synchronization
- Session state synced across browser tabs via `BroadcastChannel`
- Implemented in `lib/session-utils.ts`
- Prevents auth state desync when user signs out in one tab
- Critical for PWA installability and multi-window usage

### Guest Mode System
- Unauthenticated users can browse and interact with limited features
- Guest-created content saved in localStorage until upgrade
- Upon sign-in, guest data migrated to authenticated user account
- See `lib/guest-mode.ts` and `hooks/useGuestMode.ts`

### Krawl Creation Multi-Step Form
- 3-step wizard: Basic Info → Gem Selection → Review
- State managed via Zustand store (`stores/krawl-creation-store.ts`)
- Drag-and-drop gem reordering with @dnd-kit
- Draft auto-save every 30 seconds
- Validates 2-12 gems minimum/maximum

### Gem Creation Multi-Step Form
- 5-step wizard: Basic Info → Location → Media → Additional Details → Preview
- State managed via Zustand store (`stores/gem-creation-store.ts`)
- Photos uploaded to Cloudinary with progress tracking
- Duplicate detection using coordinate proximity (100m radius)
- Draft auto-save with resume capability

## Common Development Tasks

### Adding a New API Endpoint

1. Create request/response DTOs in `backend/src/main/java/com/krawl/dto/`
2. Add controller method in appropriate controller with Swagger annotations
3. Implement service layer logic in `service/` package
4. Add repository method if database access needed
5. Test endpoint via Swagger UI at `http://localhost:8080/swagger-ui.html`

### Adding a Database Migration

1. Create new migration file: `backend/src/main/resources/db/migration/V{next_version}__{description}.sql`
2. Write SQL (CREATE/ALTER/INSERT statements)
3. Restart backend - Flyway runs migrations automatically
4. Verify migration: Check `flyway_schema_history` table

### Creating a New Frontend Component

1. Create component in appropriate `components/` subdirectory
2. Use TypeScript for props interface
3. Follow existing component patterns (use `cn()` for className merging)
4. Add to barrel export (`index.ts`) if reusable
5. Document component props and usage in JSDoc comments

### Adding a New Zustand Store

1. Create store file in `stores/` directory
2. Define state interface and actions
3. Use `create` from `zustand` and `persist` middleware if needed
4. Export typed hooks (don't use store directly in components)
5. Add to `stores/index.ts` barrel export

### Debugging Authentication Issues

1. Check browser console for error messages
2. Verify JWT token in browser cookies (DevTools → Application → Cookies)
3. Check backend logs for token validation errors
4. Use `/auth/debug` endpoint (if available) to inspect session
5. Verify environment variables: `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Environment Variables

**Frontend (.env.local):**
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
```

**Backend (.env):**
```bash
DB_HOST=<aiven-postgres-host>
DB_PORT=25060
DB_NAME=defaultdb
DB_USERNAME=<db-username>
DB_PASSWORD=<db-password>
DB_SSL_MODE=require
GOOGLE_CLIENT_ID=<your-google-client-id>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRATION_MS=3600000
REFRESH_TOKEN_EXPIRATION_MS=604800000
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
BREVO_API_KEY=<your-brevo-api-key>
```

## Testing Strategy

**Frontend Testing:**
- Unit tests: Vitest + Testing Library
- Component tests: Test user interactions and state changes
- Run tests before commits
- Aim for >80% coverage on critical paths (auth, creation flows)

**Backend Testing:**
- Unit tests: JUnit 5 + Mockito
- Integration tests: Test full request/response cycles
- Repository tests: Test database queries with test database
- Service tests: Mock repositories, test business logic

**E2E Testing:**
- Playwright with 6 browser configurations (Chrome, Firefox, Safari, Edge, iPhone 13, Pixel 5)
- Playwright auto-starts both frontend (port 3000) and backend (port 8080)
- Tests located in `e2e/tests/`
- Accessibility testing with @axe-core/playwright
- Global setup in `e2e/global-setup.ts` for fixtures and test data

## Common Pitfalls

1. **Authentication:**
   - Always check token expiration before API calls
   - Handle 401 responses by refreshing token or redirecting to sign-in
   - Never expose JWT secrets in frontend code

2. **Database:**
   - Never modify existing Flyway migrations
   - Always use parameterized queries to prevent SQL injection
   - Test geospatial queries with valid Cebu City coordinates

3. **Frontend State:**
   - Don't store sensitive data in Zustand persist stores
   - Clear auth store on sign-out
   - Handle loading and error states in all async operations

4. **API Integration:**
   - Always validate request DTOs with Spring Validation annotations
   - Return appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
   - Include error messages in response bodies

5. **File Uploads:**
   - Images uploaded to Cloudinary, store `cloudinary_public_id` in database
   - Validate file types and sizes on both frontend and backend
   - Handle upload failures gracefully with user feedback

6. **Offline/PWA:**
   - Service Worker updates require cache busting - increment version in `sw.js`
   - IndexedDB operations are asynchronous - always await or handle promises
   - Map tiles can consume significant storage - monitor quota usage
   - Background sync only works in HTTPS (localhost exception)
   - Test offline functionality with DevTools Network throttling

7. **Geospatial:**
   - Always validate coordinates are within Cebu City bounds before saving
   - PostGIS distance queries use meters (not degrees)
   - Geofencing radius for krawl mode: 30 meters
   - Use `ST_DWithin` for proximity queries (more efficient than `ST_Distance`)

## Project Documentation

Key documentation files:
- `README.md` - Project overview and setup
- `docs/PROJECT_BRIEF.md` - Project objectives and scope
- `docs/SCOPE_OF_WORK.md` - Detailed feature specifications
- `docs/TIMELINE_AND_MILESTONES.md` - Development schedule
- `docs/design/UI_UX_DESIGN_SYSTEM.md` - Design system and components
- `docs/GLOSSARY.md` - Project terminology
- `frontend/components/*/README.md` - Component-specific documentation
- `backend/LOCAL_DB_SETUP.md` - Local database setup guide
- `backend/START_BACKEND.md` - Backend startup guide

## Code Style Guidelines

**Backend (Java):**
- Use Lombok annotations to reduce boilerplate (`@Data`, `@Builder`, etc.)
- Follow Spring Boot conventions (controller → service → repository)
- Use constructor injection for dependencies
- Document public APIs with Swagger annotations

**Frontend (TypeScript/React):**
- Use functional components with hooks
- Destructure props in function signature
- Use `cn()` from `lib/utils.ts` for className merging
- Prefer server components unless interactivity needed
- Use `'use client'` directive only when necessary
- **Package patches:** If you need to patch a node_module, use `patch-package` (configured via postinstall hook). Patches stored in `frontend/patches/`

**General:**
- Write self-documenting code with clear variable names
- Keep functions small and focused (single responsibility)
- Handle errors explicitly (don't swallow exceptions)
- Write tests for complex business logic
