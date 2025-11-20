# TASK-026 Wireframe Production Guide

This document is a hands-on checklist for drafting all required low-fidelity wireframes in Figma. Follow it sequentially to deliver every acceptance criterion for TASK-026.

---

## 1. Figma File Setup

1. Create a new Figma file named `Krawl_PWA_Wireframes`.
2. Add pages:
   - `00_Foundations`
   - `01_Landing`
   - `02_Map`
   - `03_GemDetail`
   - `04_KrawlDetail`
   - `05_GemCreation`
   - `06_KrawlCreation`
   - `07_Search`
   - `08_Profile`
   - `09_Settings`
   - `10_SignIn`
   - `11_Onboarding`
   - `12_Offline`
   - `13_Error`
   - `Flows & Notes`
3. Define frame presets + grids:
   - Desktop: 1440×900, 12 columns (80px margins, 16px gutters)
   - Tablet: 1024×768, 8 columns (64px margins)
   - Mobile: 390×844, 4 columns (24px margins)
4. Enable `Layout Grid` styles named `Grid/Desktop`, `Grid/Tablet`, `Grid/Mobile`.
5. Create text styles: `Display`, `H1`, `H2`, `Body`, `Label`. Use grayscale only.

---

## 2. Reusable Components (`00_Foundations`)

| Component | Notes |
|-----------|-------|
| App Shell | Desktop top nav (logo, search, profile), mobile bottom nav (Map, Search, Create, Profile) |
| Card Set | Gem card, Krawl card, list row, stat pill. Include mobile + desktop width variants |
| Forms | Input, text area, select, toggle, checkbox, stepper |
| Map Widgets | Map frame, pin markers (default, highlighted, offline), filter chips |
| Feedback | Loading skeleton blocks, empty state module, error banner, success toast |
| Annotation Kit | Numbered badge, connector line, note panel; use for all callouts |

Instructions:
1. Build each component with Auto Layout.
2. Create variants for states (default, hover, disabled, loading).
3. Publish as local library if needed for TASK-027 reuse.

---

## 3. Step-by-Step Build Recipes

Use the following pattern for every screen:
1. **Create Frame** – `F` hotkey → choose breakpoint preset (Desktop 1440×900 or Mobile 390×844).
2. **Apply Grid** – Select frame → `Shift+G` to toggle layout → assign `Grid/Desktop` or `Grid/Mobile`.
3. **Drop App Shell** – Drag the relevant navigation component from `00_Foundations` (top nav or bottom nav).
4. **Place Sections** – Use `Shift+A` to wrap stacks in Auto Layout; name layers (`Hero`, `Content`, `Footer`).
5. **Insert Components** – Drag cards, forms, map modules, etc. Adjust spacing via Auto Layout padding.
6. **Add States** – Duplicate frame (`Ctrl/Cmd+D`) and swap components with skeleton/empty/error variants.
7. **Annotate** – Place `Annotation Badge` components near interactions, connect with lines to `Notes` panel.

After completing Desktop, duplicate the frame and resize to Mobile. Reflow content vertically and swap nav components as needed.

---

## 4. Page-by-Page Wireframe Tasks

Each section now includes concrete “Step 1 / Step 2 …” instructions. Produce at minimum: default, empty, loading, and error/offline variants where specified.

### 3.1 Landing Page
1. **Desktop Frame** – Create 1440×900 frame, apply desktop grid, drop `TopNav/Transparent`.
2. **Hero Section** – Draw 12-column Auto Layout frame; split 6 columns left (text stack with `Display` + buttons) and 6 columns right (image placeholder rectangle + map overlay icon).
3. **Value Props** – Insert 3 `ValueCard` components within horizontal Auto Layout (gutter 24px).
4. **Featured Carousel** – Use `Card` components inside an Auto Layout with arrows (simple rectangles).
5. **Testimonials & Newsletter** – Add two stacked sections; include quote blocks + email form component.
6. **Footer** – Drag `Footer` component; align to columns.
7. **Mobile Version** – Duplicate frame, resize to 390×844, stack hero vertically, convert carousel to horizontal scroll (Auto Layout direction horizontal with clip off).
8. **States** – Duplicate desktop & mobile frames for Loading (swap cards with skeletons) and Empty (replace modules with placeholder text).
9. **Annotations** – Add callouts for CTA behavior, nav transparency, carousel interaction.

