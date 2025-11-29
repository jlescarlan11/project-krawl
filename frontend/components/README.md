# Component Library

This directory contains the reusable UI component library for the Krawl application. All components follow the design system specifications and are built with accessibility in mind.

## Overview

The component library includes:

- **Layout Components:** Container, Section, and PageLayout for consistent page structure
- **Navigation Components:** Header, Footer, BottomNav, Breadcrumbs, NavLink, ProtectedRoute
- **Brand Components:** Logo component with multiple variants and sizes
- **Authentication Components:** GoogleSignInButton, AuthErrorDisplay for authentication flows
- **Buttons:** Primary, secondary, outline, text, and accent variants
- **Cards:** Standard, interactive, and elevated variants with image support
- **Form Components:** Input, Textarea, Select, Checkbox, Radio, and FileUpload
- **State Components:** Spinner, LoadingSkeleton, ProgressBar, EmptyState, ErrorDisplay, and Toast
- **Hero Components:** HeroSection, HeroCTAs, HeroStatsSection, HeroStats, HeroVisual, and useCountUp for the landing page hero experience

## Landing Hero Components

The landing page hero now ships with a dedicated component suite:

- `HeroSection` renders the gradient hero background, tagline _"The Living Map of Filipino Culture"_, and the `HeroCTAs` component for conditional call-to-action buttons.
- `HeroCTAs` is a client component that conditionally renders CTAs based on authentication state: always shows "Explore Cebu City" (primary), and shows "Create Your First Gem" and "Start Krawl Mode" for authenticated users or "Sign In" for guests.
- `HeroStatsSection` and `HeroStats` present Gems mapped, Krawls shared, and Active Krawlers using the `LandingStats` interface, animated count-up numbers (`useCountUp`), and accessibility-friendly labels.
- `HeroVisual` loads `public/hero-cebu.svg` with lazy loading, a gradient overlay for contrast, and a friendly fallback view if the illustration fails to load.

Use the hero components together (see `frontend/components/hero/README.md` for detailed props and accessibility notes):

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

All components are:

- ✅ Fully typed with TypeScript
- ✅ Accessible (WCAG 2.1 Level AA compliant)
- ✅ Responsive (mobile-first design)
- ✅ Styled with Tailwind CSS v4 using design tokens

## Installation

Components are already installed. Dependencies include:

- `lucide-react` - Icon library
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging utility

## Usage

### Importing Components

```tsx
// Import individual components
import { Button, Card, Input } from "@/components";

// Or import from specific files
import { Button } from "@/components/ui/button";
```

### Authentication Components

**Components:** `AuthErrorDisplay`, `GoogleSignInButton`

#### AuthErrorDisplay

Displays user-friendly error messages for authentication errors with retry and dismiss functionality.

```tsx
import { AuthErrorDisplay } from '@/components/auth'

// Basic usage
<AuthErrorDisplay 
  error="NetworkError" 
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>

// With custom styling
<AuthErrorDisplay 
  error="AccessDenied"
  onRetry={handleRetry}
  className="mt-4"
/>
```

**Props:**

- `error: string` - Authentication error code (required)
- `onRetry?: () => void` - Callback when user clicks "Try Again"
- `onDismiss?: () => void` - Callback when user clicks "Dismiss"
- `showRetry?: boolean` - Show retry/dismiss buttons (default: true)
- `className?: string` - Additional CSS classes

**Supported Error Codes:**
- NextAuth.js: `Configuration`, `AccessDenied`, `Verification`, `Default`
- Application: `NetworkError`, `TokenValidationFailed`, `SessionCreationFailed`, `AccountCreationFailed`, `InvalidCredentials`, `PopupBlocked`, `CookieBlocked`, `CorsError`, `RateLimited`, `BackendError`

**Features:**
- User-friendly error messages
- Actionable guidance for resolving errors
- Retry functionality for transient errors
- Accessibility support (ARIA labels, role="alert")
- Responsive design

See [`auth/README.md`](./auth/README.md) for complete documentation.

