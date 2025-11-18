# Component Library

This directory contains the reusable UI component library for the Krawl application. All components follow the design system specifications and are built with accessibility in mind.

## Overview

The component library includes:
- **Buttons:** Primary, secondary, outline, text, and accent variants
- **Cards:** Standard, interactive, and elevated variants with image support
- **Form Components:** Input, Textarea, Select, Checkbox, Radio, and FileUpload

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
import { Button, Card, Input } from '@/components'

// Or import from specific files
import { Button } from '@/components/ui/button'
```

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
- `accept?: string` - Accepted file types (e.g., "image/*", ".pdf,.doc")
- `multiple?: boolean` - Allow multiple files (default: false)
- `maxSize?: number` - Maximum file size in bytes
- `maxFiles?: number` - Maximum number of files
- `onFilesChange?: (files: File[]) => void` - Files change handler
- `disabled?: boolean` - Disable upload
- `required?: boolean` - Required field
- `fullWidth?: boolean` - Full width upload

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
'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Select, Checkbox } from '@/components'

export function CreateGemForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    agree: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Form submission logic
  }

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
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        required
      />
      <Select
        label="Category"
        options={[
          { value: 'historical', label: 'Historical Site' },
          { value: 'cultural', label: 'Cultural Landmark' },
        ]}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
        required
      />
      <Checkbox
        label="I agree to the terms and conditions"
        checked={formData.agree}
        onCheckedChange={(checked) => setFormData({ ...formData, agree: checked })}
        error={errors.agree}
        required
      />
      <Button type="submit" variant="primary" loading={isLoading}>
        Create Gem
      </Button>
    </form>
  )
}
```

## Component Structure

```
components/
├── ui/                    # Base UI components
│   ├── button.tsx        # Button component
│   ├── card.tsx          # Card component
│   ├── input.tsx         # Input component
│   ├── textarea.tsx      # Textarea component
│   ├── select.tsx        # Select component
│   ├── checkbox.tsx      # Checkbox component
│   ├── radio.tsx         # Radio component
│   └── file-upload.tsx   # FileUpload component
├── index.ts              # Barrel exports
└── README.md            # This file
```

## References

- **Design System:** `docs/design/UI_UX_DESIGN_SYSTEM.md`
- **Brand Guidelines:** `docs/design/BRAND_GUIDELINES.md`
- **Design Tokens:** `frontend/docs/DESIGN_TOKENS.md`
- **Solution Design:** `docs/private-docs/tasks/TASK-022_SOLUTION_DESIGN.md`

---

**Last Updated:** 2025-11-16  
**Version:** 1.0.0


