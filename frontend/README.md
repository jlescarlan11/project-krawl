This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technology Stack

- **Next.js:** 16.0.3
- **React:** 19.2.0
- **TypeScript:** 5.x
- **Tailwind CSS:** v4 (CSS-based configuration with @tailwindcss/postcss)
- **ESLint:** 9.x (with eslint-config-next)
- **Prettier:** 3.x (code formatter)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file (hot module replacement enabled).

## Progressive Web App (PWA) Support

Krawl ships with offline and installable capabilities powered by [`next-pwa`](https://github.com/shadowwalker/next-pwa).

- `next.config.ts` wraps the Next.js config with `withPWA`
- Manifest is served from `app/manifest.ts`
- Offline fallback lives at `app/offline/page.tsx` + `public/offline.html`
- Icons are stored in `public/icons/*`
- Regenerate brand-accurate icons anytime with `python frontend/scripts/generate_pwa_icons.py`

### Development Tips

- PWA is disabled in development to avoid caching surprises. To test locally, set `NEXT_PUBLIC_ENABLE_PWA=true` before running `npm run dev`.
- Production builds must use `npm run build` (which passes `--webpack`) because `next-pwa` is not yet compatible with the default Turbopack pipeline in Next.js 16.
- Run Lighthouse (Chrome dev tools → Lighthouse → PWA) to validate install criteria.
- Use the [PWA Test Plan](./docs/PWA_TEST_PLAN.md) for the full QA checklist.

## Code Formatting

This project uses [Prettier](https://prettier.io/) for consistent code formatting.

### Formatting Commands

```bash
# Format all files
npm run format

# Check if files are formatted (for CI/CD)
npm run format:check
```

### IDE Integration

For the best experience, configure your IDE to format on save:

- **VS Code:** Install the "Prettier - Code formatter" extension
- **WebStorm/IntelliJ:** Enable Prettier in Settings > Languages & Frameworks > JavaScript > Prettier

### Prettier Configuration

Prettier is configured via `.prettierrc.json`. The configuration follows project conventions:

- Double quotes for strings
- Semicolons required
- 2-space indentation
- 80 character line width

**ESLint Integration:** ESLint and Prettier are integrated using `eslint-config-prettier` to prevent formatting conflicts. ESLint handles code quality while Prettier handles formatting.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts from Google Fonts:

- **[Inter](https://fonts.google.com/specimen/Inter)** - Primary typeface for body text and UI elements
- **[Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)** - Secondary typeface (optional for headings)

Both fonts support English, Tagalog, and Cebuano languages. For complete typography specifications, see `docs/design/BRAND_GUIDELINES.md`.

## Current Routes

- `/` – placeholder landing experience (will later become the marketing/hero page)
- `/onboarding` – new 5-step onboarding flow implemented for TASK-029
- `/auth/sign-in` – temporary screen users reach when selecting “Sign In to Create” inside onboarding

Update onboarding copy, illustrations, or CTA targets by editing:

- `components/onboarding/*` for UI building blocks
- `lib/onboarding/steps.ts` for step-by-step metadata
- `lib/onboarding/storage.ts` for localStorage persistence

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components (UI library)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── types/            # Shared TypeScript type definitions
├── public/           # Static assets
├── docs/             # Project documentation
└── ...
```

### Directory Organization

- **`/app`** - Next.js App Router pages, layouts, and route handlers
- **`/components`** - Reusable React components (UI library)
- **`/hooks`** - Custom React hooks (reusable logic)
- **`/lib`** - Utility functions, helpers, and shared logic
- **`/types`** - Shared TypeScript type definitions
- **`/public`** - Static assets (images, icons, etc.)

**Note:** Component-specific types and hooks can remain co-located with their components for better organization.

## Development Workflow

### Before Committing

1. **Format code:**

   ```bash
   npm run format
   ```

2. **Lint code:**

   ```bash
   npm run lint
   ```

3. **Type check:**
   ```bash
   npm run build
   ```

### Hot Reload

The development server supports hot module replacement (HMR) with Fast Refresh enabled by default:

- Component changes are reflected immediately
- State is preserved during hot reload
- Fast refresh enabled by default
- No full page reload required

**Start the development server:**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

**Verifying Hot Reload:**

1. Start the dev server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Open browser DevTools (F12) and check the Console tab
4. Make a change to `app/page.tsx` (e.g., change the heading text)
5. Save the file
6. **Expected behavior:**
   - Changes appear immediately in the browser
   - Console shows "Fast Refresh" messages
   - No full page reload occurs
   - Browser URL stays the same
   - Any form state or scroll position is preserved

**Troubleshooting:**

If hot reload doesn't work:

- Check browser console for errors
- Verify the dev server is running
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Restart the dev server
- Check for syntax errors that might prevent HMR

### Import Patterns

The project uses path aliases for clean imports:

```tsx
// ✅ Good - Using path aliases
import { Button } from "@/components";
import { useBreakpoint } from "@/hooks";
import { cn } from "@/lib/utils";
import type { StepId } from "@/types";

// ❌ Avoid - Relative paths
import { Button } from "../../components/ui/button";
```

## Component Library

Krawl includes a comprehensive component library with reusable UI components built with TypeScript, accessibility, and the design system in mind.

### Available Components

- **Buttons:** Primary, secondary, outline, text, and accent variants with loading states
- **Cards:** Standard, interactive, and elevated variants with image support
- **Form Components:** Input, Textarea, Select, Checkbox, Radio, and FileUpload with validation states

### Usage

```tsx
// Import components from the barrel export
import { Button, Card, Input } from '@/components'

// Use components with TypeScript support
<Button variant="primary" size="md">Create Gem</Button>
<Card variant="standard" padding="default">Content</Card>
<Input label="Email" type="email" required />
```

For complete component documentation, see [`components/README.md`](./components/README.md).

## Design Tokens

Krawl uses a comprehensive design token system for consistent styling across the application. Design tokens are defined in `app/globals.css` using Tailwind CSS v4's `@theme` directive and are accessible via:

- **Tailwind CSS utilities:** `bg-primary-green`, `text-text-primary`, `font-sans`, etc.
- **CSS custom properties:** `var(--color-primary-green)`, `var(--font-family-sans)`, etc.
- **TypeScript exports:** Import from `lib/design-tokens.ts` for type-safe access

### Quick Reference

For a complete reference of all available design tokens, see [`docs/DESIGN_TOKENS.md`](./docs/DESIGN_TOKENS.md).

### Usage Examples

```tsx
// Using Tailwind classes (recommended)
<button className="bg-primary-green text-white px-6 py-3 rounded-lg">
  Create Gem
</button>;

// Using TypeScript design tokens
import { colors } from "@/lib/design-tokens";
const primaryColor = colors.primary.green; // '#2D7A3E'
```

### Design Token Categories

- **Colors:** Primary, text, background, and semantic colors
- **Typography:** Font families, sizes, weights, line heights, letter spacing
- **Spacing:** 8px-based spacing scale
- **Border Radius:** Consistent rounded corner values
- **Shadows & Elevation:** Six-step elevation scale for depth states
- **Transitions:** Duration and easing tokens (fast/normal/slow) plus common patterns
- **Z-Index Layers:** Named stacking contexts for overlays, modals, tooltips, etc.
- **Borders:** Width and style tokens for consistent outlines
- **Breakpoints:** Responsive breakpoints for mobile-first design

All design tokens follow WCAG 2.1 Level AA accessibility standards.

## Responsive Breakpoints

Krawl uses a mobile-first responsive design approach with Tailwind CSS breakpoints. The breakpoint system is available through:

- **Tailwind CSS classes:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes
- **TypeScript constants:** Import from `lib/design-tokens` or `lib/breakpoints`
- **React hooks:** `useIsMobile()`, `useIsTablet()`, `useIsDesktop()`, `useBreakpoint()`

### Breakpoint Values

- **Mobile:** 0px - 639px (default, no prefix)
- **Tablet:** 640px - 1023px (`sm:` prefix)
- **Desktop:** 1024px - 1279px (`lg:` prefix)
- **Large Desktop:** 1280px - 1535px (`xl:` prefix)
- **Extra Large:** 1536px+ (`2xl:` prefix)

### Usage Examples

```tsx
// Using Tailwind responsive classes (recommended)
<div
  className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-8
"
>
  {/* Content */}
</div>;

// Using React hooks for conditional rendering
import { useIsMobile, useIsDesktop } from "@/hooks";

function MyComponent() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
}
```

For complete breakpoint documentation and examples, see [`docs/DESIGN_TOKENS.md`](./docs/DESIGN_TOKENS.md#breakpoints).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
