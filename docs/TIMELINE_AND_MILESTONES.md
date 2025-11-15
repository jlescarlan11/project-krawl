# Timeline and Milestone Plan: Krawl MVP

## Summary / Overview

This document provides a comprehensive timeline and milestone plan for the Krawl Progressive Web App (PWA) MVP project. The plan outlines 15 weeks of development organized into 6 distinct phases, with clear milestones, deliverables, and deadlines. All recommended tools and services utilize free tiers or generous free usage limits suitable for student projects. The project follows agile principles, emphasizing scalability, maintainability, and adaptability to change.

**Project Duration:** 15 weeks (14 weeks development + 1 week launch)  
**Start Date:** November 17, 2025  
**Target Launch Date:** March 2, 2026  
**Current Date:** November 15, 2025

**Note:** There is a 2-day gap between the documentation date (November 15, 2025) and the project start date (November 17, 2025) to allow for final preparations, service account setup, and project initialization.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-15 | Development Team | Initial version |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Project Timeline Overview](#project-timeline-overview)
5. [Detailed Phase Breakdown](#detailed-phase-breakdown)
6. [Milestone Definitions](#milestone-definitions)
7. [Tool and Service Verification](#tool-and-service-verification)
8. [Agile Methodology Integration](#agile-methodology-integration)
9. [Risk Mitigation Timeline](#risk-mitigation-timeline)
10. [Success Criteria](#success-criteria)
11. [Appendices](#appendices)

---

## Project Timeline Overview

### High-Level Timeline

| Phase | Duration | Weeks | Focus Area |
|-------|----------|-------|------------|
| **Phase 1: Foundation** | 2 weeks | 1-2 | Architecture, Design System, Project Setup |
| **Phase 2: Core Development** | 5 weeks | 3-7 | Authentication, Maps, Gem/Krawl Creation, Search |
| **Phase 3: Community Features** | 2 weeks | 8-9 | Vouching, Rating, Comments, Reporting |
| **Phase 4: Krawl Mode & Offline** | 3 weeks | 10-12 | Location Tracking, Offline Downloads |
| **Phase 5: Testing & Polish** | 2 weeks | 13-14 | QA, Optimization, Accessibility |
| **Phase 6: Launch Preparation** | 1 week | 15 | Content Seeding, Deployment, Go-Live |

**Total Duration:** 15 weeks

### Budget Summary

**Total MVP Budget (15 weeks):**
- **MVP Development:** ₱0 (solo development using free tools)
- **Post-Launch Monthly:** ₱0 (all services within free tiers)
- **Post-Launch Annual:** ₱1,200 (domain renewal only)

**Key Cost Categories:**
- Domain Registration: ₱1,200/year (approximately ₱230 prorated for 15-week MVP period)
- All Other Services: ₱0 (free tiers sufficient)

**Note:** Budget assumes solo development (sweat equity). If hiring freelancers, costs would increase significantly. For detailed budget breakdown, see BUDGET_AND_RESOURCE_PLAN.md [Internal].

---

## Detailed Phase Breakdown

### Phase 1: Foundation (Weeks 1-2)
**Duration:** 2 weeks  
**Start Date:** Week 1  
**End Date:** Week 2

#### Week 1: Project Setup and Architecture

**Objectives:**
- Establish development environment
- Finalize technology stack
- Design system architecture
- Set up version control and project structure

**Tasks:**
- [ ] **Day 1-2: Project Initialization**
  - Set up Git repository (GitHub - free tier)
  - Initialize backend project (Java 25 + Spring Boot 3.2.x + Maven)
  - Initialize frontend project (Next.js 14.x + TypeScript)
  - Configure development environment (IDE, Node.js 20.x LTS, Java 25)
  - Set up project management tool (GitHub Projects - free tier)

- [ ] **Day 3-4: Architecture Design**
  - Design database schema (PostgreSQL via Aiven)
  - Design RESTful API structure
  - Create API endpoint documentation template
  - Design authentication flow (Google OAuth 2.0)
  - Plan service integrations (Cloudinary, Brevo, Mapbox)
  - Review brand guidelines and tone of voice ([BRAND_BRIEF.md](./design/BRAND_BRIEF.md))

- [ ] **Day 5: Service Account Setup**
  - Create Aiven PostgreSQL database (free tier: 1 CPU, 1GB RAM, 5GB storage)
  - Set up Google OAuth 2.0 credentials
  - Create Cloudinary account (free tier: 7,500 images/month, 2GB storage)
  - Create Brevo account (free tier: 300 emails/day)
  - Create Mapbox account (free tier: 50,000 map loads/month)
  - Create Sentry account (free tier: 5,000 events/month)
  - Set up Oracle Cloud Infrastructure account (Always Free Tier)
  - Register domain name (if applicable, budget: ₱1,200/year or approximately ₱230 prorated for 15 weeks)
  - Set up DNS configuration (initial setup)

**Deliverables:**
- Git repository with project structure
- Architecture documentation
- Database schema design
- API design document
- Service accounts configured

**Tools Used:**
- GitHub (free tier)
- Aiven PostgreSQL (free tier)
- Google OAuth 2.0 (free)
- Cloudinary (free tier)
- Brevo (free tier)
- Mapbox (free tier)
- Sentry (free tier)
- Oracle Cloud Infrastructure (Always Free Tier)

---

#### Week 2: Design System and UI/UX

**Objectives:**
- Create design system and UI components
- Develop wireframes and mockups
- Establish design patterns
- Set up frontend foundation

**Tasks:**
- [ ] **Day 1-2: Design System Creation**
  - Define color palette and typography
  - Create component library (buttons, cards, forms, etc.)
  - Design mobile-first responsive breakpoints
  - Establish accessibility guidelines (WCAG 2.1 Level AA)
  - Create design tokens and style variables

- [ ] **Day 3-4: Wireframes and Mockups**
  - Create wireframes for all pages (13 pages total)
  - Design mobile and desktop layouts
  - Create interactive prototypes (Figma - free tier)
  - Design onboarding flow
  - Design empty, loading, and error states

- [ ] **Day 5: Frontend Foundation**
  - Set up Next.js 14.x project with TypeScript
  - Configure PWA support (next-pwa plugin)
  - Set up Zustand for state management
  - Configure routing and navigation structure
  - Set up basic layout components
  - Set up monitoring tools (Sentry) for frontend error tracking
  - Configure basic error logging
  - **SEO Setup:** Review SEO_PLAN_AND_KEYWORD_STRATEGY.md [Internal] implementation roadmap for SEO tasks to be integrated throughout development phases

**Deliverables:**
- Design system documentation (`UI_UX_DESIGN_SYSTEM.md`)
- Complete wireframes and mockups
- Interactive prototypes
- Frontend project foundation
- Component library structure

**Tools Used:**
- Figma (free tier for individuals)
- Next.js 14.x (open source)
- TypeScript 5.x (open source)
- Zustand 4.4.x (open source)

**Milestone 1: Project Foundation Complete**
- ✅ Development environment ready
- ✅ Architecture designed and documented
- ✅ Design system established
- ✅ All service accounts configured
- ✅ Frontend and backend projects initialized

**Risk Review Checkpoint (End of Phase 1):**
- Review free tier service account setup
- Verify all tools and services are accessible
- Check for any service availability issues
- Review architecture decisions for scalability
- Identify any early technical risks

---

### Phase 2: Core Development (Weeks 3-7)
**Duration:** 5 weeks  
**Start Date:** Week 3  
**End Date:** Week 7

#### Week 3: Authentication and User Management

**Objectives:**
- Implement Google OAuth 2.0 authentication
- Create user management system
- Build user profile pages
- Establish session management

**Tasks:**
- [ ] **Day 1: Landing Page Development**
  - Implement landing/home page
  - Hero section with tagline and CTAs
  - Value proposition section (Discover Gems, Follow Krawls, Share Culture)
  - Featured content carousels (Featured Krawls, Popular Gems)
  - Statistics display (animated counters)
  - Social proof section
  - Footer with links
  - Reference: SCOPE_OF_WORK.md page 1 (lines 312-369)

- [ ] **Day 2: Backend Authentication**
  - Implement Google OAuth 2.0 flow (Spring Security)
  - Create user entity and repository
  - Implement JWT token management
  - Create authentication endpoints
  - Set up secure session management
  - Configure application monitoring (Spring Boot Actuator)
  - Set up Sentry integration for backend error tracking
  - Write unit tests for authentication endpoints (TDD approach)

- [ ] **Day 3-4: Frontend Authentication**
  - Create sign-in page with Google OAuth button
  - Implement OAuth callback handling
  - Create authentication context/store (Zustand)
  - Implement protected routes
  - Create sign-out functionality
  - Implement onboarding flow (first-time user experience)
    - Welcome screen with value proposition
    - Interactive tutorial (3-4 steps: Discover Gems, Follow Krawls, Create Your Own, Explore Cebu City)
    - Progressive permission requests (location, notifications)
    - Quick start options (Explore as Guest, Sign In to Create)
    - Reference: SCOPE_OF_WORK.md page 0 (lines 281-309)

- [ ] **Day 5: User Profile Pages**
  - Create user profile page
  - Display user statistics (Gems created, Krawls created, etc.)
  - Create profile settings page
  - Implement profile editing functionality
  - Create API documentation template (OpenAPI/Swagger)
  - Document authentication API endpoints

**Deliverables:**
- Working Google OAuth 2.0 authentication
- User management backend API
- User profile and settings pages
- Session management system

**Tools Used:**
- Google OAuth 2.0 (free, unlimited users)
- Spring Security 6.2.x (open source)
- Next.js 14.x (open source)

---

#### Week 4: Map Integration and Location Services

**Objectives:**
- Integrate Mapbox maps
- Implement map view page
- Enforce Cebu City boundaries
- Create location validation system

**Tasks:**
- [ ] **Day 1-2: Mapbox Integration**
  - Integrate Mapbox GL JS 3.x
  - Set up map view component
  - Configure map styles and controls
  - Implement map initialization (centered on Cebu City)
  - Set up Cebu City boundary polygon

- [ ] **Day 3-4: Map View Page**
  - Create interactive map view
  - Implement marker clustering
  - Create info windows/bottom sheets
  - Implement search and filter panel
  - Add "My Location" button
  - Create FAB for "Create Gem"

- [ ] **Day 5: Location Services**
  - Implement geocoding (address to coordinates)
  - Implement reverse geocoding (coordinates to address)
  - Create location validation (Cebu City boundaries)
  - Implement distance calculations
  - Add boundary enforcement UI indicators
  - Update API documentation (Maps and location endpoints)

**Deliverables:**
- Fully functional map view page
- Cebu City boundary enforcement
- Location validation system
- Geocoding and reverse geocoding

**Tools Used:**
- Mapbox GL JS 3.x (free tier: 50,000 map loads/month)
- Mapbox Geocoding API (free tier: 100,000 requests/month)

---

#### Week 5: Gem Creation and Management

**Objectives:**
- Build Gem creation system
- Implement Gem detail pages
- Integrate image upload (Cloudinary)
- Create Gem listing and viewing

**Tasks:**
- [ ] **Day 1-2: Backend Gem API**
  - Create Gem entity and repository
  - Implement Gem CRUD endpoints
  - Add location validation (Cebu City boundaries)
  - Create image upload endpoint (Cloudinary integration)
  - Implement draft saving functionality
  - Write unit tests for Gem API endpoints (alongside development)

- [ ] **Day 3-4: Gem Creation Page**
  - Create multi-step form (4 steps)
  - Implement location selection with map
  - Add photo upload interface (drag-and-drop)
  - Create form validation and error handling
  - Implement draft auto-save
  - Add preview mode

- [ ] **Day 5: Gem Detail and Listing**
  - Create Gem detail page
  - Implement image gallery
  - Add embedded map with Gem location
  - Create Gem listing components
  - Implement pagination
  - Update API documentation (Gem endpoints)

**Deliverables:**
- Complete Gem creation system
- Gem detail pages
- Image upload integration (Cloudinary)
- Gem listing functionality

**Tools Used:**
- Cloudinary (free tier: 7,500 images/month, 2GB storage)
- Mapbox (for location selection)

---

#### Week 6: Krawl Creation and Management

**Objectives:**
- Build Krawl creation system
- Implement route calculation
- Create Krawl detail pages
- Add Gem selection and ordering

**Tasks:**
- [ ] **Day 1-2: Backend Krawl API**
  - Create Krawl entity and repository
  - Implement Krawl CRUD endpoints
  - Create Krawl-Gem junction table
  - Integrate Mapbox Directions API for route calculation
  - Implement route optimization suggestions
  - Write unit tests for Krawl API endpoints (alongside development)

- [ ] **Day 3-4: Krawl Creation Page**
  - Create Krawl creation form
  - Implement Gem selection interface
  - Add drag-and-drop Gem reordering
  - Create route visualization on map
  - Add metadata fields (difficulty, duration, etc.)
  - Implement draft saving

- [ ] **Day 5: Krawl Detail Page**
  - Create Krawl detail page
  - Display trail visualization
  - Show ordered Gem list
  - Add estimated duration and distance
  - Implement download for offline button (placeholder)
  - Update API documentation (Krawl endpoints)

**Deliverables:**
- Complete Krawl creation system
- Route calculation integration
- Krawl detail pages
- Gem selection and ordering interface

**Tools Used:**
- Mapbox Directions API (usage-based pricing after free tier)
- Mapbox GL JS (for route visualization)

---

#### Week 7: Search and Discovery

**Objectives:**
- Implement full-text search
- Create search and discovery page
- Add filtering and sorting
- Build content listing pages

**Tasks:**
- [ ] **Day 1-2: Backend Search API**
  - Implement full-text search (PostgreSQL)
  - Create search endpoints
  - Add search filters (category, rating, distance)
  - Implement search result sorting
  - Create search suggestions/autocomplete

- [ ] **Day 3-4: Search Page**
  - Create search interface with autocomplete
  - Implement filter panel (collapsible)
  - Add search results display (list and map view)
  - Create empty and loading states
  - Implement search history (localStorage)

- [ ] **Day 5: Discovery Features**
  - Create featured Krawls section (homepage)
  - Implement popular Gems display
  - Add category browsing
  - Create recently created content section
  - Update API documentation (Search endpoints)

**Deliverables:**
- Full-text search functionality
- Search and discovery page
- Filtering and sorting system
- Content listing pages

**Tools Used:**
- PostgreSQL full-text search (built-in)

**Milestone 2: Core Features Implemented**
- ✅ Authentication working (Google OAuth)
- ✅ Map integration complete
- ✅ Gem creation and viewing functional
- ✅ Krawl creation and viewing functional
- ✅ Search and discovery working
- ✅ Basic functionality validated

**Risk Review Checkpoint (End of Phase 2):**
- Review free tier usage (Mapbox, Cloudinary, etc.)
- Assess API rate limits and usage patterns
- Review performance metrics
- Check for integration issues
- Validate Cebu City boundary enforcement
- Review database storage usage

---

### Phase 3: Community Features (Weeks 8-9)
**Duration:** 2 weeks  
**Start Date:** Week 8  
**End Date:** Week 9

#### Week 8: Vouching, Rating, and Comments

**Objectives:**
- Implement vouching system
- Create rating system
- Build comments/reviews functionality
- Add user activity tracking

**Tasks:**
- [ ] **Day 1-2: Vouching System**
  - Create Vouch entity and repository
  - Implement vouch endpoints (create, list)
  - Add vouch count display
  - Create vouch list UI
  - Implement one vouch per user per item

- [ ] **Day 3-4: Rating System**
  - Create Rating entity and repository
  - Implement rating endpoints (create, update)
  - Add 1-5 star rating UI
  - Display average rating and breakdown
  - Implement rating update functionality

- [ ] **Day 5: Comments System**
  - Create Comment entity and repository
  - Implement comment endpoints (CRUD)
  - Create comment display UI
  - Add comment pagination
  - Implement edit/delete own comments

**Deliverables:**
- Vouching system complete
- Rating system complete
- Comments/reviews system complete
- User activity tracking

**Tools Used:**
- PostgreSQL (for data storage)

---

#### Week 9: Reporting and User Enhancements

**Objectives:**
- Implement reporting system
- Enhance user profiles
- Add email notifications
- Complete profile settings

**Tasks:**
- [ ] **Day 1-2: Reporting System**
  - Create Report entity and repository
  - Implement report endpoints
  - Add report categories (spam, inappropriate, etc.)
  - Create report UI (modal/form)
  - Implement basic moderation queue (if applicable)

- [ ] **Day 3-4: User Profile Enhancements**
  - Enhance user profile page
  - Add user statistics display
  - Create activity feed/timeline
  - Add created content lists (Gems, Krawls)
  - Implement profile editing

- [ ] **Day 5: Email Notifications**
  - Integrate Brevo email service
  - Create email templates
  - Implement welcome emails
  - Add notification emails (comments, vouches)
  - Create email preferences system

**Deliverables:**
- Reporting system complete
- Enhanced user profiles
- Email notification system
- Profile settings page complete

**Tools Used:**
- Brevo (free tier: 300 emails/day, ~9,000/month)
- PostgreSQL (for data storage)

**Milestone 3: Community Features Complete**
- ✅ Vouching system functional
- ✅ Rating system functional
- ✅ Comments/reviews working
- ✅ Reporting system implemented
- ✅ Email notifications integrated
- ✅ User profiles enhanced

**Risk Review Checkpoint (End of Phase 3):**
- Review Brevo email usage (daily limits)
- Assess community feature adoption risks
- Review content quality mechanisms
- Check moderation queue capacity
- Review user engagement patterns

---

### Phase 4: Krawl Mode and Offline (Weeks 10-12)
**Duration:** 3 weeks  
**Start Date:** Week 10  
**End Date:** Week 12

#### Week 10: Krawl Mode Backend and Location Tracking

**Objectives:**
- Implement Krawl Mode backend logic
- Create location tracking system
- Build geofencing for arrival detection
- Set up route calculation

**Tasks:**
- [ ] **Day 1-2: Krawl Mode Backend**
  - Create Krawl Mode session entity
  - Implement Krawl Mode start/stop endpoints
  - Create progress tracking system
  - Add completion tracking
  - Implement session management

- [ ] **Day 3-4: Location Tracking**
  - Implement real-time location tracking API
  - Create location update endpoints
  - Add geofencing logic (50m radius)
  - Implement arrival detection
  - Create location history tracking

- [ ] **Day 5: Route Calculation**
  - Integrate Mapbox Directions API
  - Implement route recalculation on deviation
  - Add turn-by-turn directions generation
  - Create route optimization

**Deliverables:**
- Krawl Mode backend complete
- Location tracking system
- Geofencing implementation
- Route calculation integration

**Tools Used:**
- Mapbox Directions API
- PostgreSQL (for session tracking)

---

#### Week 11: Krawl Mode Frontend

**Objectives:**
- Build Krawl Mode UI
- Implement real-time location updates
- Create turn-by-turn directions
- Add progress tracking UI

**Tasks:**
- [ ] **Day 1-2: Krawl Mode UI Foundation**
  - Create Krawl Mode page layout
  - Implement full-screen map view
  - Add bottom sheet/side panel
  - Create pre-start checklist
  - Implement start/stop functionality

- [ ] **Day 3-4: Real-Time Features**
  - Implement real-time location updates
  - Add current location indicator
  - Create next Gem marker (pulsing animation)
  - Implement route polyline display
  - Add distance and time calculations

- [ ] **Day 5: Directions and Progress**
  - Create turn-by-turn directions panel
  - Implement progress indicator (circular)
  - Add arrival detection UI (haptic feedback)
  - Create Gem detail cards (swipeable)
  - Implement completion celebration screen

**Deliverables:**
- Complete Krawl Mode UI
- Real-time location tracking
- Turn-by-turn directions
- Progress tracking and completion

**Tools Used:**
- Mapbox GL JS (for map display)
- Browser Geolocation API (free)

---

#### Week 12: Offline Functionality

**Objectives:**
- Implement Service Workers
- Create offline download system
- Add offline map tile caching
- Build background sync

**Tasks:**
- [ ] **Day 1-2: Service Worker Setup**
  - Configure next-pwa plugin
  - Set up Service Worker
  - Implement offline detection
  - Create offline indicator UI
  - Add cache strategies

- [ ] **Day 3-4: Offline Downloads**
  - Create offline download API
  - Implement Krawl download functionality
  - Add download progress indicator
  - Create offline downloads management page
  - Implement storage quota management

- [ ] **Day 5: Offline Map and Data**
  - Implement offline map tile caching
  - Cache Gem data for downloaded Krawls
  - Add offline Krawl Mode support
  - Implement background sync
  - Create offline mode testing

**Deliverables:**
- Service Worker implementation
- Offline download system
- Offline map tile caching
- Background sync functionality

**Tools Used:**
- next-pwa plugin (for Service Workers)
- IndexedDB (for offline data storage)
- Mapbox (for offline tile caching)

**Milestone 4: Krawl Mode and Offline Features Complete**
- ✅ Krawl Mode fully functional
- ✅ Location tracking working
- ✅ Offline downloads implemented
- ✅ Service Workers configured
- ✅ Offline map caching working

**Risk Review Checkpoint (End of Phase 4):**
- Review Mapbox Directions API usage
- Assess battery consumption risks
- Review location permission handling
- Check offline storage limits
- Validate geofencing accuracy
- Review performance on mobile devices

---

### Phase 5: Testing and Polish (Weeks 13-14)
**Duration:** 2 weeks  
**Start Date:** Week 13  
**End Date:** Week 14

#### Week 13: Comprehensive Testing

**Objectives:**
- Conduct thorough testing
- Fix bugs and issues
- Optimize performance
- Test across browsers and devices

**Tasks:**
- [ ] **Day 1-2: Unit and Integration Testing**
  - Complete unit tests for backend (JUnit 5) - supplement existing tests
  - Complete unit tests for frontend components - supplement existing tests
  - Create comprehensive integration tests for API endpoints
  - Test authentication flows
  - Test database operations
  - Review and improve test coverage (target: >70%)

- [ ] **Day 3-4: End-to-End Testing**
  - Create E2E tests (Playwright or Cypress)
  - Test critical user flows:
    - Sign in → Create Gem → View Gem
    - Create Krawl → Start Krawl Mode → Complete
    - Search → Filter → View results
  - Test error scenarios
  - Test offline functionality

- [ ] **Day 5: Cross-Browser and Device Testing**
  - Test on Chrome, Firefox, Safari, Edge
  - Test on iOS Safari and Chrome Mobile
  - Test responsive design (mobile, tablet, desktop)
  - Test PWA installation
  - Test location services on mobile devices

**Deliverables:**
- Comprehensive test suite
- Bug fix list and resolutions
- Cross-browser compatibility verified
- Mobile device testing complete

**Tools Used:**
- JUnit 5 (for backend testing)
- Playwright or Cypress (for E2E testing - free tier)
- BrowserStack (free tier for students, if available) or manual testing

---

#### Week 14: Optimization and Polish

**Objectives:**
- Optimize performance
- Improve accessibility
- Polish UI/UX
- Complete documentation

**Tasks:**
- [ ] **Day 1-2: Performance Optimization**
  - Optimize API response times
  - Implement database query optimization
  - Add image lazy loading
  - Optimize bundle sizes (code splitting)
  - Implement caching strategies
  - Test and improve page load times

- [ ] **Day 3: Accessibility Improvements**
  - Audit accessibility (WCAG 2.1 Level AA)
  - Add keyboard navigation
  - Improve screen reader support
  - Add focus indicators
  - Test with accessibility tools

- [ ] **Day 4: UI/UX Polish**
  - Refine animations and transitions
  - Improve error messages
  - Enhance loading states
  - Polish empty states
  - Improve mobile gestures
  - Add haptic feedback (where applicable)

- [ ] **Day 5: Documentation**
  - Complete API documentation (OpenAPI/Swagger)
  - Write setup and deployment guide
  - Create user guide (basic)
  - Document environment variables
  - Create troubleshooting guide

**Deliverables:**
- Performance optimized
- Accessibility improved (WCAG 2.1 AA)
- UI/UX polished
- Documentation complete

**Tools Used:**
- Lighthouse (for performance auditing - free)
- axe DevTools (for accessibility testing - free)
- OpenAPI/Swagger (for API documentation - open source)

**Milestone 5: Application Ready for Launch**
- ✅ All tests passing
- ✅ Performance optimized
- ✅ Accessibility compliant
- ✅ UI/UX polished
- ✅ Documentation complete
- ✅ Ready for production deployment

---

### Phase 6: Launch Preparation (Week 15)
**Duration:** 1 week  
**Start Date:** Week 15  
**End Date:** Week 15

#### Week 15: Content Seeding and Deployment

**Objectives:**
- Seed initial content (100+ Gems, 10+ Krawls)
- Deploy to production
- Conduct final testing
- Launch application

**Tasks:**
- [ ] **Day 1: Staging Environment and Content Seeding**
  - Set up staging environment (Oracle Cloud)
  - Configure staging database (Aiven)
  - Deploy to staging (backend and frontend)
  - Test staging deployment
  - Create 100+ Gems in Cebu City (staging)
  - Create 10+ Krawls across key districts (staging)
  - Add photos and descriptions
  - Verify all content within Cebu City boundaries
  - Test content quality and accuracy
  - Ensure all content aligns with brand tone of voice ([BRAND_BRIEF.md](./design/BRAND_BRIEF.md))
  - Reference: [CONTENT_SEEDING_STRATEGY.md](./content/CONTENT_SEEDING_STRATEGY.md)

- [ ] **Day 2: Staging Testing and Rollback Preparation**
  - Conduct comprehensive testing in staging
  - Verify all integrations working
  - Test critical user flows
  - Performance testing in staging
  - Document rollback procedures
  - Prepare rollback scripts/commands
  - Test rollback process (if possible)
  - Finalize deployment checklist (see Appendix E)

- [ ] **Day 3-4: Production Deployment**
  - Set up production environment (Oracle Cloud)
  - Configure production database (Aiven)
  - Run database migrations
  - Deploy backend application to production
  - Deploy frontend application to production (Vercel)
  - Set up SSL/HTTPS certificates
  - Configure domain DNS settings
    - Point domain to Vercel (frontend)
    - Configure subdomain for API (backend) if needed
    - Set up CNAME/A records
    - Verify DNS propagation
  - Set up monitoring (Sentry, Spring Boot Actuator)
  - Configure production environment variables
  - Verify all service integrations (Cloudinary, Brevo, Mapbox, etc.)
  - Seed production content (100+ Gems, 10+ Krawls)
  - Follow deployment checklist (Appendix E)

- [ ] **Day 5: Final Testing and Launch**
  - Conduct final testing in production
  - Verify all integrations working
  - Test critical user flows
  - Smoke tests for all major features
  - Monitor error logs (Sentry)
  - Check performance metrics
  - Verify monitoring is active
  - Launch application
  - Announce launch (if applicable)
  - Monitor post-launch metrics

**Deliverables:**
- 100+ Gems seeded in Cebu City
- 10+ Krawls created
- Application deployed to production
- Application live and accessible

**Tools Used:**
- Oracle Cloud Infrastructure (Always Free Tier)
- Aiven PostgreSQL (free tier)
- Vercel (for frontend hosting - free tier)
- Sentry (for error monitoring - free tier)

**Final Milestone: Application Launched**
- ✅ Content seeded (100+ Gems, 10+ Krawls)
- ✅ Production deployment complete
- ✅ Application live and accessible
- ✅ Monitoring set up
- ✅ Launch successful

---

## Milestone Definitions

### Milestone 1: Project Foundation Complete
**Target Date:** End of Week 2  
**Success Criteria:**
- Development environment fully configured
- Architecture designed and documented
- Design system established
- All service accounts created and configured
- Frontend and backend projects initialized
- Database schema designed

**Deliverables:**
- Git repository with project structure
- Architecture documentation
- Design system documentation
- Wireframes and mockups
- Service account configurations

---

### Milestone 2: Core Features Implemented
**Target Date:** End of Week 7  
**Success Criteria:**
- Google OAuth authentication working
- Map integration complete with Cebu City boundaries
- Gem creation and viewing functional
- Krawl creation and viewing functional
- Search and discovery working
- Basic CRUD operations validated

**Deliverables:**
- Working authentication system
- Functional map view page
- Gem creation and detail pages
- Krawl creation and detail pages
- Search and discovery page

---

### Milestone 3: Community Features Complete
**Target Date:** End of Week 9  
**Success Criteria:**
- Vouching system functional
- Rating system functional
- Comments/reviews working
- Reporting system implemented
- Email notifications integrated
- User profiles complete

**Deliverables:**
- Vouching, rating, and comments systems
- Reporting functionality
- Email notification system
- Enhanced user profiles

---

### Milestone 4: Krawl Mode and Offline Features Complete
**Target Date:** End of Week 12  
**Success Criteria:**
- Krawl Mode fully functional
- Real-time location tracking working
- Offline downloads implemented
- Service Workers configured
- Offline map caching working

**Deliverables:**
- Complete Krawl Mode implementation
- Offline download system
- Service Worker configuration
- Offline functionality tested

---

### Milestone 5: Application Ready for Launch
**Target Date:** End of Week 14  
**Success Criteria:**
- All tests passing (unit, integration, E2E)
- Performance optimized (target: <3s page load)
- Accessibility compliant (WCAG 2.1 AA)
- UI/UX polished
- Documentation complete
- Cross-browser compatibility verified

**Deliverables:**
- Comprehensive test suite
- Performance optimization complete
- Accessibility improvements
- Complete documentation

---

### Final Milestone: Application Launched
**Target Date:** End of Week 15  
**Success Criteria:**
- 100+ Gems seeded in Cebu City
- 10+ Krawls created
- Production deployment complete
- Application live and accessible
- Monitoring set up
- No critical bugs in production

**Deliverables:**
- Production application deployed
- Seeded content (100+ Gems, 10+ Krawls)
- Live application accessible to users

---

## Tool and Service Verification

### Verification Date: November 15, 2025

All tools and services listed below have been verified for current availability and free tier offerings as of November 15, 2025.

#### Backend Technologies
- **Java 25 LTS** - ✅ Current (released September 2025, supported until September 2033)
- **Spring Boot 3.2.x** - ✅ Current (latest stable 3.x version)
- **Maven 3.9.x** - ✅ Current (latest stable version)
- **PostgreSQL** - ✅ Current (via Aiven, latest stable version)

#### Frontend Technologies
- **Next.js 14.x** - ✅ Current (latest stable version, excellent PWA support)
- **TypeScript 5.x** - ✅ Current (latest stable version)
- **React 18.2.x** - ✅ Current (included with Next.js)
- **Zustand 4.4.x** - ✅ Current (latest stable version)
- **Mapbox GL JS 3.x** - ✅ Current (latest stable version)

#### Third-Party Services (Free Tiers)
- **Aiven PostgreSQL** - ✅ Free tier: 1 CPU, 1GB RAM, 5GB storage
- **Google OAuth 2.0** - ✅ Free, unlimited users
- **Cloudinary** - ✅ Free tier: 7,500 images/month, 2GB storage, 5GB bandwidth
- **Brevo (Sendinblue)** - ✅ Free tier: 300 emails/day (~9,000/month)
- **Mapbox** - ✅ Free tier: 50,000 map loads/month, 100,000 geocoding requests/month
- **Sentry** - ✅ Free tier: 5,000 events/month
- **Oracle Cloud Infrastructure** - ✅ Always Free Tier: 2 Autonomous Databases, Compute instances, 10GB storage

#### Development Tools
- **GitHub** - ✅ Free for public and private repos
- **GitHub Actions** - ✅ Free tier: 2,000 minutes/month for private repos
- **Figma** - ✅ Free tier for individuals
- **Node.js 20.x LTS** - ✅ Current (required for Next.js)

#### Testing Tools
- **JUnit 5** - ✅ Current (latest stable version)
- **Playwright/Cypress** - ✅ Free tier available
- **Lighthouse** - ✅ Free (Chrome DevTools)
- **axe DevTools** - ✅ Free tier available

**Note:** All service free tier limits should be monitored regularly. Service offerings and limits may change, so verify current limits before implementation.

---

## Agile Methodology Integration

### Sprint Structure

The project follows a flexible sprint structure aligned with the phase breakdown. While 2-week sprints are preferred, sprint duration may vary (1-2 weeks) based on phase complexity and natural breakpoints:

- **Sprint 1 (Weeks 1-2):** Foundation (2 weeks)
- **Sprint 2 (Weeks 3-4):** Authentication and Maps (2 weeks)
- **Sprint 3 (Weeks 5-6):** Gem and Krawl Creation (2 weeks)
- **Sprint 4 (Week 7):** Search and Discovery (1 week)
- **Sprint 5 (Weeks 8-9):** Community Features (2 weeks)
- **Sprint 6 (Weeks 10-11):** Krawl Mode (2 weeks)
- **Sprint 7 (Week 12):** Offline Functionality (1 week)
- **Sprint 8 (Weeks 13-14):** Testing and Polish (2 weeks)
- **Sprint 9 (Week 15):** Launch Preparation (1 week)

**Note:** Sprint duration is flexible to accommodate natural phase boundaries. The focus is on delivering working increments rather than strict adherence to 2-week cycles.

### Agile Practices

1. **Daily Standups (if team-based):**
   - Progress updates
   - Blockers identification
   - Next steps planning

2. **Sprint Planning:**
   - Define sprint goals
   - Break down tasks
   - Estimate effort
   - Assign priorities

3. **Sprint Reviews:**
   - Demo completed features
   - Gather feedback
   - Validate milestones

4. **Retrospectives:**
   - What went well
   - What could be improved
   - Action items for next sprint

5. **Continuous Integration:**
   - Automated testing on commits
   - Code quality checks
   - Deployment automation

6. **Continuous Testing:**
   - Write unit tests alongside feature development (TDD where applicable)
   - Run tests on each commit (CI/CD integration)
   - Maintain test coverage > 70% (target)
   - Integration tests for critical flows
   - E2E tests for user journeys
   - Test-driven development for complex features

7. **Iterative Development:**
   - Build, test, and refine
   - User feedback integration
   - Continuous improvement

### Adaptability Principles

- **Flexible Scope:** Priorities can be adjusted based on feedback
- **Incremental Delivery:** Features delivered in working increments
- **Regular Feedback:** Continuous validation with stakeholders
- **Change Management:** Scope changes documented and approved
- **Risk Mitigation:** Proactive identification and resolution

---

## Risk Mitigation Timeline

### Ongoing Risk Monitoring

**Weekly Tasks:**
- Monitor free tier service usage
- Review error logs (Sentry)
- Check application performance metrics
- Review database storage usage
- Monitor API usage (Mapbox, Cloudinary, Brevo)

**Monthly Tasks:**
- Review all service usage against free tier limits
- Identify optimization opportunities
- Plan for potential upgrades if approaching limits
- Review service pricing changes (if any)
- Update documentation if needed

### Risk Mitigation Schedule

| Risk | Mitigation Timeline | Frequency |
|------|-------------------|-----------|
| Free tier limits exceeded | Monitor weekly, optimize as needed | Weekly |
| Performance issues | Monitor continuously, optimize during Week 13-14 | Ongoing |
| Service API changes | Check service status pages weekly | Weekly |
| Database storage limits | Monitor weekly, optimize images | Weekly |
| Security vulnerabilities | Security review during Week 13-14 | Before launch |
| Deployment issues | Test deployment process early (Week 2) | Before launch |

---

## Success Criteria

### Technical Success Criteria

- ✅ All core features implemented and functional
- ✅ Application deployed to production
- ✅ Performance: Page load time < 3 seconds
- ✅ Accessibility: WCAG 2.1 Level AA compliance
- ✅ Cross-browser compatibility verified
- ✅ Mobile responsiveness validated
- ✅ PWA functionality working (offline, installable)
- ✅ PWA Performance: Successful deployment with offline capability
- ✅ Map Integration: Reliable location services and navigation
- ✅ Content Freshness: Effective lifecycle management (flagging outdated/closed spots)

### Content Success Criteria

- ✅ 100+ Gems created in Cebu City
- ✅ 10+ Krawls created across key districts
- ✅ All content within Cebu City boundaries
- ✅ Content quality validated
- ✅ Content Creation: 100+ Gems, 10+ Krawls in Cebu City districts
- ✅ Geographic Coverage: All content limited to Cebu City boundaries

### User Engagement Success Criteria

- ✅ Active Users: 100-500 active users in Cebu City (launch area)
- ✅ Feature Adoption: Significant usage of Krawl Mode (location-aware guided experience)
- ✅ Community Participation: Active vouching, rating, and reporting engagement

### Product Success Criteria

- ✅ Core Loop Validation: Demonstrated engagement with Gem pinning, Krawl creation, and Krawl Mode usage
- ✅ Offline Functionality: Successful downloads and usage of offline Krawls
- ✅ Data Quality: Community-driven quality control through vouching and rating systems

### Business Success Criteria

- ✅ Application launched and accessible
- ✅ User authentication working
- ✅ Core loop validated (Gem creation → Krawl creation → Krawl Mode)
- ✅ Ready for user testing and feedback collection
- ✅ Revenue Model Validation: 5-10 businesses onboarded for "Claim Your Gem" pilot
- ✅ User Feedback: Qualitative and quantitative data collection on UX, feature usability, and community dynamics

**Note:** These success criteria align with the metrics defined in [PROJECT_BRIEF.md](./PROJECT_BRIEF.md#-success-metrics).

---

## Appendices

### Appendix A: Weekly Task Checklist Template

**Week [X]: [Phase Name]**

**Objectives:**
- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

**Tasks:**
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Deliverables:**
- [ ] Deliverable 1
- [ ] Deliverable 2
- [ ] Deliverable 3

**Blockers:**
- [List any blockers]

**Notes:**
- [Any additional notes]

---

### Appendix B: Service Account Setup Checklist

**Pre-Development Setup:**
- [ ] GitHub account created
- [ ] Aiven PostgreSQL database created (free tier)
- [ ] Google Cloud Console project created
- [ ] Google OAuth 2.0 credentials configured
- [ ] Cloudinary account created (free tier)
- [ ] Brevo account created (free tier)
- [ ] Mapbox account created (free tier)
- [ ] Sentry account created (free tier)
- [ ] Oracle Cloud Infrastructure account created (Always Free Tier)
- [ ] All API keys and credentials securely stored
- [ ] Environment variables documented

---

### Appendix C: Free Tier Monitoring Checklist

**Weekly Monitoring:**
- [ ] Aiven database storage usage checked
- [ ] Cloudinary monthly image count reviewed
- [ ] Brevo daily email count checked
- [ ] Mapbox monthly map loads reviewed
- [ ] Oracle Cloud resource usage checked
- [ ] Application error logs reviewed (Sentry)
- [ ] Service API status pages checked

**Monthly Review:**
- [ ] All service usage reviewed against free tier limits
- [ ] Optimization opportunities identified
- [ ] Upgrade plans prepared if approaching limits
- [ ] Service pricing changes reviewed (if any)

---

### Appendix D: Testing Checklist

**Unit Testing:**
- [ ] Backend unit tests written (JUnit 5)
- [ ] Frontend component tests written
- [ ] Test coverage > 70% (target)

**Integration Testing:**
- [ ] API endpoint integration tests
- [ ] Database operation tests
- [ ] Service integration tests (Cloudinary, Brevo, Mapbox)

**End-to-End Testing:**
- [ ] Authentication flow tested
- [ ] Gem creation flow tested
- [ ] Krawl creation flow tested
- [ ] Krawl Mode flow tested
- [ ] Search and discovery tested
- [ ] Offline functionality tested

**Cross-Browser Testing:**
- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested
- [ ] iOS Safari tested
- [ ] Chrome Mobile tested

**Accessibility Testing:**
- [ ] WCAG 2.1 Level AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] High contrast mode tested

---

### Appendix E: Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Staging environment tested and validated
- [ ] Rollback procedures documented and tested
- [ ] Environment variables configured (production)
- [ ] Database migrations ready and tested
- [ ] SSL/HTTPS certificates configured
- [ ] Domain configured and DNS settings prepared
- [ ] Monitoring tools set up (Sentry, Spring Boot Actuator)
- [ ] Backup strategy in place
- [ ] Content seeding strategy reviewed (see CONTENT_SEEDING_STRATEGY.md)
- [ ] Service account limits reviewed
- [ ] Deployment scripts/commands prepared

**Staging Deployment:**
- [ ] Staging environment set up (Oracle Cloud)
- [ ] Staging database configured (Aiven)
- [ ] Backend deployed to staging
- [ ] Frontend deployed to staging (Vercel)
- [ ] Staging environment variables configured
- [ ] Staging integrations verified
- [ ] Staging testing completed
- [ ] Issues identified and resolved

**Production Deployment:**
- [ ] Production environment set up (Oracle Cloud)
- [ ] Production database configured (Aiven)
- [ ] Database migrations run successfully
- [ ] Backend deployed to Oracle Cloud
- [ ] Frontend deployed to Vercel
- [ ] Database configured and migrated
- [ ] Service integrations verified (Cloudinary, Brevo, Mapbox, Google OAuth)
- [ ] SSL/HTTPS certificates installed and working
- [ ] Domain DNS configured and propagated
- [ ] Monitoring active (Sentry, Spring Boot Actuator)
- [ ] Production environment variables set
- [ ] Content seeded (100+ Gems, 10+ Krawls)

**Post-Deployment:**
- [ ] Smoke tests passed
- [ ] Critical user flows verified
- [ ] Error monitoring active (Sentry)
- [ ] Performance metrics reviewed
- [ ] Content seeding completed and verified
- [ ] All integrations working
- [ ] Free tier usage within limits
- [ ] Rollback plan ready (if needed)

**Rollback Procedures:**
- [ ] Rollback scripts prepared
- [ ] Database rollback procedure documented
- [ ] Frontend rollback procedure (Vercel) documented
- [ ] Backend rollback procedure (Oracle Cloud) documented
- [ ] Rollback testing completed (if possible)

---

## Document Metadata

**Document Type:** Project Timeline and Milestone Plan  
**Target Audience:** Development Team, Project Stakeholders, Project Managers  
**Related Documents:**
- SCOPE_OF_WORK.md
- PROJECT_BRIEF.md
- BRAND_BRIEF.md
- SEO_PLAN_AND_KEYWORD_STRATEGY.md
- DOCUMENTATION_TEMPLATE.md

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Flexibility:** This timeline is a guide. Adjustments may be needed based on actual progress, blockers, or changing requirements. Document any timeline changes.

2. **Free Tier Monitoring:** Regular monitoring of free tier usage is critical. Set up alerts if possible to avoid unexpected costs or service interruptions. For comprehensive free tier limits, see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md#free-tier-service-limits).

3. **Student-Friendly Tools:** All tools and services have been selected for their free tiers or generous free usage limits, suitable for student projects.

4. **Agile Adaptation:** The project follows agile principles. Be prepared to adapt the timeline based on feedback, learnings, and changing priorities.

5. **Current as of 2025-11-15:** All tool versions, service limits, and recommendations are current as of November 15, 2025. Verify latest information before implementation.

6. **Cebu City Focus:** All development maintains focus on Cebu City as the launch area. Geographic restrictions must be enforced throughout development.

7. **Scalability and Maintainability:** Architecture and code should be designed with scalability and maintainability in mind, following best practices and design patterns.

---

*This timeline and milestone plan serves as a comprehensive guide for the Krawl MVP project, ensuring clear progression, accountability, and successful delivery within the 15-week timeframe.*

