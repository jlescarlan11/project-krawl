# TASK-037: Review Report - Configure Basic Error Logging

**Task ID:** TASK-037  
**Review Date:** 2025-01-27  
**Reviewer:** Senior Software Engineer  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## Executive Summary

TASK-037 aims to establish comprehensive error logging and error handling patterns throughout the Krawl application. The task builds upon the completed Sentry integration (TASK-036) and requires creating a centralized error logging utility, establishing error handling patterns, and implementing consistent error messaging.

**Assessment:** ✅ **READY FOR IMPLEMENTATION**  
- All dependencies are completed
- Sentry infrastructure is in place
- Clear acceptance criteria defined
- No blockers identified

---

## 1. Task Overview

### Task Description

Set up basic error logging and error handling throughout the application to catch and log errors appropriately.

### Objectives

1. Create a centralized error logging utility that:
   - Logs to console in development
   - Sends to Sentry in production
   - Includes error context and user context

2. Establish error handling patterns for:
   - Try-catch blocks
   - Error boundaries
   - API error handling
   - Form validation error handling

3. Implement consistent error messaging:
   - User-friendly messages
   - Technical details for debugging
   - Error codes (if applicable)

4. Support multiple logging levels:
   - Error (critical)
   - Warning (non-critical)
   - Info (informational)
   - Debug (development only)

### Priority & Effort

- **Priority:** Medium
- **Estimated Effort:** 0.5 days
- **Epic:** epic:design-system

---

## 2. Acceptance Criteria Analysis

### ✅ Error Logging Utility

**Required Features:**
- [ ] Log errors to console (development)
- [ ] Send errors to Sentry (production)
- [ ] Include error context
- [ ] Include user context (if available)

**Current State:**
- ✅ Sentry SDK installed and configured (`@sentry/nextjs@10.26.0`)
- ✅ Sentry client/server/edge configs exist
- ✅ User context tracking implemented (`lib/sentry/user-context.ts`)
- ✅ Error filtering and sanitization implemented (`lib/sentry/error-filtering.ts`)
- ❌ **Missing:** Centralized error logging utility function

**Gap Analysis:**
- Need to create `lib/error-logging.ts` or `lib/logger.ts` with:
  - `logError()` - Critical errors
  - `logWarning()` - Non-critical issues
  - `logInfo()` - Informational messages
  - `logDebug()` - Development-only messages
  - Environment-aware (console in dev, Sentry in prod)
  - Context enrichment (user, tags, extra data)

### ✅ Error Handling Patterns

**Required Patterns:**
- [ ] Try-catch blocks
- [ ] Error boundaries
- [ ] API error handling
- [ ] Form validation error handling

**Current State:**
- ✅ Error boundaries exist:
  - `SentryErrorBoundary` component (`components/system/SentryErrorBoundary.tsx`)
  - `global-error.tsx` for root-level errors
- ✅ Error display component exists (`components/ui/error-display.tsx`)
- ❌ **Missing:** API error handling utilities
- ❌ **Missing:** Form validation error handling patterns
- ❌ **Missing:** Standardized try-catch patterns

**Gap Analysis:**
- Need to create:
  - API error handler utility (parse HTTP errors, extract error codes/messages)
  - Form validation error handler (extract field-level errors)
  - Error handling wrapper utilities (safe async functions, error recovery)

### ✅ Error Messages

**Required Features:**
- [ ] User-friendly error messages
- [ ] Technical error details (for debugging)
- [ ] Error codes (if applicable)

**Current State:**
- ✅ ErrorDisplay component supports user-friendly messages
- ❌ **Missing:** Error message formatting utilities
- ❌ **Missing:** Error code system
- ❌ **Missing:** Error message mapping (technical → user-friendly)

**Gap Analysis:**
- Need to create:
  - Error message formatter
  - Error code constants/enum
  - Error message mapping utility

### ✅ Error Logging Levels

**Required Levels:**
- [ ] Error (critical errors)
- [ ] Warning (non-critical issues)
- [ ] Info (informational)
- [ ] Debug (development only)

**Current State:**
- ✅ Sentry supports severity levels
- ❌ **Missing:** Logging level utility functions
- ❌ **Missing:** Logging level configuration

**Gap Analysis:**
- Need to implement logging level functions that:
  - Map to Sentry severity levels
  - Filter by environment (debug only in dev)
  - Support console output with appropriate methods

