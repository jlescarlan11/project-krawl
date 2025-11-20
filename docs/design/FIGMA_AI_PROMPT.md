# Figma AI Generation Prompt for TASK-026 Wireframes

**Version:** 1.0  
**Last Updated:** 2025-11-18  
**Status:** Ready for Use

---

## Project Description

Create low-fidelity wireframes for **Krawl PWA** - a community-driven Progressive Web App mapping Filipino culture in Cebu City. This is a mobile-first PWA that allows users to discover cultural "Gems" (points of interest) and follow curated "Krawls" (guided trails).

**Design Style:** Low-fidelity wireframes only - grayscale, simple shapes, no colors, no detailed styling. Focus on structure, layout, and content hierarchy.

---

## AI Prompt for Figma Generation

```
Create a comprehensive Figma wireframe file for "Krawl PWA - Wireframes" with the following structure and specifications:

## FILE STRUCTURE

Create a Figma file with these top-level pages:
1. 00_Design System
2. 01_Components
3. 02_Public Pages
4. 03_Content Detail Pages
5. 04_Creation Pages
6. 05_User Management Pages
7. 06_Authentication & Onboarding
8. 07_Error Pages

## DESIGN SYSTEM (Page: 00_Design System)

### Grid System
- Mobile: 4 columns, 16px gutter, 16px margin
- Tablet: 8 columns, 24px gutter, 24px margin
- Desktop: 12 columns, 32px gutter, 32px margin
- Base spacing unit: 8px

### Spacing Scale
Create visual reference showing: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Typography Reference (for reference only)
- Font sizes: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px
- Font weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## COMPONENT LIBRARY (Page: 01_Components)

Create reusable components organized in folders:

### Navigation Components
1. **Mobile Bottom Nav**
   - Frame: 375px × 64px
   - 4 items: Map, Search, Create, Profile
   - Each item: 24px icon + 12px label below
   - Touch target: 44px × 44px minimum
   - Variants: Default, Active

2. **Desktop Top Nav**
   - Frame: 1280px × 72px
   - Layout: Logo (left, 120px), Links center (Map, Search, Create, Profile, 24px spacing), User menu (right)
   - Variants: Guest (Sign In button), Authenticated (Avatar + dropdown)

3. **Breadcrumbs**
   - Text-based: "Home > Map > Gem Detail"
   - 16px height, ">" separator

### Button Components
1. **Primary Button**
   - Height: 44px minimum
   - Padding: 16px horizontal
   - Border radius: 8px
   - Text: 16px, Medium weight
   - Variants: Default, Hover, Active, Disabled

2. **Secondary Button**
   - Same as Primary but outlined (2px border, transparent background)
   - Variants: Default, Hover, Active, Disabled

3. **Icon Button**
   - 44px × 44px square
   - 24px icon centered
   - Variants: Default, Hover, Active, Disabled

### Card Components
1. **Gem Card**
   - Mobile: 2 columns, padding 16px
   - Desktop: 3-4 columns, padding 24px
   - Image: 16:9 aspect ratio placeholder
   - Content: Title, Category, Location
   - Border radius: 8px, 1px border
   - Variants: Mobile, Desktop

2. **Krawl Card**
   - Mobile: Full width, horizontal layout (image left, content right)
   - Desktop: Vertical layout, 2-3 columns
   - Image: 4:3 aspect ratio
   - Content: Title, Creator, Gem count, Duration
   - Variants: Mobile, Desktop

3. **User Card**
   - Avatar (circular, 48px), Name, Stats
   - Padding: 16px mobile, 24px desktop

### Form Components
1. **Text Input**
   - Height: 44px
   - Padding: 12px horizontal
   - Border: 1px solid gray
   - Border radius: 8px
   - Label above (8px spacing)
   - Error message below (12px spacing, red text)
   - Variants: Default, Focus, Error, Disabled

2. **Textarea**
   - Min height: 120px
   - Same styling as Input
   - Character counter bottom right
   - Variants: Default, Focus, Error, Disabled

3. **Select Dropdown**
   - Same as Text Input
   - Dropdown arrow indicator
   - Variants: Default, Open, Error

4. **File Upload**
   - Mobile: 200px × 200px
   - Desktop: 300px × 300px
   - Border: 2px dashed gray
   - Border radius: 8px
   - Upload icon centered
   - Text: "Tap to upload" or "Drag and drop"
   - Variants: Default, Uploading, Success, Error

5. **Checkbox**
   - 20px × 20px square
   - Variants: Unchecked, Checked, Disabled

6. **Radio Button**
   - 20px × 20px circle
   - Variants: Unselected, Selected, Disabled

### Feedback Components
1. **Loading Skeleton**
   - Gray rectangles matching content structure
   - Border radius: 8px
   - Create variants for different content types

2. **Empty State**
   - Centered content
   - Illustration placeholder: 200px × 200px
   - Heading: "No [content] yet"
   - Description text
   - Primary CTA button

3. **Error State**
   - Centered content
   - Error icon: 48px × 48px (⚠️ or ❌)
   - Heading: "Something went wrong"
   - Error message
   - Retry button (primary)
   - Secondary action (Go Home)

### Map Components
1. **Map Container**
   - Full width × appropriate height
   - Light gray background (map placeholder)
   - 1px border

2. **Marker**
   - Circle: 24px × 24px
   - Variants: Default (gray), Selected (primary green), Custom

## PAGE WIREFRAMES

Frame sizes:
- Mobile: 375px × 812px
- Tablet: 768px × 1024px
- Desktop: 1280px × 720px

### 02_Public Pages

#### 01_Landing Page
Create these frames:
- Mobile - Default (Guest): Hero section, Featured Krawls carousel, Popular Gems grid (2 cols), How It Works, Social proof, Statistics
- Mobile - Authenticated: Same but with personalized greeting
- Desktop - Default: Same content, 4-column Gem grid
- Desktop - Authenticated: Same as mobile authenticated
- Loading State: Skeleton screens
- Empty State: "Be the first to explore" message
- Error State: Error message with retry

#### 02_Map View Page
- Mobile - Default: Full-screen map, search overlay, filter bottom sheet, gem markers, selected gem card
- Desktop - Default: Split view with side panel, map on right
- Loading State: Map skeleton
- Empty State: "No gems on map"
- Error State: Error with retry
- Offline State: Offline indicator

#### 03_Search Discovery Page
- Mobile - Default: Search bar, filter chips, results grid (2 cols), sort dropdown
- Desktop - Default: Same, 3-4 column grid
- Loading State: Skeleton cards
- Empty State: "No results found"
- Error State: Error with retry

### 03_Content Detail Pages

#### 04_Gem Detail Page
- Mobile - Default: Hero image, title, description, location map, actions (Save, Share, Report), related gems
- Desktop - Default: Same layout, max-width container
- Loading State: Skeleton
- Error State: Not found or network error

#### 05_Krawl Detail Page
- Mobile - Default: Header (title, creator, stats), step-by-step route, gem cards in sequence, Start Krawl button, progress indicator
- Desktop - Default: Same, wider layout
- Loading State: Skeleton
- Error State: Error message

#### 06_Krawl Mode Page
- Mobile - Default: Full-screen map, current step indicator overlay, navigation (Previous, Next), current gem card overlay, Exit button
- Desktop - Default: Same, larger map
- Loading State: Map loading
- Error State: Error message
- Offline State: Offline indicator

### 04_Creation Pages

#### 07_Gem Creation Page (Multi-Step)
Create frames for each step:
- Step 1 - Basic Info (Mobile + Desktop): Progress indicator (Step 1 of 4), form fields (name, description, category), Back/Next buttons
- Step 2 - Location (Mobile + Desktop): Progress indicator, map picker, location input, Back/Next buttons
- Step 3 - Media (Mobile + Desktop): Progress indicator, file upload, image preview, Back/Next buttons
- Step 4 - Review (Mobile + Desktop): Progress indicator, summary of all steps, Submit button, Back button
- Success State: Success message, "View Gem" button
- Loading State: Loading between steps
- Error State: Validation errors per step

#### 08_Krawl Creation Page
- Mobile - Default: Single-page form, gem selection interface, route visualization, drag-and-drop reordering, Submit button
- Desktop - Default: Same, two-column layout
- Loading State: Loading skeleton
- Error State: Validation errors

### 05_User Management Pages

#### 09_User Profile Page
- Mobile - Default: Profile header (avatar, name, stats), tab navigation (Gems, Krawls, Saved), content grid, settings link
- Desktop - Default: Same, wider grid
- Loading State: Skeleton
- Empty State: "No [content] yet" per tab
- Error State: Error message

#### 10_Profile Settings Page
- Mobile - Default: Settings sections (Account, Privacy, Notifications), form inputs, Save/Cancel buttons, Delete account option
- Desktop - Default: Same, max-width container
- Loading State: Skeleton
- Error State: Error message

#### 11_Offline Downloads Page
- Mobile - Default: Downloadable content list, download status indicators, storage usage, manage downloads
- Desktop - Default: Same, wider layout
- Loading State: Skeleton
- Empty State: "No downloads"
- Error State: Error message

### 06_Authentication & Onboarding

#### 12_Sign In Page
- Mobile - Default: Centered card, logo, tagline, Google OAuth button (primary), legal text, error message area
- Desktop - Default: Same, centered on page
- Loading State: OAuth processing
- Error State: Auth failure message

#### 13_Onboarding Flow
Create frames for each step:
- Step 1 - Welcome (Mobile + Desktop): Progress indicator, illustration, welcome message, Next/Skip buttons
- Step 2 - Discover Gems (Mobile + Desktop): Progress indicator, illustration, feature description, Next/Skip buttons
- Step 3 - Follow Krawls (Mobile + Desktop): Progress indicator, illustration, feature description, Next/Skip buttons
- Step 4 - Create Your Own (Mobile + Desktop): Progress indicator, illustration, feature description, Get Started/Skip buttons
- Permission - Location (Mobile + Desktop): Permission request, Allow/Deny buttons
- Permission - Notifications (Mobile + Desktop): Permission request, Allow/Deny buttons

### 07_Error Pages

#### 404 Not Found
- Mobile + Desktop: Error code "404", error message, illustration, "Go Home" button, "Back" button

#### 500 Server Error
- Mobile + Desktop: Error code "500", error message, illustration, "Retry" button, "Go Home" button

#### Offline Error
- Mobile + Desktop: Offline icon, error message, "Retry" button, "Go Home" button

## DESIGN SPECIFICATIONS

### Color Palette (Grayscale Only)
- Background: White (#FFFFFF)
- Borders: Light Gray (#E5E5E5)
- Text: Dark Gray (#1A1A1A)
- Placeholders: Medium Gray (#6B6B6B)
- No brand colors - this is low-fidelity wireframing

### Spacing
- Use 8px base spacing scale
- Consistent padding: 16px mobile, 24px desktop
- Touch targets: Minimum 44px × 44px

### Typography
- Use placeholder text: "Lorem ipsum" or "Heading Text"
- No specific fonts needed (use system default)
- Focus on hierarchy, not typography details

### Layout Principles
- Mobile-first approach
- Responsive grid system
- Consistent component usage
- Clear content hierarchy
- Accessibility: 44px touch targets, proper heading structure

## NAMING CONVENTIONS

### Components
Format: `Category/Component/Variant`
Examples:
- Button/Primary/Default
- Card/Gem/Mobile
- Form/Input/Error

### Frames
Format: `Page Name - Layout - State`
Examples:
- Landing Page - Mobile - Default
- Gem Creation - Step 1 - Mobile - Default
- Landing Page - Mobile - Loading

## ANNOTATIONS (Dev Mode)

Add annotations to all wireframes:
- Spacing values between elements
- Component names and references
- Interaction notes (tap, swipe, etc.)
- State transitions
- Breakpoint behavior
- Accessibility notes (touch targets, heading hierarchy)

## ORGANIZATION

- Group related frames together
- Use consistent naming
- Create wireframe index page with thumbnails
- Organize by page category
- Keep component library separate and organized

## QUALITY CHECKLIST

Ensure:
- All 13 pages wireframed
- Mobile and desktop layouts for each
- Loading, empty, error states included
- Component library complete and reusable
- Consistent spacing (8px base)
- Touch targets ≥ 44px
- Clear content hierarchy
- Proper annotations
- Low-fidelity style (no colors, simple shapes)
```

