# Guest Mode Guide

## Overview

TASK-048 introduces a first-class guest experience so users can explore the map, search, and read Gem/Krawl content without authenticating. When a guest attempts a protected action (create, vouch, rate, comment, download, Krawl Mode, settings) we surface contextual prompts and preserve their state so the transition to a signed-in session is seamless.

---

## Key Building Blocks

### Utilities (`frontend/lib/guest-mode.ts`)

- `GuestFeatureContext` – typed list of protected features (`"create"`, `"vouch"`, `"rate"`, `"comment"`, `"download"`, `"krawl-mode"`, `"settings"`, `"profile"`).
- `storeGuestContext` / `retrieveGuestContext` – persist filters, scroll position, and optional `redirectTo` destination in `sessionStorage` before redirecting to `/auth/sign-in`.
- `getSignInMessage` – standardized copy for each feature (“Sign in to create Gems and Krawls”, “Sign in to vouch for this Gem”, etc.).
- LocalStorage helpers (`getGuestPreferences`, `setGuestPreference`) for banner dismissal and future guest preferences.

### Hook (`frontend/hooks/useGuestMode.ts`)

```tsx
const { isGuest, navigateToSignIn, handleProtectedAction } = useGuestMode();
```

- `navigateToSignIn(context, options)` – stores context and routes to `/auth/sign-in`. `options.redirectTo` lets CTAs return users to `/gems/create`, etc.
- `handleProtectedAction(action, context)` – executes `action` immediately if authenticated, or triggers the sign-in flow for guests.
- `showSignInPrompt(context, options)` – low-level helper used by `SignInPrompt`.

### UI Components

- **`SignInPrompt`** (`components/auth/SignInPrompt.tsx`): button/banner/inline/tooltip variants that call `navigateToSignIn`.
- **`GuestModeBanner`** (`components/auth/GuestModeBanner.tsx`): dismissible top-of-page banner rendered by `NavigationWrapper`.
- Navigation components (Header, MobileMenu, BottomNav) now integrate `useGuestMode` so every guest CTA is consistent.

---

## Integration Checklist

1. **Protected CTA:** Wrap actions with `handleProtectedAction` or replace the UI with `<SignInPrompt context="...">`.
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

### Inline Prompt

```tsx
import { SignInPrompt } from "@/components/auth";

{isGuest ? (
  <SignInPrompt context="comment" variant="inline" fullWidth />
) : (
  <CommentEditor />
)}
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

