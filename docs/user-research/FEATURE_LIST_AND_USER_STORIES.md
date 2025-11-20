# Feature List and User Stories: Krawl
## *The Living Map of Filipino Culture*

**Date:** November 14, 2025  
**Version:** 1.0.0  
**Status:** Draft

---

## Summary / Overview

This document provides a comprehensive feature list with corresponding user stories for Krawl, a community-driven Progressive Web App that maps authentic Filipino culture through user-curated points of interest ("Gems") and guided trails ("Krawls"). Each user story follows the format: **"As a [user], I want to [action] so that [benefit]."**

**Purpose:** To clearly define all features from the user's perspective and their intended value, helping guide development priorities and ensuring the platform meets user needs.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial version |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [User Personas Reference](#user-personas-reference)
5. [Feature Categories](#feature-categories)
   - [Authentication & Onboarding](#authentication--onboarding)
   - [Discovery & Exploration](#discovery--exploration)
   - [Content Creation](#content-creation)
   - [Krawl Mode & Navigation](#krawl-mode--navigation)
   - [Community Engagement](#community-engagement)
   - [Offline Functionality](#offline-functionality)
   - [User Profile & Settings](#user-profile--settings)
   - [Search & Filtering](#search--filtering)
   - [Content Management](#content-management)
6. [Feature Priority](#feature-priority)
7. [References](#references)

---

## User Personas Reference

The user stories in this document are written from the perspective of the following user personas:

1. **The Cultural Explorer (Maria)** - Discovers and explores cultural locations
2. **The Community Contributor (Jose)** - Creates and curates cultural content
3. **The Student Researcher (Ana)** - Uses platform for academic research
4. **The Domestic Traveler (Carlos)** - Visits Cebu and explores culture
5. **The International Visitor (Sarah)** - International tourist seeking authentic experiences
6. **The Local Business Owner (Lito)** - Future persona for business features

For detailed persona profiles, see [USER_PERSONA_PROFILES.md](./USER_PERSONA_PROFILES.md).

---

## Feature Categories

### Authentication & Onboarding

#### Feature: Social Login (Google OAuth)

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to sign in with my Google account so that I can quickly access the platform without creating a new account.
- As a **Community Contributor (Jose)**, I want to authenticate using Google OAuth so that I can start contributing content immediately without lengthy registration.
- As a **Student Researcher (Ana)**, I want to use Google login so that I can access the platform instantly for my research without remembering passwords.
- As a **Domestic Traveler (Carlos)**, I want to sign in with Google so that I can quickly access the platform when visiting Cebu City.

**Acceptance Criteria:**
- One-click Google OAuth authentication
- Automatic account creation on first login
- Session persistence across browser sessions
- Secure token management

---

#### Feature: Onboarding Flow

**User Stories:**
- As a **first-time visitor**, I want to see an optional onboarding tutorial so that I can quickly understand how to use the platform.
- As a **Cultural Explorer (Maria)**, I want to skip the onboarding tutorial so that I can start exploring immediately if I'm already familiar with similar apps.
- As a **new user**, I want to learn about key features (Gems, Krawls, Krawl Mode) through an interactive tutorial so that I can make the most of the platform.
- As a **first-time user**, I want to understand the value proposition of Krawl so that I know what to expect from the platform.

**Acceptance Criteria:**
- Optional, skippable onboarding flow
- 3-4 interactive tutorial steps
- Clear value proposition presentation
- Progressive permission requests with benefits explanation

---

#### Feature: Guest Mode

**User Stories:**
- As a **visitor**, I want to explore Gems and Krawls without signing in so that I can evaluate the platform before creating an account.
- As a **Cultural Explorer (Maria)**, I want to browse content as a guest so that I can see what's available before committing to sign in.
- As a **first-time visitor**, I want to understand what features require authentication so that I can decide when to sign in.

**Acceptance Criteria:**
- Full read access to Gems and Krawls for guests
- Clear indication of features requiring authentication
- Seamless upgrade to authenticated account

---

### Discovery & Exploration

#### Feature: Interactive Map View

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to see all Gems on an interactive map so that I can visually discover cultural locations in Cebu City.
- As a **Domestic Traveler (Carlos)**, I want to view Gems on a map so that I can plan my cultural exploration route efficiently.
- As a **Student Researcher (Ana)**, I want to see Gems clustered on a map so that I can identify cultural hotspots for my research.
- As a **Community Contributor (Jose)**, I want to see existing Gems on the map so that I can identify gaps where new Gems are needed.

**Acceptance Criteria:**
- Interactive Mapbox map centered on Cebu City
- Gem markers with clustering at different zoom levels
- Krawl trail visualization (polylines)
- Smooth map interactions and panning
- Cebu City boundary enforcement

---

#### Feature: Gem Discovery

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to click on Gem markers to see quick previews so that I can quickly evaluate if a location interests me.
- As a **Domestic Traveler (Carlos)**, I want to view Gem details including photos and descriptions so that I can decide which locations to visit.
- As a **Student Researcher (Ana)**, I want to read detailed cultural significance information for each Gem so that I can use it in my academic research.
- As an **International Visitor (Sarah)**, I want to see English-language descriptions with cultural context so that I can understand the significance of each location.

**Acceptance Criteria:**
- Gem detail page with comprehensive information
- Photo gallery with lightbox
- Cultural significance descriptions
- Location information with embedded map
- Rating and vouching display
- Related Krawls section

---

#### Feature: Krawl Discovery

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to discover guided Krawl trails so that I can efficiently explore multiple cultural locations in a structured way.
- As a **Domestic Traveler (Carlos)**, I want to see Krawl descriptions with duration and difficulty so that I can choose trails that fit my schedule and fitness level.
- As a **Student Researcher (Ana)**, I want to view Krawls that connect related cultural locations so that I can follow thematic research trails.
- As an **International Visitor (Sarah)**, I want to see Krawls with clear cultural themes so that I can experience authentic Filipino culture.

**Acceptance Criteria:**
- Krawl detail page with comprehensive information
- Trail visualization on map
- Ordered list of Gems in sequence
- Estimated duration and distance
- Difficulty level indicator
- Rating and vouching display

---

#### Feature: Landing Page

**User Stories:**
- As a **first-time visitor**, I want to see a compelling landing page so that I understand what Krawl offers and why I should use it.
- As a **Cultural Explorer (Maria)**, I want to see featured Krawls and popular Gems on the landing page so that I can quickly discover interesting content.
- As a **returning user**, I want to see personalized content on the landing page so that I can quickly access my recent activity and recommendations.

**Acceptance Criteria:**
- Hero section with value proposition
- Featured Krawls carousel
- Popular Gems grid
- Statistics display (Gem count, Krawl count, user count)
- Clear call-to-action buttons
- Authenticated variant with personalized content

---

### Content Creation

#### Feature: Gem Creation

**User Stories:**
- As a **Community Contributor (Jose)**, I want to create a new Gem documenting a cultural location so that I can preserve and share authentic Filipino culture.
- As a **Cultural Explorer (Maria)**, I want to add a Gem for a hidden cultural spot I discovered so that others can find it too.
- As a **Student Researcher (Ana)**, I want to document cultural locations with detailed descriptions so that I can build a research database.
- As a **Community Contributor (Jose)**, I want to upload multiple photos when creating a Gem so that I can provide visual documentation of the location.

**Acceptance Criteria:**
- Multi-step creation form (Location, Basic Info, Media, Additional Details)
- Interactive map with draggable pin for location selection
- Cebu City boundary validation
- Photo upload (up to 5 images)
- Draft saving functionality
- Preview mode before submission
- Real-time validation feedback

---

#### Feature: Krawl Creation

**User Stories:**
- As a **Community Contributor (Jose)**, I want to create a Krawl connecting multiple Gems so that I can guide others through a cultural exploration trail.
- As a **Cultural Explorer (Maria)**, I want to create a Krawl based on my favorite cultural locations so that I can share my discovery route with friends.
- As a **Community Contributor (Jose)**, I want to reorder Gems in a Krawl so that I can optimize the exploration route.
- As a **Community Contributor (Jose)**, I want to see route visualization when creating a Krawl so that I can ensure the trail is logical and efficient.

**Acceptance Criteria:**
- Form fields (name, description, category, difficulty)
- Gem selection interface
- Drag-and-drop Gem reordering
- Route visualization on map
- Route optimization suggestions
- Cover image upload
- Draft saving functionality
- Preview mode before submission

---

#### Feature: Content Editing

**User Stories:**
- As a **Community Contributor (Jose)**, I want to edit my created Gems so that I can update information or add new photos.
- As a **Community Contributor (Jose)**, I want to update my Krawls so that I can add new Gems or improve descriptions.
- As a **content creator**, I want to delete my own content so that I can remove outdated or incorrect information.

**Acceptance Criteria:**
- Edit functionality for own content only
- Same validation rules as creation
- Update history tracking (future)
- Delete with confirmation dialog

---

### Krawl Mode & Navigation

#### Feature: Krawl Mode (Location-Aware Guided Experience)

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to start Krawl Mode so that I can follow a guided trail with real-time navigation.
- As a **Domestic Traveler (Carlos)**, I want to use Krawl Mode so that I can efficiently explore multiple cultural locations with turn-by-turn directions.
- As an **International Visitor (Sarah)**, I want to follow a Krawl with location-aware guidance so that I don't get lost while exploring Cebu City.
- As a **Student Researcher (Ana)**, I want to use Krawl Mode so that I can systematically visit all locations in a research trail.

**Acceptance Criteria:**
- Pre-start checklist (location permission, battery level, offline status)
- Full-screen map view with current location
- Real-time location tracking
- Next Gem indicator with pulsing animation
- Turn-by-turn directions
- Progress tracking (X of Y Gems completed)
- Arrival detection (geofencing at 50m radius)
- Completion celebration screen

---

#### Feature: Geofencing & Arrival Detection

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to receive a notification when I arrive at a Gem so that I know I've reached the correct location.
- As a **Domestic Traveler (Carlos)**, I want automatic arrival detection so that I don't have to manually check if I'm at the right place.
- As a **user following a Krawl**, I want haptic feedback when arriving at a Gem so that I'm notified even if my phone is in my pocket.

**Acceptance Criteria:**
- Geofencing with 50m radius
- Visual arrival notification
- Haptic feedback (vibration)
- Automatic progress update
- Manual "Mark as Visited" option

---

#### Feature: Turn-by-Turn Directions

**User Stories:**
- As a **Domestic Traveler (Carlos)**, I want turn-by-turn directions to the next Gem so that I can navigate efficiently in an unfamiliar city.
- As an **International Visitor (Sarah)**, I want clear directions so that I can find cultural locations without getting lost.
- As a **Cultural Explorer (Maria)**, I want to see the route to the next Gem on the map so that I can plan my path.

**Acceptance Criteria:**
- Route calculation using Mapbox Directions API
- Turn-by-turn directions panel
- Route polyline visualization on map
- Distance and estimated time to next Gem
- Automatic route recalculation if off-route

---

### Community Engagement

#### Feature: Vouching System

**User Stories:**
- As a **Community Contributor (Jose)**, I want to vouch for authentic Gems so that I can help maintain content quality and authenticity.
- As a **Cultural Explorer (Maria)**, I want to see vouching counts on Gems so that I can identify community-verified authentic locations.
- As a **Community Contributor (Jose)**, I want to see who vouched for a Gem so that I can trust the vouching system.
- As a **user**, I want to remove my vouch if I discover a Gem is inaccurate so that I can maintain my reputation.

**Acceptance Criteria:**
- One-click vouch button on Gem/Krawl detail pages
- Vouch count display
- List of users who vouched
- Ability to remove vouch
- One vouch per user per Gem/Krawl

---

#### Feature: Krawl Rating System

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to rate Krawls so that I can share my experience with the community.
- As a **Domestic Traveler (Carlos)**, I want to see Krawl Health Scores so that I can choose the best cultural experiences.
- As a **Student Researcher (Ana)**, I want to see average ratings so that I can identify high-quality Krawls for my research.
- As a **user**, I want to update my rating if my opinion changes so that my feedback remains accurate.
- As a **user**, I want to see community warnings on low-rated Krawls so that I can avoid poor experiences.

**Acceptance Criteria:**
- 1-5 star rating system (Krawls only)
- Krawl Health Score (average rating) display
- Rating breakdown (distribution)
- Ability to rate and update rating
- One rating per user per Krawl
- Community Warning badge for Krawls with Health Score < 2.5

---

#### Feature: Gem Score System

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to see Gems ranked by Gem Score so that I can find the most community-validated spots.
- As a **Domestic Traveler (Carlos)**, I want to see Gem Scores on search results so that I can identify the best Gems quickly.
- As a **Community Contributor (Jose)**, I want my Gem to appear higher in search results when it's included in many Krawls so that quality content is rewarded.

**Acceptance Criteria:**
- Gem Score calculation: `(vouches_count × 1) + (krawl_inclusion_count × 5)`
- Gem Score displayed on Gem cards/listings
- Default sort by Gem Score in search results
- Higher weight for Krawl inclusions (×5) vs vouches (×1)

---

#### Feature: Creator Reputation System

**User Stories:**
- As a **Community Contributor (Jose)**, I want to see my Creator Reputation Score so that I can track my standing in the community.
- As a **Cultural Explorer (Maria)**, I want to see creator reputation badges so that I can trust high-quality Krawl creators.
- As a **content creator**, I want my high reputation to boost my new Krawls so that quality creators are rewarded.
- As a **user**, I want low-reputation creators' Krawls to be filtered so that I avoid poor content.

**Acceptance Criteria:**
- Creator Reputation Score calculated as average of all Krawl ratings created by user
- Reputation tiers displayed on profiles:
  - 4.5+ Stars: 🥇 "Kanto Guide" (Trusted Creator)
  - 3.5-4.4 Stars: 🥈 "Local Explorer"
  - 2.5-3.4 Stars: 🥉 "Trail Maker"
  - Below 2.5 Stars: No badge
- Algorithmic boost for high-reputation creators' new Krawls
- "Sandbox" system for low-reputation creators (new Krawls hidden from most users)

---

#### Feature: Comments & Reviews

**User Stories:**
- As a **Community Contributor (Jose)**, I want to add comments to Gems so that I can provide additional context or corrections.
- As a **Cultural Explorer (Maria)**, I want to read comments from other users so that I can learn more about a location before visiting.
- As a **Domestic Traveler (Carlos)**, I want to ask questions in comments so that I can get information from locals.
- As a **content creator**, I want to respond to comments so that I can engage with the community.

**Acceptance Criteria:**
- Comment textarea on Gem/Krawl detail pages
- Comments list with user information
- Edit/delete own comments
- Character limit (e.g., 500 characters)
- Timestamp display

---

#### Feature: Content Reporting

**User Stories:**
- As a **Community Contributor (Jose)**, I want to report inaccurate or inappropriate content so that I can help maintain platform quality.
- As a **user**, I want to report commercial or spam content so that the platform stays focused on authentic culture.
- As a **user**, I want to report offensive content so that the community remains respectful.

**Acceptance Criteria:**
- Report button on Gem/Krawl detail pages
- Report reason selection (inaccurate, commercial, offensive, spam, other)
- Optional report description
- Confirmation message
- Admin review process (future)

---

### Offline Functionality

#### Feature: Offline Krawl Downloads

**User Stories:**
- As a **Domestic Traveler (Carlos)**, I want to download Krawls for offline use so that I can explore even with limited data or poor connectivity.
- As an **International Visitor (Sarah)**, I want to download Krawls before traveling so that I can save on roaming data costs.
- As a **Cultural Explorer (Maria)**, I want to download Krawls so that I can explore areas with inconsistent internet connectivity.
- As a **Student Researcher (Ana)**, I want to download Krawls for field research so that I can access information in remote locations.

**Acceptance Criteria:**
- "Download for Offline" button on Krawl detail pages
- Download progress indicator
- Storage usage display
- List of downloaded Krawls
- Offline access to Krawl data, maps, and Gem information
- Automatic sync when online

---

#### Feature: Offline Map Tiles

**User Stories:**
- As a **user with downloaded Krawls**, I want offline map tiles so that I can see the map even without internet connectivity.
- As a **Domestic Traveler (Carlos)**, I want cached map tiles so that navigation works in areas with poor connectivity.

**Acceptance Criteria:**
- Map tile caching for downloaded Krawls
- Offline map rendering
- Graceful degradation when tiles unavailable

---

#### Feature: Offline Content Creation

**User Stories:**
- As a **Community Contributor (Jose)**, I want to create Gems offline so that I can document locations even when connectivity is poor.
- As a **Community Contributor (Jose)**, I want my offline-created content to sync automatically when I'm online so that I don't lose my work.

**Acceptance Criteria:**
- Gem/Krawl creation works offline
- Draft saving to local storage
- Background sync queue
- Automatic upload when online
- Conflict resolution (future)

---

### User Profile & Settings

#### Feature: User Profile

**User Stories:**
- As a **Community Contributor (Jose)**, I want to view my profile so that I can see my contributions and build my reputation.
- As a **Cultural Explorer (Maria)**, I want to see other users' profiles so that I can discover content creators I trust.
- As a **user**, I want to see my statistics (Gems created, Krawls created, vouches given) so that I can track my community engagement.
- As a **Community Contributor (Jose)**, I want to showcase my created content on my profile so that others can discover my contributions.

**Acceptance Criteria:**
- User profile page with avatar and display name
- Bio/description section
- Statistics display (Gems created, Krawls created, vouches given, Krawls completed)
- Created Gems list
- Created Krawls list
- Vouched Gems list
- Completed Krawls list
- Activity feed (future)

---

#### Feature: Profile Settings

**User Stories:**
- As a **user**, I want to edit my profile information so that I can personalize my account.
- As a **Community Contributor (Jose)**, I want to update my bio so that I can describe my interests and expertise.
- As a **user**, I want to upload a profile picture so that I can personalize my account.
- As a **user**, I want to manage my notification preferences so that I control how often I'm notified.

**Acceptance Criteria:**
- Edit profile form (name, bio, avatar)
- Avatar upload with image optimization
- Notification preferences (email, push)
- Privacy settings
- Account management (connected accounts, delete account)
- App preferences (map style, language, units)

---

### Search & Filtering

#### Feature: Search Functionality

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to search for specific Gems or Krawls so that I can quickly find content I'm interested in.
- As a **Student Researcher (Ana)**, I want to search by keywords so that I can find Gems related to my research topics.
- As a **Domestic Traveler (Carlos)**, I want autocomplete search suggestions so that I can quickly find popular locations.
- As a **user**, I want to see recent searches so that I can quickly repeat previous searches.

**Acceptance Criteria:**
- Search bar with autocomplete
- Search across Gems and Krawls
- Recent searches display
- Popular searches suggestions
- Search results with relevance ranking
- Result count display

---

#### Feature: Advanced Filtering

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to filter Gems by category so that I can find specific types of cultural locations.
- As a **Domestic Traveler (Carlos)**, I want to filter by distance so that I can find Gems near my location.
- As a **Student Researcher (Ana)**, I want to filter by rating so that I can find high-quality content for my research.
- As a **user**, I want to filter by content type (Gems/Krawls) so that I can narrow down my search.

**Acceptance Criteria:**
- Quick filters (content type, category)
- Advanced filters panel (rating, distance, sort)
- Active filter count badge
- Real-time filter updates
- "Clear all filters" button
- Filter persistence in URL

---

#### Feature: Search Results Display

**User Stories:**
- As a **Cultural Explorer (Maria)**, I want to toggle between list and map view of search results so that I can choose my preferred viewing method.
- As a **Domestic Traveler (Carlos)**, I want to see distance information in search results so that I can plan my route efficiently.
- As a **user**, I want to see ratings and thumbnails in search results so that I can quickly evaluate content quality.

**Acceptance Criteria:**
- List view with cards (thumbnail, title, category, rating, distance)
- Map view with markers
- View toggle (List/Map)
- Pagination or infinite scroll
- Result count display
- Empty state message when no results

---

### Content Management

#### Feature: Content Moderation (Future)

**User Stories:**
- As an **admin**, I want to review reported content so that I can maintain platform quality.
- As an **admin**, I want to remove inappropriate content so that the platform stays focused on authentic culture.
- As a **user**, I want to see when my reported content has been reviewed so that I know my feedback was heard.

**Acceptance Criteria:**
- Admin dashboard for content review
- Report queue with priority
- Content removal capability
- User notification when report is resolved
- Appeal process (future)

---

#### Feature: Content Statistics

**User Stories:**
- As a **Community Contributor (Jose)**, I want to see view counts for my Gems so that I can understand which content is popular.
- As a **content creator**, I want to see completion rates for my Krawls so that I can improve trail quality.
- As a **platform admin**, I want to see overall platform statistics so that I can track growth and engagement.

**Acceptance Criteria:**
- View counts for Gems and Krawls
- Completion rates for Krawls
- Platform-wide statistics (total Gems, Krawls, users)
- User engagement metrics (future)

---

## Feature Priority

### MVP (Must Have) - Weeks 1-14

**Core Features:**
1. ✅ Social Login (Google OAuth)
2. ✅ Interactive Map View
3. ✅ Gem Creation
4. ✅ Gem Discovery & Detail Pages
5. ✅ Krawl Creation
6. ✅ Krawl Discovery & Detail Pages
7. ✅ Krawl Mode (Location-Aware Navigation)
8. ✅ Vouching System
9. ✅ Rating System
10. ✅ Comments & Reviews
11. ✅ Search & Filtering
12. ✅ User Profile
13. ✅ Offline Krawl Downloads
14. ✅ Landing Page
15. ✅ Onboarding Flow

### Post-MVP (Nice to Have) - Future Releases

**Enhancement Features:**
- Content Moderation Dashboard
- Advanced Analytics
- Social Sharing Enhancements
- User Following/Followers
- Personalized Recommendations
- AR Integration
- Voice-Guided Navigation
- Group Krawl Mode
- Business Features ("Claim Your Gem")

---

## References

### Related Documents

- [USER_PERSONA_PROFILES.md](./USER_PERSONA_PROFILES.md) - Detailed user persona profiles
- [USER_JOURNEY_MAP.md](./USER_JOURNEY_MAP.md) - Comprehensive user journey maps
- [SITEMAP.md](./SITEMAP.md) - Navigation structure and routing
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications
- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - UI/UX design system
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview and objectives

---

## Document Metadata

**Document Type:** Product Requirements / User Stories  
**Target Audience:** Development Team, Product Managers, Designers, Stakeholders  
**Related Documents:**
- USER_PERSONA_PROFILES.md
- USER_JOURNEY_MAP.md
- SCOPE_OF_WORK.md
- SITEMAP.md

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **User Story Format:** All user stories follow the format: "As a [user], I want to [action] so that [benefit]."

2. **Persona-Based:** User stories are written from the perspective of specific user personas to ensure features meet real user needs.

3. **MVP Focus:** Features are prioritized for MVP (Weeks 1-14) and post-MVP releases.

4. **Free Tier Services:** All features are designed to work within free-tier service limits (see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md)).

5. **Cebu City Focus:** All features are restricted to Cebu City boundaries for the initial launch.

6. **Social Login Only:** Authentication features assume Google OAuth 2.0 only (no email/password).

7. **Mobile-First:** All features are designed with mobile-first approach, though desktop support is included.

8. **Current as of 2025-11-14:** This document reflects the current feature list as of November 14, 2025. Features should be updated based on user feedback and development progress.

---

*This document provides a comprehensive feature list with user stories to guide all development and product decisions for Krawl. User stories should be referenced throughout the development process to ensure features meet user needs and deliver intended value.*
