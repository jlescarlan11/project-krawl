# Test Plan

## Overview

This document outlines the comprehensive test plan for the Krawl MVP application, covering unit tests, integration tests, E2E tests, accessibility testing, performance testing, and security testing.

## Test Scope

### Backend Testing
- **Unit Tests**: All API endpoints (controllers, services, repositories)
- **Integration Tests**: Critical user flows (authentication, gem creation, krawl creation)
- **Coverage Target**: >= 80% for business logic

### Frontend Testing
- **Unit Tests**: React components, hooks, utilities
- **Integration Tests**: Critical user flows (sign-in, gem creation, search)
- **Coverage Target**: >= 70% for components

### E2E Testing
- **Browser Tests**: Chrome, Firefox, Safari, Edge
- **Mobile Tests**: iOS Safari, Android Chrome
- **Key Flows**: Sign-in, gem creation, krawl creation, krawl mode, search, social features

### Accessibility Testing
- **WCAG 2.1 Level AA** compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast

### Performance Testing
- Page load time < 3 seconds
- API response < 500ms
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Lighthouse score > 90

### Security Testing
- Authentication/authorization
- Input validation
- SQL injection prevention
- XSS prevention
- CSRF protection

## Test Environment

### Backend
- Java 25
- Spring Boot 3.5.7
- PostgreSQL (test database)
- JUnit 5 + Mockito

### Frontend
- Next.js 16
- React 19
- Vitest + React Testing Library
- Playwright for E2E

## Test Execution

### Running Backend Tests
```bash
cd backend
mvn test
```

### Running Frontend Tests
```bash
cd frontend
npm test
```

### Running E2E Tests
```bash
cd e2e
npm test
```

## Test Data Management

- Use `TestDataFactory` for consistent test data
- Clean up test data after each test
- Use test database for integration tests
- Mock external services (Cloudinary, Brevo, Google OAuth)

## Coverage Reports

Coverage reports are generated automatically:
- Backend: `backend/target/site/jacoco/index.html`
- Frontend: `frontend/coverage/index.html`

## CI/CD Integration

- Unit tests run on every commit
- Integration tests run on PR
- E2E tests run on merge to main
- Coverage reports generated automatically

## Known Issues and Limitations

- Some E2E tests require manual authentication setup (TODO: implement auth mocking)
- Performance tests may vary based on system resources
- Accessibility tests require manual verification with screen readers




