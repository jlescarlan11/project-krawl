# Onboarding Components

This directory contains all components related to the user onboarding flow for first-time users of Krawl.

## Overview

The onboarding flow introduces new users to Krawl's core features through an interactive, step-by-step tutorial. The flow consists of 5 steps that guide users through discovering Gems, following Krawls, creating content, and setting up permissions.

## Components

### `OnboardingFlow.tsx`

Main orchestration component for the onboarding flow. Manages step navigation, permission requests, analytics tracking, and flow completion.

**Props:** None (uses router and internal state)

**Key Features:**
- Step navigation (forward/backward)
- Permission request handling
- Analytics tracking
- Cross-tab synchronization
- Transition animations

**Usage:**
```tsx
import { OnboardingFlow } from "@/components/onboarding";

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
```

### `StepContent.tsx`

Displays the content for each onboarding step, including illustration, title, and description.

**Props:**
- `step: OnboardingStep` - Step data (title, description, illustration)
- `index: number` - Current step index (0-based)
- `total: number` - Total number of steps
- `direction?: "forward" | "backward"` - Animation direction

**Usage:**
```tsx
<StepContent
  step={currentStep}
  index={currentIndex}
  total={TOTAL_STEPS}
  direction="forward"
/>
```

### `Illustration.tsx`

Displays SVG icons for onboarding steps, replacing emoji placeholders.

**Props:**
- `id: IllustrationId` - Illustration identifier (map-cebu, gems-cluster, etc.)
- `className?: string` - Additional CSS classes
- `ariaLabel?: string` - Accessibility label

**Supported IDs:**
- `"map-cebu"` - Map of Cebu City
- `"gems-cluster"` - Multiple Gem pins
- `"krawl-trail"` - Krawl trail/route
- `"create-story"` - Create content icon
- `"location-permission"` - Location permission icon

**Usage:**
```tsx
<Illustration
  id="map-cebu"
  ariaLabel="Map of Cebu City"
/>
```

### `StepTransition.tsx`

Wrapper component that provides smooth fade and slide animations for step transitions.

**Props:**
- `children: React.ReactNode` - Content to animate
- `stepIndex: number` - Current step index
- `direction?: "forward" | "backward"` - Animation direction
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<StepTransition stepIndex={currentIndex} direction="forward">
  <StepContent ... />
</StepTransition>
```

### `ProgressDots.tsx`

Visual indicator showing current step and total steps. Allows clicking to jump to specific steps.

**Props:**
- `total: number` - Total number of steps
- `currentIndex: number` - Current step index (0-based)
- `onSelect: (index: number) => void` - Handler when dot is clicked

**Usage:**
```tsx
<ProgressDots
  total={TOTAL_STEPS}
  currentIndex={currentIndex}
  onSelect={goToStep}
/>
```

### Permission Section (within `StepContent.tsx`)

The final onboarding step includes an inline permission request for location access:

- Inline clickable link to request location permission
- Contextual error messaging when permission is denied or unavailable
- Loading states while permission request is active
- Status-aware button labels ("Skip for now" vs "Complete the onboarding")
- Accessible button with proper ARIA attributes

The permission request is implemented as an inline link within the step description, maintaining consistency with the rest of the step content and animations.

## Utilities

### `lib/onboarding/storage.ts`

Client-side storage utilities for persisting onboarding state.

**Functions:**
- `markStepCompleted(step: StepId)` - Mark a step as completed
- `markOnboardingCompleted({ skipped })` - Mark onboarding as complete
- `getOnboardingState()` - Get current onboarding state
- `resetOnboardingState()` - Reset onboarding state (for testing)
- `subscribeToOnboardingState(listener)` - Subscribe to cross-tab state changes

### `lib/onboarding/permissions.ts`

Browser permission API wrappers with graceful error handling.

**Functions:**
- `isLocationSupported()` - Check if geolocation is supported
- `isNotificationSupported()` - Check if notifications are supported
- `getBrowserInfo()` - Get browser information for error messages
- `requestLocationPermission()` - Request location permission
- `requestNotificationPermission()` - Request notification permission

### `lib/onboarding/analytics.ts`

Analytics tracking utilities for onboarding events.

**Functions:**
- `analytics.start()` - Track onboarding start
- `analytics.stepView(stepId, stepNumber)` - Track step view
- `analytics.stepComplete(stepId, stepNumber)` - Track step completion
- `analytics.permissionRequest(permission)` - Track permission request
- `analytics.skip(step, stepId)` - Track skip event
- `analytics.complete(skipped, completedSteps)` - Track completion
- `analytics.quickStart(action)` - Track quick start selection

## Types

### `types.ts`

TypeScript type definitions for onboarding components.

**Key Types:**
- `StepId` - Step identifier union type
- `IllustrationId` - Illustration identifier union type
- `OnboardingStep` - Step data structure
- `PermissionStatus` - Permission state structure
- `OnboardingStorageState` - Storage state structure

## Flow Structure

The onboarding flow consists of 5 steps:

1. **Welcome** - Welcome screen with value proposition
2. **Discover** - Introduction to discovering Gems
3. **Follow** - Introduction to following Krawls
4. **Create** - Introduction to creating content
5. **Permissions** - Location permission request with inline link

## Features

- ✅ Smooth animations and transitions
- ✅ Mobile-optimized responsive design (primary button first on mobile)
- ✅ Accessibility (WCAG 2.1 Level AA) with proper ARIA attributes
- ✅ Analytics tracking for all user interactions
- ✅ Cross-tab synchronization via localStorage events
- ✅ Location permission request with inline link
- ✅ Browser compatibility detection
- ✅ Graceful error handling and user-friendly messages
- ✅ Race condition protection in navigation
- ✅ Type-safe permission status management

## Usage Example

```tsx
// In app/onboarding/page.tsx
import { OnboardingFlow } from "@/components/onboarding";

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
```

## Testing

### Manual Testing Checklist

- [ ] Test all 5 steps render correctly
- [ ] Test Previous button (disabled on step 1, works on steps 2-5)
- [ ] Test Next button navigation
- [ ] Test "Skip for now" button on permissions step (when location not granted)
- [ ] Test "Complete the onboarding" button (when location is granted)
- [ ] Test button layout on mobile (primary button first, back button below)
- [ ] Test button layout on desktop (back button left, primary button right)
- [ ] Test navigation is hidden on onboarding page
- [ ] Test animations are smooth
- [ ] Test location permission request via inline link
- [ ] Test permission error messages display correctly
- [ ] Test on mobile devices (iOS/Android)
- [ ] Test cross-tab synchronization
- [ ] Test browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Test rapid button clicking (race condition protection)
- [ ] Test keyboard navigation and accessibility

### Edge Cases to Test

- User skips onboarding ("Skip for now" button)
- Location permission denied
- Location permission error (timeout, unavailable)
- User returns after skipping
- Onboarding partially completed
- localStorage disabled
- localStorage quota exceeded
- Browser doesn't support geolocation
- Rapid navigation clicks (race condition)
- Cross-tab completion during active flow
- Network errors during permission request
- Component unmount during async permission request

## Related Documentation

- [TASK-029 Solution Design](../../../docs/design/TASK-029_SOLUTION_DESIGN.md)
- [TASK-046 Implementation Summary](../../../TASK-046_IMPLEMENTATION_SUMMARY.md)
- [TASK-046 QA Verification Report](../../../TASK-046_QA_VERIFICATION_REPORT.md)


