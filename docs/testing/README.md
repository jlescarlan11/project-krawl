# Testing Documentation

This directory contains comprehensive testing documentation for the Krawl MVP application.

## Documentation Files

- **[TEST_PLAN.md](./TEST_PLAN.md)** - Overall test plan and strategy
- **[TEST_CASES.md](./TEST_CASES.md)** - Detailed test cases for all features
- **[TESTING_PROCEDURES.md](./TESTING_PROCEDURES.md)** - How to run and maintain tests
- **[BUG_TRACKING.md](./BUG_TRACKING.md)** - Bug tracking process and known issues
- **[CROSS_BROWSER_TESTING.md](./CROSS_BROWSER_TESTING.md)** - Cross-browser testing documentation
- **[MOBILE_TESTING.md](./MOBILE_TESTING.md)** - Mobile device testing documentation

## Quick Start

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd e2e
npm install
npx playwright install
npm test
```

## Test Coverage Goals

- **Backend**: >= 80% coverage for business logic
- **Frontend**: >= 70% coverage for components
- **E2E**: All critical user flows covered

## Test Types

1. **Unit Tests**: Individual components and functions
2. **Integration Tests**: Full request/response cycles
3. **E2E Tests**: Complete user workflows
4. **Accessibility Tests**: WCAG 2.1 AA compliance
5. **Performance Tests**: Load time and API performance
6. **Security Tests**: Authentication, authorization, input validation

## CI/CD Integration

Tests run automatically:
- Unit tests on every commit
- Integration tests on PR
- E2E tests on merge to main

## Getting Help

For questions or issues with testing:
1. Check [TESTING_PROCEDURES.md](./TESTING_PROCEDURES.md) for common issues
2. Review [BUG_TRACKING.md](./BUG_TRACKING.md) for known issues
3. Check test output and error messages