---

## Alternative: Simplified Prompt for Quick Generation

If you need a shorter, more focused prompt:

```
Create a Figma wireframe file for "Krawl PWA" with:

1. Component library: Navigation (mobile bottom nav, desktop top nav), Buttons (primary, secondary, icon), Cards (gem, krawl, user), Forms (input, textarea, select, file upload), Feedback (loading skeleton, empty state, error state), Map components.

2. 13 pages wireframed:
   - Landing Page (mobile/desktop, guest/authenticated, loading/empty/error)
   - Map View Page (mobile/desktop, loading/empty/error/offline)
   - Search & Discovery Page (mobile/desktop, loading/empty/error)
   - Gem Detail Page (mobile/desktop, loading/error)
   - Krawl Detail Page (mobile/desktop, loading/error)
   - Krawl Mode Page (mobile/desktop, loading/error/offline)
   - Gem Creation Page (4 steps, mobile/desktop, success/loading/error)
   - Krawl Creation Page (mobile/desktop, loading/error)
   - User Profile Page (mobile/desktop, loading/empty/error)
   - Profile Settings Page (mobile/desktop, loading/error)
   - Offline Downloads Page (mobile/desktop, loading/empty/error)
   - Sign In Page (mobile/desktop, loading/error)
   - Onboarding Flow (4 steps + permissions, mobile/desktop)
   - Error Pages (404, 500, offline)

3. Specifications:
   - Mobile: 375px × 812px, 4-column grid, 16px gutter
   - Desktop: 1280px × 720px, 12-column grid, 32px gutter
   - 8px base spacing, grayscale only, low-fidelity
   - Touch targets: 44px minimum
   - Use components throughout for consistency

4. Add Dev Mode annotations for spacing, interactions, and state transitions.
```

