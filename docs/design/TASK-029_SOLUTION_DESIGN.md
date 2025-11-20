---
title: TASK-029 – Design Onboarding Flow
last_updated: 2025-11-20
owner: design-system
related_tasks:
  - TASK-026
  - TASK-046
---

## 1. Overview
- **Goal:** Deliver a 5-step onboarding experience that welcomes first-time users, communicates value, and responsibly requests permissions before handing off to either guest or authenticated journeys.
- **Audience:** First-time guests (majority), newly authenticated users, and returning users who replay onboarding from Settings/Help.
- **Entry Points:** Post-auth success redirect, first guest launch, manual replay (`Profile → Help → View Onboarding` placeholder).
- **Exit Points:** Global Skip, completion CTA (`Explore as Guest`), authentication CTA (`Sign In to Create`), or auto-dismiss after permissions granted.

## 2. Acceptance Criteria Traceability
| Requirement | Design Solution |
|-------------|-----------------|
| Welcome screen + value proposition | Step 1 “Welcome to Krawl” hero with logo, headline, tagline |
| 3–4 feature intro steps | Steps 2–4: Discover Gems, Follow Krawls, Create & Share |
| Permission request screen | Step 5 “Ready to Explore?” with rationale bullets and dual permission actions |
| Quick start options | Final step includes `Explore as Guest` + `Sign In to Create` buttons |
| Optional, skippable, progress indicator | Persistent top-right Skip, step counter (`Step X of 5`) + dot indicator bottom |
| Mobile optimized + visually appealing | 8pt spacing grid, fluid illustrations, typography tokens, 360px min viewport |
| Edge cases (skip, deny, replay, multi permissions) | Documented in §5 Edge Cases + flows in §3 |

## 3. Flow & UX
### 3.1 Step Details
| Step | Content | Illustration | CTA |
|------|---------|--------------|-----|
| 1 – Welcome | Logo, “Welcome to Krawl”, tagline, `Get Started`, Skip visible | Map of Cebu City | `Get Started` |
| 2 – Discover Gems | Headline “Discover Cultural Gems” + 2-line body | Map with gem pins | `Next` |
| 3 – Follow Krawls | Headline “Follow Guided Krawls”, value copy | Trail connecting pins | `Next` |
| 4 – Create & Share | Headline “Create & Share”, highlight community | User adding content | `Next` |
| 5 – Permissions & Start | Why we need location bullet list, optional notifications, quick-start CTAs | Location icon | Permission buttons + Quick Start |

### 3.2 Interaction Rules
- **Skip:** Visible at every step (text button). Immediately marks onboarding as viewed (`skipped=true`) and routes to destination.
- **Progress Indicator:** Text (“Step X of 5”) + dot strip. Non-current dots are interactive on pointer/keyboard devices; the current step is disabled with `aria-current="step"` and `aria-disabled="true"` for clarity.
- **Permission Requests:** `Allow Location` primary, `Enable Notifications` secondary. Provide inline success/denied states, never block progression.
- **Micro-Interactions:** Illustrations fade in, CTA bounce subtle on hover, permission success shows checkmark icon + supportive copy.

### 3.3 Navigation Targets
- `Explore as Guest` → `/` (Map View placeholder until Task-051).
- `Sign In to Create` → `/auth/sign-in` (placeholder screen merged with copy explaining Google sign-in is coming soon).
- Replay entry point documented for Task-046 to wire from profile/help.

## 4. Component Architecture (Next.js)
```
app/onboarding/page.tsx         # Route entry (server component) -> <OnboardingFlow />
components/onboarding/
  OnboardingFlow.tsx            # State machine + orchestration
  StepContent.tsx               # Illustration + copy
  ProgressDots.tsx              # Step indicator
  SkipButton.tsx                # Reusable action
  PermissionActions.tsx         # Permission CTAs + status
  QuickStartActions.tsx         # Guest vs Sign In CTAs
  types.ts                      # Shared types/enums
lib/onboarding/
  steps.ts                      # Step metadata
  storage.ts                    # LocalStorage helpers
  permissions.ts                # Wrapper for Geolocation/Notification APIs
```

