This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technology Stack

- **Next.js:** 16.0.3
- **React:** 19.2.0
- **TypeScript:** 5.x
- **Tailwind CSS:** v4 (CSS-based configuration with @tailwindcss/postcss)
- **Zustand:** 5.0.8 (state management)
- **Sentry:** @sentry/nextjs@10.26.0 (error tracking and performance monitoring)
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

Krawl ships with offline and installable capabilities using the [official Next.js PWA approach](https://nextjs.org/docs/app/guides/progressive-web-apps).

- `app/manifest.ts` defines the web app manifest (Next.js built-in support)
- `public/sw.js` implements the service worker with caching strategies
- `components/system/ServiceWorkerRegistration.tsx` handles service worker registration
- Offline fallback lives at `app/offline/page.tsx` + `public/offline.html`
- Icons are stored in `public/icons/*`
- Regenerate brand-accurate icons anytime with `python frontend/scripts/generate_pwa_icons.py`

### Development Tips

- PWA is disabled in development by default. To test locally, set `NEXT_PUBLIC_ENABLE_PWA=true` before running `npm run dev`.
- Production builds use standard `npm run build` (no special flags needed).
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

## Routing Structure

Krawl uses Next.js 16 App Router with a comprehensive routing structure. All routes are defined in `lib/routes.ts` for type safety and maintainability.

### Public Routes

- `/` – Landing page (placeholder, will become marketing/hero page)
- `/map` – Map view page
- `/search` – Search & discovery page
- `/gems/[id]` – Gem detail page (dynamic route)
- `/krawls/[id]` – Krawl detail page (dynamic route)
- `/krawls/[id]/mode` – Krawl mode page (dynamic route)
- `/users/[id]` – User profile page (dynamic route)
- `/onboarding` – 5-step onboarding flow (TASK-029)
- `/auth/sign-in` – Sign in page
- `/auth/signout` – Sign out page
- `/auth/callback` – OAuth callback handler

### Protected Routes

These routes require authentication and redirect to sign-in if the user is not authenticated:

- `/gems/create` – Create new Gem
- `/krawls/create` – Create new Krawl
- `/users/settings` – User profile settings
- `/offline` – Offline downloads management

### Legal Pages

- `/terms` – Terms of Service
- `/privacy` – Privacy Policy

### Route Protection

Routes are protected at two levels:
1. **Server-side:** Next.js middleware (`middleware.ts`) intercepts requests
2. **Client-side:** `ProtectedRoute` component wraps protected page content

### Layout Components

Layout components provide consistent page structure and spacing:
- `Container` – Max-width container with responsive padding
- `Section` – Section with vertical spacing and background variants
- `PageLayout` – Page wrapper with optional breadcrumbs, title, and description

For complete layout documentation, see [`components/layout/README.md`](./components/layout/README.md).

### Navigation Components

Navigation is handled by components in `components/navigation/`:
- `Header` – Desktop top navigation
- `Footer` – Site footer
- `MobileMenu` – Mobile slide-in menu
- `BottomNav` – Mobile bottom navigation
- `Breadcrumbs` – Dynamic breadcrumb navigation
- `NavLink` – Reusable navigation link with active state
- `ProtectedRoute` – Client-side route protection wrapper

For complete navigation documentation, see [`components/navigation/README.md`](./components/navigation/README.md).

### Route Constants

Use centralized route constants for type safety:

```tsx
import { ROUTES } from "@/lib/routes";

// Static routes
<Link href={ROUTES.MAP}>Map</Link>
<Link href={ROUTES.SEARCH}>Search</Link>

// Dynamic routes
<Link href={ROUTES.GEM_DETAIL(gemId)}>View Gem</Link>
<Link href={ROUTES.KRAWL_DETAIL(krawlId)}>View Krawl</Link>
```

### Route Utilities

Utility functions for route-related logic:

```tsx
import { isProtectedRoute, isActiveRoute, getReturnUrl } from "@/lib/route-utils";

// Check if route requires authentication
if (isProtectedRoute(pathname)) {
  // Handle protected route
}

// Check if route is active
const isActive = isActiveRoute(currentPath, targetPath, exact);

// Get return URL from query params
const returnUrl = getReturnUrl(searchParams);
```

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components (UI library)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── stores/           # Zustand state management stores
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
- **`/stores`** - Zustand state management stores
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

- **Layout Components:** Container, Section, PageLayout for consistent page structure
- **Navigation Components:** Header, Footer, MobileMenu, BottomNav, Breadcrumbs, NavLink, ProtectedRoute
- **Buttons:** Primary, secondary, outline, text, and accent variants with loading states
- **Cards:** Standard, interactive, and elevated variants with image support
- **Form Components:** Input, Textarea, Select, Checkbox, Radio, and FileUpload with validation states

### Usage

```tsx
// Import components from the barrel export
import { Container, Section, PageLayout, Button, Card, Input } from '@/components'

// Layout components
<PageLayout title="Page Title" breadcrumbs>
  <Section spacing="md" background="light">
    <Container>
      <h2>Section Title</h2>
      <p>Content here...</p>
    </Container>
  </Section>
</PageLayout>

// UI components
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

## State Management (Zustand)

Krawl uses [Zustand](https://github.com/pmndrs/zustand) for lightweight, type-safe state management. The application includes three core stores:

- **`authStore`** - Authentication state (user session, auth status)
- **`uiStore`** - UI state (modals, sidebars, theme preferences)
- **`mapStore`** - Map viewport state (center, zoom, selected markers, filters)

### Usage

```tsx
// Import stores and selectors
import { useAuthStore, useIsAuthenticated } from "@/stores";
import { useUIStore, useModal, useTheme } from "@/stores";
import { useMapStore, useMapCenter } from "@/stores";

// Use stores in components
function MyComponent() {
  // Access full store
  const { user, signIn, signOut } = useAuthStore();

  // Use selectors for derived state
  const isAuthenticated = useIsAuthenticated();
  const theme = useTheme();
  const mapCenter = useMapCenter();

  // Update state
  const openModal = useUIStore((state) => state.openModal);

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={() => signIn(userData, sessionData)}>Sign In</button>
      )}
    </div>
  );
}
```

### Store Features

- **Type-safe:** Full TypeScript support with explicit interfaces
- **Persistence:** Auth and UI theme preferences persist to localStorage
- **Devtools:** Redux DevTools integration for debugging
- **SSR-safe:** Handles Next.js App Router server/client boundaries
- **Optimized:** Selectors prevent unnecessary re-renders

### Available Stores

#### Auth Store (`useAuthStore`)

- **State:** `status`, `user`, `session`, `error`
- **Actions:** `signIn()`, `signOut()`, `setStatus()`, `setUser()`, `setSession()`, `setError()`, `clearError()`
- **Selectors:** `useAuthStatus()`, `useAuthUser()`, `useIsAuthenticated()`, `useAuthError()`

#### UI Store (`useUIStore`)

- **State:** `modals`, `sidebars`, `theme`, `loading`
- **Actions:** `openModal()`, `closeModal()`, `toggleModal()`, `openSidebar()`, `closeSidebar()`, `toggleSidebar()`, `setTheme()`, `setLoading()`
- **Selectors:** `useModal(id)`, `useSidebar(side)`, `useTheme()`, `useLoading(key)`

#### Map Store (`useMapStore`)

- **State:** `center`, `zoom`, `bearing`, `pitch`, `selectedMarkerId`, `filters`, `controls`
- **Actions:** `setCenter()`, `setZoom()`, `selectMarker()`, `setFilters()`, `resetFilters()`, `toggleControl()`
- **Selectors:** `useMapCenter()`, `useMapZoom()`, `useSelectedMarker()`, `useMapFilters()`

For complete store documentation, see the store files in `stores/` directory.

## Error Tracking & Monitoring (Sentry)

Krawl uses [Sentry](https://sentry.io/) for comprehensive error tracking and performance monitoring. The integration provides:

- ✅ **Error Tracking:** Automatic capture of JavaScript errors, React component errors, and API errors
- ✅ **Performance Monitoring:** Track page load times, API response times, and user interactions
- ✅ **User Context:** Privacy-first user identification (ID and username only, no email)
- ✅ **Error Filtering:** Automatic filtering of browser extension errors and rate limiting
- ✅ **Data Sanitization:** Automatic removal of sensitive data (passwords, tokens, etc.)
- ✅ **Source Maps:** Production debugging with source map uploads
- ✅ **Error Boundaries:** React error boundaries with user-friendly error UI

### Configuration

Sentry is configured via environment variables in `.env.local`:

```bash
# Sentry DSN (required)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Sentry Environment
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development  # or staging, production