### 3.2 Map View Page
1. **Desktop Frame** – 1440×900, grid on. Add `TopNav/Solid`.
2. **Left Drawer** – Draw 480px-wide Auto Layout column pinned left; insert search bar, filter chips row, tab bar (3 buttons), and `ListCard` stack.
3. **Map Area** – Cover remaining columns with `MapFrame` component. Add floating `FAB` buttons on top-right.
4. **Mobile Frame** – Duplicate and resize to 390×844. Place search bar at top, map fills frame, drag `BottomSheet` component anchored bottom with list cards.
5. **States** – Create:
   - Loading: overlay gradient + spinner on map, skeleton list cards.
   - Empty: replace list with empty module.
   - Offline: add banner at top + disabled map variant.
   - Error: toast anchored bottom.
6. **Annotations** – Note gestures (pinch/drag), filter logic, offline download CTA.

### 3.3 Gem Detail Page
1. **Desktop Frame** – Add hero Auto Layout with gallery (8 columns) + summary card (4 columns).
2. **Action Bar** – Place `StickyCTA` component at top of frame; annotate sticky behavior.
3. **Content Sections** – Stack `Overview`, `MapPreview`, `Highlights`, `Reviews`, `Related` modules, spacing 32px.
4. **Mobile Frame** – Resize to 390 width, reorder sections vertically, add `BottomCTA`.
5. **States** – Duplicate frames for loading (skeleton gallery + cards), empty reviews (placeholder box), save error (toast near CTA).
6. **Annotations** – Call out image carousel controls, map expand, share/save actions.

### 3.4 Krawl Detail Page
1. Copy Gem Detail desktop frame; rename sections.
2. Replace Highlights section with `TimelineStepper` component (vertical Auto Layout).
3. Insert `Participants` card with avatar chips + `Invite` button.
4. Update map preview to show route (use dashed polyline overlay).
5. Generate states: empty participants, offline map, loading timeline skeleton.
6. Repeat for mobile version (stacked layout).

### 3.5 Gem Creation (Multi-step Wizard)
1. **Wizard Shell** – Place `Stepper/Horizontal` at top labeled `Basics → Location → Media → Details → Review`.
2. **Desktop Layout** – Create 2-column Auto Layout: left 8 columns for form (inputs, text areas, upload slots), right 4 columns for `GuidancePanel`.
3. **Mobile Layout** – Duplicate frame, switch to single column, move stepper to sticky top bar.
4. **Step Frames** – Duplicate frame per step; swap content (map picker for Location, media grid for Media, summary table for Review).
5. **States** – Add inline validation (red label + helper text), autosave toast near footer, submission loading overlay (semi-transparent rectangle + spinner).
6. **Annotations** – Note autosave interval, required field indicator, ability to save draft.

### 3.6 Krawl Creation Page
1. Duplicate Gem Creation wizard, rename tabs to `Overview → Stops → Timing → Collaborators → Review`.
2. Replace sidebar with `RouteBuilder` module (list of stops + add/search input) and embed mini-map preview.
3. Add drag handles (simple dots) to each stop row; annotate drag interaction.
4. Add `Collaborators` card with invite field + chips.
5. Create states: empty stop list (placeholder row), loading suggestions (skeleton rows), conflict error (inline banner near stepper).
6. Build mobile version with bottom sheet for route builder if needed.

### 3.7 Search / Discovery Page
1. Desktop frame with `SearchHeader` component spanning top.
2. Below, add horizontal Auto Layout for filter chips + toggle buttons (`Grid/List`).
3. Create main content area: left 9 columns grid of `ResultCard`s (Auto Layout wrap), right 3 columns for `TrendingPanel`.
4. Add mobile version: search bar sticky at top, filter button launching overlay (denote with annotation), results as stacked cards with infinite scroll indicator.
5. States: Duplicate frames for empty search (show suggestions block), loading (skeleton cards), error (banner below header).
6. Annotate save/share quick actions and keyboard focus behavior.

### 3.8 User Profile Page
1. Build hero section: cover rectangle, overlapping circular avatar, stats row, `Follow` + `Share` buttons.
2. Insert tab bar component (`Gems`, `Krawls`, `Activity`) below hero.
3. Desktop content: left 9 columns for cards grid, right 3 columns for `About` and `Achievements`.
4. Mobile: stack hero, actions, segmented control, card list.
5. Create states: private profile banner (lock icon + message), empty content (illustration module), loading skeleton.
6. Annotate follow success state, share behavior, tab persistence.