#### GoogleSignInButton

Button component for initiating Google OAuth sign-in flow.

```tsx
import { GoogleSignInButton } from '@/components/auth'

<GoogleSignInButton 
  onClick={handleSignIn} 
  loading={isLoading}
/>
```

**Props:**

- `onClick: () => void` - Callback when button is clicked (required)
- `loading?: boolean` - Whether sign-in is in progress
- `disabled?: boolean` - Whether button is disabled
- `className?: string` - Additional CSS classes

See [`auth/README.md`](./auth/README.md) for complete documentation.

### Button Component

**Variants:** `primary` | `secondary` | `outline` | `text` | `accent`  
**Sizes:** `sm` | `md` | `lg`  
**States:** `loading`, `disabled`

```tsx
import { Button } from '@/components'
import { Plus } from 'lucide-react'

// Primary button
<Button variant="primary" size="md">Create Gem</Button>

// Button with icon
<Button variant="primary" icon={<Plus />} iconPosition="left">
  Create Gem
</Button>

// Loading button
<Button variant="primary" loading={isLoading}>
  Submit
</Button>

// Icon-only button (requires aria-label)
<Button variant="primary" icon={<Plus />} aria-label="Add item" />
```

**Props:**

- `variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'accent'` - Button style variant
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `loading?: boolean` - Show loading state
- `icon?: React.ReactNode` - Icon element
- `iconPosition?: 'left' | 'right'` - Icon position
- `fullWidth?: boolean` - Full width button
- All standard button HTML attributes are supported

### Card Component

**Variants:** `standard` | `interactive` | `elevated`  
**Padding:** `compact` | `default` | `spacious`

```tsx
import { Card, CardHeader, CardBody, CardFooter, CardActions } from '@/components'
import { Button } from '@/components'

// Standard card
<Card variant="standard" padding="default">
  <CardHeader>
    <h3 className="text-lg font-semibold text-text-primary">Card Title</h3>
  </CardHeader>
  <CardBody>
    <p className="text-sm text-text-secondary">Card content goes here.</p>
  </CardBody>
  <CardActions>
    <Button variant="primary">Action</Button>
  </CardActions>
</Card>

// Interactive card (clickable)
<Card variant="interactive" onClick={() => console.log('clicked')}>
  <CardBody>
    <h3 className="text-lg font-semibold mb-2 text-text-primary">Gem Name</h3>
    <p className="text-sm text-text-secondary">Gem description...</p>
  </CardBody>
</Card>

// Card with image
<Card
  variant="standard"
  padding="spacious"
  image={{
    src: "/gem-image.jpg",
    alt: "Gem description",
    width: 400,
    height: 192
  }}
>
  <CardBody>
    <h3 className="text-lg font-semibold mb-2 text-text-primary">Gem Name</h3>
    <p className="text-sm text-text-secondary">Gem description...</p>
  </CardBody>
</Card>
```

**Props:**

- `variant?: 'standard' | 'interactive' | 'elevated'` - Card style variant
- `padding?: 'compact' | 'default' | 'spacious'` - Padding size
- `image?: { src: string; alt: string; width?: number; height?: number }` - Card image
- `onClick?: () => void` - Click handler (makes card interactive)
- All standard div HTML attributes are supported

**Sub-components:**

- `CardHeader` - Card header section
- `CardBody` - Card body content
- `CardFooter` - Card footer section
- `CardActions` - Action buttons container

### Input Component

**States:** `error`, `success`, `disabled`

```tsx
import { Input } from '@/components'
import { Mail } from 'lucide-react'

// Basic input
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
/>

// Input with icon
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  leftIcon={<Mail className="w-5 h-5" />}
/>

// Input with error
<Input
  label="Email"
  type="email"
  error="Please enter a valid email address"
/>

// Input with success
<Input
  label="Email"
  type="email"
  success="Email is valid"
/>
```

**Props:**

