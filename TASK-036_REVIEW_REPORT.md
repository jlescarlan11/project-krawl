# TASK-036 Review Report: Set up monitoring tools (Sentry) for frontend

**Task ID:** TASK-036  
**Review Date:** 2025-01-27  
**Reviewer:** Senior Software Engineer  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## Executive Summary

TASK-036 involves setting up Sentry for frontend error tracking and performance monitoring in the Next.js application. The task is well-defined with clear acceptance criteria, dependencies are met, and the codebase is ready for implementation. No blockers identified.

**Recommendation:** ✅ **Proceed with implementation**

---

## 1. Git Status Analysis

### Current Branch
- **Branch:** `45-task-036-set-up-monitoring-tools-sentry-for-frontend`
- **Status:** Up to date with origin
- **Uncommitted Changes:** 
  - Multiple documentation files with trailing newline changes (cosmetic only)
  - Test files with trailing newlines
  - No code changes related to TASK-036
  - One untracked file: `TASK-035_COMMIT_SUMMARY.md`

### Assessment
- ✅ Branch is correctly named and ready for TASK-036 work
- ✅ No conflicting code changes
- ⚠️ Minor: Trailing newline changes should be cleaned up before committing TASK-036 work

---

## 2. Task Description Analysis

### Source
**File:** `docs/private-docs/tasks/WEEK_02_TASKS.md`  
**Lines:** 855-903

### Task Overview
**Epic:** epic:design-system  
**Priority:** Medium  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-031, TASK-017  
**Week:** Week 2

### Description
Set up Sentry for frontend error tracking and performance monitoring to catch and debug issues in production.

### Acceptance Criteria

#### ✅ Sentry SDK Installation and Configuration
- [ ] Sentry SDK installed and configured
- [ ] Sentry initialized in Next.js app:
  - [ ] Error boundary configured
  - [ ] Error tracking enabled
  - [ ] Performance monitoring enabled

#### ✅ Sentry Configuration
- [ ] DSN configured (from TASK-017)
- [ ] Environment set (development, production)
- [ ] Release tracking configured
- [ ] User context tracking configured

#### ✅ Error Reporting
- [ ] Errors are captured
- [ ] Errors include context (user, environment, etc.)
- [ ] Errors are sent to Sentry dashboard

#### ✅ Performance Monitoring
- [ ] Page load times tracked
- [ ] API call times tracked
- [ ] Custom performance metrics tracked

### Edge Cases Identified
1. **Sentry service unavailable** - Handle gracefully, don't break app
2. **Too many errors** - Implement error throttling
3. **Sensitive data** - Ensure no sensitive data in error reports
4. **Performance impact** - Ensure Sentry doesn't impact performance

### Technical Notes
- Use `@sentry/nextjs` for Next.js integration
- Configure Sentry in `next.config.js` or `sentry.client.config.js`
- Set up error boundaries
- Configure source maps for better error tracking
- Set up release tracking with Git commits

### Testing Requirements
- Test error tracking (trigger test error)
- Test performance monitoring
- Verify errors appear in Sentry dashboard
- Test error boundaries

---

## 3. Dependencies Analysis

### Required Dependencies

#### TASK-031: Set up Next.js 16.0.3 project with TypeScript ✅ **COMPLETED**
- **Status:** ✅ Completed (2025-11-21)
- **Verification:**
  - ✅ Next.js 16.0.3 installed (`frontend/package.json`)
  - ✅ TypeScript configured (`frontend/tsconfig.json`)
  - ✅ Project structure established
  - ✅ Build successful
- **Impact:** Critical - Required for Sentry integration
- **Blocking:** No

#### TASK-017: Create Sentry account (free tier) ✅ **COMPLETED**
- **Status:** ✅ Completed (per TASK-017_REVIEW_REPORT.md)
- **Verification:**
  - ✅ Sentry account created
  - ✅ Backend and frontend projects created
  - ✅ DSNs obtained and documented
  - ✅ Environment variables configured in `frontend/env-example`
  - ✅ Setup documentation created (`docs/private-docs/operations/SENTRY_SETUP.md`)
- **Impact:** Critical - Required for DSN configuration
- **Blocking:** No