---

## 3. Dependencies Status

### Required Dependencies

| Dependency | Task ID | Status | Verification |
|------------|---------|--------|--------------|
| Next.js 16.0.3 Setup | TASK-031 | ✅ **COMPLETED** | Next.js project initialized, TypeScript configured |
| Sentry Monitoring Setup | TASK-036 | ✅ **COMPLETED** | Sentry SDK installed, configs created, error boundaries implemented |

**Dependency Verification:**

#### ✅ TASK-031 Completed
- **Location:** `frontend/` directory
- **Implementation:**
  - ✅ Next.js 16.0.3 project initialized
  - ✅ TypeScript configured with strict mode
  - ✅ Project structure organized (`/app`, `/components`, `/lib`, `/hooks`, `/types`)
  - ✅ ESLint and Prettier configured
  - ✅ Environment variables configured
- **Status:** ✅ Ready for error logging implementation

#### ✅ TASK-036 Completed
- **Location:** `frontend/sentry.*.config.ts`, `frontend/lib/sentry/`
- **Implementation:**
  - ✅ Sentry SDK installed (`@sentry/nextjs@10.26.0`)
  - ✅ Client, server, and edge configs created
  - ✅ Error filtering implemented (`lib/sentry/error-filtering.ts`)
  - ✅ User context tracking implemented (`lib/sentry/user-context.ts`)
  - ✅ Error boundaries created (`SentryErrorBoundary`, `global-error.tsx`)
  - ✅ DSN validation utilities (`lib/sentry/config-validation.ts`)
- **Status:** ✅ Sentry infrastructure ready for error logging integration

### Dependency Chain

```
TASK-031 (Week 2) ✅
    ↓
TASK-036 (Week 2) ✅
    ↓
TASK-037 (Week 2) ← Current Task
    ↓
Future Tasks:
- API integration tasks (will use error logging)
- Form implementation tasks (will use error logging)
```

### Assessment

- ✅ All dependencies are completed
- ✅ No blocking dependencies
- ✅ Ready to proceed with implementation

---

## 4. Codebase Review

### Current State

#### ✅ Sentry Infrastructure (TASK-036)

**Files:**
- `frontend/sentry.client.config.ts` - Client-side Sentry config
- `frontend/sentry.server.config.ts` - Server-side Sentry config
- `frontend/sentry.edge.config.ts` - Edge runtime Sentry config
- `frontend/instrumentation.ts` - Runtime detection
- `frontend/lib/sentry/error-filtering.ts` - Error filtering logic
- `frontend/lib/sentry/user-context.ts` - User context management
- `frontend/lib/sentry/config-validation.ts` - DSN validation

**Features:**
- ✅ Error filtering (browser extensions, rate limiting, known errors)
- ✅ Data sanitization (passwords, tokens, sensitive data)
- ✅ User context tracking (privacy-first, no email)
- ✅ Error boundaries (SentryErrorBoundary, global-error.tsx)
- ✅ Performance monitoring configured

#### ✅ Error UI Components

**Files:**
- `frontend/components/ui/error-display.tsx` - Error display component
- `frontend/components/system/SentryErrorBoundary.tsx` - Error boundary

**Features:**
- ✅ Multiple error variants (network, error, 404, 500, permission)
- ✅ User-friendly error messages
- ✅ Retry action support
- ✅ Accessible (ARIA labels, role="alert")

#### ❌ Missing: Error Logging Utility

**Expected Files:**
- `frontend/lib/error-logging.ts` or `frontend/lib/logger.ts` - **NOT FOUND**
- `frontend/lib/api-error-handler.ts` - **NOT FOUND**
- `frontend/lib/form-error-handler.ts` - **NOT FOUND**

**Status:** Error logging utility needs to be created

#### ✅ Existing Patterns

**Console Usage:**
- Found 8 instances of `console.warn()` in Sentry config files
- All are for Sentry initialization warnings
- No centralized logging pattern

**Error Handling:**
- Error boundaries catch React component errors
- Global error handler catches root-level errors
- No standardized API error handling
- No standardized form error handling

### Files That Need to Be Created

1. **`frontend/lib/error-logging.ts`** (or `lib/logger.ts`)
   - Centralized error logging utility
   - Functions: `logError()`, `logWarning()`, `logInfo()`, `logDebug()`
   - Environment-aware (console in dev, Sentry in prod)
   - Context enrichment

