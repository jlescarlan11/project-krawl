# Guest Indicators

Helpers for TASK-049 that keep guest-mode messaging consistent across the app.

## Components

### `ProtectedActionGate`
Render-prop wrapper that exposes guest helpers so protected CTAs can share a single code path.

```tsx
import { ProtectedActionGate } from "@/components/guest";

<ProtectedActionGate context="create">
  {({ isGuest, requestSignIn, promptId, Prompt }) =>
    isGuest ? (
      <>
        <button
          type="button"
          onClick={() => requestSignIn()}
          aria-describedby={promptId}
          className="cta-button"
        >
          Sign in to create
        </button>
        <span className="sr-only">{Prompt}</span>
      </>
    ) : (
      <NavLink href={ROUTES.GEM_CREATE} label="Create" />
    )
  }
</ProtectedActionGate>;
```

### `ProtectedFeatureBadge`
Pill/banner badge that announces locked functionality and links to the sign-in flow.

```tsx
import { ProtectedFeatureBadge } from "@/components/guest";

<ProtectedFeatureBadge context="comment" />;
<ProtectedFeatureBadge context="krawl-mode" variant="banner" />;
```

## Usage Guidelines
- Prefer `ProtectedActionGate` whenever an action button behaves differently for guests.
- Use `aria-describedby={promptId}` from the gate to keep tooltips accessible.
- Place `ProtectedFeatureBadge` near section headers or CTA clusters to highlight value props without spamming prompts.