- `label?: string` - Input label
- `error?: string` - Error message
- `success?: string` - Success message
- `helperText?: string` - Helper text
- `leftIcon?: React.ReactNode` - Left icon
- `rightIcon?: React.ReactNode` - Right icon
- `fullWidth?: boolean` - Full width input
- All standard input HTML attributes are supported

### Textarea Component

**States:** `error`, `success`, `disabled`

```tsx
import { Textarea } from '@/components'

<Textarea
  label="Description"
  placeholder="Enter description"
  rows={4}
  resize="vertical"
  required
/>

<Textarea
  label="Description"
  error="Description is required"
  helperText="Maximum 500 characters"
/>
```

**Props:**

- `label?: string` - Textarea label
- `error?: string` - Error message
- `success?: string` - Success message
- `helperText?: string` - Helper text
- `rows?: number` - Number of rows (default: 4)
- `resize?: 'none' | 'vertical' | 'both'` - Resize behavior (default: 'vertical')
- `fullWidth?: boolean` - Full width textarea
- All standard textarea HTML attributes are supported

### Select Component

**States:** `error`, `success`, `disabled`

```tsx
import { Select } from '@/components'

<Select
  label="Category"
  placeholder="Select a category"
  options={[
    { value: 'historical', label: 'Historical Site' },
    { value: 'cultural', label: 'Cultural Landmark' },
    { value: 'food', label: 'Food & Dining' },
  ]}
  required
/>

<Select
  label="Category"
  error="Please select a category"
  options={options}
/>
```

**Props:**

- `label?: string` - Select label
- `error?: string` - Error message
- `success?: string` - Success message
- `helperText?: string` - Helper text
- `options: SelectOption[]` - Options array (`{ value: string; label: string; disabled?: boolean }`)
- `placeholder?: string` - Placeholder option text
- `fullWidth?: boolean` - Full width select
- All standard select HTML attributes are supported

### Checkbox Component

**States:** `error`, `disabled`

```tsx
import { Checkbox } from '@/components'

<Checkbox
  label="I agree to the terms and conditions"
  checked={isChecked}
  onCheckedChange={setIsChecked}
  required
/>

<Checkbox
  label="Subscribe to newsletter"
  error="You must agree to continue"
/>
```

**Props:**

- `label?: string` - Checkbox label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `checked?: boolean` - Checked state
- `onCheckedChange?: (checked: boolean) => void` - Change handler
- All standard checkbox HTML attributes are supported (except `type` and `onChange`)

### Radio Component

**States:** `error`, `disabled`

```tsx
import { Radio } from '@/components'

<Radio
  name="difficulty"
  label="Easy"
  value="easy"
  checked={selectedDifficulty === 'easy'}
  onCheckedChange={() => setSelectedDifficulty('easy')}
/>

<Radio
  name="difficulty"
  label="Medium"
  value="medium"
  checked={selectedDifficulty === 'medium'}
  onCheckedChange={() => setSelectedDifficulty('medium')}
/>
```

**Props:**

- `label?: string` - Radio label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `checked?: boolean` - Checked state
- `onCheckedChange?: (checked: boolean) => void` - Change handler
- `name: string` - Radio group name (required for grouping)
- All standard radio HTML attributes are supported (except `type` and `onChange`)

### FileUpload Component

**Features:** Drag-and-drop, file preview, validation

```tsx
import { FileUpload } from '@/components'

<FileUpload
  label="Upload Images"
  accept="image/*"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
  maxFiles={5}
  onFilesChange={(files) => console.log(files)}
/>

<FileUpload
  label="Upload Document"
  accept=".pdf,.doc,.docx"
  maxSize={10 * 1024 * 1024} // 10MB
  error="File size must be less than 10MB"
/>
```

**Props:**

- `label?: string` - Upload label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `accept?: string` - Accepted file types (e.g., "image/\*", ".pdf,.doc")
- `multiple?: boolean` - Allow multiple files (default: false)
- `maxSize?: number` - Maximum file size in bytes
- `maxFiles?: number` - Maximum number of files
- `onFilesChange?: (files: File[]) => void` - Files change handler
- `disabled?: boolean` - Disable upload
- `required?: boolean` - Required field
- `fullWidth?: boolean` - Full width upload

