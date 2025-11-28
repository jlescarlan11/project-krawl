# Hero Components

This folder houses the landing page hero experience, which pairs a storytelling hero banner with animated trust indicators. The hero suite keeps the value proposition front-and-center while surfacing calls-to-action and community metrics that reinforce trust.

## HeroSection

`HeroSection` wraps a `Section` and `Container` from `frontend/components/layout` to deliver the gradient background, headline copy, and CTA buttons. It combines:

- The tagline **“The Living Map of Filipino Culture”** with supporting copy that highlights stories, food, and traditions in Cebu.
- Primary and secondary CTAs that link to the map (`ROUTES.MAP`) and sign-in page (`ROUTES.SIGN_IN`) using the shared `Button` component (`variant="primary"` and `variant="outline"`).
- The `HeroVisual` illustration on the right-hand side, which loads `public/hero-cebu.svg` lazily and includes a friendly fallback if the image fails to load.

`HeroSection` requires no props and can be placed at the top of any page that needs to promote the brand story.

## HeroStatsSection

`HeroStatsSection` renders a `Section` that wraps `HeroStats`. It accepts:

| Prop | Type | Description |
|------|------|-------------|
| `stats` | `LandingStats` | Optional stats data (total Gems, total Krawls, active users). When omitted, placeholders appear and the cards show `aria-busy` states. |

Use this component immediately below `HeroSection` to present the trust indicators. The default stats (`DEFAULT_LANDING_STATS`) display 13,242 Gems, 862 Krawls, and 24,500 active users.

## HeroStats

`HeroStats` transforms `LandingStats` into three cards (`STAT_ITEMS`) containing labels, descriptions, and animated values. Key behaviors:

- Values format large numbers as `1.2K` / `1.5M` via `formatStatValue`.
- `useCountUp` animates numbers from zero when the component scrolls into view (observed via `IntersectionObserver`).
- Each card is marked with `aria-busy` and wrapped in an `aria-live="polite"` region for accessible count updates.
- Loading states show `animate-pulse` styling until data is available.

## HeroVisual

`HeroVisual` wraps a Next.js `Image` that loads `/hero-cebu.svg` with `loading="lazy"` and responsive `sizes`. If the image fails to load, a fallback gradient card displays descriptive copy so the hero never feels broken. A gradient overlay keeps text contrast high when the hero section is overlaid on the image.

## useCountUp

`useCountUp(target, shouldAnimate, duration)` is a reusable hook that increments from 0 to the target value over `duration` milliseconds. When animation is disabled, it immediately returns the target. Hero stats rely on this hook to perform accessible count-up animations triggered when the stats section is visible.

## Usage Example

```tsx
import { HeroSection, HeroStatsSection } from "@/components/hero";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HeroStatsSection />
    </>
  );
}
```

Pass real data to `HeroStatsSection` to replace the defaults:

```tsx
const latestStats = {
  totalGems: 15_120,
  totalKrawls: 912,
  activeUsers: 27_340,
};

<HeroStatsSection stats={latestStats} />
```

## Accessibility & Performance

- Buttons provide full `aria-label` coverage via their text labels.
- Stats cards announce their live values to screen readers.
- Hero image loads lazily and degrades gracefully when offline.
- Background gradients and typography adhere to the design system’s contrast guidelines.

Refer to `frontend/components/hero` for the source files (`HeroSection.tsx`, `HeroStatsSection.tsx`, `HeroStats.tsx`, `HeroVisual.tsx`, `useCountUp.ts`) when customizing behavior.


