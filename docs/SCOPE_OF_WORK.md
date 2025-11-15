# Scope of Work (SOW): Krawl - The Living Map of Filipino Culture

## Summary / Overview

This Scope of Work (SOW) document provides a comprehensive description of the Krawl Progressive Web App (PWA) project, including detailed specifications for all pages, features, system integrations, and technology stack. The document clearly defines in-scope and out-of-scope items to establish clear boundaries and expectations for development and delivery. This project will utilize free-tier or generously free-tiered tools and services, with social login authentication exclusively.

**Project Overview:** Krawl is a community-driven PWA that maps authentic Filipino culture through user-curated points of interest ("Gems") and guided trails ("Krawls"). The initial launch will be limited to Cebu City, Philippines, with core features including location-aware guided experiences, offline capability, and community-driven quality control mechanisms.

**Technology Stack Summary (Finalized):**
- **Backend:** Java 25 LTS + Spring Boot 3.5.7 + Maven
- **Frontend:** Next.js 16.0.3 + React 19.2.0 + TypeScript 5.x + Tailwind CSS v4
- **Database:** Aiven PostgreSQL (free tier)
- **Backend Deployment:** Oracle Cloud Infrastructure (Always Free Tier)
- **Frontend Hosting:** Vercel (free tier)
- **Authentication:** Google OAuth 2.0 (social login only)
- **Image Management:** Cloudinary (free tier)
- **Email:** Brevo (free tier: 300 emails/day)
- **Maps:** Mapbox (free tier: 50,000 loads/month)
- **CI/CD:** GitHub Actions (free tier)
- **Monitoring:** Spring Boot Actuator + Sentry (free tier)

All technology decisions prioritize mobile-first design, scalability, maintainability, and agile principles while utilizing free-tier services suitable for student projects.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial version |
| 1.1.0 | 2025-11-14 | Development Team | Updated frontend framework from React to Next.js 14.x for better PWA support and SEO |
| 1.3.0 | 2025-11-15 | Development Team | Updated frontend framework to Next.js 16.0.3 with React 19.2.0 and Tailwind CSS v4 |
| 1.2.0 | 2025-11-14 | Development Team | Comprehensive UX improvements: Added onboarding flow, empty/loading/error states, progressive disclosure, accessibility enhancements, mobile gestures, haptic feedback, and Google-level UX patterns |

