# Developer Setup Guide

Welcome to the Krawl project! This guide will help you set up your development environment and get the application running locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Service Account Setup](#service-account-setup)
5. [Running the Application](#running-the-application)
6. [Running Tests](#running-tests)
7. [Code Style Guidelines](#code-style-guidelines)
8. [Git Workflow](#git-workflow)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following software installed:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 20.x LTS or higher | [nodejs.org](https://nodejs.org/) |
| **Java** | 25 LTS | [oracle.com/java](https://www.oracle.com/java/technologies/downloads/) |
| **Maven** | 3.9.x | [maven.apache.org](https://maven.apache.org/download.cgi) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | 17.x | [postgresql.org](https://www.postgresql.org/download/) (or use Aiven cloud) |

### Recommended IDE

- **IntelliJ IDEA** (Ultimate or Community) for backend
- **VS Code** with extensions for frontend:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Verify Installation

```bash
# Check Node.js
node --version  # Should show v20.x.x or higher

# Check npm
npm --version   # Should show 10.x.x or higher

# Check Java
java --version  # Should show Java 25

# Check Maven
mvn --version   # Should show Maven 3.9.x

# Check Git
git --version   # Should show git version 2.x.x
```

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/krawl.git
cd krawl
```

### 2. Set Up Frontend Environment

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 3. Configure Frontend Environment Variables

Edit `frontend/.env.local` with your configuration:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

### 4. Set Up Backend Environment

```bash
cd ../backend

# Copy environment template
cp .env.example .env
```

### 5. Configure Backend Environment Variables

Edit `backend/.env` with your configuration:

```env
# Database Configuration (Aiven PostgreSQL)
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=25060
DB_NAME=defaultdb
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_SSL_MODE=require

# JWT Configuration
JWT_SECRET=your-jwt-secret-at-least-32-characters-long
JWT_EXPIRATION_MS=3600000
REFRESH_TOKEN_EXPIRATION_MS=604800000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Brevo)
BREVO_API_KEY=your-brevo-api-key
EMAIL_FROM_ADDRESS=noreply@krawl.app
EMAIL_FROM_NAME=Krawl

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL 17.x** (if not already installed)

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE krawl_db;
   \q
   ```

3. **Enable PostGIS Extension**
   ```bash
   psql -U postgres -d krawl_db
   CREATE EXTENSION IF NOT EXISTS postgis;
   \q
   ```

4. **Update Backend .env**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=krawl_db
   DB_USERNAME=postgres
   DB_PASSWORD=your-password
   DB_SSL_MODE=disable
   ```

### Option 2: Aiven PostgreSQL (Recommended)

1. **Create Aiven Account** at [aiven.io](https://aiven.io/)

2. **Create PostgreSQL Service**
   - Select PostgreSQL 17.x
   - Choose free tier
   - Enable PostGIS extension

3. **Get Connection Details** from Aiven dashboard

4. **Update Backend .env** with Aiven credentials

### Run Database Migrations

Migrations run automatically when the backend starts, but you can run them manually:

```bash
cd backend
./mvnw flyway:migrate
```

---

## Service Account Setup

### 1. Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** to `.env` and `.env.local`

### 2. Mapbox

1. Create account at [mapbox.com](https://www.mapbox.com/)
2. Go to **Account** → **Access tokens**
3. Create a new token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
4. Copy token to `frontend/.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`

### 3. Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com/)
2. Go to **Dashboard**
3. Copy:
   - Cloud name
   - API Key
   - API Secret
4. Add to `backend/.env`

### 4. Brevo (Email Service)

1. Create account at [brevo.com](https://www.brevo.com/)
2. Go to **SMTP & API** → **API Keys**
3. Create new API key
4. Copy to `backend/.env` as `BREVO_API_KEY`

### 5. Sentry (Optional)

1. Create account at [sentry.io](https://sentry.io/)
2. Create new project (Next.js)
3. Copy DSN to `frontend/.env.local`

---

## Running the Application

### Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

**Verify Backend:**
- API Documentation: http://localhost:8080/swagger-ui.html
- Health Check: http://localhost:8080/actuator/health

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

### Run Both Concurrently (Optional)

Create a script or use tools like `concurrently`:

```bash
npm install -g concurrently
concurrently "cd backend && ./mvnw spring-boot:run" "cd frontend && npm run dev"
```

---

## Running Tests

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Backend Tests

```bash
cd backend

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthControllerTest

# Run specific test method
./mvnw test -Dtest=AuthControllerTest#testGoogleAuth

# Run tests with coverage
./mvnw test jacoco:report
```

---

## Code Style Guidelines

### Frontend (TypeScript/React)

- **ESLint**: Automatically enforces code style
- **Prettier**: Automatically formats code
- **File naming**: `camelCase.ts` or `PascalCase.tsx` for components
- **Component structure**:
  ```typescript
  // Imports
  import { useState } from 'react';

  // Types/Interfaces
  interface MyComponentProps {
    title: string;
  }

  // Component
  export function MyComponent({ title }: MyComponentProps) {
    // Hooks
    const [state, setState] = useState();

    // Event handlers
    const handleClick = () => {};

    // Render
    return <div>{title}</div>;
  }
  ```

### Backend (Java/Spring Boot)

- **Code Style**: Follow Spring Boot conventions
- **File naming**: `PascalCase.java`
- **Package structure**:
  ```
  com.krawl/
  ├── controller/  # REST endpoints
  ├── service/     # Business logic
  ├── repository/  # Data access
  ├── entity/      # Database models
  ├── dto/         # Data transfer objects
  └── config/      # Configuration classes
  ```

### Run Linters

```bash
# Frontend
cd frontend
npm run lint       # Check for issues
npm run lint:fix   # Auto-fix issues
npm run format     # Format with Prettier

# Backend
cd backend
./mvnw checkstyle:check  # Check code style
```

---

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation changes

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**
```
feat(auth): add Google OAuth sign-in

- Implement OAuth callback handler
- Add session management
- Update sign-in page UI

Closes #123
```

### Workflow Steps

1. **Create branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to remote**
   ```bash
   git push -u origin feature/my-feature
   ```

4. **Create Pull Request**
   - Go to GitHub
   - Create PR from your branch to `main`
   - Add description and reviewers

5. **Code Review**
   - Address review comments
   - Push additional commits if needed

6. **Merge**
   - Once approved, squash and merge to `main`

---

## Troubleshooting

### Frontend Issues

#### Port 3000 already in use
```bash
# Find and kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Backend Issues

#### Port 8080 already in use
```bash
# Find and kill process
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

#### Database connection errors
- Verify database credentials in `.env`
- Check database is running: `psql -U postgres -d krawl_db`
- Check network connectivity to Aiven (if using cloud)

#### Maven build errors
```bash
# Clean and rebuild
./mvnw clean install
```

#### Flyway migration errors
```bash
# Reset database (WARNING: deletes all data)
psql -U postgres -d krawl_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
./mvnw flyway:migrate
```

### General Issues

#### Environment variables not loading
- Verify `.env` and `.env.local` files exist
- Restart application after changing environment variables
- Check for typos in variable names

#### Tests failing
```bash
# Frontend: Clear test cache
npm test -- --clearCache

# Backend: Clean and test
./mvnw clean test
```

---

## Additional Resources

### Documentation
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Feature specifications
- [CLAUDE.md](../CLAUDE.md) - AI assistant guide
- [API Documentation](http://localhost:8080/swagger-ui.html) - Interactive API docs (when backend running)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [NextAuth.js Guide](https://next-auth.js.org/getting-started/introduction)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/17/index.html)

---

## Getting Help

- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/krawl/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/your-username/krawl/discussions)
- **Code Reviews**: Request reviews from team members on Pull Requests

---

## Next Steps

Once your development environment is set up:

1. **Read the codebase**: Start with `CLAUDE.md` for project structure
2. **Run the application**: Verify everything works locally
3. **Pick a task**: Check the project board for available tasks
4. **Make your first contribution**: Fix a bug or add a small feature
5. **Submit a Pull Request**: Get feedback from the team

Happy coding! 🚀