### Dependency Chain
```
TASK-017 (Week 1) ✅
    ↓
TASK-036 (Week 2) ← Current Task
    ↓
TASK-037 (Week 2) - Configure basic error logging
    ↓
TASK-244 (Week 15) - Production monitoring setup
```

### Assessment
- ✅ All dependencies are completed
- ✅ No blocking dependencies
- ✅ Ready to proceed

---

## 4. Codebase Review

### Current State

#### ✅ Next.js Project Setup
- **Version:** Next.js 16.0.3 (confirmed in `package.json`)
- **TypeScript:** Configured and working
- **App Router:** Using App Router (`frontend/app/` directory)
- **Configuration:** `frontend/next.config.ts` exists and configured

#### ✅ Environment Variables
- **File:** `frontend/env-example`
- **Sentry Variables Present:**
  - `NEXT_PUBLIC_SENTRY_DSN=` (line 137) - Placeholder ready
  - `NEXT_PUBLIC_SENTRY_ENVIRONMENT=development` (line 140) - Configured
- **Status:** ✅ Environment variable templates ready

#### ❌ Sentry SDK Not Installed
- **Current:** No `@sentry/nextjs` in `package.json`
- **Action Required:** Install Sentry SDK

#### ❌ Sentry Configuration Files Missing
- **Expected Files:**
  - `frontend/sentry.client.config.ts` (client-side config)
  - `frontend/sentry.server.config.ts` (server-side config)
  - `frontend/sentry.edge.config.ts` (edge runtime config, optional)
- **Status:** Files need to be created

#### ✅ Error Handling Infrastructure Exists
- **Components:**
  - `frontend/components/ui/error-display.tsx` - Error display component
  - `frontend/app/not-found.tsx` - 404 error page
- **Status:** UI components ready, but no error tracking integration

#### ✅ PWA Configuration
- **Status:** PWA already configured with `next-pwa`
- **Impact:** Sentry should work alongside PWA
- **Note:** Ensure Sentry doesn't interfere with service worker

### Files That Need to Be Created

1. **`frontend/sentry.client.config.ts`**
   - Client-side Sentry configuration
   - Error boundary setup
   - Performance monitoring configuration

2. **`frontend/sentry.server.config.ts`**
   - Server-side Sentry configuration
   - API route error tracking

3. **`frontend/sentry.edge.config.ts`** (Optional)
   - Edge runtime configuration
   - For middleware error tracking

4. **`frontend/components/error-boundary.tsx`** (Optional, if custom error boundary needed)
   - React error boundary component
   - Integrates with Sentry

### Files That Need to Be Modified

1. **`frontend/package.json`**
   - Add `@sentry/nextjs` dependency
   - Add Sentry build scripts if needed

2. **`frontend/next.config.ts`**
   - Integrate Sentry webpack plugin (via `@sentry/nextjs`)
   - Configure source maps for Sentry
   - Ensure compatibility with existing PWA configuration

3. **`frontend/app/layout.tsx`**
   - Initialize Sentry (if needed at root level)
   - Wrap app with error boundary (if custom)

