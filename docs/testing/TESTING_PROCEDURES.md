# Testing Procedures

## How to Run Tests

### Backend Unit Tests

```bash
cd backend
mvn test
```

Run specific test class:
```bash
mvn test -Dtest=AuthControllerTest
```

Run with coverage:
```bash
mvn test jacoco:report
```

### Frontend Unit Tests

```bash
cd frontend
npm test
```

Run in watch mode:
```bash
npm run test:watch
```

Run with coverage:
```bash
npm run test:coverage
```

### Integration Tests

Backend integration tests:
```bash
cd backend
mvn test -Dtest=*IntegrationTest
```

Frontend integration tests:
```bash
cd frontend
npm test -- __tests__/integration
```

### E2E Tests

Setup:
```bash
cd e2e
npm install
npx playwright install
```

Run all E2E tests:
```bash
npm test
```

Run in UI mode:
```bash
npm run test:ui
```

Run specific browser:
```bash
npm run test:chromium
```

## Test Environment Setup

### Prerequisites

1. **Backend**:
   - Java 25 installed
   - PostgreSQL running (or use test database)
   - Maven installed

2. **Frontend**:
   - Node.js installed
   - npm installed

3. **E2E**:
   - Frontend dev server running (`cd frontend && npm run dev`)
   - Backend server running (`cd backend && mvn spring-boot:run`)

### Environment Variables

Create `.env.test` files for test-specific configuration:

**Backend** (`backend/.env.test`):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=krawl_test
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

**Frontend** (`frontend/.env.test`):
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Test Data Requirements

### Backend Test Data

- Test users created via `TestDataFactory`
- Test gems and krawls created in test database
- External services mocked (Google OAuth, Cloudinary, Brevo)

### Frontend Test Data

- Mock API responses using MSW (Mock Service Worker)
- Mock authentication state
- Mock browser APIs (geolocation, localStorage)

## Debugging Tests

### Backend

Run tests in debug mode:
```bash
mvn test -Dmaven.surefire.debug
```

### Frontend

Run tests in debug mode:
```bash
npm test -- --inspect-brk
```

### E2E

Run tests in debug mode:
```bash
npm run test:debug
```

Run in headed mode (see browser):
```bash
npm run test:headed
```

## Test Maintenance

### Adding New Tests

1. **Backend**: Create test class in `backend/src/test/java/com/krawl/`
2. **Frontend**: Create test file in `frontend/__tests__/`
3. **E2E**: Create test file in `e2e/tests/`

### Updating Tests

- Update tests when API contracts change
- Update tests when component props change
- Keep test data factories up to date

### Test Naming Conventions

- Backend: `*Test.java` for unit tests, `*IntegrationTest.java` for integration tests
- Frontend: `*.test.tsx` or `*.test.ts`
- E2E: `*.spec.ts`

## Troubleshooting

### Common Issues

1. **Tests failing due to database connection**:
   - Ensure PostgreSQL is running
   - Check database credentials in test configuration

2. **Tests failing due to port conflicts**:
   - Ensure dev servers are not running on test ports
   - Use different ports for test environment

3. **E2E tests timing out**:
   - Increase timeout in Playwright config
   - Check that dev servers are running

4. **Coverage not generating**:
   - Ensure test execution completes successfully
   - Check coverage tool configuration




