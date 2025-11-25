# 🗺️ User Journey Map: Krawl
## *The Living Map of Filipino Culture*

**Date:** November 14, 2025  
**Version:** 1.0.0  
**Status:** Draft

---

## Summary / Overview

This document provides comprehensive user journey maps for Krawl, a community-driven Progressive Web App that maps authentic Filipino culture through user-curated points of interest ("Gems") and guided trails ("Krawls"). The journey maps describe how users navigate through the website to complete key tasks, highlighting their actions, motivations, pain points, and touchpoints along the way.

**Purpose:** To establish clear, detailed user journey maps that inform all design, development, and product decisions for Krawl, ensuring the platform provides intuitive navigation and seamless user experiences while maintaining focus on authentic Filipino cultural discovery in Cebu City.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial version |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-23  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Journey Map Overview](#journey-map-overview)
5. [Primary User Journeys](#primary-user-journeys)
   - [Journey 1: First-Time Visitor Discovery](#journey-1-first-time-visitor-discovery)
   - [Journey 2: Authenticated User Content Creation](#journey-2-authenticated-user-content-creation)
   - [Journey 3: Following a Krawl Trail](#journey-3-following-a-krawl-trail)
   - [Journey 4: Searching and Discovering Content](#journey-4-searching-and-discovering-content)
   - [Journey 5: Community Engagement and Contribution](#journey-5-community-engagement-and-contribution)
6. [Secondary User Journeys](#secondary-user-journeys)
   - [Journey 6: Pre-Travel Planning (Traveler)](#journey-6-pre-travel-planning-traveler)
   - [Journey 7: Profile Management](#journey-7-profile-management)
7. [Touchpoint Analysis](#touchpoint-analysis)
8. [Pain Point Summary](#pain-point-summary)
9. [Opportunities for Improvement](#opportunities-for-improvement)
10. [References](#references)
11. [Appendices](#appendices)

---

## Journey Map Overview

### Journey Map Structure

Each user journey map includes the following elements:

- **Stages:** High-level phases of the user journey
- **Actions:** Specific user actions at each stage
- **Touchpoints:** Points of interaction between user and platform
- **Emotions:** User emotional state at each stage
- **Pain Points:** Friction or challenges encountered
- **Motivations:** User goals and drivers
- **Opportunities:** Potential improvements or enhancements

### Key User Personas

The journey maps are designed for the following primary personas (see [USER_PERSONA_PROFILES.md](./USER_PERSONA_PROFILES.md) for detailed profiles):

1. **The Cultural Explorer (Maria)** - Discovers and explores cultural locations
2. **The Community Contributor (Jose)** - Creates and curates cultural content
3. **The Student Researcher (Ana)** - Uses platform for academic research
4. **The Domestic Traveler (Carlos)** - Visits Cebu and explores culture
5. **The International Visitor (Sarah)** - International tourist seeking authentic experiences

### Technology Context

All journeys assume:
- **Authentication:** Google OAuth 2.0 (social login only)
- **Platform:** Progressive Web App (PWA) with offline capabilities
- **Device:** Mobile-first design (primary), desktop support (secondary)
- **Free Services:** All features accessible via free-tier services
- **Location:** Cebu City, Philippines (geographic restriction)

---

## Primary User Journeys

### Journey 1: First-Time Visitor Discovery

**Persona:** The Cultural Explorer (Maria)  
**Goal:** Discover authentic Filipino cultural locations in Cebu City  
**Duration:** 15-30 minutes  
**Device:** Mobile smartphone

#### Stage 1: Awareness & Entry

**Actions:**
- Hears about Krawl from friend, social media, or search
- Visits landing page via mobile browser
- Views hero section and value proposition

**Touchpoints:**
- Landing page (`/`)
- Hero section with tagline "The Living Map of Filipino Culture"
- Featured Krawls carousel
- Popular Gems grid
- "Explore Cebu City" primary CTA
- "Sign In" secondary CTA

**Emotions:**
- **Curiosity:** Interested in discovering authentic culture
- **Excitement:** Eager to explore new platform
- **Skepticism:** Wondering if content is authentic

**Motivations:**
- Discover hidden cultural gems
- Find authentic, non-commercial experiences
- Explore Cebu City culture
- Connect with local community

**Pain Points:**
- Unclear value proposition if landing page doesn't load quickly
- Too much information overwhelming first-time visitors
- Uncertainty about content quality and authenticity

**Opportunities:**
- Clear, compelling value proposition
- Trust indicators (user count, Gem count, Krawl count)
- Quick preview of featured content
- Social proof (testimonials, recent activity)

#### Stage 2: Onboarding (Optional)

**Actions:**
- Clicks "Get Started" or "Explore Cebu City"
- Views optional onboarding tutorial (can skip)
- Sees interactive tutorial steps:
  - Step 1: "Discover Gems" - Example Gem interaction
  - Step 2: "Follow Krawls" - Krawl trail visualization
  - Step 3: "Create Your Own" - Creation features (if authenticated)
  - Step 4: "Explore Cebu City" - Geographic focus
- Grants location permission (optional, with clear benefit explanation)

**Touchpoints:**
- Onboarding flow (`/onboarding`)
- Welcome screen with app logo and tagline
- Interactive tutorial (3-4 steps)
- Permission request dialogs (location, notifications)
- "Skip" option available at any step
- "Continue as Guest" option

**Emotions:**
- **Engagement:** Learning about platform features
- **Impatience:** May want to skip tutorial
- **Confidence:** Understanding how to use platform

**Motivations:**
- Learn platform features quickly
- Start exploring immediately
- Understand value proposition

**Pain Points:**
- Tutorial may feel too long for eager users
- Permission requests may cause hesitation
- Unclear benefits of granting permissions

**Opportunities:**
- Progressive disclosure (one concept per screen)
- Clear benefits for each permission
- Easy skip option for experienced users
- Persistent "Help" access to replay tutorial

#### Stage 3: Map Exploration

**Actions:**
- Arrives at map view page
- Sees interactive Mapbox map centered on Cebu City
- Views Gem markers on map (with clustering)
- Sees Krawl trail visualizations (polylines)
- Taps/clicks on Gem markers
- Views info windows/bottom sheets with quick previews
- Uses search bar to find specific locations
- Applies filters (category, rating, distance)

**Touchpoints:**
- Map view page (`/map`)
- Interactive Mapbox map
- Gem markers (with clustering)
- Krawl trail polylines
- Info windows/bottom sheets
- Search bar with autocomplete
- Filter panel (collapsible)
- "My Location" button
- Create Gem FAB (if authenticated)

**Emotions:**
- **Excitement:** Discovering cultural locations
- **Curiosity:** Exploring map and markers
- **Satisfaction:** Finding interesting Gems
- **Frustration:** If map loads slowly or markers unclear

**Motivations:**
- Discover nearby cultural locations
- Find specific types of cultural experiences
- Explore Cebu City culture visually
- Plan cultural exploration routes

**Pain Points:**
- Slow map loading on poor connectivity
- Too many markers causing visual clutter
- Unclear marker categories or information
- Difficulty finding specific locations
- Location permission denied (can't see nearby Gems)

**Opportunities:**
- Fast map loading with progressive marker loading
- Smart marker clustering based on zoom level
- Clear visual distinction between Gems and Krawls
- Efficient search and filtering
- Clear location permission benefits

#### Stage 4: Gem Discovery

**Actions:**
- Taps on Gem marker or search result
- Views Gem detail page
- Scrolls through photos gallery
- Reads description and cultural significance
- Views location on embedded map
- Checks rating and vouching count
- Reads comments/reviews
- Views related Krawls that include this Gem
- Clicks "Get Directions" (opens external maps app)

**Touchpoints:**
- Gem detail page (`/gems/:id`)
- Photo gallery with lightbox
- Description and cultural significance section
- Embedded map with Gem location
- Rating display (average and breakdown)
- Vouching count and list
- Comments/reviews section
- Related Krawls section
- "Get Directions" button
- "Share" button
- "Report" button (for inappropriate content)
- "Vouch" button (if authenticated)
- "Rate" button (if authenticated)
- "Add Comment" button (if authenticated)

**Emotions:**
- **Interest:** Learning about cultural location
- **Appreciation:** Understanding cultural significance
- **Desire:** Wanting to visit location
- **Trust:** Evaluating authenticity through vouches and ratings
- **Frustration:** If content is incomplete or inaccurate

**Motivations:**
- Learn about cultural location
- Evaluate authenticity and quality
- Plan visit to cultural location
- Understand cultural significance
- Share interesting discoveries

**Pain Points:**
- Incomplete or inaccurate Gem information
- Poor quality photos
- Missing cultural context
- Unclear location or directions
- Low vouching count (uncertainty about authenticity)

**Opportunities:**
- Rich, detailed Gem descriptions
- High-quality photos from multiple angles
- Clear cultural significance explanations
- Accurate location information
- Strong community vouching system

#### Stage 5: Sign-In Prompt (Guest Users)

**Actions:**
- Attempts to vouch, rate, or comment on Gem
- Sees sign-in prompt modal/dialog
- Clicks "Sign In with Google"
- Redirected to Google OAuth consent screen
- Authorizes Google account
- Returns to platform (authenticated)
- Can now vouch, rate, or comment

**Touchpoints:**
- Sign-in prompt modal/dialog
- Sign-in page (`/auth/signin`)
- Google OAuth consent screen
- OAuth callback handler (`/auth/callback`)
- Success message/redirect

**Emotions:**
- **Motivation:** Wanting to engage with content
- **Hesitation:** Concern about privacy or account creation
- **Relief:** Quick, familiar Google login process
- **Satisfaction:** Successfully authenticated

**Motivations:**
- Engage with community (vouch, rate, comment)
- Create own content (Gems, Krawls)
- Save favorites and track activity
- Build reputation in community

**Pain Points:**
- Unclear benefits of signing in
- Privacy concerns about Google account
- Friction in authentication process
- Lost context after authentication (redirect issues)

**Opportunities:**
- Clear benefits communication ("Sign in to create Gems and Krawls")
- Transparent privacy policy
- Quick, one-click Google login
- Preserve user context after authentication
- Guest mode clearly explained

---

### Journey 2: Authenticated User Content Creation

**Persona:** The Community Contributor (Jose)  
**Goal:** Create and publish a new Gem documenting a cultural location  
**Duration:** 20-40 minutes  
**Device:** Mobile smartphone (on-site) or desktop (detailed creation)

#### Stage 1: Discovery & Intent

**Actions:**
- Explores map or visits cultural location
- Identifies location that should be documented
- Decides to create Gem for this location
- Clicks "Create Gem" FAB or menu item

**Touchpoints:**
- Map view page (`/map`)
- Create Gem FAB (floating action button)
- "Create" menu item in navigation
- Gem creation entry point

**Emotions:**
- **Excitement:** Discovering undocumented location
- **Purpose:** Contributing to cultural preservation
- **Determination:** Committed to creating quality content

**Motivations:**
- Document authentic cultural location
- Share knowledge with community
- Preserve cultural heritage
- Build reputation as contributor

**Pain Points:**
- Unclear how to start creating Gem
- Uncertainty about creation requirements
- Concern about content quality standards

**Opportunities:**
- Prominent, accessible "Create Gem" button
- Clear creation guidelines and examples
- Quick-start tutorial for first-time creators

#### Stage 2: Location Selection

**Actions:**
- Arrives at Gem creation page
- Sees multi-step form with progress indicator
- Step 1: Location selection
- Uses map interface with draggable pin
- Clicks "Use Current Location" (if permission granted)
- Or searches for address
- Drags pin to exact location
- Sees visual boundary indicator (Cebu City limits)
- Receives real-time validation feedback
- Confirms location is within boundaries

**Touchpoints:**
- Gem creation page (`/gems/create`)
- Step 1: Location selection interface
- Interactive map with draggable pin
- "Use Current Location" button
- Address search bar with autocomplete
- Visual boundary indicator (Cebu City limits)
- Real-time validation feedback (green checkmark or error)
- "Next" button (enabled when location valid)

**Emotions:**
- **Focus:** Carefully selecting accurate location
- **Confidence:** Seeing validation feedback
- **Frustration:** If location outside boundaries or unclear

**Motivations:**
- Ensure accurate location documentation
- Comply with Cebu City boundary restrictions
- Create precise, useful Gem

**Pain Points:**
- Unclear boundary restrictions
- Difficulty placing pin accurately
- Location outside Cebu City boundaries
- Poor GPS accuracy in some locations

**Opportunities:**
- Clear boundary visualization
- Helpful error messages with guidance
- Accurate GPS location detection
- Easy pin adjustment

#### Stage 3: Basic Information

**Actions:**
- Proceeds to Step 2: Basic Info
- Enters Gem name (with character counter, max 100 chars)
- Selects category (visual chips/icons, single select)
- Writes description (with character counter, min 50, max 500 chars)
- Sees real-time validation feedback
- Character count warnings at 80% limit

**Touchpoints:**
- Step 2: Basic Info form
- Gem name input field
- Category selection (visual chips)
- Description textarea
- Character counters with visual feedback
- Real-time validation messages
- "Back" and "Next" buttons
- "Save Draft" button

**Emotions:**
- **Engagement:** Writing detailed description
- **Satisfaction:** Completing required fields
- **Anxiety:** Ensuring description quality

**Motivations:**
- Create comprehensive, accurate Gem
- Provide cultural context
- Help others discover location

**Pain Points:**
- Unclear category definitions
- Difficulty writing compelling description
- Character limit constraints
- Uncertainty about required vs. optional fields

**Opportunities:**
- Clear category descriptions with examples
- Description templates or examples
- Helpful hints and suggestions
- Auto-save draft functionality

#### Stage 4: Media Upload

**Actions:**
- Proceeds to Step 3: Media (optional but recommended)
- Clicks "Add Photos" or drags-and-drops images
- Selects up to 5 images from device
- Sees image preview grid
- Reorders images by drag-and-drop
- Deletes individual photos if needed
- Sees upload progress indicators
- Views image compression preview (before/after size)

**Touchpoints:**
- Step 3: Media upload interface
- Drag-and-drop zone
- "Add Photos" button
- Image preview grid
- Upload progress indicators
- Image compression preview
- Reorder functionality (drag-and-drop)
- Delete individual photos
- "Back" and "Next" buttons
- "Save Draft" button

**Emotions:**
- **Satisfaction:** Adding visual content
- **Frustration:** If upload fails or slow
- **Pride:** Selecting best photos

**Motivations:**
- Provide visual documentation
- Help others visualize location
- Create high-quality Gem

**Pain Points:**
- Slow image upload on poor connectivity
- Image upload failures
- Unclear image requirements (size, format)
- Difficulty selecting best photos

**Opportunities:**
- Fast, reliable image upload (Cloudinary)
- Automatic image optimization
- Clear image guidelines
- Offline upload queue (future)

#### Stage 5: Additional Details

**Actions:**
- Proceeds to Step 4: Additional Details (optional)
- Adds cultural significance notes (max 300 chars)
- Adds tags/keywords (autocomplete chips, max 5 tags)
- Sees suggested tags based on category
- Reviews all information
- Clicks "Preview" to see how Gem will appear

**Touchpoints:**
- Step 4: Additional Details form
- Cultural significance textarea
- Tags/keywords input with autocomplete
- Suggested tags display
- "Preview" button
- "Back" and "Submit" buttons
- "Save Draft" button

**Emotions:**
- **Completion:** Finishing Gem creation
- **Anticipation:** Ready to publish
- **Review:** Ensuring quality

**Motivations:**
- Create comprehensive Gem
- Add relevant tags for discoverability
- Ensure quality before publishing

**Pain Points:**
- Unclear tag suggestions
- Difficulty summarizing cultural significance
- Uncertainty about optional fields

**Opportunities:**
- Smart tag suggestions based on category
- Examples of cultural significance notes
- Clear optional field indicators

#### Stage 6: Submission & Confirmation

**Actions:**
- Reviews preview of Gem
- Clicks "Submit" button
- Sees final confirmation dialog
- Confirms submission
- Sees submission progress indicator
- Receives success message
- Sees options: "View Gem" or "Create Another"

**Touchpoints:**
- Preview mode
- Final confirmation dialog
- Submission progress indicator
- Success screen
- "View Gem" button
- "Create Another" button

**Emotions:**
- **Pride:** Successfully creating Gem
- **Satisfaction:** Contributing to community
- **Excitement:** Seeing Gem published

**Motivations:**
- Share Gem with community
- See Gem appear on map
- Receive community feedback

**Pain Points:**
- Submission failures or errors
- Unclear submission status
- Lost work if submission fails

**Opportunities:**
- Reliable submission process
- Clear success/error messages
- Draft auto-save throughout process
- Retry option on failure

---

### Journey 3: Following a Krawl Trail

**Persona:** The Cultural Explorer (Maria) or The Domestic Traveler (Carlos)  
**Goal:** Follow a guided Krawl trail to explore multiple cultural locations  
**Duration:** 2-4 hours (depending on Krawl length)  
**Device:** Mobile smartphone (on-site)

#### Stage 1: Krawl Discovery

**Actions:**
- Searches for Krawls or browses map
- Finds interesting Krawl (e.g., "Historic Colon District Trail")
- Clicks on Krawl to view details
- Reads Krawl description and cultural theme
- Views list of Gems in Krawl (ordered sequence)
- Checks estimated duration and difficulty
- Reviews rating and vouching count
- Views photos from Gems in trail

**Touchpoints:**
- Search page (`/search`) or Map view (`/map`)
- Krawl detail page (`/krawls/:id`)
- Krawl description and metadata
- Gem list (ordered sequence)
- Trail visualization on embedded map
- Rating and vouching display
- Photos gallery
- "Download for Offline" button
- "Start Krawl Mode" button

**Emotions:**
- **Interest:** Discovering cultural trail
- **Excitement:** Planning cultural exploration
- **Anticipation:** Ready to start trail

**Motivations:**
- Explore multiple cultural locations efficiently
- Follow structured cultural trail
- Experience authentic Filipino culture
- Learn about cultural connections

**Pain Points:**
- Unclear Krawl difficulty or duration
- Uncertainty about trail quality
- Difficulty understanding route

**Opportunities:**
- Clear Krawl descriptions with cultural themes
- Accurate duration and difficulty indicators
- Visual trail preview on map
- Community ratings and vouches

#### Stage 2: Pre-Travel Preparation (Optional)

**Actions:**
- Clicks "Download for Offline" button
- Sees download progress indicator
- Waits for download completion
- Receives confirmation: "Krawl downloaded for offline use"
- Reviews downloaded Krawls in offline downloads page

**Touchpoints:**
- "Download for Offline" button
- Download progress indicator
- Success confirmation message
- Offline downloads page (`/offline`)
- Downloaded Krawls list

**Emotions:**
- **Preparation:** Ensuring offline access
- **Confidence:** Ready for exploration
- **Satisfaction:** Successfully downloaded

**Motivations:**
- Ensure access in areas with poor connectivity
- Save mobile data
- Prepare for travel

**Pain Points:**
- Slow download on poor connectivity
- Unclear download status
- Storage limitations

**Opportunities:**
- Fast, efficient download process
- Clear download progress
- Storage management tools

#### Stage 3: Starting Krawl Mode

**Actions:**
- Clicks "Start Krawl Mode" button
- Sees pre-start checklist:
  - Location permission status
  - Battery level warning (if < 20%)
  - Offline download status (if applicable)
  - Estimated duration reminder
  - Safety tips (optional, dismissible)
- Grants location permission (if not already granted)
- Clicks "Start Krawl" primary button
- Krawl Mode begins

**Touchpoints:**
- "Start Krawl Mode" button
- Pre-start checklist screen
- Location permission request dialog
- Battery level indicator
- Safety tips display
- "Start Krawl" button
- Krawl Mode page (`/krawls/:id/mode`)

**Emotions:**
- **Excitement:** Beginning cultural exploration
- **Confidence:** Prepared for trail
- **Anticipation:** Ready to discover

**Motivations:**
- Start guided cultural exploration
- Follow structured trail
- Experience location-aware guidance

**Pain Points:**
- Location permission denied
- Low battery concerns
- Unclear safety information

**Opportunities:**
- Clear permission benefits
- Battery level warnings
- Helpful safety tips

#### Stage 4: Navigation & Exploration

**Actions:**
- Sees full-screen map view with:
  - Current location indicator (blue dot)
  - Next Gem marker (pulsing animation)
  - Route polyline (highlighted path to next Gem)
  - Completed Gems (grayed out)
  - Remaining Gems (standard markers)
- Views bottom sheet with:
  - Progress indicator (X of Y Gems completed)
  - Next Gem card (thumbnail, name, distance, estimated time)
  - Turn-by-turn directions (expandable)
- Follows directions to next Gem
- Receives arrival notification (geofencing trigger at 50m radius)
- Haptic feedback (vibration) when arriving
- Views Gem details card (swipeable)
- Marks Gem as visited (manual or auto)
- Continues to next Gem

**Touchpoints:**
- Krawl Mode full-screen map
- Current location indicator
- Next Gem marker with pulsing animation
- Route polyline visualization
- Bottom sheet with progress and directions
- Next Gem card
- Turn-by-turn directions panel
- Arrival notification (visual and haptic)
- Gem detail cards (swipeable)
- "Mark as Visited" button
- "Skip Gem" button (with confirmation)
- "Exit Krawl Mode" button (with confirmation)

**Emotions:**
- **Engagement:** Actively following trail
- **Satisfaction:** Progressing through Gems
- **Excitement:** Arriving at each Gem
- **Frustration:** If navigation unclear or off-route

**Motivations:**
- Follow trail accurately
- Discover each Gem location
- Complete cultural exploration
- Learn about cultural connections

**Pain Points:**
- Unclear navigation directions
- GPS inaccuracy causing confusion
- Off-route situations
- Battery drain from location tracking
- Poor connectivity affecting map loading

**Opportunities:**
- Clear, accurate turn-by-turn directions
- Reliable GPS tracking
- Automatic route recalculation
- Battery-efficient location tracking
- Offline map tiles for downloaded Krawls

#### Stage 5: Gem Arrival & Exploration

**Actions:**
- Arrives at Gem location (geofencing trigger)
- Receives arrival notification (haptic feedback, visual card)
- Views Gem details card (swipe up to expand)
- Reads Gem description and cultural significance
- Views Gem photos
- Explores actual location
- Takes own photos (optional)
- Marks Gem as visited
- Continues to next Gem

**Touchpoints:**
- Arrival notification (visual card slides up)
- Haptic feedback (vibration)
- Gem detail card (swipeable, expandable)
- Gem description and photos
- "Mark as Visited" button
- "Continue" button
- "View Full Details" link (opens Gem detail page)

**Emotions:**
- **Achievement:** Successfully arriving at Gem
- **Appreciation:** Experiencing cultural location
- **Satisfaction:** Progressing through trail

**Motivations:**
- Experience authentic cultural location
- Learn about cultural significance
- Complete trail successfully

**Pain Points:**
- Arrival detection not triggering
- Unclear Gem location at site
- Difficulty finding exact location

**Opportunities:**
- Accurate geofencing (adjustable radius)
- Clear location markers at site
- Helpful arrival instructions

#### Stage 6: Trail Completion

**Actions:**
- Arrives at final Gem
- Marks final Gem as visited
- Sees completion celebration screen
- Views completion statistics:
  - Total time taken
  - Distance traveled
  - Gems visited
- Receives "Rate this Krawl" prompt
- Rates Krawl (1-5 stars)
- Shares completion (optional)
- Sees "Explore More Krawls" CTA

**Touchpoints:**
- Completion celebration screen
- Completion statistics display
- Shareable achievement card
- "Rate this Krawl" prompt
- Rating interface (1-5 stars)
- "Share Completion" button
- "Explore More Krawls" CTA

**Emotions:**
- **Achievement:** Successfully completing trail
- **Pride:** Accomplishing cultural exploration
- **Satisfaction:** Rating and sharing experience

**Motivations:**
- Complete cultural exploration
- Share experience with others
- Provide feedback to community

**Pain Points:**
- Completion not properly tracked
- Unclear completion statistics
- Difficulty sharing completion

**Opportunities:**
- Accurate completion tracking
- Detailed completion statistics
- Easy sharing functionality
- Celebration animation

---

### Journey 4: Searching and Discovering Content

**Persona:** The Student Researcher (Ana) or The Cultural Explorer (Maria)  
**Goal:** Find specific cultural locations or Krawls using search and filters  
**Duration:** 5-15 minutes  
**Device:** Mobile smartphone or desktop

#### Stage 1: Search Initiation

**Actions:**
- Navigates to search page or uses search bar
- Enters search query (e.g., "historic churches")
- Sees autocomplete suggestions as typing
- Views recent searches (if available)
- Sees popular searches suggestions
- Selects search query or suggestion

**Touchpoints:**
- Search page (`/search`)
- Search bar (prominent, sticky header)
- Autocomplete dropdown
- Recent searches list
- Popular searches display
- Voice input button (if supported)
- Clear button (X icon)

**Emotions:**
- **Focus:** Searching for specific content
- **Curiosity:** Exploring search suggestions
- **Efficiency:** Wanting quick results

**Motivations:**
- Find specific cultural locations
- Discover content by category
- Explore related content

**Pain Points:**
- Unclear search functionality
- Slow autocomplete
- Unhelpful search suggestions

**Opportunities:**
- Fast, responsive search
- Smart autocomplete suggestions
- Helpful search examples

#### Stage 2: Filter Application

**Actions:**
- Views search results
- Applies quick filters (content type: All/Gems/Krawls)
- Selects category chips (scrollable horizontal list)
- Opens advanced filters panel
- Applies rating filter (slider: 1-5 stars)
- Applies distance filter (radius slider)
- Selects sort option (Relevance/Rating/Distance/Date)
- Sees active filter count badge
- Views filtered results update in real-time

**Touchpoints:**
- Quick filter chips (content type, categories)
- Advanced filters panel (collapsible)
- Rating slider with visual stars
- Distance slider with radius visualization
- Sort dropdown
- Active filter count badge
- "Clear all filters" button
- Filtered results display

**Emotions:**
- **Control:** Refining search results
- **Satisfaction:** Finding relevant content
- **Frustration:** If filters unclear or ineffective

**Motivations:**
- Narrow down search results
- Find specific content types
- Sort by relevance or rating

**Pain Points:**
- Unclear filter options
- Too many filters overwhelming
- Filters not working as expected
- Difficulty clearing filters

**Opportunities:**
- Clear, intuitive filter interface
- Real-time filter updates
- Easy filter clearing
- Helpful filter descriptions

#### Stage 3: Results Review

**Actions:**
- Views search results (list or map view)
- Sees result count ("X results found")
- Scrolls through result cards
- Views thumbnails, titles, categories
- Checks ratings and distances
- Toggles between list and map view
- Clicks on result to view details

**Touchpoints:**
- Search results header (result count)
- Results list view (card layout)
- Results map view (markers)
- View toggle (List/Map)
- Result cards with thumbnails
- Rating and distance display
- "Load More" button or infinite scroll

**Emotions:**
- **Satisfaction:** Finding relevant results
- **Interest:** Exploring result options
- **Frustration:** If no results or irrelevant results

**Motivations:**
- Find specific cultural content
- Discover new content
- Compare options

**Pain Points:**
- No results found
- Irrelevant results
- Too many results to review
- Slow result loading

**Opportunities:**
- Accurate, relevant search results
- Helpful empty state messages
- Efficient result pagination
- Fast result loading

#### Stage 4: Content Selection

**Actions:**
- Selects Gem or Krawl from results
- Views detail page
- Reviews content quality
- Decides to visit, save, or share

**Touchpoints:**
- Gem detail page (`/gems/:id`)
- Krawl detail page (`/krawls/:id`)
- Content quality indicators
- Action buttons (Visit, Save, Share)

**Emotions:**
- **Interest:** Reviewing content
- **Decision:** Evaluating options
- **Satisfaction:** Finding quality content

**Motivations:**
- Select best content for needs
- Ensure content quality
- Plan cultural exploration

**Pain Points:**
- Low-quality content in results
- Incomplete information
- Unclear content quality

**Opportunities:**
- Quality content ranking
- Comprehensive content information
- Clear quality indicators

---

### Journey 5: Community Engagement and Contribution

**Persona:** The Community Contributor (Jose)  
**Goal:** Engage with community through vouching, rating, and commenting  
**Duration:** 10-30 minutes  
**Device:** Mobile smartphone or desktop

#### Stage 1: Content Discovery

**Actions:**
- Browses map or search results
- Finds Gem or Krawl to engage with
- Views detail page
- Reviews content quality and authenticity

**Touchpoints:**
- Map view (`/map`)
- Search results (`/search`)
- Gem detail page (`/gems/:id`)
- Krawl detail page (`/krawls/:id`)

**Emotions:**
- **Interest:** Finding content to engage with
- **Evaluation:** Assessing quality

**Motivations:**
- Support authentic content
- Maintain platform quality
- Build community reputation

**Pain Points:**
- Difficulty finding content to engage with
- Unclear content quality

**Opportunities:**
- Easy content discovery
- Clear quality indicators

#### Stage 2: Vouching

**Actions:**
- Reviews Gem or Krawl content
- Determines content is authentic and high-quality
- Clicks "Vouch" button
- Sees confirmation: "You vouched for this Gem/Krawl"
- Vouch count increases
- Name appears in vouchers list

**Touchpoints:**
- "Vouch" button on detail page
- Vouch confirmation message
- Vouch count display
- Vouchers list

**Emotions:**
- **Satisfaction:** Supporting authentic content
- **Pride:** Contributing to quality control

**Motivations:**
- Support authentic cultural content
- Help others discover quality content
- Build reputation as trusted contributor

**Pain Points:**
- Unclear vouching process
- Uncertainty about when to vouch

**Opportunities:**
- Clear vouching guidelines
- Helpful vouching examples
- Recognition for vouching activity

#### Stage 3: Rating

**Actions:**
- Reviews Gem or Krawl experience
- Clicks "Rate" button
- Selects rating (1-5 stars)
- Sees rating confirmation
- Average rating updates
- Rating breakdown updates

**Touchpoints:**
- "Rate" button on detail page
- Rating interface (1-5 stars)
- Rating confirmation message
- Average rating display
- Rating breakdown (distribution)

**Emotions:**
- **Satisfaction:** Providing feedback
- **Engagement:** Contributing to community

**Motivations:**
- Share experience with others
- Help others evaluate content
- Provide constructive feedback

**Pain Points:**
- Unclear rating criteria
- Difficulty deciding rating

**Opportunities:**
- Clear rating guidelines
- Helpful rating examples
- Rating update capability

#### Stage 4: Commenting

**Actions:**
- Clicks "Add Comment" button
- Writes comment in textarea
- Submits comment
- Sees comment appear in comments section
- Views own comment with edit/delete options

**Touchpoints:**
- "Add Comment" button
- Comment textarea
- Comment submission button
- Comments section
- Edit/delete comment options

**Emotions:**
- **Engagement:** Participating in community
- **Satisfaction:** Sharing thoughts

**Motivations:**
- Share detailed feedback
- Ask questions
- Connect with other users

**Pain Points:**
- Unclear commenting guidelines
- Difficulty writing helpful comments

**Opportunities:**
- Clear commenting guidelines
- Helpful comment examples
- Easy comment editing

---

## Secondary User Journeys

### Journey 6: Pre-Travel Planning (Traveler)

**Persona:** The Domestic Traveler (Carlos) or The International Visitor (Sarah)  
**Goal:** Plan cultural exploration before visiting Cebu City  
**Duration:** 30-60 minutes  
**Device:** Desktop or mobile (pre-travel)

#### Stage 1: Pre-Travel Research

**Actions:**
- Discovers Krawl while researching Cebu City
- Visits landing page
- Signs in with Google (quick, familiar)
- Explores map view (centered on Cebu City)
- Searches for cultural Krawls
- Reviews Krawl descriptions and difficulty

**Touchpoints:**
- Landing page (`/`)
- Sign-in page (`/auth/signin`)
- Map view (`/map`)
- Search page (`/search`)
- Krawl detail pages (`/krawls/:id`)

**Emotions:**
- **Excitement:** Planning cultural exploration
- **Anticipation:** Looking forward to visit

**Motivations:**
- Plan efficient cultural exploration
- Discover authentic experiences
- Prepare for travel

**Pain Points:**
- Unclear Krawl difficulty or duration
- Difficulty planning routes

**Opportunities:**
- Clear Krawl descriptions
- Accurate duration and difficulty
- Route visualization

#### Stage 2: Krawl Selection & Download

**Actions:**
- Selects Krawls to follow during visit
- Clicks "Download for Offline" for each Krawl
- Sees download progress
- Receives download confirmations
- Reviews downloaded Krawls list

**Touchpoints:**
- "Download for Offline" button
- Download progress indicators
- Success confirmations
- Offline downloads page (`/offline`)

**Emotions:**
- **Preparation:** Ensuring offline access
- **Confidence:** Ready for travel

**Motivations:**
- Ensure access during travel
- Save mobile data
- Prepare for exploration

**Pain Points:**
- Slow downloads
- Storage limitations

**Opportunities:**
- Fast, efficient downloads
- Storage management

#### Stage 3: Travel & Exploration

**Actions:**
- Arrives in Cebu City
- Opens Krawl app
- Starts downloaded Krawl in Krawl Mode
- Follows trail with location-aware guidance
- Explores cultural locations
- Completes Krawls

**Touchpoints:**
- Krawl Mode (`/krawls/:id/mode`)
- Offline functionality
- Location tracking

**Emotions:**
- **Excitement:** Exploring new city
- **Satisfaction:** Following planned trails

**Motivations:**
- Experience authentic culture
- Follow planned exploration
- Discover cultural locations

**Pain Points:**
- Offline functionality issues
- GPS accuracy problems

**Opportunities:**
- Reliable offline functionality
- Accurate GPS tracking

---

### Journey 7: Profile Management

**Persona:** Any Authenticated User  
**Goal:** Manage profile information and settings  
**Duration:** 5-15 minutes  
**Device:** Mobile smartphone or desktop

#### Stage 1: Profile Access

**Actions:**
- Clicks profile icon in navigation
- Views user profile page
- Sees profile information:
  - Avatar and display name
  - Bio/description
  - Statistics (Gems created, Krawls created, vouches given, Krawls completed)
  - Created Gems list
  - Created Krawls list
  - Vouched Gems list
  - Completed Krawls list

**Touchpoints:**
- Profile icon in navigation
- User profile page (`/users/:id`)
- Profile information display
- Statistics display
- Content lists

**Emotions:**
- **Satisfaction:** Viewing contributions
- **Pride:** Seeing statistics

**Motivations:**
- Review contributions
- Track activity
- Manage profile

**Pain Points:**
- Incomplete profile information
- Unclear statistics

**Opportunities:**
- Comprehensive profile display
- Clear statistics

#### Stage 2: Profile Editing

**Actions:**
- Clicks "Edit Profile" button
- Navigates to profile settings page
- Updates display name
- Edits bio/description
- Uploads new avatar photo
- Saves changes
- Sees updated profile

**Touchpoints:**
- "Edit Profile" button
- Profile settings page (`/users/settings`)
- Edit profile form
- Avatar upload interface
- Save button
- Success confirmation

**Emotions:**
- **Control:** Managing profile
- **Satisfaction:** Updating information

**Motivations:**
- Keep profile current
- Personalize profile
- Build reputation

**Pain Points:**
- Slow avatar upload
- Unclear edit process

**Opportunities:**
- Fast, reliable avatar upload
- Clear edit interface

#### Stage 3: Settings Management

**Actions:**
- Views notification preferences
- Updates email notification settings
- Updates push notification settings
- Manages privacy settings
- Updates app preferences (map style, units)
- Saves settings

**Touchpoints:**
- Settings sections
- Toggle switches
- Dropdown menus
- Save button

**Emotions:**
- **Control:** Managing preferences
- **Satisfaction:** Customizing experience

**Motivations:**
- Control notifications
- Customize app experience
- Manage privacy

**Pain Points:**
- Unclear settings options
- Settings not saving

**Opportunities:**
- Clear settings descriptions
- Reliable settings persistence

---

## Touchpoint Analysis

### Critical Touchpoints

#### 1. Landing Page Entry Point
- **Purpose:** First impression and value proposition
- **Key Elements:** Hero section, featured content, CTAs
- **Success Metrics:** Bounce rate, time on page, conversion to map view

#### 2. Authentication Flow
- **Purpose:** User onboarding and account creation
- **Key Elements:** Google OAuth, sign-in page, callback handler
- **Success Metrics:** Authentication completion rate, time to authenticate

#### 3. Map View Interface
- **Purpose:** Primary content discovery interface
- **Key Elements:** Interactive map, markers, search, filters
- **Success Metrics:** Map interaction rate, marker click-through rate

#### 4. Content Creation Flow
- **Purpose:** Enable user contributions
- **Key Elements:** Multi-step form, location selection, media upload
- **Success Metrics:** Creation completion rate, draft save rate

#### 5. Krawl Mode Interface
- **Purpose:** Location-aware guided experience
- **Key Elements:** Full-screen map, directions, progress tracking
- **Success Metrics:** Krawl completion rate, time in Krawl Mode

### Touchpoint Optimization Opportunities

1. **Reduce Friction:** Minimize steps in authentication and content creation
2. **Improve Feedback:** Clear loading states, success messages, error handling
3. **Enhance Guidance:** Helpful tooltips, tutorials, examples
4. **Mobile Optimization:** Touch-friendly interfaces, gesture support
5. **Offline Support:** Graceful degradation, offline functionality

---

## Pain Point Summary

### Common Pain Points Across Journeys

1. **Connectivity Issues**
   - Slow loading on poor connectivity
   - Offline functionality gaps
   - **Solution:** Offline-first architecture, progressive loading

2. **Unclear Navigation**
   - Difficulty finding features
   - Unclear user flows
   - **Solution:** Clear navigation, helpful tooltips, tutorials

3. **Content Quality Uncertainty**
   - Unclear content authenticity
   - Low vouching/rating counts
   - **Solution:** Strong community verification, clear quality indicators

4. **Location Accuracy**
   - GPS inaccuracy
   - Unclear boundary restrictions
   - **Solution:** Accurate GPS, clear boundary visualization

5. **Authentication Friction**
   - Privacy concerns
   - Unclear benefits
   - **Solution:** Transparent privacy policy, clear benefits communication

### Persona-Specific Pain Points

#### Cultural Explorer (Maria)
- Finding authentic experiences
- Connectivity in cultural locations
- Time constraints

#### Community Contributor (Jose)
- Time investment in content creation
- Quality control concerns
- Technical barriers

#### Student Researcher (Ana)
- Budget constraints
- Academic requirements
- Offline research needs

#### Travelers (Carlos, Sarah)
- Limited time during visits
- Finding authenticity
- Navigation in unfamiliar city

---

## Opportunities for Improvement

### Short-Term Opportunities (MVP)

1. **Enhanced Onboarding**
   - Interactive tutorial with examples
   - Progressive permission requests
   - Clear value proposition

2. **Improved Search**
   - Better autocomplete suggestions
   - Smarter filtering
   - Faster result loading

3. **Content Quality Indicators**
   - Clear vouching/rating displays
   - Quality badges
   - Community verification

4. **Offline Functionality**
   - Reliable offline downloads
   - Offline map tiles
   - Background sync

### Long-Term Opportunities (Post-MVP)

1. **Personalization**
   - Personalized recommendations
   - Custom Krawl suggestions
   - User preference learning

2. **Social Features**
   - User following/followers
   - Social sharing enhancements
   - Community groups

3. **Advanced Features**
   - AR integration
   - Voice-guided navigation
   - Group Krawl Mode

4. **Business Features**
   - "Claim Your Gem" expansion
   - Business dashboard
   - Premium features

---

## References

### Related Documents

- [USER_PERSONA_PROFILES.md](./USER_PERSONA_PROFILES.md) - Detailed user persona profiles
- [FEATURE_LIST_AND_USER_STORIES.md](./FEATURE_LIST_AND_USER_STORIES.md) - Comprehensive feature list with user stories
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications
- [SITEMAP.md](./SITEMAP.md) - Navigation structure and routing
- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - UI/UX design system
- [WIREFRAMES.md](./WIREFRAMES.md) - Low-fidelity wireframes

### External Resources

- **User Journey Mapping Tools:**
  - FigJam by Figma - Free user journey map templates
  - Miro - Free journey mapping with collaboration
  - UXPressia - Online customer journey mapping tool (free tier: 3 journey maps)

- **Design Resources:**
  - Material Design - Design system guidelines
  - Human Interface Guidelines - iOS design guidelines
  - Web Content Accessibility Guidelines (WCAG) - Accessibility standards

---

## Appendices

### Appendix A: Journey Map Visualization Tools

**Recommended Free Tools for Creating Visual Journey Maps:**

1. **Figma (Free Tier)**
   - Up to 3 projects, 2 editors
   - Journey map templates available
   - Collaborative design
   - **Status:** Actively maintained (verified November 14, 2025)

2. **Miro (Free Tier)**
   - 3 boards, unlimited team members
   - Journey map templates
   - Real-time collaboration
   - **Status:** Actively maintained (verified November 14, 2025)

3. **Draw.io (Free, Open Source)**
   - Browser-based diagramming
   - Journey map templates
   - No account required
   - **Status:** Actively maintained (verified November 14, 2025)

4. **UXPressia (Free Tier)**
   - 1 project with up to 3 personas and 3 journey maps
   - Online tool
   - Customizable templates
   - **Status:** Actively maintained (verified November 14, 2025)

### Appendix B: Journey Map Metrics

**Key Metrics to Track for Each Journey:**

1. **Completion Rate:** Percentage of users completing journey
2. **Time to Complete:** Average time to complete journey
3. **Drop-off Points:** Stages where users abandon journey
4. **Error Rate:** Frequency of errors or issues
5. **Satisfaction Score:** User satisfaction with journey

### Appendix C: Journey Map Validation Checklist

**Before Finalizing Journey Maps, Verify:**

- [ ] Journeys are based on real user research or validated assumptions
- [ ] All stages are clearly defined with specific actions
- [ ] Touchpoints are accurately identified
- [ ] Pain points are realistic and addressable
- [ ] Opportunities are actionable and prioritized
- [ ] Journeys align with user persona goals
- [ ] Technology constraints are considered
- [ ] Free-tier service limitations are accounted for

### Appendix D: Journey Map Update Schedule

**When to Update Journey Maps:**

- **After User Research:** Update based on real user data
- **After Launch:** Refine based on actual user behavior
- **Quarterly Reviews:** Review and update quarterly
- **Major Feature Releases:** Update when major features are added
- **User Feedback:** Update based on user feedback and complaints

---

## Document Metadata

**Document Type:** User Research / User Journey Map  
**Target Audience:** Development Team, Design Team, Product Managers, UX Researchers  
**Related Documents:**
- USER_PERSONA_PROFILES.md
- SCOPE_OF_WORK.md
- SITEMAP.md
- UI_UX_DESIGN_SYSTEM.md
- WIREFRAMES.md

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Journey Validation:** These journey maps are based on project assumptions and user persona profiles. They should be validated through user research and updated based on real user data after launch.

2. **Free Tools Focus:** All recommended tools and services have been verified as free or offering generous free tiers suitable for student projects, as of November 14, 2025.

3. **Social Login Only:** All journeys assume Google OAuth 2.0 authentication. No traditional email/password authentication is included.

4. **Mobile-First:** All journeys are designed with mobile-first approach, though desktop support is included where applicable.

5. **Cebu City Focus:** All journeys are restricted to Cebu City boundaries. Geographic restrictions are enforced throughout.

6. **Current as of 2025-11-14:** This document reflects the current state of user journeys as of November 14, 2025. Journey maps should be updated based on user research and actual user behavior.

7. **Agile Principles:** Journey maps should remain adaptable and responsive to user feedback, embracing agile principles in journey refinement.

8. **Technology Verification:** All recommended tools have been verified as current and well-maintained as of November 14, 2025. Tools should be re-verified periodically to ensure they remain current.

---

*This document provides comprehensive user journey maps to guide all design and development decisions for Krawl. Journey maps should be referenced throughout the design and development process to ensure the platform provides intuitive navigation and seamless user experiences.*
