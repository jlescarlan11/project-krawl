# Codebase Refactoring Analysis

**Date:** 2025-01-27  
**Analysis Scope:** Frontend components and stores  
**Method:** Code complexity, size, and responsibility analysis

---

## Top 3 Refactoring Candidates

### 1. 🥇 **`frontend/components/krawl-creation/steps/ReviewStep.tsx`** (508 lines)

**Priority:** HIGH  
**Complexity Score:** 9/10

#### Issues Identified:

1. **Multiple Responsibilities (SRP Violation)**
   - Route calculation logic
   - Preview data transformation
   - Form validation
   - API submission handling
   - Error state management
   - Success state management
   - Multiple conditional render paths

2. **Complex State Management**
   - 7+ useState hooks managing different concerns
   - Complex useEffect dependencies (`sortedGems`, `gemsDependencyKey`)
   - Multiple derived states using `useMemo`

3. **Large Component Size**
   - 508 lines in a single component
   - Multiple early returns for different states
   - Deeply nested conditional rendering

4. **Code Duplication**
   - Similar error handling patterns could be extracted
   - Route calculation logic could be a custom hook
   - Preview transformation logic is mixed with component logic

#### Refactoring Recommendations:

**Extract Custom Hooks:**
- `useRouteMetrics` - Handle route calculation logic
- `useKrawlPreview` - Transform form data to preview format
- `useKrawlSubmission` - Handle submission logic and error states

**Extract Utility Functions:**
- `createPreviewKrawl` → Move to `utils/krawlPreviewUtils.ts`
- `validateData` → Move to `utils/krawlValidation.ts`

**Split Component:**
- `ReviewStep` (main orchestrator)
- `ReviewStepPreview` (preview display)
- `ReviewStepValidation` (validation display)
- `ReviewStepError` (error display)

**Benefits:**
- ✅ Reduced component complexity (from 508 → ~150 lines)
- ✅ Better testability (hooks can be tested independently)
- ✅ Improved reusability
- ✅ Easier to maintain and debug

---

### 2. 🥈 **`frontend/components/map/Map.tsx`** (552 lines)

**Priority:** HIGH  
**Complexity Score:** 8/10

#### Issues Identified:

1. **God Component Anti-pattern**
   - Handles map initialization
   - Error handling and retry logic
   - Performance monitoring
   - Event listener management
   - Control rendering
   - State synchronization

2. **Massive useEffect Hook**
   - `initializeMap` callback has 25+ dependencies
   - Complex initialization logic (200+ lines)
   - Multiple concerns mixed together

3. **Tight Coupling**
   - Direct integration with Mapbox GL
   - Mixed concerns: initialization, error handling, controls
   - Hard to test individual pieces

4. **Performance Concerns**
   - Large dependency array causes frequent re-initialization
   - Complex memoization logic
   - Multiple refs managing lifecycle

#### Refactoring Recommendations:

**Extract Custom Hooks:**
- `useMapInitialization` - Handle map creation and configuration
- `useMapErrorHandling` - Error detection, classification, retry logic
- `useMapControls` - Control rendering and positioning
- `useMapEventListeners` - Event listener setup/cleanup
- `useMapPerformance` - Performance monitoring (dev only)

**Extract Configuration:**
- `mapConfig.ts` - Map configuration constants and defaults
- `mapErrorHandlers.ts` - Error classification and handling logic

**Split Component:**
- `Map` (main component, ~100 lines)
- `MapContainer` (container with refs)
- `MapControls` (already exists, but could be enhanced)
- `MapErrorBoundary` (error display)

**Benefits:**
- ✅ Reduced component size (from 552 → ~150 lines)
- ✅ Better separation of concerns
- ✅ Easier to test individual hooks
- ✅ Improved performance (smaller dependency arrays)
- ✅ Better maintainability

---

### 3. 🥉 **`frontend/stores/gem-creation-store.ts`** (605+ lines)

**Priority:** MEDIUM-HIGH  
**Complexity Score:** 7/10

#### Issues Identified:

1. **Large Store File**
   - 605+ lines managing multiple concerns
   - Complex validation logic embedded in store
   - Draft management mixed with form state
   - Upload status management