### Spinner Component

**Purpose:** Reusable spinner for loading states

**Sizes:** `sm` | `md` | `lg`

```tsx
import { Spinner } from '@/components'

// Basic spinner
<Spinner size="md" aria-label="Loading content" />

// Small spinner
<Spinner size="sm" />

// Large spinner
<Spinner size="lg" />
```

**Props:**

- `size?: 'sm' | 'md' | 'lg'` - Spinner size (default: 'md')
- `className?: string` - Additional CSS classes
- `aria-label?: string` - Accessibility label (default: 'Loading')

### LoadingSkeleton Component

**Purpose:** Skeleton loaders for content placeholders with shimmer animation

**Variants:** `card` | `text` | `image` | `list` | `custom`

```tsx
import { LoadingSkeleton } from '@/components'

// Card skeleton
<LoadingSkeleton variant="card" />

// Text skeleton (3 lines)
<LoadingSkeleton variant="text" lines={3} />

// Image skeleton
<LoadingSkeleton variant="image" className="w-full aspect-video" />

// List skeleton (multiple cards)
<LoadingSkeleton variant="list" />

// Custom skeleton
<LoadingSkeleton variant="custom" width="200px" height="100px" />
```

**Props:**

- `variant?: 'card' | 'text' | 'image' | 'list' | 'custom'` - Skeleton variant (default: 'card')
- `lines?: number` - Number of lines for text variant (default: 3)
- `width?: string` - Custom width (for custom variant)
- `height?: string` - Custom height (for custom variant)
- `className?: string` - Additional CSS classes

### ProgressBar Component

**Purpose:** Progress indicator for determinate loading

**Sizes:** `sm` | `md` | `lg`

```tsx
import { ProgressBar } from '@/components'

// Basic progress bar
<ProgressBar value={75} max={100} />

// With label and value
<ProgressBar
  value={50}
  max={100}
  label="Upload progress"
  showValue
  size="md"
/>
```

**Props:**

- `value: number` - Current progress value (required)
- `max?: number` - Maximum value (default: 100)
- `label?: string` - Progress label
- `showValue?: boolean` - Show percentage value (default: false)
- `size?: 'sm' | 'md' | 'lg'` - Progress bar size (default: 'md')
- `className?: string` - Additional CSS classes

### EmptyState Component

**Purpose:** Display empty content states with icon, message, and optional CTA

**Sizes:** `sm` | `md` | `lg`

```tsx
import { EmptyState } from '@/components'
import { MapPin, Search } from 'lucide-react'

// Basic empty state
<EmptyState
  icon={<MapPin className="w-30 h-30 md:w-40 md:h-40" />}
  title="No Gems found"
  description="Be the first to add a Gem in this area!"
  action={() => router.push('/create-gem')}
  actionLabel="Create First Gem"
/>

// Empty state without action
<EmptyState
  icon={<Search className="w-30 h-30 md:w-40 md:h-40" />}
  title="No results found"
  description="Try adjusting your search or filters"
/>
```

**Props:**

- `icon: React.ReactNode` - Icon element (required)
- `title: string` - Empty state title (required)
- `description?: string` - Empty state description
- `action?: () => void` - Action callback
- `actionLabel?: string` - Action button label
- `size?: 'sm' | 'md' | 'lg'` - Empty state size (default: 'md')
- `className?: string` - Additional CSS classes

### ErrorDisplay Component

**Purpose:** Full-page error component with retry action

**Variants:** `network` | `error` | `404` | `500` | `permission`

```tsx
import { ErrorDisplay } from '@/components'

// Network error
<ErrorDisplay
  title="Unable to load content"
  message="Please check your connection and try again"
  retryAction={() => refetch()}
  variant="network"
/>

// 404 error
<ErrorDisplay
  title="Page Not Found"
  message="The page you're looking for doesn't exist"
  variant="404"
/>

// Custom error
<ErrorDisplay
  title="Something went wrong"
  message="We're working on fixing this issue"
  retryAction={handleRetry}
  icon={<AlertCircle className="w-16 h-16" />}
/>
```