2. **`frontend/lib/api-error-handler.ts`**
   - API error parsing utilities
   - HTTP error code mapping
   - Error message extraction
   - Error recovery helpers

3. **`frontend/lib/form-error-handler.ts`** (optional)
   - Form validation error handling
   - Field-level error extraction
   - Validation error formatting

4. **`frontend/lib/error-codes.ts`** (optional)
   - Error code constants/enum
   - Error code to message mapping
   - Error code documentation

5. **`frontend/__tests__/lib/error-logging.test.ts`**
   - Unit tests for error logging utility
   - Tests for all logging levels
   - Tests for Sentry integration
   - Tests for console output

### Files That May Need Modification

1. **`frontend/lib/utils.ts`**
   - May add error formatting utilities
   - May add error type guards

2. **`frontend/README.md`**
   - Document error logging usage
   - Document error handling patterns
   - Add examples

3. **`frontend/env-example`**
   - May add error logging configuration variables (if needed)

---

## 5. Technical Considerations

### Error Logging Utility Design

**Recommended Structure:**
```typescript
// lib/error-logging.ts
export type LogLevel = 'error' | 'warning' | 'info' | 'debug';

export interface LogContext {
  user?: { id: string; username?: string };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: LogLevel;
}

export function logError(error: Error | string, context?: LogContext): void;
export function logWarning(message: string, context?: LogContext): void;
export function logInfo(message: string, context?: LogContext): void;
export function logDebug(message: string, context?: LogContext): void;
```

**Key Considerations:**
- Environment detection (development vs production)
- Console output in development (with appropriate methods: `console.error`, `console.warn`, etc.)
- Sentry integration in production (with appropriate severity levels)
- Context enrichment (user, tags, extra data)
- Error object vs string handling
- Stack trace preservation

### API Error Handling

**Recommended Pattern:**
```typescript
// lib/api-error-handler.ts
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
  statusCode?: number;
}

export function parseApiError(error: unknown): ApiError;
export function handleApiError(error: unknown): ApiError;
export function getErrorMessage(error: ApiError): string; // User-friendly
export function getErrorDetails(error: ApiError): string; // Technical
```

**Key Considerations:**
- Parse fetch/axios errors
- Extract error codes from API responses
- Map HTTP status codes to error types
- Handle network errors (offline, timeout)
- Handle validation errors (400 Bad Request)
- Handle authentication errors (401 Unauthorized)
- Handle authorization errors (403 Forbidden)
- Handle not found errors (404 Not Found)
- Handle server errors (500 Internal Server Error)

### Form Validation Error Handling

**Recommended Pattern:**
```typescript
// lib/form-error-handler.ts
export interface FieldError {
  field: string;
  message: string;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export function parseValidationErrors(error: unknown): FormErrors;
export function getFieldError(errors: FormErrors, field: string): string | undefined;
```

**Key Considerations:**
- Extract field-level errors from API responses
- Map validation errors to form fields
- Display errors next to form fields
- Clear errors on field change
- Aggregate errors for form-level display

### Error Message Formatting

**Recommended Approach:**
- User-friendly messages: Simple, actionable, non-technical
- Technical details: Include error codes, stack traces, context
- Error codes: Consistent format (e.g., `ERR_API_001`, `ERR_VALIDATION_001`)
- Message mapping: Map technical errors to user-friendly messages

### Integration Points

**Sentry Integration:**
- Use `Sentry.captureException()` for errors
- Use `Sentry.captureMessage()` for warnings/info
- Use `Sentry.setContext()` for additional context
- Use `Sentry.setTag()` for error categorization
- Respect error filtering (use existing `shouldSendError` function)

**User Context:**
- Automatically include user context from auth store
- Use existing `setSentryUser()` function
- Don't duplicate user context logic

**Error Boundaries:**
- Error boundaries already catch React errors
- Logging utility should complement, not replace error boundaries
- Use logging utility in try-catch blocks, not error boundaries

---

## 6. Edge Cases & Challenges

### Identified Edge Cases

1. **Network Errors**
   - **Challenge:** Distinguish between network errors and API errors
   - **Solution:** Check `error.name === 'NetworkError'` or `navigator.onLine`
   - **Handling:** Show offline-specific error messages

