# Guest Mode Guide

## Overview

TASK-048 introduces a first-class guest experience so users can explore the map, search, and read Gem/Krawl content without authenticating. When a guest attempts a protected action (create, vouch, rate, comment, download, Krawl Mode, settings) we surface contextual prompts and preserve their state so the transition to a signed-in session is seamless.

---

## Key Building Blocks

### Utilities (`frontend/lib/guest-mode.ts`)

- `GuestFeatureContext` / `GuestUpgradeIntent` – typed list of protected features + passive intents (`"map"`, `"search"`, `"onboarding"`).
- `GuestUpgradeContext` – versioned (v2) snapshot persisted in `sessionStorage` with TTL (30 minutes) capturing route, scroll, search filters, map viewport, and optional redirect overrides.
- `storeGuestContext` / `retrieveGuestContext` – persist and restore upgrade state with automatic size guarding and legacy shape conversion.
- `persistGuestStateForRestore` / `consumeGuestStateForRestore` – allow downstream pages (map/search) to hydrate filters and viewport immediately after sign-in.
- `queueGuestUpgradeSuccess` / `consumeGuestUpgradeSuccess` – enqueue toast payloads so the post-redirect page can display contextual success messaging.
- `getSignInMessage` / `getUpgradeSuccessMessage` – standardized copy for prompts and success banners.
- LocalStorage helpers (`getGuestPreferences`, `setGuestPreference`) for banner dismissal and future guest preferences.

### Hooks

#### `useGuestMode` (`frontend/hooks/useGuestMode.ts`)

```tsx
const { isGuest, navigateToSignIn, handleProtectedAction } = useGuestMode();
```

- `navigateToSignIn(context, options)` – stores context and routes to `/auth/sign-in`. `options.redirectTo` lets CTAs return users to `/gems/create`, etc.
- `contextData` option accepts map/search payloads so feature-specific CTAs can supply richer snapshots (e.g., highlighted Gem IDs, filter chips).
- `handleProtectedAction(action, context)` – executes `action` immediately if authenticated, or triggers the sign-in flow for guests.
- `showSignInPrompt(context, options)` – low-level helper used by `SignInPrompt`.

#### `useGuestContextSync` (`frontend/hooks/useGuestContextSync.ts`)

- Lightweight hook for pages like Map/Search to push live state (filters, viewport, selections) into the guest context while the user browses.
- Accepts an `intent`, a `getContext` callback, and a dependency array so the snapshot stays current without duplicate code.

- **`SignInPrompt`** (`components/auth/SignInPrompt.tsx`): button/banner/inline/tooltip variants that call `navigateToSignIn`. Accepts `contextData` for CTAs that already know the desired redirect or payload.
- **`ProtectedActionGate`** (`components/guest/ProtectedActionGate.tsx`): render-prop helper that short-circuits protected CTAs for guests and wires `aria-describedby` tooltips automatically.
- **`ProtectedFeatureBadge`** (`components/guest/ProtectedFeatureBadge.tsx`): pill or banner badge that communicates “Sign in to unlock” messaging.
- **`GuestModeBanner`** (`components/auth/GuestModeBanner.tsx`): dismissible top-of-page banner rendered by `NavigationWrapper`.
- **`GuestUpgradeSuccessToast`** (`components/auth/GuestUpgradeSuccessToast.tsx`): listens for stored success payloads after sign-in and fires a contextual toast once.
- Navigation components (Header, MobileMenu, BottomNav) now integrate these helpers so every guest CTA is consistent and routes back to the right destination (`redirectTo` when needed).

---

## Integration Checklist

1. **Protected CTA:** Wrap actions with `ProtectedActionGate` (preferred) or `handleProtectedAction`; render `ProtectedFeatureBadge` nearby when space allows.
2. **Return URL:** Pass `redirectTo` when guests should land on a specific route after signing in (e.g., `ROUTES.GEM_CREATE`).
3. **State Preservation:** Avoid serializing large objects—stick to filters, scroll, and destination paths.
4. **Accessibility:** When using the tooltip variant, pair it with `aria-describedby` on the disabled button so screen readers get the explanation.
5. **Banner Placement:** `GuestModeBanner` is already rendered globally. Only add additional banners if a page requires localized messaging.

---

## Example Patterns

### Guarding a Button

```tsx
import { useGuestMode } from "@/hooks";

function VouchButton({ gemId }: { gemId: string }) {
  const { handleProtectedAction } = useGuestMode();

  return (
    <Button
      onClick={() =>
        handleProtectedAction(() => vouchForGem(gemId), "vouch")
      }
    >
      Vouch
    </Button>
  );
}
```

### Inline Prompt / Badge

```tsx
import { ProtectedActionGate, ProtectedFeatureBadge } from "@/components/guest";

<ProtectedActionGate context="comment">
  {({ isGuest, requestSignIn, promptId, Prompt }) =>
    isGuest ? (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => requestSignIn()}
          aria-describedby={promptId}
          className="btn btn-primary w-full"
        >
          Sign in to comment
        </button>
        <div className="sr-only">{Prompt}</div>
        <ProtectedFeatureBadge context="comment" />
      </div>
    ) : (
      <CommentEditor />
    )
  }
</ProtectedActionGate>
```

### CTA with Custom Redirect

```tsx
const { navigateToSignIn } = useGuestMode();

<Button
  onClick={() =>
    navigateToSignIn("create", { redirectTo: ROUTES.KRAWL_CREATE })
  }
>
  Sign in to Create a Krawl
</Button>;
```

---

## Related Documentation

- [Session Management Guide](./SESSION_MANAGEMENT.md) – includes guest context preservation details.
- [Navigation README](../components/navigation/README.md) – describes how guest prompts integrate with Header/MobileMenu/BottomNav.
- [Auth Components README](../components/auth/README.md) – documents `SignInPrompt` and `GuestModeBanner`.

---

**Last Updated:** 2025-01-27  
**Status:** ✅ **Guest mode implemented (TASK-048)**

---

## Manual QA Checklist

- [ ] Visit Header (desktop) as guest: `Create` CTA shows badge + disabled tooltip, Sign In button visible in user controls.
- [ ] Open MobileMenu as guest: create section shows badge + CTA, profile section shows sign-in button with tooltip.
- [ ] Tap BottomNav FAB as guest: button stays disabled, explanatory text renders, tapping triggers sign-in.
- [ ] Onboarding “Create & Share” step shows GuestActionShowcase with badges + disabled sample CTAs.
- [ ] Dismiss guest banner and refresh – dismissal preference persists (localStorage).