**Props:**

- `title: string` - Error title (required)
- `message: string` - Error message (required)
- `retryAction?: () => void` - Retry callback
- `icon?: React.ReactNode` - Custom icon (defaults to variant icon)
- `variant?: 'network' | 'error' | '404' | '500' | 'permission'` - Error variant (default: 'error')
- `className?: string` - Additional CSS classes

### Toast System

**Purpose:** Toast notifications for success/error feedback

**Variants:** `success` | `error` | `warning` | `info`

**Setup:** Wrap your app with `ToastProvider` in the root layout

```tsx
// app/layout.tsx
import { ToastProvider } from "@/components";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

**Usage:**

```tsx
"use client";

import { useToast } from "@/components";

export function MyComponent() {
  const { toast, success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success("Gem created successfully!", "Your Gem is now live on the map");
  };

  const handleError = () => {
    error("Failed to upload", "Please check your connection and try again");
  };

  // Or use the generic toast function
  const handleCustom = () => {
    toast({
      variant: "success",
      title: "Custom toast",
      description: "With custom message",
      duration: 3000,
      action: {
        label: "View",
        onClick: () => console.log("View clicked"),
      },
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

**Toast Hook Methods:**

- `toast(props)` - Generic toast function
- `success(title, description?)` - Show success toast
- `error(title, description?)` - Show error toast
- `warning(title, description?)` - Show warning toast
- `info(title, description?)` - Show info toast
- `dismiss(id)` - Dismiss specific toast

**Toast Props:**

- `variant: 'success' | 'error' | 'warning' | 'info'` - Toast variant
- `title: string` - Toast title (required)
- `description?: string` - Toast description
- `duration?: number` - Auto-dismiss duration in ms (default: 5000, 0 = no auto-dismiss)
- `action?: { label: string; onClick: () => void }` - Action button

**Features:**

- Auto-dismiss after duration (default: 5 seconds)
- Maximum 5 toasts displayed simultaneously
- Position: Top-right (desktop), Top-center (mobile)
- Keyboard accessible (Escape to dismiss)
- Accessible with screen readers

## Design Tokens

All components use design tokens defined in `frontend/app/globals.css`. Key tokens:

**Colors:**

- `bg-primary-green` - Primary brand color
- `bg-accent-orange` - Accent color
- `text-text-primary` - Primary text color
- `text-text-secondary` - Secondary text color
- `bg-bg-white` - White background
- `border-bg-medium` - Medium gray border

**Spacing:**

- Uses 8px base spacing scale (`p-2`, `p-4`, `p-6`, etc.)

**Typography:**

- Font family: Inter (via `font-sans`)
- Font sizes: `text-sm`, `text-base`, `text-lg`, etc.

See `frontend/docs/DESIGN_TOKENS.md` for complete token reference.

## Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **ARIA Labels:** Proper ARIA attributes for screen readers
- **Focus Indicators:** Visible focus outlines (Accent Orange, 2px)
- **Touch Targets:** Minimum 44px × 44px for touch devices
- **Color Contrast:** WCAG 2.1 Level AA compliant

**Testing:**

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard-only navigation
- Test with high contrast mode
- Test at 200% zoom

For complete accessibility guidelines and checklists, see:

- [ACCESSIBILITY_GUIDELINES.md](../../../docs/design/ACCESSIBILITY_GUIDELINES.md) - Comprehensive accessibility guidelines
- [ACCESSIBILITY_CHECKLIST.md](../../../docs/design/ACCESSIBILITY_CHECKLIST.md) - Developer and QA checklists

## Responsive Design

Components are mobile-first and responsive:

- **Mobile (< 640px):** Components stack vertically, full width
- **Tablet (640px - 1024px):** Components adapt layout
- **Desktop (> 1024px):** Components use full layout

## Best Practices

1. **Always provide labels** for form inputs
2. **Use proper semantic HTML** (labels, fieldsets, legends)
3. **Handle errors gracefully** with clear error messages
4. **Provide loading states** for async operations
5. **Test accessibility** with screen readers and keyboard navigation
6. **Use design tokens** instead of hardcoded values

## Examples

### Form Example

```tsx
"use client";

import { useState } from "react";
import { Button, Input, Textarea, Select, Checkbox } from "@/components";

export function CreateGemForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Gem Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        error={errors.description}
        required
      />
      <Select
        label="Category"
        options={[
          { value: "historical", label: "Historical Site" },
          { value: "cultural", label: "Cultural Landmark" },
        ]}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
        required
      />
      <Checkbox
        label="I agree to the terms and conditions"
        checked={formData.agree}
        onCheckedChange={(checked) =>
          setFormData({ ...formData, agree: checked })
        }
        error={errors.agree}
        required
      />
      <Button type="submit" variant="primary" loading={isLoading}>
        Create Gem
      </Button>
    </form>
  );
}
```

## Component Structure

```
components/
├── layout/               # Layout components (TASK-035)
│   ├── Container.tsx    # Max-width container component
│   ├── Section.tsx      # Section with spacing and backgrounds
│   ├── PageLayout.tsx   # Page wrapper with breadcrumbs, title, description
│   ├── index.ts         # Barrel exports
│   └── README.md        # Layout components documentation
├── navigation/          # Navigation components (TASK-034)
│   ├── Header.tsx       # Desktop top navigation
│   ├── Footer.tsx       # Site footer
│   ├── BottomNav.tsx    # Mobile bottom navigation
│   ├── Breadcrumbs.tsx  # Dynamic breadcrumbs
│   ├── NavLink.tsx      # Reusable navigation link
│   ├── ProtectedRoute.tsx # Client-side route protection
│   ├── index.ts         # Barrel exports
│   └── README.md        # Navigation documentation
├── brand/               # Brand components (TASK-044)
│   ├── Logo.tsx         # Logo component with variants and sizes
│   ├── index.ts         # Barrel exports
│   └── README.md        # Brand components documentation
├── ui/                  # Base UI components
│   ├── button.tsx       # Button component
│   ├── card.tsx         # Card component
│   ├── input.tsx        # Input component
│   ├── textarea.tsx     # Textarea component
│   ├── select.tsx       # Select component
│   ├── checkbox.tsx     # Checkbox component
│   ├── radio.tsx         # Radio component
│   ├── file-upload.tsx  # FileUpload component
│   ├── spinner.tsx       # Spinner component
│   ├── loading-skeleton.tsx  # LoadingSkeleton component
│   ├── progress-bar.tsx # ProgressBar component
│   ├── empty-state.tsx  # EmptyState component
│   ├── error-display.tsx # ErrorDisplay component
│   └── toast.tsx        # Toast system (ToastProvider, useToast)
├── index.ts             # Barrel exports
└── README.md           # This file
```

## Related Component Documentation

- **Layout Components:** [`layout/README.md`](./layout/README.md) - Container, Section, PageLayout
- **Navigation Components:** [`navigation/README.md`](./navigation/README.md) - Header, Footer, Breadcrumbs, etc.
- **Brand Components:** [`brand/README.md`](./brand/README.md) - Logo component
- **Authentication Components:** [`auth/README.md`](./auth/README.md) - GoogleSignInButton, AuthErrorDisplay

## References

- **Design System:** `docs/design/UI_UX_DESIGN_SYSTEM.md`
- **Brand Guidelines:** `docs/design/BRAND_GUIDELINES.md`
- **Design Tokens:** `frontend/docs/DESIGN_TOKENS.md`
- **Solution Design:** `docs/private-docs/tasks/TASK-022_SOLUTION_DESIGN.md`

---

**Last Updated:** 2025-01-27  
**Version:** 1.3.0