---

## Usage Instructions

### For Figma Make / AI Tools:

1. **Copy the full prompt** above (the detailed version)
2. **Paste into your AI tool** (Figma Make, ChatGPT with Figma plugin, etc.)
3. **Review generated wireframes** against the checklist
4. **Refine as needed** using the implementation guide
5. **Add annotations** manually in Dev Mode
6. **Verify completeness** using TASK-026_WIREFRAME_CHECKLIST.md

### For Manual Creation:

Use this prompt as a reference guide while following the step-by-step instructions in `FIGMA_WIREFRAMES_IMPLEMENTATION_GUIDE.md`.

---

## Key Points to Emphasize

When using this prompt with AI tools, emphasize:

1. **Low-Fidelity Only:** No colors, no detailed styling, simple shapes
2. **Component-Based:** Reuse components, don't duplicate
3. **Mobile-First:** Create mobile layouts first, then desktop
4. **State Coverage:** Every page needs loading, empty, and error states
5. **Accessibility:** 44px touch targets, proper hierarchy
6. **Consistency:** Use same spacing, components, and patterns throughout

---

## Expected Output

The AI should generate:
- ✅ Complete Figma file structure with 8 pages
- ✅ Component library with all specified components
- ✅ All 13 pages with mobile and desktop layouts
- ✅ UI states (loading, empty, error) for applicable pages
- ✅ Proper naming conventions
- ✅ Basic annotations (may need manual refinement)

---

## Post-Generation Steps

After AI generation:

1. **Review all wireframes** against the checklist
2. **Add detailed annotations** in Dev Mode
3. **Verify component consistency**
4. **Check spacing** (8px base)
5. **Verify touch targets** (44px minimum)
6. **Add wireframe index** page
7. **Share with team** for review
8. **Update documentation** with Figma link

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-18  
**For Use With:** Figma Make, ChatGPT + Figma, or similar AI design tools