**Current Version:** 1.3.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Project Overview](#project-overview)
5. [Technology Stack](#technology-stack)
6. [Pages and User Interfaces](#pages-and-user-interfaces)
7. [Features and Functionality](#features-and-functionality)
8. [System Integrations](#system-integrations)
9. [In-Scope Items](#in-scope-items)
10. [Out-of-Scope Items](#out-of-scope-items)
11. [Free Tier Service Limits](#free-tier-service-limits)
12. [Technical Requirements](#technical-requirements)
13. [Deliverables](#deliverables)
14. [Timeline and Milestones](#timeline-and-milestones)
15. [Assumptions and Constraints](#assumptions-and-constraints)
16. [Risks and Mitigation](#risks-and-mitigation)
17. [Appendices](#appendices)
18. [Glossary](#glossary)

---

## Project Overview

### Project Name
**Krawl** - The Living Map of Filipino Culture

### Project Type
Progressive Web App (PWA) - Community-driven cultural mapping platform

### Primary Objectives
1. Develop and launch MVP with core features (authentication, Gem pinning, Krawl creation, Krawl Mode, offline capability)
2. Seed initial content: 100+ Gems and 10+ Krawls in Cebu City
3. Validate core loop with 100-500 active users in Cebu City
4. Gather user feedback for iteration
5. Test revenue model with 5-10 local Cebu businesses
6. Enforce map boundary restrictions to Cebu City only

### Launch Area
**Cebu City, Philippines** - All map views, content creation, and discovery features are restricted to Cebu City boundaries only.

### Project Duration
15 Weeks (14 weeks development + 1 week launch)

### Identified Stakeholders

#### Primary Stakeholders
- **Founders/Development Team** - Core development and product management
- **Young Filipino Adults (18-35)** - Primary user base in Cebu City (initial launch area)
- **Founding Users** - Early adopters recruited to seed initial content in Cebu City

#### Secondary Stakeholders
- **Domestic & International Travelers** - Secondary user base seeking authentic experiences
- **Local Businesses** - Potential revenue partners via "Claim Your Gem" freemium model
- **Community Contributors** - Users who create Gems, Krawls, and provide vouching/ratings

For detailed stakeholder information, see [PROJECT_BRIEF.md](./PROJECT_BRIEF.md#-identified-stakeholders).

For detailed user persona profiles, see [USER_PERSONA_PROFILES.md](./user-research/USER_PERSONA_PROFILES.md).

---

## Technology Stack

### Backend
- **Language:** Java 25 LTS (Long-Term Support version, released September 2025, supported until September 2033)
  - **Rationale:** Latest LTS version with improved performance, pattern matching, and modern language features. Better than Java 17 for new projects while maintaining long-term support.
- **Framework:** Spring Boot 3.5.7 (latest stable version as of installation date)
  - **Rationale:** Industry standard, excellent documentation, strong community support, built-in security, and seamless integration with Spring ecosystem.
- **Build Tool:** Maven 3.9.x (latest stable version)
  - **Rationale:** Standard for Spring Boot projects, excellent IDE support, widely adopted, easier for students to learn with extensive documentation.
- **Deployment Platform:** Oracle Cloud Infrastructure (OCI) - Always Free Tier
  - 2 Always Free Autonomous Databases (20 GB each)
  - Compute instances (1/8 OCPU, 1 GB memory)
  - 10 GB object storage
  - 10 TB outbound data transfer per month

### Database
- **Service:** Aiven for PostgreSQL
  - **Free tier:** Single node, 1 CPU, 1GB RAM, 5GB storage
  - **Version:** PostgreSQL 15+ (managed by Aiven)
  - **Rationale:** Managed service with automatic backups, monitoring, and easy scaling. Free tier sufficient for MVP with 100-500 users.
  - **Alternative:** Oracle Autonomous Database (if Aiven free tier unavailable)

### Frontend
- **Framework:** Next.js 16.0.3 (installed version)
  - **Rationale:** 
    - Built on React 19.2.0 with enhanced features
    - Superior PWA support with built-in configuration
    - Server-side rendering (SSR) and static site generation (SSG) for better performance
    - Built-in image optimization and automatic code splitting
    - Better SEO capabilities (important for content discovery)
    - Excellent mobile-first capabilities with responsive design
    - Strong community and extensive documentation
    - API routes for simplified backend integration
    - Built-in routing and navigation
- **PWA Support:** 
  - Built-in PWA configuration via next-pwa plugin
  - Service Workers (automatic generation and management)
  - Web App Manifest (automatic generation)
  - Offline-first architecture with better caching strategies
  - Improved performance with SSR/SSG
- **Maps Library:** Mapbox GL JS 3.x (latest version)
  - **Rationale:** Best-in-class mapping library with excellent mobile performance, works seamlessly with Next.js
- **State Management:** Zustand 4.4.x (latest stable version)
  - **Rationale:** 
    - Lightweight and simple (much simpler than Redux)
    - Better performance than Context API for complex state
    - Minimal boilerplate, perfect for agile development
    - Easy to learn and maintain
    - Scales well as application grows
    - Works perfectly with Next.js (both client and server components)
  - **Alternative:** React Context API for simple state (can migrate to Zustand later if needed)

### Frontend Styling
- **CSS Framework:** Tailwind CSS v4 (installed version, CSS-based configuration with @tailwindcss/postcss)
  - **Rationale:** Utility-first CSS framework, highly customizable, excellent documentation, free and open-source
  - **Configuration:** CSS-based using @tailwindcss/postcss plugin (no JavaScript config file needed)
  - **PostCSS:** Configured with @tailwindcss/postcss plugin
  - **Component Library:** shadcn/ui (optional, for accessible components built on Radix UI and Tailwind CSS)
  - **Documentation:** See [BRAND_GUIDELINES.md](./design/BRAND_GUIDELINES.md) for visual identity tokens and [UI_UX_DESIGN_SYSTEM.md](./design/UI_UX_DESIGN_SYSTEM.md) for component library specs and implementation patterns

### Authentication
- **Provider:** Google OAuth 2.0 (free, unlimited users)
- **Implementation:** NextAuth.js v5 (Auth.js) for Next.js integration
  - **Note:** NextAuth.js v5 is also known as Auth.js. Both names refer to the same library.
  - **Rationale:** Free and open-source, excellent Next.js integration, supports multiple social providers, TypeScript support, active maintenance, no vendor lock-in
  - **Primary Provider:** Google OAuth 2.0
  - **Additional Options:** Facebook Login, GitHub OAuth (if needed)
  - **Documentation:** See [BRAND_GUIDELINES.md](./design/BRAND_GUIDELINES.md) for detailed authentication setup and implementation guidelines
  - **For detailed authentication flow diagrams and API specifications:** See API_DOCUMENTATION.md [Internal] and SYSTEM_DESIGN.md [Internal]

#### Authentication Architecture

**Frontend (NextAuth.js v5 - Auth.js):**
- Handles OAuth callback from Google
- Manages user session on frontend
- Provides authentication state to React components
- Handles token refresh and session persistence

**Backend (Spring Security OAuth):**
- Validates OAuth tokens from frontend
- Manages user accounts and sessions
- Provides protected API endpoints
- Handles user creation/update on first login

**Authentication Flow:**

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Clicks "Sign In"
       ▼
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
└──────┬──────────┘
       │
       │ 2. Redirects to Google OAuth
       ▼
┌─────────────────┐
│  Google OAuth   │
│  Service        │
└──────┬──────────┘
       │
       │ 3. User authenticates
       │ 4. Google redirects with authorization code
       ▼
┌─────────────────┐
│  Frontend       │
│  (NextAuth.js)  │
└──────┬──────────┘
       │
       │ 5. Exchanges code for tokens
       │ 6. Sends token to backend
       ▼
┌─────────────────┐
│  Backend API    │
│  (Spring Boot)  │
└──────┬──────────┘
       │
       │ 7. Validates token
       │ 8. Creates/updates user account
       │ 9. Returns session token
       ▼
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
└──────┬──────────┘
       │
       │ 10. Stores session
       │ 11. User is authenticated
       ▼
┌─────────────┐
│   User      │
│ (Logged In) │
└─────────────┘
```

**Step-by-Step Flow:**
1. **User Action:** User clicks "Sign In" button on frontend
2. **OAuth Redirect:** Frontend redirects user to Google OAuth consent screen
3. **User Authentication:** User authenticates with Google credentials
4. **Authorization Code:** Google redirects back to frontend with authorization code
5. **Token Exchange:** Frontend (NextAuth.js) exchanges authorization code for access/ID tokens
6. **Backend Validation:** Frontend sends token to backend API (`/api/auth/validate`)
7. **Token Validation:** Backend (Spring Security) validates token with Google
8. **User Management:** Backend creates new user account or updates existing account
9. **Session Creation:** Backend returns session token (JWT or session cookie)
10. **Session Storage:** Frontend stores session token securely
11. **Authenticated State:** User is now authenticated and can access protected features

**Session Management:**
- JWT tokens or session cookies (to be determined during implementation)
- Session refresh handled automatically by NextAuth.js
- Backend validates session on each protected API request

### Image Management
- **Service:** Cloudinary
  - Free tier: 7,500 images/month, 2 GB storage, 5 GB bandwidth
  - Image transformations and optimizations
  - CDN delivery

### Email Service
- **Service:** Brevo (formerly Sendinblue)
  - Free tier: 300 emails per day (approximately 9,000 per month)
  - Transactional email API
  - Email templates support
  - **Alternative:** Resend (free tier: 3,000 emails/month) - Available as backup option if Brevo limits are insufficient

### Maps and Location Services
- **Service:** Mapbox
  - Free tier: 50,000 map loads per month
  - Geocoding API
  - Directions API (with usage limits)
  - Custom map styles

### Additional Tools
- **Version Control:** Git with GitHub (free for public and private repos)
  - **Rationale:** Industry standard, excellent CI/CD integration, free private repos for students
- **CI/CD:** GitHub Actions (free tier)
  - **Rationale:** 
    - Free for public repos (unlimited minutes)
    - Free for private repos (2,000 minutes/month - sufficient for student project)
    - Native GitHub integration
    - Excellent documentation and community support
- **Frontend Hosting:** Vercel (free tier)
  - **Rationale:** 
    - Free tier suitable for student projects
    - Excellent Next.js integration with automatic deployments
    - Built-in CDN and edge network
    - Automatic SSL/HTTPS
    - Serverless functions support
- **Monitoring & Logging:** 
  - **Application Logging:** SLF4J with Logback (built into Spring Boot)
  - **Error Tracking:** Sentry (free tier: 5,000 events/month)
    - **Rationale:** Free tier sufficient for MVP, excellent error tracking and monitoring
  - **Application Monitoring:** Basic Spring Boot Actuator endpoints
    - **Rationale:** Built-in, free, provides health checks and metrics

**Note:** For comprehensive tools and services information with free tier details, verification status, and monitoring guidelines, see API_DOCUMENTATION.md [Internal].

---

## UX Design Principles and Patterns

### Core UX Principles (Google Material Design Inspired)

1. **User-Centered Design**
   - Every feature designed with user needs first
   - Clear value proposition at every step
   - Minimal cognitive load
   - Progressive disclosure of complexity

2. **Accessibility First**
   - WCAG 2.1 Level AA compliance minimum
   - Keyboard navigation for all interactions
   - Screen reader support throughout
   - High contrast mode support
   - Reduced motion options

3. **Mobile-First Approach**
   - Touch-optimized targets (minimum 44x44px)
   - Gesture-based interactions
   - Responsive design (320px to desktop)
   - Performance optimization for mobile networks

4. **Progressive Disclosure**
   - Show only what's needed when needed
   - Multi-step forms for complex tasks
   - Collapsible sections for advanced features
   - Contextual help and tooltips

5. **Feedback and Confirmation**
   - Loading states for all async operations
   - Success/error messages with clear actions
   - Haptic feedback for important interactions
   - Visual feedback for all user actions

6. **Error Prevention and Recovery**
   - Real-time validation
   - Confirmation dialogs for destructive actions
   - Auto-save drafts
   - Clear error messages with recovery options

7. **Performance and Responsiveness**
   - 60fps animations
   - Skeleton screens for loading
   - Lazy loading for images and content
   - Optimistic UI updates

8. **Brand Alignment**
   - All UI copy and user-facing content should align with brand tone of voice and messaging guidelines defined in [BRAND_BRIEF.md](./design/BRAND_BRIEF.md)
   - Content should reflect brand values: authenticity, community-driven, cultural preservation, accessibility
   - User communications should follow brand personality traits: explorer, community builder, cultural guardian

### Global UI Patterns

#### Navigation Structure
- The full site map, user journeys, and canonical routes are detailed in [`SITEMAP.md`](./SITEMAP.md); reference it when implementing or updating navigation.
- **Bottom Navigation (Mobile):**
  - Home / Map
  - Search / Discover
  - Create (FAB or menu item)
  - Profile
  - Settings (in profile)
- **Top Navigation (Desktop):**
  - Logo (home link)
  - Primary nav: Map, Search, Create, Profile
  - Secondary nav: Settings, Help
- **Breadcrumbs:** For deep navigation (e.g., Home > Search > Gem Detail)
- **Back Button:** Always accessible, browser back support

#### Common Components
- **Bottom Sheets (Mobile):** For detail views, forms, filters
- **Modals/Dialogs:** For confirmations, important actions
- **Snackbars/Toasts:** For non-blocking notifications
- **Floating Action Buttons (FAB):** For primary actions (Create Gem)
- **Chips:** For filters, tags, categories
- **Cards:** For content previews, lists
- **Skeleton Screens:** For loading states

#### Interaction Patterns
- **Pull to Refresh:** On list views, map view
- **Infinite Scroll:** For long lists (with "Load More" option)
- **Swipe Actions:** Swipe to reveal actions (e.g., delete, share)
- **Long Press:** For context menus
- **Drag and Drop:** For reordering (Gems in Krawl, photos)

#### Visual Feedback
- **Haptic Feedback:**
  - Light: Button taps, selections
  - Medium: Important actions (save, submit)
  - Strong: Critical events (arrival at Gem, errors)
- **Visual Feedback:**
  - Button press states (ripple effect)
  - Loading spinners
  - Progress indicators
  - Success checkmarks
  - Error icons

#### State Management (UX Perspective)
- **Empty States:** Helpful, actionable, encouraging
- **Loading States:** Skeleton screens, progress indicators
- **Error States:** Clear messages, recovery actions
- **Success States:** Confirmation, next steps

---

## Pages and User Interfaces

**Note:** All user-facing copy should follow brand tone of voice guidelines (see [BRAND_BRIEF.md](./design/BRAND_BRIEF.md)). Content should be authentic, welcoming, culturally respectful, clear, and engaging.

### 0. Onboarding Flow (First-Time User Experience)
**Purpose:** Guide new users through key features and value proposition

**Features:**
- **Welcome Screen:**
  - App logo and tagline
  - Brief value proposition (1-2 sentences)
  - "Get Started" primary CTA
  - "Skip" option for returning users
- **Interactive Tutorial (3-4 steps):**
  - Step 1: "Discover Gems" - Show example Gem with tap interaction
  - Step 2: "Follow Krawls" - Show Krawl trail visualization
  - Step 3: "Create Your Own" - Highlight creation features (if authenticated)
  - Step 4: "Explore Cebu City" - Emphasize geographic focus
- **Permission Requests (Progressive):**
  - Location permission request with clear benefit explanation
  - Notification permission (optional, deferred)
- **Quick Start Options:**
  - "Explore as Guest" - Direct to map view
  - "Sign In to Create" - Highlight benefits of authentication
- **Skip Option:** Available at any step, with option to view tutorial later

**UX Principles Applied:**
- Progressive disclosure (one concept per screen)
- Clear value proposition at each step
- Minimal cognitive load
- Easy to skip for experienced users
- Persistent "Help" access to replay tutorial

---

### 1. Landing Page / Home Page
**Purpose:** Introduction to Krawl, value proposition, and entry point for new users

**Features:**
- **Hero Section:**
  - Compelling tagline "The Living Map of Filipino Culture"
  - High-quality hero image/video showcasing Cebu City culture
  - Primary CTA: "Explore Cebu City" (prominent, high contrast)
  - Secondary CTA: "Sign In" (for authenticated features)
  - Trust indicators (user count, Gem count, Krawl count)
- **Value Proposition Section:**
  - Three-column layout explaining:
    - "Discover Gems" - Authentic cultural locations
    - "Follow Krawls" - Guided cultural trails
    - "Share Culture" - Community-driven content
  - Visual icons/illustrations for each benefit
- **Featured Content:**
  - "Featured Krawls" carousel with:
    - Large, high-quality cover images
    - Rating and difficulty indicators
    - Quick preview on hover/tap
    - Smooth horizontal scroll with momentum
  - "Popular Gems" grid (3-6 items)
- **Statistics Display:**
  - Animated counters (total Gems, total Krawls, active users)
  - Visual representation (icons, charts)
  - Real-time updates if possible
- **Social Proof:**
  - Recent user activity feed (optional)
  - Testimonials or quotes (if available)
- **Authenticated Variant:**
  - Personalized greeting: "Welcome back, [Name]!"
  - "Your Activity" section showing recent Gems created and saved Krawls
  - Personal statistics (Gems created, Krawls created, Vouches given, Krawls completed)
  - Direct creation CTAs: "Create Gem", "Create Krawl"
  - Removed or minimized "How It Works" section (users already understand value)
  - See [WIREFRAMES.md](./design/WIREFRAMES.md) for detailed authenticated variant wireframes
- **Footer:**
  - Links: About, Help, Privacy, Terms
  - Social media links (if applicable)
  - Copyright and version info

**Empty States:**
- If no featured content: "Be the first to create a Krawl in Cebu City!"
- If no statistics: "Join us in mapping Filipino culture"

**Loading States:**
- Skeleton screens for featured content
- Progressive image loading with blur-up effect
- Smooth fade-in animations

**User Actions:**
- Navigate to map view (primary action)
- Sign in with social login
- Browse featured content (with smooth transitions)
- Learn about the platform (expandable sections)
- Skip to map view (quick access)

**Accessibility:**
- High contrast ratios (WCAG AA minimum)
- Keyboard navigation support
- Screen reader announcements
- Focus indicators
- Alt text for all images

---

### 2. Map View Page
**Purpose:** Primary interface for viewing and interacting with Gems and Krawls on the map

**Features:**
- **Interactive Mapbox Map:**
  - Centered on Cebu City with smooth animations
  - Boundary restriction (Cebu City limits only) with visual boundary indicator
  - Gem markers with smart clustering (adjusts based on zoom level)
  - Krawl trail visualization (polylines with distinct colors per Krawl)
  - Smooth zoom and pan with momentum scrolling
  - Double-tap to zoom, pinch to zoom gestures
- **Map Controls:**
  - Floating action button (FAB) for "Create Gem" (if authenticated)
  - "My Location" button (centers map on user, requests permission if needed)
  - Zoom controls (zoom in/out buttons, optional)
  - Map style toggle (standard/satellite, if available)
  - Compass indicator (shows map rotation)
- **Search and Filter Panel:**
  - **Search Bar:**
    - Prominent, always accessible (sticky header on mobile)
    - Autocomplete with recent searches
    - Voice input option (if supported)
    - Clear button (X icon) when text entered
    - Search suggestions dropdown
  - **Filter Panel (Collapsible):**
    - Category filter (multi-select chips)
    - Rating filter (slider: 1-5 stars)
    - Distance filter (radius slider with visual indicator)
    - Content type toggle (Gems only / Krawls only / Both)
    - Active filter count badge
    - "Clear all filters" quick action
- **Info Windows/Popups:**
  - Bottom sheet on mobile (slides up from bottom)
  - Card overlay on desktop
  - Quick preview with:
    - Thumbnail image
    - Name and category
    - Rating and distance
    - "View Details" CTA
    - Dismissible (swipe down on mobile, click outside on desktop)
- **View Toggle:**
  - Map view / List view toggle (prominent, accessible)
  - List view shows cards with thumbnails
  - Smooth transition between views
- **User Location Indicator:**
  - Blue dot with accuracy circle (if permissions granted)
  - Pulsing animation when actively tracking
  - Permission request dialog with clear benefits

**Empty States:**
- No Gems/Krawls in area: "No content in this area. Be the first to add a Gem!"
- No search results: "No results found. Try adjusting your filters."
- Location permission denied: "Enable location to see nearby Gems and Krawls"

**Loading States:**
- Map tile loading with subtle progress indicator
- Marker clustering animation
- Skeleton screens for info windows
- Progressive marker loading (load visible markers first)

**Error States:**
- Map load failure: "Unable to load map. Check your connection and try again."
- Location error: "Location unavailable. Using default view."
- Search error: "Search failed. Please try again."

**User Actions:**
- Tap/click on Gem markers → Bottom sheet with quick preview → "View Details" → Gem detail page
- Tap/click on Krawl trails → Bottom sheet with quick preview → "View Details" → Krawl detail page
- Long-press on map → Quick action menu (Create Gem, Center map, etc.)
- Swipe up on info window → Expand to full detail view
- Pull down to refresh (refresh map data)
- Filter and search with real-time results
- Toggle between map/list view
- Create new Gem/Krawl (FAB or menu)

**Mobile Gestures:**
- Pinch to zoom
- Double-tap to zoom
- Long-press for context menu
- Swipe up/down on info windows
- Pull to refresh

**Accessibility:**
- Keyboard navigation for all controls
- Screen reader announcements for map interactions
- High contrast mode support
- Reduced motion option
- Focus management for modals

**Technical Requirements:**
- Map loads restricted to Cebu City boundaries
- Offline map tiles caching for downloaded Krawls
- Responsive design for mobile and desktop
- Performance: 60fps map interactions
- Lazy loading for markers outside viewport

---

### 3. Gem Detail Page
**Purpose:** Display comprehensive information about a specific Gem (point of interest)

**Features:**
- Gem name and category
- Location on embedded map
- Photos gallery (from Cloudinary)
- Description and cultural significance
- Creator information and profile link
- Vouching count and list of vouchers
- Rating display (average and breakdown)
- Comments/reviews section
- Related Krawls that include this Gem
- Report button (for inappropriate content)
- Share functionality
- Directions button (opens in external maps app)

**User Actions:**
- View photos and details
- Vouch for Gem (if authenticated)
- Rate the Gem (if authenticated)
- Add comment/review (if authenticated)
- Report inappropriate content
- Share Gem with others
- Navigate to related Krawls
- View creator profile
- Get directions

**Technical Requirements:**
- Image optimization and lazy loading
- Responsive image gallery
- Social sharing meta tags

---

### 4. Gem Creation Page
**Purpose:** Allow authenticated users to create and submit new Gems

**Features:**
- **Multi-Step Form (Progressive Disclosure):**
  - **Step 1: Location (Required)**
    - Map interface with draggable pin
    - "Use Current Location" button (if permission granted)
    - Search bar for address lookup
    - Visual boundary indicator (Cebu City limits)
    - Real-time validation feedback (green checkmark if valid)
    - Error message if outside boundaries
  - **Step 2: Basic Info (Required)**
    - Gem name input (with character counter, max 100 chars)
    - Category selection (visual chips/icons, single select)
    - Description textarea (with character counter, min 50, max 500 chars)
    - Character count with visual feedback (warns at 80% limit)
  - **Step 3: Media (Optional but Recommended)**
    - Photo upload interface:
      - Drag-and-drop zone
      - "Add Photos" button
      - Image preview grid (up to 5 images)
      - Reorder by drag-and-drop
      - Delete individual photos
      - Upload progress indicators
      - Image compression preview (show before/after size)
  - **Step 4: Additional Details (Optional)**
    - Cultural significance notes (textarea, max 300 chars)
    - Tags/keywords (autocomplete chips, max 5 tags)
    - Suggested tags based on category
- **Progress Indicator:**
  - Step indicator at top (1 of 4, 2 of 4, etc.)
  - Visual progress bar
  - "Back" and "Next" navigation buttons
  - "Save Draft" available at any step
- **Draft Management:**
  - Auto-save every 30 seconds (with subtle notification)
  - "Saved Draft" indicator
  - "Resume Draft" option on entry (if draft exists)
  - Draft list in user profile
- **Validation and Feedback:**
  - Real-time field validation
  - Inline error messages (below each field)
  - Success indicators (green checkmarks)
  - Required field indicators (asterisks)
  - Disabled "Submit" button until all required fields valid
- **Preview Mode:**
  - "Preview" button before submission
  - Shows how Gem will appear to others
  - Edit from preview mode
- **Submission:**
  - Final confirmation dialog
  - Submission progress indicator
  - Success screen with "View Gem" and "Create Another" options
  - Error handling with retry option

**Empty States:**
- No photos uploaded: "Add photos to help others discover this Gem"
- No tags: "Add tags to make your Gem easier to find"

**Loading States:**
- Image upload progress (percentage and spinner)
- Location validation spinner
- Form submission spinner
- Map loading skeleton

**Error States:**
- Location outside boundaries: Clear error with map highlighting valid area
- Image upload failure: Retry button with error message
- Network error: "Connection lost. Your draft is saved. Retry?"
- Validation errors: Inline messages with suggestions

**User Actions:**
- Select location on map (drag pin or search)
- Upload photos (drag-drop or button)
- Fill in Gem details with real-time validation
- Save as draft (explicit or auto-save)
- Preview before submission
- Submit Gem for community review
- Cancel creation (with confirmation if unsaved changes)

**UX Enhancements:**
- Smart defaults (suggest current location)
- Autocomplete for tags
- Image compression preview
- Character count with visual warnings
- Keyboard shortcuts (Ctrl+S to save draft)
- Mobile-optimized input fields (appropriate keyboards)

**Accessibility:**
- Form labels properly associated
- Error messages announced to screen readers
- Keyboard navigation through all fields
- Focus management between steps

---

### 5. Krawl Detail Page
**Purpose:** Display comprehensive information about a specific Krawl (guided trail)

**Features:**
- Krawl name and description
- Creator information and profile link
- Trail visualization on embedded map
- List of Gems in the Krawl (ordered sequence)
- Estimated duration and distance
- Difficulty level indicator
- Photos from Gems in the trail
- Rating and reviews
- Vouching count
- Download for offline button
- Start Krawl Mode button
- Share functionality
- Report button

**User Actions:**
- View trail details and route
- Browse Gems in the Krawl
- Download for offline use
- Start Krawl Mode (location-aware guided experience)
- Rate and review the Krawl
- Vouch for the Krawl
- Share with others
- Report inappropriate content
- View creator profile

**Technical Requirements:**
- Offline download functionality (Service Worker)
- Route calculation and visualization
- Responsive map display

---

### 6. Krawl Creation Page
**Purpose:** Allow authenticated users to create new Krawls (guided trails)

**Features:**
- Form fields:
  - Krawl name (required)
  - Description (required)
  - Category/theme selection
  - Gem selection interface (add Gems to trail in order)
  - Reorder Gems (drag and drop)
  - Estimated duration input
  - Difficulty level selection
  - Cover image upload
- Map visualization showing selected Gems and route
- Route optimization suggestions
- Validation (minimum 2 Gems required, all within Cebu City)
- Draft saving
- Preview mode

**User Actions:**
- Search and add Gems to trail
- Reorder Gems in sequence
- Set trail metadata
- Preview the Krawl
- Save as draft
- Publish Krawl
- Cancel creation

**Technical Requirements:**
- Route calculation using Mapbox Directions API
- Gem selection with search and filtering
- Drag-and-drop reordering interface
- Location validation for all selected Gems

---

### 7. Krawl Mode Page
**Purpose:** Location-aware guided experience for following a Krawl in real-time

**Features:**
- **Pre-Start Checklist:**
  - Location permission status
  - Battery level warning (if < 20%)
  - Offline download status (if applicable)
  - Estimated duration reminder
  - Safety tips (optional, dismissible)
  - "Start Krawl" primary button
- **Full-Screen Map View:**
  - Current location indicator (blue dot with accuracy circle)
  - Next Gem marker (pulsing animation, distinct color)
  - Route polyline (highlighted path to next Gem)
  - Completed Gems (grayed out markers)
  - Remaining Gems (standard markers)
  - Map auto-centers on user location (with option to disable)
- **Bottom Sheet (Mobile) / Side Panel (Desktop):**
  - **Progress Indicator:**
    - Circular progress ring (X of Y Gems completed)
    - Percentage complete
    - Estimated time remaining
  - **Next Gem Card:**
    - Gem thumbnail image
    - Gem name and category
    - Distance to next Gem (updates in real-time)
    - Estimated time to reach (walking speed)
    - "View Details" button
  - **Directions Panel:**
    - Turn-by-turn directions (text list)
    - Current step highlighted
    - Visual direction indicators (arrows, icons)
    - Distance to next turn
    - "Recalculate Route" button (if off-route)
  - **Action Buttons:**
    - "Mark as Visited" (when near Gem)
    - "Skip Gem" (with confirmation)
    - "View All Gems" (expandable list)
    - "Exit Krawl Mode" (with confirmation)
- **Arrival Detection:**
  - Geofencing trigger (50m radius, adjustable)
  - Haptic feedback (vibration) when arriving
  - Visual notification (card slides up)
  - Audio cue (optional, user preference)
  - Auto-mark as visited (with option to disable)
- **Gem Detail Cards (Swipeable):**
  - Swipe up to view current Gem details
  - Swipe left/right to browse other Gems in Krawl
  - Full Gem information (photos, description, etc.)
  - "Continue" button to return to navigation
- **Completion Celebration:**
  - Animated celebration screen
  - Completion statistics:
    - Total time taken
    - Distance traveled
    - Gems visited
    - Shareable achievement card
  - "Rate this Krawl" prompt
  - "Share Completion" option
  - "Explore More Krawls" CTA
- **Safety Features:**
  - Battery level indicator (warns if < 10%)
  - Low battery mode (reduces location update frequency)
  - Emergency exit (always accessible)
  - Offline mode indicator
  - Connection status indicator
- **Offline Mode Support:**
  - Clear "Offline Mode" indicator
  - Cached map tiles
  - Pre-downloaded Gem data
  - Background sync when connection restored

**Empty States:**
- No location permission: "Enable location to start Krawl Mode"
- No route calculated: "Calculating route..." with progress

**Loading States:**
- Route calculation spinner
- Location acquisition indicator
- Map tile loading
- Gem data loading

**Error States:**
- Location unavailable: "Unable to get location. Check GPS settings."
- Off-route: "You seem off-route. Recalculating..." with button
- Network error (offline mode): "Offline mode active. Route cached."
- Battery low: "Low battery. Consider pausing or charging."

**User Actions:**
- Start Krawl Mode (with pre-flight checklist)
- View directions to next Gem (expandable panel)
- Mark Gem as visited (manual or auto)
- View Gem details during trail (swipeable cards)
- Skip Gem (with confirmation and reason)
- Recalculate route (if off-route)
- Exit Krawl Mode (with confirmation and progress save)
- Complete Krawl (triggers celebration)
- Share completion (social sharing)

**Mobile Gestures:**
- Swipe up on bottom sheet to expand
- Swipe down to minimize
- Swipe left/right on Gem cards
- Long-press for quick actions menu
- Pull down to refresh route

**Haptic Feedback:**
- Arrival at Gem (strong vibration)
- Route recalculation (light vibration)
- Button taps (subtle feedback)
- Error states (pattern vibration)

**Accessibility:**
- Voice announcements for directions
- High contrast mode
- Large text option
- Screen reader support
- Reduced motion option

**Technical Requirements:**
- Real-time geolocation tracking (high accuracy mode)
- Geofencing for arrival detection (adjustable radius)
- Offline functionality for downloaded Krawls
- Battery-efficient location tracking (adaptive frequency)
- Background location updates (with user permission)
- Route recalculation on deviation
- Performance: Smooth 60fps map updates

---

### 8. User Profile Page
**Purpose:** Display user information, activity, and created content

**Features:**
- User avatar and display name (from social login)
- Bio/description (editable)
- Statistics:
  - Gems created count
  - Krawls created count
  - Gems vouched count
  - Krawls completed count
- Created Gems list (with links)
- Created Krawls list (with links)
- Vouched Gems list
- Completed Krawls list
- Activity feed/timeline
- Edit profile button (if own profile)

**User Actions:**
- View user statistics and content
- Navigate to created Gems/Krawls
- Edit own profile (if authenticated as that user)
- Follow user (future feature - out of scope for MVP)

**Technical Requirements:**
- Profile data from social login provider
- Efficient pagination for content lists
- Image optimization for avatars

---

### 9. Profile Settings Page
**Purpose:** Allow users to manage their account settings and preferences

**Features:**
- Edit profile information:
  - Display name
  - Bio/description
  - Avatar/photo (upload via Cloudinary)
- Notification preferences:
  - Email notifications (on/off)
  - Push notifications (on/off)
- Privacy settings:
  - Profile visibility
  - Activity visibility
- Account management:
  - Connected social accounts
  - Delete account option
- App preferences:
  - Map style preference
  - Language (English only for MVP)
  - Units (metric/imperial)

**User Actions:**
- Update profile information
- Change notification settings
- Manage privacy preferences
- Delete account
- Update app preferences

**Technical Requirements:**
- Secure profile update API
- Image upload for avatar
- Preference persistence

---

### 10. Search and Discovery Page
**Purpose:** Allow users to search and discover Gems and Krawls

**Features:**
- **Search Interface:**
  - **Prominent Search Bar:**
    - Full-width, sticky header
    - Autocomplete dropdown (shows as you type)
    - Voice input button (if supported)
    - Clear button (X) appears when text entered
    - Search icon with loading spinner during search
  - **Quick Filters (Below Search Bar):**
    - Content type chips (All / Gems / Krawls) - single select
    - Category chips (scrollable horizontal list)
    - Active filter count badge
  - **Advanced Filters (Collapsible Panel):**
    - Rating slider (1-5 stars with visual stars)
    - Distance slider (with radius visualization on map)
    - Date range picker (created date)
    - Sort dropdown (Relevance / Rating / Distance / Date)
    - "Clear all" button
- **Search Suggestions:**
  - Autocomplete dropdown with:
    - Recent searches (with delete option)
    - Popular searches
    - Suggested searches based on location
    - Trending searches
  - Keyboard navigation (arrow keys, Enter to select)
- **Search Results:**
  - **Results Header:**
    - Result count ("X results found")
    - Active filters summary (dismissible chips)
    - View toggle (List / Map)
  - **List View:**
    - Card layout with:
      - Thumbnail image (lazy loaded)
      - Title and category
      - Rating (stars) and distance
      - Quick actions (Vouch, Share)
      - Tap to view details
    - Infinite scroll or "Load More" button
    - Skeleton screens while loading
  - **Map View:**
    - Markers for all results
    - Clustering for performance
    - Info windows on marker click
    - Results list as bottom sheet
  - **Empty State:**
    - "No results found" illustration
    - Suggestions to:
      - Try different keywords
      - Clear filters
      - Browse popular content
      - Create new content

**Empty States:**
- No search query: "Start typing to search Gems and Krawls"
- No results: "No results found. Try adjusting your search or filters."
- No recent searches: "Your recent searches will appear here"

**Loading States:**
- Search spinner in search bar
- Skeleton screens for results
- Progressive loading (show results as they load)
- Shimmer effect on cards

**Error States:**
- Search failed: "Search unavailable. Please try again." with retry button
- Network error: "Connection lost. Check your internet and try again."

**User Actions:**
- Enter search query (with autocomplete)
- Apply filters (with real-time results update)
- View search results (list or map view)
- Navigate to Gem/Krawl from results
- Clear search and filters (individual or all)
- Save search (optional, for logged-in users)
- Share search results (optional)

**UX Enhancements:**
- Debounced search (wait for pause in typing)
- Search history (local storage)
- Search analytics (track popular searches)
- Smart suggestions based on:
  - User location
  - Recent activity
  - Popular content
- Keyboard shortcuts:
  - "/" to focus search
  - Esc to clear
  - Enter to search

**Accessibility:**
- Keyboard navigation for all controls
- Screen reader announcements for results
- Focus management for modals
- High contrast support

**Technical Requirements:**
- Full-text search implementation
- Efficient search indexing
- Search result caching (localStorage)
- Location-based distance calculations
- Debounced search queries (300ms delay)
- Progressive result loading

---

### 11. Offline Downloads Page
**Purpose:** Manage downloaded Krawls for offline use

**Features:**
- List of downloaded Krawls
- Download status and progress
- Storage usage indicator
- Download new Krawl button
- Delete downloaded Krawl option
- Last sync date/time
- Storage limit warning

**User Actions:**
- View downloaded Krawls
- Download new Krawl for offline
- Delete downloaded Krawl
- Start offline Krawl Mode

**Technical Requirements:**
- Service Worker for offline functionality
- IndexedDB for offline data storage
- Background sync for updates
- Storage quota management

---

### 12. Authentication Pages
**Purpose:** Handle user authentication via social login

**Features:**
- **Sign In Page:**
  - **Hero Section:**
    - App logo and tagline
    - Value proposition: "Sign in to create Gems and Krawls"
    - Benefits list:
      - Create and share cultural locations
      - Build guided trails
      - Save favorites
      - Track your contributions
  - **Social Login Options:**
    - Google OAuth button (prominent, Material Design style)
    - Clear Google branding
    - Loading state during authentication
    - Error handling with retry option
  - **Guest Option:**
    - "Continue as Guest" link (below sign-in)
    - Clear explanation of limitations:
      - Can browse and view content
      - Cannot create Gems or Krawls
      - Cannot save favorites
    - "Sign in anytime" reminder
  - **Legal Links:**
    - Terms of Service link
    - Privacy Policy link
    - Clear, accessible placement
  - **Trust Indicators:**
    - "Secure sign-in" badge
    - User count or testimonials (if available)
- **Sign In Callback:**
  - Loading screen with progress indicator
  - Success animation
  - Redirect to intended destination or home
- **Sign Out:**
  - Confirmation dialog:
    - "Are you sure you want to sign out?"
    - "You can sign back in anytime"
    - "Sign Out" and "Cancel" buttons
  - Success message: "Signed out successfully"
  - Redirect to home page
- **Account Linking (Future):**
  - Settings page option
  - Link additional providers
  - Unlink accounts with confirmation

**Empty States:**
- Authentication error: Clear error message with retry option

**Loading States:**
- OAuth redirect spinner
- "Signing you in..." message
- Progress indicator

**Error States:**
- Authentication failed: "Sign in failed. Please try again." with retry
- Network error: "Connection issue. Check your internet."
- Cancelled: "Sign in cancelled. You can try again anytime."
- Account error: "Unable to sign in. Please contact support."

**User Actions:**
- Sign in with Google (one-click flow)
- Continue as guest (with limitations explained)
- View terms and privacy policy
- Sign out (with confirmation)
- Retry on error

**UX Enhancements:**
- Remember last sign-in method
- Quick sign-in for returning users
- Clear benefit communication
- Minimal friction (one-click sign-in)
- Guest mode clearly explained

**Accessibility:**
- Keyboard navigation
- Screen reader support
- High contrast buttons
- Focus indicators

**Technical Requirements:**
- OAuth 2.0 flow implementation
- Secure token storage (httpOnly cookies)
- Session management
- Error handling for authentication failures
- CSRF protection
- Secure redirect handling

---

### 13. Admin/Moderation Pages (Internal)
**Purpose:** Content moderation and platform management (if applicable)

**Features:**
- Reported content queue
- Content approval/rejection interface
- User management (if needed)
- Analytics dashboard (basic)

**Note:** This may be out of scope for MVP, depending on requirements.

---

## Features and Functionality

### 1. Authentication and User Management

#### Social Login Authentication
- **In-Scope:**
  - Google OAuth 2.0 integration
  - User profile creation from social provider data
  - Secure session management
  - Token refresh handling
  - Sign out functionality
  - Account deletion

- **Out-of-Scope:**
  - Traditional username/password authentication
  - Email/password registration
  - Multi-factor authentication (MFA)
  - Account recovery via email
  - Password reset functionality

#### User Profiles
- **In-Scope:**
  - Basic profile information (name, avatar from social provider)
  - User-created content display
  - User statistics
  - Profile editing (name, bio, avatar)

- **Out-of-Scope:**
  - User following/followers system
  - Private messaging between users
  - User badges or achievements system
  - Advanced profile customization

---

### 2. Gem Management

#### Gem Creation
- **In-Scope:**
  - Create new Gems with location, description, photos
  - Location validation (Cebu City boundaries only)
  - Category selection
  - Photo upload (multiple images via Cloudinary)
  - Draft saving
  - Gem submission and publishing

- **Out-of-Scope:**
  - Video uploads for Gems
  - Audio recordings
  - Advanced rich text editing
  - Gem templates
  - Bulk Gem import

#### Gem Discovery and Viewing
- **In-Scope:**
  - View Gem details
  - Browse Gems on map
  - Search Gems
  - Filter Gems by category, rating, distance
  - View Gem photos
  - Get directions to Gem

- **Out-of-Scope:**
  - Advanced filtering (multiple categories, custom filters)
  - Gem comparison tool
  - Gem collections/bookmarks (future feature)
  - Gem recommendations based on user behavior

#### Gem Quality Control
- **In-Scope:**
  - Vouching system (users can vouch for Gems)
  - Rating system (1-5 stars)
  - Reporting system (flag inappropriate content)
  - Basic moderation queue (if implemented)

- **Out-of-Scope:**
  - Automated content moderation (AI-based)
  - Advanced reputation system
  - Gem verification badges
  - Professional curator program

---

### 3. Krawl Management

#### Krawl Creation
- **In-Scope:**
  - Create new Krawls by selecting and ordering Gems
  - Set Krawl metadata (name, description, difficulty, duration)
  - Route visualization
  - Cover image upload
  - Draft saving
  - Krawl publishing

- **Out-of-Scope:**
  - Automated route optimization
  - Krawl templates
  - Collaborative Krawl editing (multiple creators)
  - Krawl branching (alternative routes)
  - Time-based Krawls (only available at certain times)

#### Krawl Discovery and Viewing
- **In-Scope:**
  - View Krawl details
  - Browse Krawls on map
  - Search Krawls
  - Filter Krawls by category, difficulty, duration
  - View Krawl route and Gems
  - Download Krawl for offline use

- **Out-of-Scope:**
  - Krawl recommendations engine
  - Personalized Krawl suggestions
  - Krawl collections/playlists
  - Social sharing with custom messages

#### Krawl Mode (Location-Aware Guided Experience)
- **In-Scope:**
  - Start Krawl Mode for a selected Krawl
  - Real-time location tracking
  - Next Gem indicator and directions
  - Progress tracking
  - Arrival detection (geofencing)
  - Turn-by-turn directions
  - Completion tracking
  - Offline support for downloaded Krawls

- **Out-of-Scope:**
  - Augmented Reality (AR) features
  - Voice-guided navigation
  - Group Krawl Mode (multiple users following same Krawl)
  - Live location sharing with other users
  - Advanced route recalculation

---

### 4. Offline Functionality

#### Offline Downloads
- **In-Scope:**
  - Download Krawls for offline use
  - Offline map tiles caching
  - Offline Gem data storage
  - Offline Krawl Mode functionality
  - Storage management
  - Background sync when online

- **Out-of-Scope:**
  - Offline Gem creation
  - Offline photo uploads (queue for later)
  - Full app offline mode
  - Offline search functionality

---

### 5. Maps and Location Services

#### Map Features
- **In-Scope:**
  - Interactive Mapbox map
  - Cebu City boundary restrictions
  - Gem markers (with clustering)
  - Krawl trail visualization (polylines)
  - User location indicator
  - Map controls (zoom, pan, search)
  - Custom map styles (basic)
  - Info windows/popups

- **Out-of-Scope:**
  - 3D map views
  - Satellite imagery toggle
  - Street view integration
  - Custom map tile creation
  - Advanced map styling beyond basic customization
  - Heat maps
  - Territory mapping

#### Location Services
- **In-Scope:**
  - Geocoding (address to coordinates)
  - Reverse geocoding (coordinates to address)
  - Location validation (Cebu City boundaries)
  - Distance calculations
  - Route calculation for Krawls (basic)

- **Out-of-Scope:**
  - Advanced routing algorithms
  - Traffic-aware routing
  - Multi-modal routing (walking + public transport)
  - Location history tracking
  - Geofencing beyond Krawl Mode arrival detection

---

### 6. Search and Discovery

#### Search Functionality
- **In-Scope:**
  - Full-text search for Gems and Krawls
  - Search by name, description, category
  - Search filters (category, rating, distance)
  - Search results sorting
  - Search suggestions/autocomplete

- **Out-of-Scope:**
  - Advanced search operators
  - Semantic search
  - Image-based search
  - Voice search
  - Search analytics

#### Discovery Features
- **In-Scope:**
  - Featured Krawls on homepage
  - Popular Gems display
  - Recently created content
  - Category browsing

- **Out-of-Scope:**
  - Personalized recommendations
  - Trending content algorithm
  - Discovery feed with machine learning
  - Content curation by editors

---

### 7. Community Features

#### Vouching System
- **In-Scope:**
  - Users can vouch for Gems and Krawls
  - Vouch count display
  - List of users who vouched
  - One vouch per user per item

- **Out-of-Scope:**
  - Vouch comments/reasons
  - Vouch removal
  - Vouch history
  - Vouch-based ranking algorithm

#### Rating System
- **In-Scope:**
  - 1-5 star rating for Gems and Krawls
  - Average rating display
  - Rating breakdown (distribution)
  - One rating per user per item
  - Rating update (user can change rating)

- **Out-of-Scope:**
  - Detailed rating categories (separate ratings for different aspects)
  - Rating comments/reviews (separate from general comments)
  - Rating moderation
  - Rating analytics

#### Comments and Reviews
- **In-Scope:**
  - Comments on Gems and Krawls
  - Comment display and pagination
  - Edit own comments
  - Delete own comments
  - Basic comment moderation (reporting)

- **Out-of-Scope:**
  - Comment replies/threading
  - Comment reactions (likes, etc.)
  - Rich text formatting in comments
  - Comment notifications
  - Comment moderation tools

#### Reporting System
- **In-Scope:**
  - Report inappropriate content (Gems, Krawls, comments)
  - Report categories (spam, inappropriate, incorrect location, etc.)
  - Basic reporting queue (if moderation implemented)

- **Out-of-Scope:**
  - Advanced moderation dashboard
  - Automated content flagging
  - User reporting system (report other users)
  - Appeal process for reported content

---

### 8. Image Management

#### Image Upload and Storage
- **In-Scope:**
  - Multiple image uploads per Gem/Krawl
  - Image upload via Cloudinary
  - Image compression and optimization
  - Image preview before upload
  - Image deletion (for own content)

- **Out-of-Scope:**
  - Image editing tools (crop, filter, etc.)
  - Video uploads
  - Image annotations/markup
  - Bulk image upload
  - Image metadata editing

#### Image Display
- **In-Scope:**
  - Image galleries with lightbox
  - Responsive image display
  - Lazy loading for performance
  - Image optimization (responsive sizes)

- **Out-of-Scope:**
  - Advanced image viewer (zoom, pan)
  - Image slideshow with transitions
  - Image sharing to external platforms
  - Image download functionality

---

### 9. Email Notifications

#### Email Functionality
- **In-Scope:**
  - Welcome email (new user registration)
  - Email notifications for:
    - New comments on user's content
    - New vouches on user's content
    - Content approval/rejection (if moderation implemented)
  - Email preferences (opt-in/opt-out)
  - Basic email templates

- **Out-of-Scope:**
  - Marketing emails
  - Newsletter functionality
  - Email digests (daily/weekly summaries)
  - Advanced email personalization
  - Email analytics and tracking
  - A/B testing for emails

---

### 10. Progressive Web App (PWA) Features

#### PWA Core Features
- **In-Scope:**
  - Web App Manifest
  - Service Worker implementation
  - Offline functionality (for downloaded Krawls)
  - Install prompt (Add to Home Screen)
  - App-like experience
  - Responsive design (mobile-first)

- **Out-of-Scope:**
  - Push notifications (beyond basic email)
  - Background sync for all content
  - Full offline mode
  - App store distribution
  - Native app features (camera, contacts, etc.)

---

## System Integrations

### 1. Authentication Integration

#### Google OAuth 2.0
- **Purpose:** User authentication via Google accounts
- **Implementation:**
  - OAuth 2.0 authorization flow
  - Token management and refresh
  - User profile data retrieval
  - Secure session management
- **API Endpoints Used:**
  - Google OAuth 2.0 Authorization Server
  - Google User Info API
- **Data Retrieved:**
  - User ID
  - Email address
  - Display name
  - Profile picture URL
- **Free Tier:** Unlimited users, no cost

---

### 2. Database Integration

#### Aiven PostgreSQL
- **Purpose:** Primary data storage for all application data
- **Implementation:**
  - Spring Data JPA or JDBC
  - Connection pooling
  - Database migrations (Flyway or Liquibase)
- **Data Stored:**
  - User accounts and profiles
  - Gems (locations, descriptions, metadata)
  - Krawls (trails, Gem sequences, metadata)
  - Vouches, ratings, comments
  - User activity and preferences
- **Free Tier Limits:**
  - Single node, 1 CPU, 1GB RAM, 5GB storage
  - Automatic backups
  - Monitoring and alerts

---

### 3. Image Management Integration

#### Cloudinary
- **Purpose:** Image upload, storage, transformation, and CDN delivery
- **Implementation:**
  - Cloudinary Java SDK
  - Direct upload from frontend (signed uploads)
  - Server-side upload processing
- **Features Used:**
  - Image upload
  - Automatic image optimization
  - Responsive image generation
  - Image transformations (resize, crop, format conversion)
  - CDN delivery
- **Free Tier Limits:**
  - 7,500 images per month
  - 2 GB storage
  - 5 GB bandwidth
  - 25 monthly credits (for transformations)
- **API Endpoints:**
  - Upload API
  - Transformation API
  - Admin API (for deletion)

---

### 4. Email Service Integration

#### Brevo (formerly Sendinblue)
- **Purpose:** Transactional email sending
- **Implementation:**
  - Brevo Java SDK or REST API
  - Email template management
  - Transactional email sending
- **Email Types:**
  - Welcome emails
  - Notification emails (comments, vouches)
  - Content moderation emails (if implemented)
- **Free Tier Limits:**
  - 300 emails per day
  - Approximately 9,000 emails per month
  - Email templates
  - Basic analytics
- **API Endpoints:**
  - Send Transactional Email API
  - Template API (if using templates)

---

### 5. Maps and Location Integration

#### Mapbox
- **Purpose:** Interactive maps, geocoding, routing, and location services
- **Implementation:**
  - Mapbox GL JS (frontend)
  - Mapbox Java SDK (backend, if needed)
  - Mapbox REST APIs
- **Features Used:**
  - Interactive map display
  - Custom map styles
  - Geocoding API (address to coordinates)
  - Reverse Geocoding API (coordinates to address)
  - Directions API (route calculation for Krawls)
  - Map tiles and rendering
- **Free Tier Limits:**
  - 50,000 map loads per month
  - 100,000 geocoding requests per month
  - Basic directions (usage-based pricing after free tier)
- **API Endpoints:**
  - Maps API
  - Geocoding API
  - Directions API
  - Static Images API

---

### 6. Deployment Platform Integration

#### Oracle Cloud Infrastructure (OCI)
- **Purpose:** Backend application hosting and deployment
- **Implementation:**
  - Java application deployment on OCI Compute
  - Container deployment (Docker, if applicable)
  - Load balancing (if needed)
  - Auto-scaling configuration
- **Always Free Tier Resources:**
  - 2 Always Free Autonomous Databases (20 GB each)
  - Compute instances (1/8 OCPU, 1 GB memory)
  - 10 GB object storage
  - 10 TB outbound data transfer per month
- **Services Used:**
  - Compute (for Java backend)
  - Object Storage (for static assets, if needed)
  - Autonomous Database (alternative to Aiven, if preferred)

---

## In-Scope Items

### Development Scope

1. **Backend Development**
   - Java Spring Boot RESTful API
   - Database schema design and implementation
   - API endpoints for all features
   - Authentication and authorization
   - Data validation and error handling
   - API documentation

2. **Frontend Development**
   - Responsive PWA interface
   - All pages and user interfaces listed above
   - Map integration and visualization
   - Form handling and validation
   - State management
   - Service Worker implementation

3. **Core Features**
   - Social login authentication (Google OAuth)
   - Gem creation, viewing, and management
   - Krawl creation, viewing, and management
   - Krawl Mode (location-aware guided experience)
   - Offline functionality for downloaded Krawls
   - Vouching system
   - Rating system
   - Comments/reviews
   - Reporting system
   - Search and discovery
   - User profiles and settings

4. **System Integrations**
   - Google OAuth 2.0 integration
   - Aiven PostgreSQL database integration
   - Cloudinary image management integration
   - Brevo email service integration
   - Mapbox maps and location services integration
   - Oracle Cloud Infrastructure deployment

5. **Geographic Restrictions**
   - Cebu City boundary enforcement
   - Location validation for all content creation
   - Map view restrictions to Cebu City
   - Search and discovery limited to Cebu City

6. **Content Seeding**
   - Initial 100+ Gems in Cebu City
   - Initial 10+ Krawls in Cebu City
   - Content across key Cebu City districts

7. **Testing and Quality Assurance**
   - Unit testing (backend)
   - Integration testing
   - End-to-end testing (critical flows)
   - Cross-browser testing
   - Mobile device testing
   - Performance testing
   - Accessibility testing (basic)

8. **Documentation**
   - API documentation
   - Setup and deployment guide
   - User guide (basic)
   - Developer documentation

9. **Deployment**
   - Production deployment on Oracle Cloud
   - Database setup and migration
   - Environment configuration
   - SSL/HTTPS setup
   - Domain configuration (if applicable)

---

## Out-of-Scope Items

### Excluded Features

1. **Authentication**
   - Traditional username/password authentication
   - Email/password registration
   - Multi-factor authentication (MFA)
   - Account recovery via email
   - Password reset functionality
   - Social login providers beyond Google (Facebook, GitHub, etc.) - unless specifically needed

2. **Advanced User Features**
   - User following/followers system
   - Private messaging between users
   - User badges or achievements
   - User reputation system
   - User groups or communities
   - User activity feed/notifications center

3. **Content Features**
   - Video uploads and playback
   - Audio recordings
   - Rich text editing (beyond basic formatting)
   - Content templates
   - Bulk content import
   - Content scheduling
   - Content versioning/history

4. **Advanced Map Features**
   - 3D map views
   - Satellite imagery
   - Street view integration
   - Custom map tile creation
   - Heat maps
   - Territory mapping
   - Advanced routing (traffic-aware, multi-modal)

5. **Advanced Discovery**
   - Personalized recommendations engine
   - Machine learning-based content suggestions
   - Trending algorithms
   - Content curation by editors
   - Advanced analytics dashboard

6. **Social Features**
   - Comment replies/threading
   - Comment reactions (likes, etc.)
   - Social sharing with custom messages
   - Group Krawl Mode (multiple users)
   - Live location sharing

7. **Advanced Offline Features**
   - Full app offline mode
   - Offline Gem creation
   - Offline photo upload queue
   - Offline search

8. **Communication Features**
   - Push notifications (beyond basic email)
   - In-app notifications center
   - Email newsletters
   - Email digests
   - Marketing emails

9. **Business Features**
   - Payment processing
   - "Claim Your Gem" business features (beyond basic MVP testing)
   - Subscription management
   - Advanced analytics and reporting
   - Revenue tracking

10. **Administration Features**
    - Advanced moderation dashboard
    - Automated content moderation (AI)
    - User management tools
    - Advanced analytics dashboard
    - Content management system (CMS)

11. **Platform Expansion**
    - Support for cities beyond Cebu City
    - Multi-language support (beyond English)
    - Internationalization (i18n)

12. **Native Applications**
    - iOS native app
    - Android native app
    - Desktop applications

13. **Advanced PWA Features**
    - Push notifications
    - Background sync for all content
    - Full offline mode
    - App store distribution

14. **Third-Party Integrations**
    - Social media platform integrations (beyond authentication)
    - Payment gateways
    - Analytics platforms (beyond basic)
    - Marketing tools
    - CRM integrations

15. **Advanced Technical Features**
    - Real-time collaboration
    - WebSocket connections
    - Advanced caching strategies
    - CDN configuration (beyond Cloudinary)
    - Advanced monitoring and logging
    - Performance optimization beyond basic

---

## Free Tier Service Limits

**Note:** For comprehensive free tier limits, monitoring strategies, and detailed service usage information, see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md#free-tier-service-limits). The following section provides a summary; BUDGET_AND_RESOURCE_PLAN.md serves as the single source of truth for all free tier limits.

### Service Usage Limits and Monitoring

#### Aiven PostgreSQL
- **Free Tier:**
  - Single node
  - 1 CPU
  - 1 GB RAM
  - 5 GB storage
- **Monitoring:** Monitor database size and connection usage
- **Upgrade Path:** If limits exceeded, consider paid tier or Oracle Autonomous Database

#### Cloudinary
- **Free Tier:**
  - 7,500 images per month
  - 2 GB storage
  - 5 GB bandwidth
  - 25 monthly credits (transformations)
- **Monitoring:** Track monthly image uploads and storage usage
- **Optimization:** Implement image compression and lazy loading
- **Upgrade Path:** Paid plans available if limits exceeded

#### Brevo (Sendinblue)
- **Free Tier:**
  - 300 emails per day
  - Approximately 9,000 emails per month
- **Monitoring:** Track daily and monthly email sending
- **Optimization:** Batch notifications, user email preferences
- **Upgrade Path:** Paid plans available if limits exceeded

#### Mapbox
- **Free Tier:**
  - 50,000 map loads per month
  - 100,000 geocoding requests per month
  - Basic directions (usage-based after free tier)
- **Monitoring:** Track map loads and API usage
- **Optimization:** Implement map tile caching, limit unnecessary API calls
- **Upgrade Path:** Pay-as-you-go pricing after free tier

#### Oracle Cloud Infrastructure
- **Always Free Tier:**
  - 2 Autonomous Databases (20 GB each)
  - Compute instances (1/8 OCPU, 1 GB memory)
  - 10 GB object storage
  - 10 TB outbound data transfer per month
- **Monitoring:** Track resource usage and data transfer
- **Limitations:** Compute instances may have limited performance
- **Upgrade Path:** Paid instances available for better performance

#### Google OAuth
- **Free Tier:** Unlimited users, no cost
- **No Limits:** No usage restrictions for authentication

---

## Technical Requirements

### Backend Requirements

1. **Java Version**
   - Java 25 LTS (latest stable LTS version)
   - Spring Boot 3.5.7 (installed version)
   - Maven or Gradle for build management

2. **Database**
   - PostgreSQL (via Aiven)
   - Database migrations (Flyway or Liquibase)
   - Connection pooling
   - Backup strategy

3. **API Design**
   - RESTful API architecture
   - JSON request/response format
   - Proper HTTP status codes
   - API versioning (if needed)
   - Error handling and validation

4. **Security**
   - HTTPS/SSL encryption
   - Secure authentication (OAuth 2.0)
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection
   - CORS configuration

5. **Performance**
   - API response time optimization
   - Database query optimization
   - Caching strategy (if applicable)
   - Image optimization

### Frontend Requirements

1. **Framework**
   - Next.js 16.0.3 (installed version)
   - React 19.2.0 (installed version)
   - TypeScript 5.x (installed version, recommended for type safety and maintainability)
   - Tailwind CSS v4 (installed version, CSS-based configuration)
   - ESLint 9.x (installed version, with eslint-config-next)
   - PWA support (next-pwa plugin for Service Workers and Web App Manifest - planned)
   - Server-side rendering (SSR) and static site generation (SSG)
   - Built-in image optimization
   - Mobile-first responsive design

2. **Browser Support**
   - Chrome (last 2 versions)
   - Firefox (last 2 versions)
   - Safari (last 2 versions)
   - Edge (last 2 versions)
   - Mobile browsers (iOS Safari, Chrome Mobile)

3. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
   - Touch-friendly interfaces

4. **Performance**
   - Page load time optimization
   - Image lazy loading
   - Code splitting
   - Service Worker caching

5. **Accessibility**
   - WCAG 2.1 Level AA compliance (basic)
   - Keyboard navigation
   - Screen reader support (basic)
   - Alt text for images

### Infrastructure Requirements

1. **Deployment**
   - Oracle Cloud Infrastructure
   - Container support (Docker, if applicable)
   - Environment configuration (dev, staging, production)

2. **Monitoring**
   - Application error logging
   - Performance monitoring (basic)
   - Service usage tracking (free tier limits)

3. **Backup and Recovery**
   - Database backups (Aiven automatic backups)
   - Code version control (Git)
   - Deployment rollback capability

---

## Deliverables

### Code Deliverables

1. **Backend Code**
   - Complete Java 25 Spring Boot 3.5.7 application
   - Database schema and migrations (Flyway or Liquibase)
   - RESTful API endpoints implementation
   - Unit tests (JUnit 5)
   - Integration tests
   - Spring Boot Actuator endpoints for monitoring

2. **Frontend Code**
   - Complete Next.js 14.x PWA application with TypeScript
   - All pages and components (using Next.js App Router)
   - Zustand state management implementation
   - PWA configuration (next-pwa plugin)
   - Service Worker implementation (automatic via next-pwa)
   - End-to-end tests (Playwright or Cypress)
   - Next.js build configuration

3. **Configuration Files**
   - Maven build configuration (pom.xml)
   - Deployment configuration for Oracle Cloud
   - Environment configuration files (.env templates)
   - GitHub Actions CI/CD workflows
   - Docker files (if applicable)

### Documentation Deliverables

1. **Technical Documentation**
   - API documentation (OpenAPI/Swagger)
   - Database schema documentation
   - Architecture overview
   - Setup and installation guide
   - Deployment guide

2. **User Documentation**
   - User guide (basic)
   - Feature documentation
   - FAQ (if applicable)

3. **Developer Documentation**
   - Code comments and documentation
   - Development setup guide
   - Contribution guidelines (if applicable)

### Deployment Deliverables

1. **Production Environment**
   - Deployed application on Oracle Cloud
   - Configured database on Aiven
   - SSL/HTTPS setup
   - Domain registration and DNS configuration (if applicable)
   - Frontend deployed on Vercel
   - Domain pointing to production services

2. **Testing Environment**
   - Staging environment (if applicable)
   - Test data and scenarios

### Content Deliverables

1. **Seed Content**
   - 100+ Gems in Cebu City
   - 10+ Krawls in Cebu City
   - Content across key districts

---

## Timeline and Milestones

### Project Timeline: 15 Weeks

#### Phase 1: Foundation (Weeks 1-2)
- **Week 1:**
  - Project setup and architecture design
  - Technology stack finalization
  - Development environment setup
  - Database schema design
  - API design and documentation

- **Week 2:**
  - Design system creation
  - UI/UX wireframes and mockups
  - Frontend project setup
  - Backend project setup
  - Initial database setup

**Milestone 1:** Project foundation complete, development environment ready

---

#### Phase 2: Core Development (Weeks 3-7)
- **Week 3:**
  - Authentication implementation (Google OAuth)
  - User management backend
  - User profile pages
  - Basic navigation and routing

- **Week 4:**
  - Map integration (Mapbox)
  - Map view page implementation
  - Cebu City boundary enforcement
  - Location services integration

- **Week 5:**
  - Gem creation backend and API
  - Gem creation page (frontend)
  - Gem detail page
  - Image upload integration (Cloudinary)

- **Week 6:**
  - Krawl creation backend and API
  - Krawl creation page (frontend)
  - Krawl detail page
  - Route calculation integration

- **Week 7:**
  - Search and discovery implementation
  - Filtering and sorting
  - Search page
  - Content listing pages

**Milestone 2:** Core features implemented, basic functionality working

---

#### Phase 3: Community Features (Weeks 8-9)
- **Week 8:**
  - Vouching system implementation
  - Rating system implementation
  - Comments/reviews system
  - User activity tracking

- **Week 9:**
  - Reporting system implementation
  - User profile enhancements
  - Profile settings page
  - Email notifications (Brevo integration)

**Milestone 3:** Community features complete

---

#### Phase 4: Krawl Mode and Offline (Weeks 10-12)
- **Week 10:**
  - Krawl Mode backend logic
  - Location tracking implementation
  - Geofencing for arrival detection

- **Week 11:**
  - Krawl Mode frontend
  - Real-time location updates
  - Turn-by-turn directions
  - Progress tracking

- **Week 12:**
  - Offline functionality (Service Workers)
  - Offline downloads implementation
  - Offline map tiles caching
  - Background sync

**Milestone 4:** Krawl Mode and offline features complete

---

#### Phase 5: Testing and Polish (Weeks 13-14)
- **Week 13:**
  - Comprehensive testing (unit, integration, E2E)
  - Bug fixes and refinements
  - Performance optimization
  - Cross-browser testing
  - Mobile device testing

- **Week 14:**
  - Accessibility improvements
  - UI/UX polish
  - Error handling improvements
  - Documentation completion
  - Final code review

**Milestone 5:** Application ready for launch

---

#### Phase 6: Launch Preparation (Week 15)
- **Week 15:**
  - Content seeding (100+ Gems, 10+ Krawls)
  - Production deployment
  - Final testing in production
  - Go-live and monitoring
  - Launch activities

**Final Milestone:** Application launched and live

---

## Assumptions and Constraints

### Assumptions

1. **Service Availability**
   - All third-party services (Aiven, Cloudinary, Brevo, Mapbox, Google OAuth) will remain available and maintain their free tier offerings
   - Services will maintain API compatibility during development period

2. **Technical Assumptions**
   - Development team has experience with Java, Spring Boot, and chosen frontend framework
   - Oracle Cloud Infrastructure free tier will be sufficient for MVP deployment
   - Free tier limits of all services will be sufficient for initial launch and 100-500 users

3. **Content Assumptions**
   - Initial content seeding (100+ Gems, 10+ Krawls) can be completed within launch week
   - Content will be created by founding users or development team

4. **User Assumptions**
   - Users will have Google accounts for authentication
   - Users will grant location permissions for Krawl Mode
   - Users will have modern browsers with PWA support

5. **Business Assumptions**
   - 5-10 local Cebu businesses can be onboarded for "Claim Your Gem" pilot testing
   - User feedback can be collected through basic mechanisms (surveys, in-app feedback)

### Claim Your Gem Feature (Post-MVP Validation)

**Overview:**
"Claim Your Gem" is a freemium business model feature that allows local businesses to claim ownership of Gems representing their establishments. This feature enables business verification, enhanced Gem profiles, and potential revenue opportunities.

**Business Model:**
- **Free Tier:** Basic Gem creation and listing (available to all users)
- **Claimed Gems:** Businesses can claim Gems representing their establishments
- **Verification Process:** Businesses provide proof of ownership (business registration, location verification)
- **Enhanced Features (Future):** Verified badges, business hours, contact information, special promotions

**Implementation Approach:**
1. **MVP Phase:** Validation only (5-10 businesses for pilot testing)
2. **Post-MVP:** Full implementation with business dashboard and premium features
3. **Revenue Model:** Potential freemium model with premium features for businesses

**User Flow:**
1. Business owner identifies Gem representing their establishment
2. Business owner initiates claim request
3. System validates business ownership (manual review in MVP)
4. Upon approval, Gem is marked as "Claimed" with verified badge
5. Business gains access to enhanced Gem profile (future feature)

**Admin Interface Requirements:**
- Claim request review dashboard
- Business verification tools
- Claim approval/rejection workflow
- Business contact management

**Cross-References:**
- See [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) for business objectives
- See BUDGET_AND_RESOURCE_PLAN.md [Internal] for revenue model considerations

### Content Lifecycle Management

**Overview:**
Content lifecycle management ensures that Gems and Krawls remain accurate, up-to-date, and relevant over time. This includes flagging outdated or closed locations, content review processes, and automated checks.

**Flagging Outdated/Closed Spots:**
- **Community Reporting:** Users can report Gems/Krawls as outdated, closed, or incorrect
- **Report Reasons:** Outdated information, permanently closed, incorrect location, duplicate content
- **Review Process:** Reports are reviewed by administrators or community moderators
- **Action Items:** Update content, mark as closed, remove if duplicate, or dismiss if invalid

**Content Review Process:**
1. **Automated Checks:**
   - Age-based flags (Gems/Krawls older than 2 years without updates)
   - Low engagement flags (no vouches or ratings in 6+ months)
   - Report threshold flags (multiple reports trigger review)

2. **Manual Review:**
   - Administrator reviews flagged content
   - Community moderator reviews (future feature)
   - Decision: Update, close, or remove content

3. **Content Updates:**
   - Creator can update their own content
   - Community can suggest updates (future feature)
   - Administrators can update verified information

**Automated Checks:**
- **Age Monitoring:** Flag content older than 2 years without updates
- **Engagement Monitoring:** Flag content with no activity in 6+ months
- **Report Aggregation:** Automatically flag content with multiple reports
- **Location Validation:** Periodic checks for location accuracy

**Community Reporting Integration:**
- Users can report content issues via report button
- Report reasons: Outdated, closed, incorrect, duplicate, inappropriate
- Reports are tracked and aggregated for review
- Users receive feedback on report status (future feature)

**Content Validation:**
- Regular validation of location coordinates
- Verification of image URLs (broken link detection)
- Category accuracy checks
- Description quality reviews

**Cross-References:**
- See [CONTENT_SEEDING_STRATEGY.md](./content/CONTENT_SEEDING_STRATEGY.md) for content creation guidelines
- See [CONTENT_INVENTORY_AND_PLAN.md](./content/CONTENT_INVENTORY_AND_PLAN.md) for content specifications

### Constraints

1. **Budget Constraints**
   - Must utilize free-tier or generously free-tiered services only
   - No paid services unless they offer reasonable free usage limits
   - Limited budget for domain registration (if applicable)

2. **Technical Constraints**
   - Free tier service limits must be monitored and not exceeded
   - Oracle Cloud free tier compute resources may have performance limitations
   - Database storage limited to 5 GB (Aiven free tier)

3. **Geographic Constraints**
   - All features restricted to Cebu City boundaries only
   - No support for other cities in MVP
   - Location validation must be enforced for all content

4. **Feature Constraints**
   - Social login only (no traditional authentication)
   - Limited offline functionality (downloaded Krawls only)
   - Basic moderation and quality control (no advanced AI moderation)

5. **Timeline Constraints**
   - 15-week development timeline must be adhered to
   - MVP scope must be limited to core features only
   - No feature creep beyond defined scope

6. **Resource Constraints**
   - Solo development or limited team size
   - Limited time for advanced features
   - Focus on MVP functionality over advanced features

---

## Risks and Mitigation

### Technical Risks

1. **Risk: Free Tier Service Limits Exceeded**
   - **Impact:** Service interruption or additional costs
   - **Probability:** Medium
   - **Mitigation:**
     - Monitor service usage regularly
     - Implement usage tracking and alerts
     - Optimize API calls and image uploads
     - Implement caching strategies
     - Have upgrade plan ready if limits approached

2. **Risk: Oracle Cloud Free Tier Performance Limitations**
   - **Impact:** Slow application performance, poor user experience
   - **Probability:** Medium
   - **Mitigation:**
     - Optimize application performance
     - Implement efficient database queries
     - Use CDN for static assets (Cloudinary)
     - Monitor performance metrics
     - Consider paid tier upgrade if needed

3. **Risk: Service API Changes or Deprecation**
   - **Impact:** Integration breakage, development delays
   - **Probability:** Low
   - **Mitigation:**
     - Use stable, well-maintained services
     - Monitor service announcements
     - Implement abstraction layers for integrations
     - Keep dependencies updated
     - Have backup service options identified

4. **Risk: Database Storage Limit Exceeded**
   - **Impact:** Unable to store new content
   - **Probability:** Low (for MVP with 100-500 users)
   - **Mitigation:**
     - Monitor database size regularly
     - Implement data archiving strategy (if needed)
     - Optimize image storage (use Cloudinary, not database)
     - Consider Oracle Autonomous Database as alternative

### Business Risks

1. **Risk: Insufficient User Adoption**
   - **Impact:** Unable to validate core loop, limited feedback
   - **Probability:** Medium
   - **Mitigation:**
     - Focus on content seeding before launch
     - Engage founding users early
     - Implement referral mechanisms (if possible)
     - Gather feedback from early users
     - Iterate based on user feedback

2. **Risk: Content Quality Issues**
   - **Impact:** Poor user experience, platform credibility
   - **Probability:** Medium
   - **Mitigation:**
     - Implement vouching and rating systems
     - Content moderation (basic)
     - Reporting system for inappropriate content
     - Seed high-quality initial content
     - Community-driven quality control

3. **Risk: Geographic Boundary Enforcement Failures**
   - **Impact:** Content created outside Cebu City, scope creep
   - **Probability:** Low
   - **Mitigation:**
     - Implement strict location validation
     - Test boundary enforcement thoroughly
     - Clear user messaging about Cebu City restriction
     - Regular monitoring of created content

### Operational Risks

1. **Risk: Development Timeline Delays**
   - **Impact:** Launch delay, increased costs
   - **Probability:** Medium
   - **Mitigation:**
     - Clear scope definition (this SOW)
     - Regular progress tracking
     - Prioritize core features
     - Buffer time in schedule
     - Agile development approach

2. **Risk: Deployment Issues**
   - **Impact:** Launch delays, service interruption
   - **Probability:** Medium
   - **Mitigation:**
     - Test deployment process early
     - Staging environment testing
     - Rollback plan preparation
     - Documentation of deployment steps
     - Gradual rollout if possible

3. **Risk: Security Vulnerabilities**
   - **Impact:** Data breaches, user trust issues
   - **Probability:** Low
   - **Mitigation:**
     - Follow security best practices
     - Input validation and sanitization
     - Secure authentication (OAuth 2.0)
     - HTTPS/SSL encryption
     - Regular security reviews
     - Keep dependencies updated

---

## Appendices

### Appendix A: Technology Stack Details

#### Backend Framework Versions (as of 2025-11-14)
- **Java:** Java 25 LTS (Long-Term Support, released September 2025)
- **Spring Boot:** 3.5.7 (installed version)
- **Spring Security:** 6.3.x (compatible with Spring Boot 3.5.7)
- **Spring Data JPA:** 3.5.x (compatible with Spring Boot 3.5.7)
- **Maven:** 3.9.x (latest stable version)
- **JUnit:** 5.10.x (latest stable version for testing)

#### Frontend Framework Versions (as of 2025-11-15)
- **Next.js:** 16.0.3 (installed version)
- **React:** 19.2.0 (installed version)
- **React-DOM:** 19.2.0 (installed version)
- **TypeScript:** 5.x (installed version)
- **Tailwind CSS:** v4 (installed version, CSS-based configuration)
- **@tailwindcss/postcss:** ^4 (installed version)
- **ESLint:** 9.x (installed version)
- **eslint-config-next:** 16.0.3 (installed version)
- **Zustand:** 4.4.x (planned, for state management)
- **Mapbox GL JS:** 3.x (planned, latest stable version)
- **next-pwa:** Latest version (planned, PWA plugin for Next.js)
- **Node.js:** 20.x LTS (required for Next.js)

#### Database
- **PostgreSQL:** Version provided by Aiven (typically latest stable)
- **JDBC Driver:** Latest PostgreSQL JDBC driver

#### Third-Party SDKs
- **Cloudinary Java SDK:** Latest version (for image uploads)
- **Brevo Java SDK:** Latest version (or REST API for email)
- **Mapbox Java SDK:** Latest version (if used on backend for geocoding)
- **Google OAuth Client Library:** Latest version (for authentication)
- **Spring Boot Actuator:** Built-in (for monitoring)
- **Sentry Java SDK:** Latest version (for error tracking - free tier)

#### Development Tools
- **Node.js:** 20.x LTS (required for Next.js)
- **npm/yarn/pnpm:** Latest version (package manager)
- **Next.js CLI:** Built-in (no separate build tool needed)
- **ESLint:** 9.x (installed version, code linting with eslint-config-next)
- **Prettier:** Latest version (code formatting, optional)

### Appendix B: API Endpoint Summary

**Note:** For complete API documentation with detailed request/response formats, authentication methods, error handling, and rate limiting, see API_DOCUMENTATION.md [Internal].

#### Authentication Endpoints
- `POST /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user

#### Gem Endpoints
- `GET /api/gems` - List Gems (with filters)
- `GET /api/gems/{id}` - Get Gem details
- `POST /api/gems` - Create new Gem
- `PUT /api/gems/{id}` - Update Gem (own content)
- `DELETE /api/gems/{id}` - Delete Gem (own content)
- `POST /api/gems/{id}/vouch` - Vouch for Gem
- `POST /api/gems/{id}/rate` - Rate Gem
- `POST /api/gems/{id}/comment` - Add comment
- `POST /api/gems/{id}/report` - Report Gem

#### Krawl Endpoints
- `GET /api/krawls` - List Krawls (with filters)
- `GET /api/krawls/{id}` - Get Krawl details
- `POST /api/krawls` - Create new Krawl
- `PUT /api/krawls/{id}` - Update Krawl (own content)
- `DELETE /api/krawls/{id}` - Delete Krawl (own content)
- `POST /api/krawls/{id}/vouch` - Vouch for Krawl
- `POST /api/krawls/{id}/rate` - Rate Krawl
- `POST /api/krawls/{id}/comment` - Add comment
- `POST /api/krawls/{id}/report` - Report Krawl
- `POST /api/krawls/{id}/download` - Download for offline
- `POST /api/krawls/{id}/start` - Start Krawl Mode

#### User Endpoints
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile (own profile)
- `GET /api/users/{id}/gems` - Get user's Gems
- `GET /api/users/{id}/krawls` - Get user's Krawls

#### Search Endpoints
- `GET /api/search` - Search Gems and Krawls
- `GET /api/search/suggestions` - Get search suggestions

### Appendix C: Database Schema Overview

#### Core Tables
- `users` - User accounts and profiles
- `gems` - Gem (point of interest) data
- `krawls` - Krawl (trail) data
- `krawl_gems` - Junction table for Krawl-Gem relationships
- `vouches` - User vouches for Gems/Krawls
- `ratings` - User ratings for Gems/Krawls
- `comments` - Comments on Gems/Krawls
- `reports` - Content reports
- `offline_downloads` - User offline download records

#### Key Fields
- All tables include `created_at` and `updated_at` timestamps
- Soft deletes where applicable (`deleted_at`)
- Foreign key relationships
- Indexes on frequently queried fields

### Appendix D: Cebu City Boundary Definition

#### Geographic Boundaries
- **North:** Consolacion boundary
- **South:** Talisay City boundary
- **East:** Mactan Channel
- **West:** Mountain ranges

#### Coordinate Reference
- Coordinate system: WGS84 (EPSG:4326)
- Boundary polygon definition (GeoJSON format)
- Validation against boundary on all location inputs

### Appendix E: Free Tier Monitoring Checklist

#### Weekly Monitoring Tasks
- [ ] Check Aiven database storage usage
- [ ] Check Cloudinary monthly image count and storage
- [ ] Check Brevo daily email count
- [ ] Check Mapbox monthly map loads
- [ ] Check Oracle Cloud resource usage
- [ ] Review application error logs
- [ ] Check service API status pages

#### Monthly Review
- [ ] Review all service usage against free tier limits
- [ ] Identify optimization opportunities
- [ ] Plan for potential upgrades if approaching limits
- [ ] Review service pricing changes (if any)

---

## Glossary

| Term | Definition |
|------|------------|
| **Gem** | A point of interest representing authentic Filipino cultural location or experience, created by users |
| **Krawl** | A guided trail connecting multiple Gems in a specific sequence, created by users |
| **Krawl Mode** | Location-aware guided experience that helps users follow a Krawl in real-time with turn-by-turn directions |
| **Vouching** | Community quality control mechanism where users can vouch for the authenticity/quality of Gems or Krawls |
| **PWA** | Progressive Web App - a web application that provides app-like experience with offline capabilities |
| **Geofencing** | Technology that uses GPS or RFID to define geographic boundaries and trigger actions when users enter/exit |
| **Service Worker** | A script that runs in the background of a web application, enabling offline functionality and background sync |
| **OAuth 2.0** | Authorization framework that enables applications to obtain limited access to user accounts |
| **CDN** | Content Delivery Network - a network of servers that deliver content based on geographic location |
| **Geocoding** | Process of converting addresses into geographic coordinates |
| **Reverse Geocoding** | Process of converting geographic coordinates into addresses |
| **API** | Application Programming Interface - a set of protocols and tools for building software applications |
| **RESTful** | Architectural style for designing networked applications using HTTP methods |
| **MVP** | Minimum Viable Product - the most basic version of a product with core features |
| **CORS** | Cross-Origin Resource Sharing - mechanism that allows web pages to make requests to different domains |
| **SSL/HTTPS** | Secure Sockets Layer / Hypertext Transfer Protocol Secure - encrypted communication protocol |
| **XSS** | Cross-Site Scripting - a security vulnerability that allows attackers to inject malicious scripts |
| **SQL Injection** | A code injection technique used to attack data-driven applications |
| **WCAG** | Web Content Accessibility Guidelines - international standards for web accessibility |

---

## Document Metadata

**Document Type:** Scope of Work (SOW) / Project Specification  
**Target Audience:** Development Team, Project Stakeholders, Clients  
**Related Documents:** 
- [README.md](../README.md) - Project overview
- [GLOSSARY.md](./GLOSSARY.md) - Project terminology and definitions
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - High-level project overview and objectives
- SYSTEM_DESIGN.md [Internal] - System architecture and data flow
- API_DOCUMENTATION.md [Internal] - Complete API endpoint specifications
- DATABASE_SCHEMA.md [Internal] - Complete database schema and relationships
- [BRAND_BRIEF.md](./design/BRAND_BRIEF.md) - Brand strategy and positioning
- [WIREFRAMES.md](./design/WIREFRAMES.md) - Low-fidelity wireframes for all pages
- [UI_UX_DESIGN_SYSTEM.md](./design/UI_UX_DESIGN_SYSTEM.md) - Design system and component specifications
- [SITEMAP.md](./SITEMAP.md) - Navigation structure and routing
- [FEATURE_LIST_AND_USER_STORIES.md](./user-research/FEATURE_LIST_AND_USER_STORIES.md) - Comprehensive feature list with user stories
- SEO_PLAN_AND_KEYWORD_STRATEGY.md [Internal] - SEO plan, keyword strategy, and optimization recommendations
- DEPLOYMENT_GUIDE.md [Internal] - Deployment procedures
- [DOCUMENTATION_TEMPLATE.md](./DOCUMENTATION_TEMPLATE.md) - Template for creating new documentation

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Service Verification:** All recommended tools and services should be verified for current versions and availability before implementation. Service offerings and free tier limits may change.

2. **Scope Flexibility:** While this SOW defines clear boundaries, some flexibility may be needed during development. Any scope changes should be documented and approved.

3. **Free Tier Monitoring:** Regular monitoring of free tier usage is critical to avoid unexpected costs or service interruptions.

4. **Cebu City Focus:** All development and testing should maintain focus on Cebu City as the launch area. Expansion to other cities is explicitly out of scope for MVP.

5. **Student-Friendly Tools:** All selected tools and services have been chosen specifically for their free tiers or generous free usage limits, suitable for student projects.

6. **Current as of 2025-11-14:** All technology versions, service limits, and recommendations are current as of November 14, 2025. Verify latest information before implementation.

---

*This Scope of Work document serves as the definitive guide for the Krawl MVP project, ensuring all stakeholders have a clear understanding of what will be delivered, what is excluded, and how the project will be executed.*