2. **Complex Validation Logic**
   - `validateCurrentStep` has nested switch statements
   - Validation rules duplicated across steps
   - Hard to test validation independently

3. **Mixed Responsibilities**
   - Form state management
   - Draft persistence (localStorage + backend)
   - Upload status tracking
   - Duplicate detection state
   - Step navigation logic

4. **Tight Coupling**
   - Store directly handles API calls
   - Validation logic mixed with state updates
   - Hard to reuse validation logic elsewhere

#### Refactoring Recommendations:

**Extract Validation Logic:**
- `lib/validation/gem-creation-validation.ts`
  - `validateLocationStep()`
  - `validateDetailsStep()`
  - `validateMediaStep()`
  - `validatePreviewStep()`

**Split Store Concerns:**
- `gem-creation-store.ts` - Core form state only (~200 lines)
- `gem-creation-draft-store.ts` - Draft management (~150 lines)
- `gem-creation-upload-store.ts` - Upload status tracking (~100 lines)

**Extract API Logic:**
- `lib/api/gem-drafts.ts` - Draft API calls (already exists, but could be enhanced)
- Keep store actions thin, delegate to API layer

**Create Selector Hooks:**
- Already exists (`useLocationData`, `useCurrentStep`, etc.)
- Consider adding more granular selectors

**Benefits:**
- ✅ Reduced store complexity
- ✅ Better testability (validation logic can be unit tested)
- ✅ Improved reusability
- ✅ Clearer separation of concerns
- ✅ Easier to maintain

---

## Additional Refactoring Opportunities

### 4. `frontend/components/gem-creation/steps/BasicInfoStep.tsx` (440 lines)

**Issues:**
- Complex duplicate detection logic
- Multiple useEffect hooks with complex dependencies
- Form validation mixed with component logic

**Recommendation:** Extract `useDuplicateDetection` hook and `useGemFormValidation` hook

### 5. `frontend/components/map/useGemMarkers.ts` (593 lines)

**Issues:**
- Very large custom hook
- Multiple concerns: fetching, rendering, event handling
- Complex state management

**Recommendation:** Split into smaller hooks:
- `useGemFetching`
- `useGemMarkerRendering`
- `useGemMarkerEvents`

---

## Refactoring Priority Matrix

| File | Lines | Complexity | Priority | Impact | Effort |
|------|-------|------------|----------|--------|--------|
| ReviewStep.tsx | 508 | High | HIGH | High | Medium |
| Map.tsx | 552 | High | HIGH | High | High |
| gem-creation-store.ts | 605 | Medium | MEDIUM-HIGH | High | Medium |
| BasicInfoStep.tsx | 440 | Medium | MEDIUM | Medium | Low |
| useGemMarkers.ts | 593 | Medium | MEDIUM | Medium | Medium |

---

## Refactoring Strategy

### Phase 1: Quick Wins (Low Effort, High Impact)
1. Extract utility functions from ReviewStep.tsx
2. Extract validation logic from gem-creation-store.ts
3. Create `useRouteMetrics` hook from ReviewStep.tsx

### Phase 2: Medium Effort (High Impact)
1. Split Map.tsx into custom hooks
2. Refactor ReviewStep.tsx into smaller components
3. Split gem-creation-store.ts into focused stores

### Phase 3: Long-term Improvements
1. Comprehensive testing for extracted hooks
2. Performance optimization
3. Documentation updates

---

## Metrics to Track

- **Component Size:** Target < 300 lines per component
- **Hook Complexity:** Target < 200 lines per hook
- **Store Size:** Target < 300 lines per store
- **Cyclomatic Complexity:** Target < 10 per function
- **Test Coverage:** Target > 80% for extracted logic

---

## Conclusion

The top 3 files identified would benefit significantly from refactoring:

1. **ReviewStep.tsx** - Highest priority due to complexity and multiple responsibilities
2. **Map.tsx** - High priority due to size and god component pattern
3. **gem-creation-store.ts** - Medium-high priority due to mixed concerns

All three files would see improved maintainability, testability, and code clarity after refactoring.