**State Machine**
- `currentStep` (0-4)
- `permissions.location` (`unknown | granted | denied | error`)
- `permissions.notification` (same union)
- `status.skipRequested` (boolean)

Actions: `NEXT`, `SKIP`, `SET_STEP`, `ALLOW_LOCATION_SUCCESS/FAIL`, `ALLOW_NOTIFICATIONS_SUCCESS/FAIL`, `COMPLETE`.

## 5. Edge Cases & Handling
| Scenario | UX Response |
|----------|-------------|
| Skip immediately | Store `skipped=true`, route to destination, show snackbar on next page “You can view onboarding again from Settings.” |
| Permission denied | Inline error message + “Learn how” helper text, allow user to continue via quick-start buttons. Store `locationDeniedAt` timestamp to avoid re-prompt in session. |
| User returns after skipping | Provide Settings entry. When triggered, reset storage state and start at Step 1. |
| Multiple permission prompts | Staggered UI, handle success+failure independently. Notification request only shown if browser supports API. |
| Offline / API error | Show error state (“We couldn’t request permissions right now.”) with `Try again` button; do not block progression. |

## 6. Visual & Content Guidelines
- **Typography:** Headings `--text-3xl` mobile / `--text-4xl` desktop; body `--text-lg`.
- **Color Palette:** Primary green for CTAs, accent orange for highlights, warm yellow for permission tips.
- **Illustrations:** 280×220px max on mobile, 420×320px desktop. Use existing brand illustration style (flat, minimal).
- **Spacing:** 8px grid, 24px vertical rhythm between sections.
- **Accessibility:** Contrast ≥ 4.5:1, focus outlines, skip button keyboard-focusable, step indicators announce `aria-current="step"`.

## 7. Technical Notes for Implementation
- Components marked `use client`; route entry remains server component.
- Storage key: `krawl:onboarding:v1`.
- Storage helpers cache the most recent state in-memory to reduce JSON parse/write churn.
- Router destinations configurable via props to support future flows.
- Provide placeholder analytics hooks (`trackOnboardingEvent`) for future integration.
- Defer `navigator.permissions` usage to avoid SSR issues; guard behind `typeof window`.

## 8. Testing Strategy
1. **Unit Tests (React Testing Library)**
   - Step rendering sequence, skip behavior, progress dots.
   - Permission button state changes.
   - Quick start CTAs call expected callbacks.
2. **Integration Tests (Playwright)**
   - First visit → complete flow with permissions granted.
   - Skip path.
   - Denied permissions path.
3. **Manual QA**
   - Mobile Safari/Chrome layout checks.
   - Keyboard navigation on desktop.
   - Screen-reader announcements for skip/Progress/permission.
   - Replay from Settings (simulate storage reset).

## 9. Handoff Checklist
- [x] Documentation committed (`TASK-029_SOLUTION_DESIGN.md`).
- [x] Component scaffolding merged (see frontend structure).
- [ ] Figma prototype link added to README (pending design export).
- [ ] QA + Review reports to be completed post-stakeholder review.

## 10. Implementation Snapshot (Week 2)
- **Routes:** `/onboarding` (multi-step flow) and `/auth/sign-in` (temporary CTA landing screen).
- **Key Files:** `frontend/components/onboarding/*`, `frontend/lib/onboarding/*`.
- **State Handling:** `OnboardingFlow` orchestrates current step, permission states, and skip completion; `storage.ts` caches onboarding progress client-side.
- **Accessibility:** Skip button is keyboard-focusable, progress dots expose `aria-current`, permission buttons announce success/error via inline text.

This document, combined with updated wireframes and scaffolding, unblocks TASK-046 implementation work.