2. **API Errors**
   - **Challenge:** Different error response formats from backend
   - **Solution:** Create flexible error parser that handles multiple formats
   - **Handling:** Extract error code, message, and details from response

3. **Validation Errors**
   - **Challenge:** Field-level vs form-level errors
   - **Solution:** Parse nested error structures
   - **Handling:** Map errors to form fields, show inline errors

4. **Unknown Errors**
   - **Challenge:** Errors that don't match expected patterns
   - **Solution:** Fallback to generic error message
   - **Handling:** Log full error details for debugging, show user-friendly message

5. **Sentry Unavailable**
   - **Challenge:** Sentry service down or DSN missing
   - **Solution:** Graceful degradation (console fallback)
   - **Handling:** Don't break app if Sentry fails

6. **Error Spam**
   - **Challenge:** Same error logged multiple times
   - **Solution:** Use existing rate limiting from `error-filtering.ts`
   - **Handling:** Rate limit already implemented in Sentry config

7. **Sensitive Data in Errors**
   - **Challenge:** Passwords, tokens in error messages
   - **Solution:** Use existing `beforeSendError` sanitization
   - **Handling:** Sanitization already implemented in Sentry config

### Potential Challenges

1. **Error Message Consistency**
   - **Risk:** Inconsistent error messages across the app
   - **Mitigation:** Create error message constants/mapping
   - **Priority:** Medium

2. **Performance Impact**
   - **Risk:** Logging overhead in production
   - **Mitigation:** Use Sentry's built-in sampling, filter debug logs in production
   - **Priority:** Low (Sentry handles this)

3. **Error Code System**
   - **Risk:** Unclear error code format
   - **Mitigation:** Define error code format and document it
   - **Priority:** Low (can be added incrementally)

4. **Testing Error Logging**
   - **Risk:** Difficult to test Sentry integration
   - **Mitigation:** Mock Sentry in tests, test console output separately
   - **Priority:** Medium

---

## 7. Recommended Approach

### Phase 1: Core Error Logging Utility

1. **Create `lib/error-logging.ts`**
   - Implement `logError()`, `logWarning()`, `logInfo()`, `logDebug()`
   - Environment-aware (console in dev, Sentry in prod)
   - Context enrichment (user, tags, extra)
   - Error object vs string handling

2. **Create Tests**
   - Unit tests for all logging functions
   - Mock Sentry in tests
   - Test console output in development mode
   - Test Sentry integration in production mode

### Phase 2: API Error Handling

1. **Create `lib/api-error-handler.ts`**
   - Parse fetch/axios errors
   - Extract error codes and messages
   - Map HTTP status codes to error types
   - Handle network errors

2. **Create Error Code System** (optional)
   - Define error code constants
   - Create error code to message mapping
   - Document error codes

### Phase 3: Form Error Handling

1. **Create `lib/form-error-handler.ts`** (if needed)
   - Parse validation errors
   - Extract field-level errors
   - Format errors for form display

### Phase 4: Integration & Documentation

1. **Update Documentation**
   - Document error logging usage in README
   - Add usage examples
   - Document error handling patterns

2. **Update Examples**
   - Add error logging examples to existing code (if applicable)
   - Create example error handling patterns

---

## 8. Risk Assessment

### Low Risk ✅

- **Sentry Integration:** Already implemented and tested (TASK-036)
- **Error Boundaries:** Already implemented and working
- **Error Filtering:** Already implemented and working
- **User Context:** Already implemented and working

### Medium Risk ⚠️

- **Error Message Consistency:** Need to establish error message format
- **API Error Parsing:** Need to handle different error response formats
- **Testing:** Need to mock Sentry in tests

### High Risk ❌

- **None identified**

### Mitigation Strategies

1. **Error Message Consistency:**
   - Create error message constants file
   - Document error message format
   - Review error messages in code review

2. **API Error Parsing:**
   - Create flexible error parser
   - Test with different error response formats
   - Add fallback for unknown formats

3. **Testing:**
   - Mock Sentry SDK in tests
   - Test console output separately
   - Use Vitest's mocking capabilities

---

## 9. Testing Strategy

### Unit Tests

**Files to Test:**
- `lib/error-logging.ts` - All logging functions
- `lib/api-error-handler.ts` - Error parsing functions
- `lib/form-error-handler.ts` - Form error parsing (if created)