### 3.9 Profile Settings Page
1. Desktop frame with left column (280px) using `SettingsNav` component listing sections.
2. Right column houses form sections; use Auto Layout to group `Account`, `Notifications`, etc.
3. Add persistent `SaveBar` at bottom (sticky) with primary + secondary buttons.
4. Mobile: convert nav into accordion list; each accordion opens to full-width form.
5. States: show inline validation on inputs, disabled fields (reduced opacity), confirmation modal overlay, success toast.
6. Annotate autosave vs manual save behavior and security messaging.

### 3.10 Sign In Page
1. Desktop frame: create two columns (7/5). Left holds illustration placeholder + marketing copy; right contains form stack.
2. Form stack: Email input, Password input, Forgot link, Primary Sign In button, SSO buttons, `Continue as Guest` text button.
3. Add trust badges or quick bullet list under form if desired.
4. Mobile: stack illustration above form, widen buttons to full width.
5. States: duplicate frames with button loading spinner (replace text with loader), error alert below form.
6. Annotate password visibility toggle, guest flow entry point.

### 3.11 Onboarding Flow (3–4 steps)
1. Use mobile frame 390×844; insert full-bleed background with center card (Auto Layout column).
2. Add progress indicator (dots) at top, skip link top-right.
3. Within card: illustration block, headline, body text, primary CTA, secondary CTA.
4. Duplicate frame for each step (update copy + illustration label).
5. Create separate frames for Location and Notification permission prompts (modal with allow/deny buttons).
6. Annotate ability to skip, progress persistence, permission fallback states.

### 3.12 Offline Downloads Page
1. Desktop frame with header containing title + `Sync Now` button.
2. Add storage meter component (progress bar + text).
3. Create list (Auto Layout) of download rows: name, size, status chip, overflow menu.
4. Include settings card with toggle for auto-download, wifi-only checkbox.
5. Mobile: stack modules vertically; show bottom sheet for details.
6. States: empty (illustration), syncing (spinner overlay on rows), error (inline alert with retry).
7. Annotate storage warnings, background sync behavior.

### 3.13 Error Pages (404 / 500 / Offline)
1. Create base template frame (Desktop + Mobile) with centered stack: icon/illustration, headline, body, primary + secondary buttons, helper links.
2. Duplicate for 404, 500, Offline; update copy + CTA labels.
3. Build inline error module (narrow banner) to drop into other pages.
4. States: add “technical details” expandable panel for 500.
5. Annotate return navigation, retry logic, offline tips.

---

## 5. Edge Case & State Coverage Checklist

| Page | Desktop | Mobile | Loading | Empty | Error | Offline |
|------|---------|--------|---------|-------|-------|---------|
| Landing | ✅ | ✅ | ✅ | ✅ | — | — |
| Map | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gem Detail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (map) |
| Krawl Detail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gem Creation | ✅ | ✅ | ✅ | — | ✅ | ✅ (save) |
| Krawl Creation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Profile | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Profile Settings | ✅ | ✅ | ✅ | — | ✅ | — |
| Sign In | ✅ | ✅ | ✅ | — | ✅ | — |
| Onboarding | ✅ | ✅ | ✅ | — | ✅ | — |
| Offline Downloads | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error Pages | ✅ | ✅ | — | — | ✅ | ✅ |

Use this table as a progress tracker—check off boxes in Figma once each variant frame exists.

---

## 6. Annotation & Documentation

1. Duplicate the `Annotation Kit` component onto every frame.
2. Number callouts clockwise from top-left; keep numbers consistent between desktop and mobile versions of the same page.
3. On the `Flows & Notes` page:
   - Add user-flow diagrams (e.g., `Landing → Sign In → Onboarding → Map`).
   - Create a `Notes` table with columns: `#`, `Component`, `Behavior`, `Data Source`, `States`.
4. Export PNG thumbnails per page (Desktop + Mobile + Key States) once ready; place them in `docs/design/exports/` if needed for handoff.

---

## 7. Delivery Checklist

- [ ] All 13 pages wireframed for desktop and mobile.
- [ ] Loading, empty, error/offline states represented.
- [ ] Onboarding includes 3–4 steps + permission screens.
- [ ] Gem/Krawl creation flows documented step-by-step.
- [ ] Wireframes annotated with numbered notes.
- [ ] Reusable components set up in `00_Foundations`.
- [ ] `Flows & Notes` page shows navigation paths.
- [ ] Figma share link captured in `docs/design/WIREFRAMES.md`.
- [ ] Review session scheduled with team (add date in `WEEK_02_TASKS.md` if required).

Once the Figma file is ready, update `docs/design/WIREFRAMES.md` > **Figma Wireframes** section with the share link and version details.

