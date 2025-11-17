This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technology Stack

- **Next.js:** 16.0.3
- **React:** 19.2.0
- **TypeScript:** 5.x
- **Tailwind CSS:** v4 (CSS-based configuration with @tailwindcss/postcss)
- **ESLint:** 9.x (with eslint-config-next)

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts from Google Fonts:
- **[Inter](https://fonts.google.com/specimen/Inter)** - Primary typeface for body text and UI elements
- **[Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)** - Secondary typeface (optional for headings)

Both fonts support English, Tagalog, and Cebuano languages. For complete typography specifications, see `docs/design/BRAND_GUIDELINES.md`.

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
</button>

// Using TypeScript design tokens
import { colors } from '@/lib/design-tokens';
const primaryColor = colors.primary.green; // '#2D7A3E'
```

### Design Token Categories

- **Colors:** Primary, text, background, and semantic colors
- **Typography:** Font families, sizes, weights, line heights, letter spacing
- **Spacing:** 8px-based spacing scale
- **Border Radius:** Consistent rounded corner values

All design tokens follow WCAG 2.1 Level AA accessibility standards.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
