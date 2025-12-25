# E2E Tests

End-to-end tests for the Krawl application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in UI mode:
```bash
npm run test:ui
```

Run tests for specific browser:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

Run mobile tests:
```bash
npm run test:mobile
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

## Prerequisites

Before running tests, ensure:
1. Frontend dev server is running (`cd frontend && npm run dev`)
2. Backend server is running (`cd backend && mvn spring-boot:run`)
3. Test database is set up and migrations are applied

## Test Structure

- `tests/auth.spec.ts` - Authentication flows
- `tests/gem-creation.spec.ts` - Gem creation flows
- `tests/krawl-creation.spec.ts` - Krawl creation flows
- `tests/krawl-mode.spec.ts` - Krawl Mode flows
- `tests/search.spec.ts` - Search and discovery flows
- `tests/social-features.spec.ts` - Vouching, rating, commenting flows

## Configuration

Tests run against `http://localhost:3000` by default. Override with:
```bash
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 npm test
```