4. **`frontend/.env.local`** (Developer's local file)
   - Add `NEXT_PUBLIC_SENTRY_DSN` with actual DSN
   - Verify `NEXT_PUBLIC_SENTRY_ENVIRONMENT` is set

### Existing Patterns to Follow

#### Error Handling Pattern
- **Location:** `frontend/components/ui/error-display.tsx`
- **Pattern:** Component-based error display
- **Integration:** Sentry should capture errors before displaying them

#### State Management Pattern
- **Location:** `frontend/stores/`
- **Pattern:** Zustand stores with error handling
- **Integration:** Sentry can capture errors from store actions

#### Configuration Pattern
- **Location:** `frontend/next.config.ts`
- **Pattern:** TypeScript config with plugins
- **Integration:** Sentry plugin should be added alongside PWA plugin

---

## 5. Technical Considerations

### Sentry SDK Selection

#### Recommended: `@sentry/nextjs`
- **Version:** Latest stable (check compatibility with Next.js 16.0.3)
- **Why:** Official Next.js integration with automatic setup
- **Features:**
  - Automatic error boundary integration
  - Server-side and client-side tracking
  - Performance monitoring
  - Source map upload
  - Release tracking

#### Alternative: `@sentry/react` + `@sentry/nextjs` (if needed)
- **Use Case:** If more granular control needed
- **Note:** `@sentry/nextjs` already includes React integration

### Configuration Strategy

#### Client-Side Configuration
- **File:** `sentry.client.config.ts`
- **Key Settings:**
  - DSN from `NEXT_PUBLIC_SENTRY_DSN`
  - Environment from `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
  - Release tracking (Git commit SHA)
  - User context (from auth store)
  - Performance monitoring (page loads, API calls)
  - Error filtering (reduce noise)

#### Server-Side Configuration
- **File:** `sentry.server.config.ts`
- **Key Settings:**
  - DSN from `NEXT_PUBLIC_SENTRY_DSN` (or separate server DSN if needed)
  - Environment configuration
  - API route error tracking
  - Server-side performance monitoring

#### Next.js Integration
- **File:** `next.config.ts`
- **Integration:**
  - Use `@sentry/nextjs` automatic webpack plugin
  - Configure source maps for production
  - Ensure compatibility with `next-pwa` plugin

### Error Boundary Strategy

#### Option 1: Use Sentry's Built-in Error Boundary
- **Pros:** Automatic, no custom code needed
- **Cons:** Less control over UI

#### Option 2: Custom Error Boundary with Sentry Integration
- **Pros:** Full control over error UI, can use existing `ErrorDisplay` component
- **Cons:** Requires custom implementation
- **Recommendation:** Use custom error boundary that integrates with Sentry and uses existing `ErrorDisplay` component

### Performance Monitoring Strategy

#### Automatic Tracking
- Page load times (automatic with `@sentry/nextjs`)
- API route performance (automatic)

#### Custom Tracking
- API call times (from frontend to backend)
- Component render times (if needed)
- User interactions (if needed)

### Source Maps Configuration

#### Development
- Source maps enabled for debugging
- Sentry can use local source maps

#### Production
- Source maps should be uploaded to Sentry
- Configure in `next.config.ts` or via Sentry CLI
- **Security:** Ensure source maps are not exposed to public

### Release Tracking

#### Strategy
- Use Git commit SHA as release identifier
- Configure in Sentry config files
- Enable release tracking in Sentry dashboard

#### Implementation
```typescript
// Example release tracking
release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || 'development'
```

### User Context Tracking

#### Integration with Auth Store
- **Location:** `frontend/stores/auth-store.ts`
- **Strategy:** Set user context when user signs in
- **Data to Include:**
  - User ID (not email for privacy)
  - Username/display name
  - Authentication status

#### Implementation
```typescript
// Example user context
Sentry.setUser({
  id: user.id,
  username: user.displayName,
  // Don't include email or sensitive data
});
```

### Error Filtering Strategy

#### Common Filters
- Ignore browser extension errors
- Ignore known third-party library errors
- Filter out development-only errors
- Rate limit error reporting

#### Implementation
```typescript
// Example error filtering
beforeSend(event, hint) {
  // Filter out browser extension errors
  if (event.exception?.values?.[0]?.value?.includes('chrome-extension://')) {
    return null;
  }
  return event;
}
```

---

## 6. Potential Challenges and Blockers

### Identified Challenges

#### 1. PWA Compatibility ⚠️ Medium Risk
**Challenge:** Sentry integration with `next-pwa` service worker  
**Likelihood:** Medium  
**Impact:** Medium  
**Mitigation:**
- Test Sentry with service worker enabled
- Ensure Sentry doesn't interfere with offline functionality
- Configure Sentry to work with service worker context

#### 2. Source Maps Configuration ⚠️ Medium Risk
**Challenge:** Proper source map upload and configuration  
**Likelihood:** Medium  
**Impact:** Medium (affects error readability)  
**Mitigation:**
- Follow Sentry Next.js documentation for source maps
- Test source map upload in production build
- Verify source maps are accessible in Sentry dashboard

#### 3. Environment Variable Configuration ⚠️ Low Risk
**Challenge:** Ensuring DSN is properly loaded in all contexts  
**Likelihood:** Low  
**Impact:** High (Sentry won't work without DSN)  
**Mitigation:**
- Verify DSN is available in client and server contexts
- Test with and without DSN (graceful degradation)
- Add validation for DSN presence

#### 4. Performance Impact ⚠️ Low Risk
**Challenge:** Sentry SDK adding performance overhead  
**Likelihood:** Low  
**Impact:** Low (Sentry is optimized, but should be monitored)  
**Mitigation:**
- Monitor bundle size increase
- Test performance impact in development
- Use Sentry's performance monitoring to track its own impact

#### 5. Error Boundary Integration ⚠️ Low Risk
**Challenge:** Integrating Sentry with existing error handling  
**Likelihood:** Low  
**Impact:** Medium  
**Mitigation:**
- Use existing `ErrorDisplay` component for error UI
- Ensure Sentry captures errors before displaying them
- Test error boundary in various scenarios

#### 6. TypeScript Configuration ⚠️ Low Risk
**Challenge:** TypeScript types for Sentry configuration  
**Likelihood:** Low  
**Impact:** Low  
**Mitigation:**
- `@sentry/nextjs` includes TypeScript types
- Follow TypeScript examples in Sentry documentation

### Blockers

#### ❌ No Blockers Identified
All dependencies are met, and no technical blockers are present.

---

## 7. Related Documentation

### Existing Documentation

#### ✅ Sentry Setup Guide
- **File:** `docs/private-docs/operations/SENTRY_SETUP.md`
- **Status:** Complete and comprehensive
- **Content:**
  - Account creation steps
  - DSN configuration
  - Security best practices
  - Usage monitoring guidelines
- **Relevance:** High - Reference for DSN configuration

#### ✅ TASK-017 Review Report
- **File:** `TASK-017_REVIEW_REPORT.md`
- **Status:** Available
- **Content:** Sentry account setup details
- **Relevance:** Medium - Historical context

#### ✅ Environment Variables Template
- **File:** `frontend/env-example`
- **Status:** Ready with Sentry placeholders
- **Relevance:** High - Configuration reference

### Documentation to Create/Update

#### 1. **Sentry Integration Documentation** (New)
- **File:** `frontend/docs/SENTRY_INTEGRATION.md` (recommended)
- **Content:**
  - Sentry configuration overview
  - Error tracking usage
  - Performance monitoring usage
  - Troubleshooting guide
  - Development vs production differences

#### 2. **README.md Update** (Update)
- **File:** `frontend/README.md`
- **Content:** Add Sentry section with setup instructions

#### 3. **Error Handling Guide** (Update)
- **File:** `frontend/components/README.md` (if exists)
- **Content:** Update error handling section with Sentry integration

---

## 8. Testing Strategy

### Unit Tests

#### Sentry Configuration Tests
- [ ] Verify Sentry initializes correctly
- [ ] Verify DSN is loaded from environment variables
- [ ] Verify error filtering works
- [ ] Verify user context is set correctly

#### Error Boundary Tests
- [ ] Test error boundary catches React errors
- [ ] Test error boundary displays correct UI
- [ ] Test error boundary sends errors to Sentry

### Integration Tests

#### Error Tracking Tests
- [ ] Trigger test error and verify it appears in Sentry
- [ ] Verify error includes correct context
- [ ] Verify error includes user information (if authenticated)
- [ ] Verify error includes environment information

#### Performance Monitoring Tests
- [ ] Verify page load times are tracked
- [ ] Verify API call times are tracked
- [ ] Verify custom performance metrics work

### Manual Testing

#### Error Scenarios
- [ ] Test unhandled JavaScript errors
- [ ] Test React component errors
- [ ] Test API error responses
- [ ] Test network errors
- [ ] Test error boundary recovery

#### Performance Scenarios
- [ ] Test page load performance tracking
- [ ] Test API call performance tracking
- [ ] Verify performance data appears in Sentry dashboard

#### Edge Cases
- [ ] Test with Sentry service unavailable (graceful degradation)
- [ ] Test with invalid DSN
- [ ] Test with missing environment variables
- [ ] Test error throttling

### Sentry Dashboard Verification

#### Error Verification
- [ ] Verify errors appear in Sentry dashboard
- [ ] Verify error details are complete
- [ ] Verify source maps work (if configured)
- [ ] Verify user context is included

#### Performance Verification
- [ ] Verify performance data appears in Sentry dashboard
- [ ] Verify transaction traces are complete
- [ ] Verify performance metrics are accurate

---

## 9. Security Considerations

### DSN Security

#### ✅ Frontend DSN Exposure
- **Status:** Safe - Public DSNs are read-only
- **Risk:** Low
- **Mitigation:**
  - Use separate project for frontend (already done in TASK-017)
  - Configure rate limiting in Sentry dashboard
  - Monitor Sentry access logs

#### ✅ Environment Variables
- **Status:** Properly configured in `.env.local` (gitignored)
- **Risk:** Low
- **Mitigation:**
  - Never commit `.env.local` to version control
  - Use `.env.example` with placeholders
  - Verify `.gitignore` includes `.env.local`

### Data Privacy

#### Sensitive Data Filtering
- **Requirement:** Ensure no sensitive data in error reports
- **Implementation:**
  - Filter out passwords, tokens, API keys
  - Don't include full request/response bodies
  - Use `beforeSend` hook to sanitize data

#### User Data Privacy
- **Requirement:** Only include necessary user context
- **Implementation:**
  - Include user ID and username only
  - Don't include email addresses
  - Don't include personal information

### Source Maps Security

#### Production Source Maps
- **Requirement:** Source maps should not be publicly accessible
- **Implementation:**
  - Upload source maps to Sentry (not public)
  - Don't serve source maps from public directory
  - Use Sentry's source map upload feature

---

## 10. Implementation Checklist

### Pre-Implementation
- [x] Review task description and acceptance criteria
- [x] Verify dependencies are completed
- [x] Review codebase structure
- [x] Identify files to create/modify
- [x] Review related documentation

### Implementation Steps

#### Step 1: Install Sentry SDK
- [ ] Install `@sentry/nextjs` package
- [ ] Verify package installation
- [ ] Check compatibility with Next.js 16.0.3

#### Step 2: Create Sentry Configuration Files
- [ ] Create `frontend/sentry.client.config.ts`
- [ ] Create `frontend/sentry.server.config.ts`
- [ ] Configure DSN from environment variables
- [ ] Configure environment setting
- [ ] Configure release tracking
- [ ] Configure error filtering
- [ ] Configure performance monitoring

#### Step 3: Update Next.js Configuration
- [ ] Update `frontend/next.config.ts` with Sentry integration
- [ ] Configure source maps for Sentry
- [ ] Ensure compatibility with PWA plugin
- [ ] Test build with Sentry enabled

#### Step 4: Integrate Error Boundary
- [ ] Create or configure error boundary component
- [ ] Integrate with existing `ErrorDisplay` component
- [ ] Test error boundary catches errors
- [ ] Verify errors are sent to Sentry

#### Step 5: Configure User Context
- [ ] Integrate with auth store
- [ ] Set user context on sign in
- [ ] Clear user context on sign out
- [ ] Test user context in error reports

#### Step 6: Configure Performance Monitoring
- [ ] Enable automatic performance tracking
- [ ] Configure API call tracking
- [ ] Test performance data in Sentry dashboard

#### Step 7: Environment Configuration
- [ ] Verify `.env.local` has `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Verify `NEXT_PUBLIC_SENTRY_ENVIRONMENT` is set
- [ ] Test with and without DSN (graceful degradation)

#### Step 8: Testing
- [ ] Test error tracking (trigger test error)
- [ ] Test performance monitoring
- [ ] Verify errors appear in Sentry dashboard
- [ ] Test error boundaries
- [ ] Test with Sentry service unavailable
- [ ] Test error filtering

#### Step 9: Documentation
- [ ] Create Sentry integration documentation
- [ ] Update README.md with Sentry setup
- [ ] Document error tracking usage
- [ ] Document performance monitoring usage

#### Step 10: Code Review
- [ ] Review Sentry configuration
- [ ] Review error boundary implementation
- [ ] Review user context integration
- [ ] Review security considerations

---

## 11. Recommended Approach

### Implementation Strategy

#### Phase 1: Basic Setup (2-3 hours)
1. Install `@sentry/nextjs` package
2. Create basic Sentry configuration files
3. Configure DSN and environment
4. Test basic error tracking

#### Phase 2: Integration (2-3 hours)
1. Integrate with Next.js configuration
2. Set up error boundary
3. Configure user context
4. Test integration

#### Phase 3: Advanced Features (1-2 hours)
1. Configure performance monitoring
2. Set up error filtering
3. Configure release tracking
4. Test advanced features

#### Phase 4: Testing & Documentation (1-2 hours)
1. Comprehensive testing
2. Create documentation
3. Update README
4. Code review

### Best Practices

1. **Start Simple:** Begin with basic error tracking, then add features
2. **Test Incrementally:** Test after each major change
3. **Monitor Performance:** Watch for performance impact
4. **Document Everything:** Keep documentation up to date
5. **Security First:** Ensure no sensitive data in error reports

### Key Files to Focus On

1. **`frontend/sentry.client.config.ts`** - Main client configuration
2. **`frontend/sentry.server.config.ts`** - Server configuration
3. **`frontend/next.config.ts`** - Next.js integration
4. **`frontend/app/layout.tsx`** - Root-level initialization (if needed)

---

## 12. Risk Assessment

### Risk Matrix

| Risk | Likelihood | Impact | Severity | Mitigation |
|------|------------|--------|----------|------------|
| PWA Compatibility Issues | Medium | Medium | Medium | Test thoroughly, ensure compatibility |
| Source Maps Not Working | Medium | Medium | Medium | Follow Sentry docs, test in production |
| Performance Impact | Low | Low | Low | Monitor bundle size, test performance |
| DSN Configuration Issues | Low | High | Medium | Validate DSN, test graceful degradation |
| Error Boundary Integration | Low | Medium | Low | Use existing patterns, test thoroughly |

### Overall Risk Level: **LOW**

The task has low overall risk. All dependencies are met, the codebase is ready, and Sentry integration is well-documented. The main risks are configuration-related and can be mitigated through thorough testing.

---

## 13. Success Criteria

### Must Have (Acceptance Criteria)
- ✅ Sentry SDK installed and configured
- ✅ Error tracking working (errors appear in Sentry dashboard)
- ✅ Performance monitoring working (performance data in Sentry)
- ✅ Error boundary configured
- ✅ User context tracking configured
- ✅ Environment configuration working

### Should Have (Best Practices)
- ✅ Error filtering configured
- ✅ Source maps configured
- ✅ Release tracking configured
- ✅ Graceful degradation (works without DSN)
- ✅ Documentation created

### Nice to Have (Future Enhancements)
- Custom error UI integration
- Advanced performance metrics
- Custom error grouping
- Alert configuration

---

## 14. Next Steps

### Immediate Actions
1. ✅ Review complete - Proceed with implementation
2. Install `@sentry/nextjs` package
3. Create Sentry configuration files
4. Integrate with Next.js

### Follow-up Tasks
1. **TASK-037** (Week 2): Configure basic error logging
   - Build on TASK-036
   - Set up error logging patterns
   - Configure error filtering

2. **TASK-244** (Week 15): Set up production monitoring
   - Configure Sentry for production
   - Set up production alerts
   - Monitor production errors

---

## 15. Summary and Recommendations

### Task Readiness: ✅ **READY FOR IMPLEMENTATION**

TASK-036 is ready to proceed with the following status:

#### ✅ Strengths
- Clear acceptance criteria
- All dependencies completed
- Environment variables ready
- Codebase structure ready
- Comprehensive setup documentation available
- Low complexity and risk
- Well-documented integration path

#### ⚠️ Considerations
- Ensure PWA compatibility
- Configure source maps properly
- Test graceful degradation
- Monitor performance impact
- Filter sensitive data from error reports

#### 📋 Recommended Actions
1. **Immediate:** Proceed with TASK-036 implementation
2. **During Implementation:** Follow Sentry Next.js documentation closely
3. **After Implementation:** Comprehensive testing and documentation
4. **Before Production:** Verify source maps and error filtering

### Final Recommendation

**✅ APPROVED FOR IMPLEMENTATION**

The task is well-defined, dependencies are met, and the codebase is ready. No blockers identified. Proceed with implementation following the recommended approach and best practices outlined in this report.

---

**Reviewer:** Senior Software Engineer  
**Date:** 2025-01-27  
**Status:** ✅ Ready for Implementation  
**Next Step:** Begin implementation following the implementation checklist

