# Design Deliverables: Wireframes → Mockups → Prototypes

## Summary / Overview

This document outlines the design evolution of the application from low‑fidelity wireframes through high‑fidelity mockups to interactive prototypes.  
It is structured to support agile, iterative development and to ensure the resulting experience is scalable, maintainable, and adaptable to change.  
All recommended tools and services are current and, as of **Saturday, November 15, 2025**, offer free or generous free tiers suitable for student projects.

---

## Version History

| Version | Date       | Author        | Changes                                   |
|---------|-----------|---------------|-------------------------------------------|
| 1.0.0   | 2025-11-15| [Your Name]   | Initial design deliverables documentation |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-23  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Main Content](#main-content)
   - [Section 1: Low‑Fidelity Wireframes](#section-1-lowfidelity-wireframes)
   - [Section 2: High‑Fidelity Mockups](#section-2-highfidelity-mockups)
   - [Section 3: Interactive Prototypes](#section-3-interactive-prototypes)
5. [Additional Sections](#additional-sections)
   - [References](#references)
   - [Appendices](#appendices)
   - [Glossary](#glossary)
6. [Document Metadata](#document-metadata)

---

## Main Content

### Section 1: Low‑Fidelity Wireframes

#### 1.1 Purpose and Goals

Low‑fidelity wireframes capture the basic **layout**, **information hierarchy**, and **navigation structure** without visual polish.  
They are intentionally fast to create and modify, enabling rapid experimentation and alignment with stakeholders before investing in detailed design.

Key goals:
- **Clarify user flows** for primary tasks (e.g., sign‑in, onboarding, core feature usage).
- **Define screen layouts** (what appears above the fold, grouping of related elements).
- **Identify core components** that will later become reusable UI elements.

#### 1.2 Recommended Tools (Free / Generous Free Tier)

- **Figma (Free plan)** – Current, actively maintained cloud design tool.  
  - Use simple frames, gray boxes, and basic text styles for wireframes.  
  - Free tier supports personal projects and collaboration, suitable for students.
  - **Krawl PWA Wireframes:** [Figma File - To be created]
    - File name: "Krawl PWA - Wireframes"
    - Includes component library and all 13 pages with mobile/desktop layouts
    - See [WIREFRAMES.md](./WIREFRAMES.md#figma-wireframes) for access instructions
    - **📝 Update Instructions:** Once created, replace `[Figma File - To be created]` with the actual Figma shareable link (Share → Copy link)
- **Penpot (Free & open source)** – Browser‑based design and prototyping platform.  
  - 100% free, good for long‑term, cost‑neutral projects.
  - Alternative to Figma if needed
- **Excalidraw (Free, open source)** – Sketchy‑style whiteboard, ideal for very rough flows.  
  - Great for quick ideation and storyboarding user journeys.

*(All three tools are current and well‑maintained as of 2025‑11‑15, each with a free tier or fully free offering.)*

**Krawl PWA Wireframe Component Library:**
The Figma wireframe file includes a reusable component library organized as follows:
- **Navigation:** Mobile Bottom Nav, Desktop Top Nav, Breadcrumbs
- **Buttons:** Primary, Secondary, Icon (with all states: Default, Hover, Active, Disabled)
- **Cards:** Gem Card, Krawl Card, User Card (Mobile and Desktop variants)
- **Forms:** Text Input, Textarea, Select Dropdown, File Upload, Checkbox, Radio Button
- **Feedback:** Loading Skeleton, Empty State, Error State, Success State
- **Map Components:** Map Container, Markers (Default, Selected, Custom)

All components follow the 8px base spacing system and are designed for mobile-first responsive layouts.

#### 1.3 Screen Inventory (Wireframe Level)

For illustration, assume a generic web app with social login only:

- **Screen W1 – Landing / Marketing**
  - Hero section: app value proposition + “Get Started” primary CTA.  
  - Secondary CTA: “Learn more” scrolling to feature overview.  
  - Persistent header: logo (top‑left), “Sign in” button (top‑right).

- **Screen W2 – Social Login**
  - Centered card containing:  
    - App logo & short tagline.  
    - Primary button: “Continue with Google”.  
    - Optional secondary button: another provider (e.g., GitHub) if needed.  
    - Small legal text: “By continuing you agree to…”.

- **Screen W3 – Onboarding**
  - Simple, 2–3 step layout using progress indicator (Step 1 of 3, etc.).  
  - Fields grouped by purpose (profile basics, preferences).  
  - “Skip for now” option to keep flow lightweight.

- **Screen W4 – Main Dashboard**
  - Top bar: logo, global search, user avatar menu.  
  - Left navigation: key sections (e.g., Dashboard, Items, Settings).  
  - Main content area: list or cards showing core objects.  
  - Primary action button (top‑right of content): e.g., “Create new …”.

- **Screen W5 – Detail / Editor**
  - Two‑column layout:  
    - Left: primary content (form or details).  
    - Right: contextual info (activity, tips) or collapsible sidebar.  
  - Sticky footer or top actions: “Save”, “Cancel”.

#### 1.4 Wireframe Interaction Notes

Interactions at this stage are mostly static:
- Demonstrate **basic navigation** between W1 → W2 → W4 using simple clickable hotspots.  
- Show **primary user path** (e.g., first‑time sign‑in → onboarding → dashboard).  
- Defer edge cases, complex validation, and animations to later stages.

---

### Section 2: High‑Fidelity Mockups

#### 2.1 Purpose and Goals

High‑fidelity mockups build on the wireframes by adding **color, typography, spacing, iconography, and imagery**.  
They represent how the product should actually look in production, while still being easy to iterate on before development begins.

Key goals:
- Establish a **design system** (colors, type scale, spacing, components).  
- Validate **visual hierarchy** and **readability**.  
- Align stakeholders on the “look and feel” before code is written.

#### 2.2 Recommended Tools (Free / Generous Free Tier)

- **Figma (Free plan)**  
  - Primary recommendation for hi‑fi mockups and design systems.  
  - Offers components, variants, auto‑layout, and shared libraries.  
  - Actively maintained with frequent releases and strong community support (confirmed current as of 2025‑11‑15).

- **Penpot (Free, open source)**  
  - Suitable if you prefer an open‑source stack and self‑hosting options.  
  - Supports components, design tokens, and prototyping.

You can keep all stages (wireframe → mock → prototype) in the same Figma/Penpot file, which supports agile iteration and reduces duplication.

#### 2.3 Visual Design System (Example)

- **Color Palette**
  - Primary: accessible blue (for main CTAs and links).  
  - Secondary: neutral gray scale for backgrounds, borders, and text.  
  - Accent: limited highlight color (e.g., green) for success states and key metrics.  
  - Status colors: red (error), amber (warning), green (success), blue (info).

- **Typography**
  - Use a well‑supported, free web font (e.g., Inter, Roboto) from Google Fonts.  
  - Define a simple type scale: H1, H2, H3, body, caption.  
  - Ensure contrast ratios meet accessibility guidelines (WCAG AA or better).

- **Spacing & Layout**
  - Use an 8‑point spacing system (8, 16, 24, 32, …) for consistent paddings and margins.  
  - Use a 12‑column layout grid for desktop, 4‑column for mobile.

- **Components**
  - Buttons: primary, secondary, tertiary, destructive, disabled states.  
  - Inputs: text fields, dropdowns, toggles, checkboxes, radio buttons, error states.  
  - Navigation: app bar, side nav, tabs, breadcrumbs.  
  - Cards, modals, toasts, empty states.

#### 2.4 Screen Evolution: Wireframe → Mockup

Using the earlier wireframes, the mockups add polish:

- **Screen M1 – Landing (from W1)**
  - Apply hero imagery or illustration aligned with the brand.  
  - Use primary color for the main CTA and a ghost/secondary style for “Learn more”.  
  - Include clear typography scale for headline, sub‑title, and supporting text.

- **Screen M2 – Social Login (from W2)**
  - Card with soft shadow and rounded corners.  
  - Google button styled per current brand guidelines (logo + label).  
  - Subtle background gradient or pattern behind the card for depth.

- **Screen M3 – Dashboard (from W4)**
  - Use cards or rows with clear hierarchy: title, key stats, badges.  
  - Incorporate icons in navigation for quick scanning.  
  - Highlight primary action in the top‑right using the primary color.

#### 2.5 Design for Scalability & Maintainability

- Centralize tokens (colors, typography, spacing) and components so future changes propagate automatically.  
- Use Figma component variants (e.g., button: default/hover/pressed/disabled) to reduce duplication.  
- Document usage guidelines in a dedicated “Design System” page inside the file.

---

### Section 3: Interactive Prototypes

#### 3.1 Purpose and Goals

Interactive prototypes turn static mockups into **clickable flows** that simulate real usage.  
They are used for usability testing, stakeholder demos, and to de‑risk interaction design before development.

Key goals:
- Demonstrate **end‑to‑end user journeys** (e.g., first‑time sign‑in to achieving a key outcome).  
- Validate **navigation patterns**, **micro‑interactions**, and **feedback states**.  
- Provide a clear blueprint for developers, reducing ambiguity.

#### 3.2 Recommended Tools (Free / Generous Free Tier)

- **Figma Prototyping (Free plan)**  
  - Use built‑in prototyping to link frames, define transitions, and configure overlays.  
  - Supports interactive components (e.g., toggles, dropdowns) for richer prototypes.

- **Penpot Prototyping (Free & open source)**  
  - Provides link‑based navigation and interaction flows between screens.  
  - Good fit if you already use Penpot for design.

*(Tools confirmed current and actively maintained as of 2025‑11‑15.)*

#### 3.3 Prototype Scenarios

Design at least these prototype flows:

- **Flow P1 – First‑Time User Sign‑In with Social Login**
  - Landing (M1) → “Get Started” → Social Login (M2).  
  - Click “Continue with Google” → success state → Onboarding (M3).  
  - Edge case notes: show error toast for failed login (network issues, denied consent).

- **Flow P2 – Returning User**
  - Direct access to Social Login (M2) or auto‑redirect from Landing.  
  - Successful auth → Dashboard (M3) with last‑used filters and state restored where feasible.

- **Flow P3 – Core Task Completion**
  - Dashboard → “Create new …” → Detail/Editor screen.  
  - Fill required fields, handle validation errors, save → success notification → back to Dashboard with updated list.

#### 3.4 Interaction & Motion Guidelines

- Use **subtle transitions** (e.g., smart animate, dissolve) to avoid distracting from content.  
- Provide **instant feedback** on actions: button press states, loading indicators, inline error messages.  
- Limit motion complexity for accessibility; avoid large parallax or excessive animation.

#### 3.5 Handoff to Development

- Attach annotations directly in the prototype (Figma comments or a dedicated spec page).  
- Include notes on:
  - Authentication (social providers used, error states, loading states).  
  - Responsive behavior (breakpoints, how components adapt).  
  - Edge cases (empty states, slow network, unauthorized access).

---

## Additional Sections

### References

- **Figma** – Collaborative interface design and prototyping tool with a robust free tier.  
- **Penpot** – Open‑source design and prototyping platform, fully free.  
- **Excalidraw** – Open‑source virtual whiteboard for sketchy wireframes.  
- **Firebase Authentication** – Google‑maintained auth service with social providers (Google, etc.) and a generous free tier as of 2025‑11‑15.  
- **Supabase Auth** – Open‑source backend-as-a-service; Auth module supports social login with a free tier, current as of 2025‑11‑15.

*(All references verified via quick web search on 2025‑11‑15 for currency and free‑tier suitability.)*

---

### Appendices

#### Appendix A: Authentication Design (Social Login Only)

- The app uses **social login only** (no email/password).  
- Primary provider: **Google**; optionally add one or two more (e.g., GitHub) if the audience justifies it.  
- At the UX level:
  - Prominently display the main provider button.  
  - Provide clear messaging about what data is requested and why.  
  - Show concise legal text (Terms & Privacy) beneath the buttons.  
- At the system level (implementation options):
  - **Firebase Authentication** or **Supabase Auth** to handle OAuth flows and token management.  
  - Use an up‑to‑date client library (e.g., Auth.js / NextAuth.js on the frontend for Next.js apps) to integrate the provider flows cleanly.

#### Appendix B: Agile & Scalability Considerations

- Maintain a **living design system**: update components and tokens as the product evolves.  
- Treat each iteration of wireframes/mockups/prototypes as a **sprint artifact**:  
  - Start with low‑fi for new features.  
  - Promote to hi‑fi once flows are validated.  
  - Build prototypes for usability testing and dev handoff.  
- Ensure designs anticipate:
  - Additional features and navigation items.  
  - Localization (longer text strings).  
  - Accessibility and different input methods (keyboard, touch, screen readers).

---

### Glossary

| Term                 | Definition                                                                 |
|----------------------|----------------------------------------------------------------------------|
| Low‑fidelity wireframe | Simple layout focusing on structure and flow, without visual design details |
| High‑fidelity mockup | Detailed, polished visual representation of a screen                        |
| Interactive prototype| Clickable simulation of user flows and key interactions                    |
| Design system        | Reusable set of components, styles, and guidelines                         |
| Social login         | Authentication method using third‑party identity providers (e.g., Google)  |

---

## Document Metadata

**Document Type:** Design Documentation / UX Deliverables  
**Target Audience:** Product Owners, Designers, Developers, Stakeholders  
**Related Documents:** Product Requirements, Technical Architecture, UX Research Notes  
**Contact:** [Your Email or Contact Info]

---