# Optional: Sentry Release (Git commit SHA)
NEXT_PUBLIC_SENTRY_RELEASE=git-commit-sha
```

### Configuration Files

- **`sentry.client.config.ts`** - Client-side configuration (browser)
- **`sentry.server.config.ts`** - Server-side configuration (Node.js)
- **`sentry.edge.config.ts`** - Edge runtime configuration (middleware)
- **`instrumentation.ts`** - Runtime detection and config loading
- **`lib/sentry/error-filtering.ts`** - Error filtering and sanitization logic
- **`lib/sentry/user-context.ts`** - User context management
- **`lib/sentry/config-validation.ts`** - DSN validation utilities

### Components

- **`SentryErrorBoundary`** - React error boundary that catches component errors
- **`SentryUserContextSync`** - Automatically syncs user context from auth store

### Usage

Sentry is automatically initialized when the application starts. No manual setup required.

**Testing Error Tracking:**
- Visit `/sentry-example-page` to test error tracking
- Errors are automatically captured and sent to Sentry dashboard

**Manual Error Reporting:**
```tsx
import * as Sentry from "@sentry/nextjs";

// Capture an exception
Sentry.captureException(new Error("Something went wrong"));

// Capture a message
Sentry.captureMessage("User performed action", "info");

// Add context
Sentry.setContext("custom", { key: "value" });
```

### Documentation

For complete Sentry setup and troubleshooting, see:
- **[SENTRY_INSTALLATION.md](./docs/SENTRY_INSTALLATION.md)** - Installation and configuration guide
- **[SENTRY_SETUP.md](../../docs/private-docs/operations/SENTRY_SETUP.md)** - Account setup and DSN configuration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