**Test Cases:**
- Log error with Error object
- Log error with string message
- Log with context (user, tags, extra)
- Console output in development
- Sentry integration in production
- Log level filtering (debug only in dev)
- API error parsing (various formats)
- Network error handling
- Validation error parsing

### Integration Tests

**Test Cases:**
- Error logging in try-catch blocks
- Error logging in API calls
- Error logging in form validation
- Error logging with error boundaries
- Sentry error capture verification

### Manual Testing

**Test Scenarios:**
- Trigger error in development (verify console output)
- Trigger error in production (verify Sentry dashboard)
- Test network error handling
- Test API error handling
- Test form validation error handling
- Test error message display

---

## 10. Success Criteria

### Must Have (Required)

- ✅ Error logging utility created with all logging levels
- ✅ Console output in development
- ✅ Sentry integration in production
- ✅ Context enrichment (user, tags, extra)
- ✅ API error handling utilities
- ✅ Error message formatting
- ✅ Unit tests for error logging
- ✅ Documentation updated

### Should Have (Best Practices)

- ✅ Form error handling utilities
- ✅ Error code system
- ✅ Error message mapping
- ✅ Integration tests
- ✅ Usage examples

### Nice to Have (Future Enhancements)

- Custom error types
- Error recovery utilities
- Error analytics
- Error reporting UI

---

## 11. Blockers & Concerns

### Blockers

**None identified** ✅

### Concerns

1. **Error Message Format**
   - **Concern:** Need to establish consistent error message format
   - **Impact:** Low - Can be refined during implementation
   - **Action:** Define format in implementation phase

2. **API Error Response Format**
   - **Concern:** Backend error response format may vary
   - **Impact:** Medium - Need flexible error parser
   - **Action:** Create flexible parser that handles multiple formats

3. **Error Code System**
   - **Concern:** Error code format not yet defined
   - **Impact:** Low - Can be added incrementally
   - **Action:** Define format during implementation

---

## 12. Next Steps

### Immediate Actions

1. ✅ **Review Complete** - Proceed with implementation
2. Create error logging utility (`lib/error-logging.ts`)
3. Create API error handler (`lib/api-error-handler.ts`)
4. Write unit tests
5. Update documentation

### Follow-up Tasks

1. **Future API Integration Tasks:**
   - Use error logging utility in API calls
   - Use API error handler for error parsing

2. **Future Form Implementation Tasks:**
   - Use form error handler for validation errors
   - Display errors using ErrorDisplay component

---

## 13. Summary and Recommendations

### Task Readiness: ✅ **READY FOR IMPLEMENTATION**

TASK-037 is ready to proceed with the following status:

#### ✅ Strengths

- Clear acceptance criteria
- All dependencies completed (TASK-031, TASK-036)
- Sentry infrastructure in place and working
- Error boundaries already implemented
- Error UI components ready
- Well-defined error handling requirements
- Low complexity and risk

#### ⚠️ Considerations

- Need to establish error message format
- Need flexible API error parser
- Need to mock Sentry in tests
- Error code system can be added incrementally

#### 📋 Recommended Actions

1. **Immediate:** Proceed with TASK-037 implementation
2. **During Implementation:**
   - Create error logging utility first
   - Add API error handling
   - Write tests alongside implementation
   - Document usage patterns
3. **After Implementation:**
   - Comprehensive testing
   - Documentation updates
   - Code review

### Final Recommendation

**✅ APPROVED FOR IMPLEMENTATION**

The task is well-defined, dependencies are met, and the codebase is ready. No blockers identified. Proceed with implementation following the recommended approach and best practices outlined in this report.

---

## 14. Appendix

### Related Files

- `docs/private-docs/tasks/WEEK_02_TASKS.md` - Task description
- `frontend/lib/sentry/error-filtering.ts` - Error filtering logic
- `frontend/lib/sentry/user-context.ts` - User context management
- `frontend/components/system/SentryErrorBoundary.tsx` - Error boundary
- `frontend/components/ui/error-display.tsx` - Error display component
- `frontend/sentry.client.config.ts` - Sentry client config
- `frontend/sentry.server.config.ts` - Sentry server config

### References

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Error Handling Best Practices](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

**Document Type:** Task Review Report  
**Target Audience:** Development Team  
**Last Updated:** 2025-01-27  
**Status:** ✅ Ready for Implementation

