# Content Inventory and Content Plan: Krawl
## *The Living Map of Filipino Culture*

## Summary / Overview

This document provides a comprehensive content inventory and content plan for the Krawl Progressive Web App. It lists all required content types—including text, images, and videos—organized by each page in the application. This plan ensures a complete overview of content needs to facilitate effective development and design, while maintaining alignment with Krawl's brand values of authenticity, community-driven content, and cultural preservation.

**Purpose:** To establish a clear, comprehensive content strategy that guides content creation, organization, and management across all pages of the Krawl PWA, ensuring consistency, quality, and cultural respect.

**Current Date:** November 14, 2025

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial comprehensive content inventory and plan |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Content Strategy Overview](#content-strategy-overview)
5. [Content Inventory by Page](#content-inventory-by-page)
   - [Public Pages](#public-pages)
   - [Content Detail Pages](#content-detail-pages)
   - [Creation Pages](#creation-pages)
   - [Interactive Experience Pages](#interactive-experience-pages)
   - [User Management Pages](#user-management-pages)
   - [Authentication Pages](#authentication-pages)
   - [Onboarding Flow](#onboarding-flow)
6. [Content Types and Specifications](#content-types-and-specifications)
7. [Content Creation Guidelines](#content-creation-guidelines)
8. [Recommended Tools and Services](#recommended-tools-and-services)
9. [Content Management Workflow](#content-management-workflow)
10. [Scalability and Maintainability](#scalability-and-maintainability)
11. [References](#references)
12. [Appendices](#appendices)

---

## Content Strategy Overview

### Content Principles

1. **Authenticity First:** All content must represent genuine Filipino cultural experiences, avoiding commercial or tourist-trap language
2. **Community-Driven:** Content is created and verified by community members, not corporate entities
3. **Cultural Respect:** All content must honor Filipino culture and traditions appropriately
4. **Accessibility:** Content must be accessible to all users, including those with disabilities
5. **Consistency:** Content should maintain consistent tone, style, and quality across all pages
6. **Scalability:** Content structure should support future growth and expansion

### Content Tone of Voice

All content should follow Krawl's brand tone of voice (see [BRAND_BRIEF.md](./BRAND_BRIEF.md#tone-of-voice)):
- **Authentic & Genuine:** Real, honest language—no marketing fluff
- **Welcoming & Inclusive:** Warm, friendly, and approachable
- **Culturally Respectful:** Honors Filipino culture and traditions
- **Clear & Accessible:** Simple, straightforward language
- **Engaging & Inspiring:** Encourages exploration and discovery

---

## Content Inventory by Page

### Public Pages

#### 1. Landing Page / Home Page
**Route:** `/`  
**Access:** Public

##### Text Content
- **Hero Section:**
  - Main headline: "The Living Map of Filipino Culture" (tagline)
  - Subheadline: Brief value proposition (2-3 sentences)
  - Primary CTA: "Explore Cebu City" or "Start Discovering"
  - Secondary CTA: "Sign In to Create"
  
- **Featured Krawls Section:**
  - Section heading: "Featured Krawls"
  - Krawl cards with:
    - Krawl name
    - Brief description (50-100 characters)
    - Estimated duration
    - Difficulty level
    - Gem count
  
- **Popular Gems Section:**
  - Section heading: "Popular Gems"
  - Gem cards with:
    - Gem name
    - Category
    - Brief description (30-50 characters)
    - Location (district/area)
    - Vouch count
  
- **Statistics Display:**
  - Total Gems count
  - Total Krawls count
  - Community members count
  - Cultural locations mapped
  
- **Value Proposition Section:**
  - Heading: "Why Krawl?"
  - 3-4 key benefits with brief descriptions:
    - Community-driven discovery
    - Offline-first exploration
    - Cultural preservation
    - Authentic experiences
  
- **Footer:**
  - Copyright notice
  - Links to Terms of Service, Privacy Policy
  - Social media links (if applicable)

##### Images
- **Hero Image:**
  - Authentic photo of Cebu City cultural location
  - Aspect ratio: 16:9 or 21:9
  - Format: WebP (preferred) or JPEG
  - Size: Optimized for web (<200KB)
  - Alt text: Descriptive of cultural location shown
  
- **Krawl Cover Images:**
  - Featured Krawl cover images (3-6 images)
  - Aspect ratio: 16:9
  - Format: WebP or JPEG
  - Size: Optimized thumbnails
  
- **Gem Thumbnails:**
  - Popular Gem primary photos (6-12 images)
  - Aspect ratio: 1:1 or 4:3
  - Format: WebP or JPEG
  - Size: Optimized thumbnails
  
- **Logo:**
  - Krawl full-color logo
  - Format: SVG (preferred) or PNG
  - Multiple sizes for responsive design
  
- **Icons:**
  - Feature icons (community, offline, preservation, authenticity)
  - Format: SVG
  - Style: Consistent with brand iconography

##### Videos
- **Optional Hero Video:**
  - Short introduction video (30-60 seconds)
  - Showcase Krawl Mode in action
  - Format: MP4 (WebM fallback)
  - Size: Optimized for web
  - Autoplay: Muted, with controls
  - Captions: Required for accessibility

---

#### 2. Map View Page
**Route:** `/map`  
**Access:** Public (some features require authentication)

##### Text Content
- **Page Title:** "Explore Cebu City"
- **Search Bar Placeholder:** "Search Gems and Krawls..."
- **Filter Labels:**
  - Category filter options
  - Content type (Gems/Krawls)
  - Difficulty level (for Krawls)
  - Distance/radius selector
  
- **Map Controls:**
  - Zoom in/out labels
  - My location button label
  - Map style toggle (if applicable)
  
- **Info Panel (when marker selected):**
  - Gem/Krawl name
  - Category
  - Brief description (30-50 characters)
  - Distance (if location enabled)
  - Quick action buttons (View Details, Directions)
  
- **Create Gem FAB (authenticated users):**
  - Tooltip: "Create a Gem"
  - Button label: "Create Gem"
  
- **Empty State:**
  - Message: "No Gems found in this area"
  - Suggestion: "Try adjusting your filters or zoom out"
  
- **Loading States:**
  - "Loading map..."
  - "Loading Gems..."
  - "Calculating route..."

##### Images
- **Map Markers:**
  - Gem marker icon (custom SVG)
  - Krawl marker icon (custom SVG)
  - Clustered marker icon
  - Selected marker state
  
- **Map Controls:**
  - Zoom in/out icons
  - My location icon
  - Map style icon
  
- **Category Icons:**
  - Icons for each Gem category
  - Format: SVG
  - Consistent style with brand

##### Videos
- **None Required** (map is interactive, no video content needed)

---

#### 3. Search & Discovery Page
**Route:** `/search`  
**Access:** Public

##### Text Content
- **Page Title:** "Search & Discover"
- **Search Bar:**
  - Placeholder: "Search Gems, Krawls, or categories..."
  - Autocomplete suggestions
  - Recent searches (if applicable)
  
- **Quick Filters:**
  - Filter labels: "All", "Gems", "Krawls"
  - Category quick filters
  - "Clear filters" link
  
- **Advanced Filters:**
  - Section heading: "Advanced Filters"
  - Filter labels:
    - Category dropdown
    - Rating filter
    - Distance filter
    - Sort options
    - Difficulty level (for Krawls)
  
- **Search Results:**
  - Results count: "X results found"
  - Empty state: "No results found. Try different keywords or filters."
  - Result cards:
    - Name
    - Category
    - Description (30-50 characters)
    - Metadata (distance, rating, vouch count)
  
- **View Toggle:**
  - "List View" / "Map View" toggle labels

##### Images
- **Search Icon:**
  - Search icon (SVG)
  - Clear search icon (SVG)
  
- **Filter Icons:**
  - Filter icon
  - Category icons
  - Sort icon
  
- **Result Thumbnails:**
  - Gem/Krawl primary photos
  - Aspect ratio: 1:1 or 4:3
  - Format: WebP or JPEG
  - Size: Optimized thumbnails
  
- **Empty State Illustration:**
  - Illustration for "no results" state
  - Format: SVG or optimized image

##### Videos
- **None Required**

---

### Content Detail Pages

#### 4. Gem Detail Page
**Route:** `/gems/:id`  
**Access:** Public

##### Text Content
- **Gem Header:**
  - Gem name (H1)
  - Category badge
  - Location (district/area, coordinates)
  
- **Photo Gallery:**
  - Image count indicator: "1 of 5"
  - Alt text for each image
  
- **Description Section:**
  - Heading: "About This Gem"
  - Full description (50-500 characters)
  - Cultural significance notes (if applicable)
  
- **Creator Information:**
  - Heading: "Created by"
  - Creator name (link to profile)
  - Creation date
  - "View Profile" link
  
- **Vouching Section:**
  - Heading: "Vouched by"
  - Vouch count
  - Voucher list (first 5-10, "View all" link)
  - "Vouch for this Gem" button (authenticated users)
  
- **Rating Section:**
  - Average rating display
  - Rating breakdown
  - "Rate this Gem" button (authenticated users)
  
- **Comments/Reviews Section:**
  - Heading: "Comments"
  - Comment count
  - Comment form (authenticated users):
    - Placeholder: "Share your experience..."
    - Submit button: "Post Comment"
  - Comment list with:
    - Author name
    - Comment text
    - Timestamp
    - Reply option (if applicable)
  
- **Related Krawls:**
  - Heading: "Krawls featuring this Gem"
  - Krawl cards with:
    - Krawl name
    - Brief description
    - Gem count
    - Duration
  
- **Actions:**
  - "Show on Map" button
  - "Get Directions" button
  - "Share" button
  - "Report" link (authenticated users)

##### Images
- **Photo Gallery:**
  - Primary photo (hero image)
  - Additional photos (up to 5 total)
  - Aspect ratio: 16:9 or 4:3
  - Format: WebP or JPEG
  - Size: Optimized for web
  - Alt text: Descriptive of Gem location/feature
  
- **Creator Avatar:**
  - User profile picture
  - Format: WebP or JPEG
  - Size: 64x64px thumbnail
  - Default avatar if none
  
- **Category Icon:**
  - Category-specific icon
  - Format: SVG
  
- **Action Icons:**
  - Map icon
  - Directions icon
  - Share icon
  - Report icon

##### Videos
- **Optional Gem Video:**
  - User-submitted video of Gem (if applicable)
  - Format: MP4 (WebM fallback)
  - Size: Optimized
  - Captions: Required if audio

---

#### 5. Krawl Detail Page
**Route:** `/krawls/:id`  
**Access:** Public

##### Text Content
- **Krawl Header:**
  - Krawl name (H1)
  - Category/theme badge
  - Difficulty level badge
  - Estimated duration
  - Total distance
  
- **Description Section:**
  - Heading: "About This Krawl"
  - Full description (50-500 characters)
  - Cultural theme explanation
  
- **Trail Visualization:**
  - Heading: "Trail Map"
  - Map showing route
  - Gem markers along route
  
- **Gems in Sequence:**
  - Heading: "Gems in This Krawl"
  - Ordered list of Gems:
    - Gem number/order
    - Gem name
    - Brief description (30-50 characters)
    - Distance from previous Gem
    - "View Gem" link
  
- **Creator Information:**
  - Heading: "Created by"
  - Creator name (link to profile)
  - Creation date
  - "View Profile" link
  
- **Vouching Section:**
  - Heading: "Vouched by"
  - Vouch count
  - Voucher list
  - "Vouch for this Krawl" button (authenticated users)
  
- **Rating Section:**
  - Average rating display
  - Rating breakdown
  - "Rate this Krawl" button (authenticated users)
  
- **Reviews Section:**
  - Heading: "Reviews"
  - Review count
  - Review form (authenticated users)
  - Review list
  
- **Photos from Gems:**
  - Heading: "Photos from This Krawl"
  - Photo gallery from all Gems in Krawl
  
- **Actions:**
  - "Start Krawl Mode" button (primary CTA)
  - "Download for Offline" button (authenticated users)
  - "Share" button
  - "Show on Map" button
  - "Report" link (authenticated users)

##### Images
- **Cover Image:**
  - Krawl cover/hero image
  - Aspect ratio: 16:9
  - Format: WebP or JPEG
  - Size: Optimized
  
- **Trail Map:**
  - Map visualization showing route
  - Gem markers
  - Route line
  
- **Gem Thumbnails:**
  - Thumbnail for each Gem in sequence
  - Aspect ratio: 1:1 or 4:3
  - Format: WebP or JPEG
  
- **Photo Gallery:**
  - Photos from all Gems in Krawl
  - Format: WebP or JPEG
  - Size: Optimized thumbnails
  
- **Creator Avatar:**
  - User profile picture
  - Format: WebP or JPEG
  
- **Action Icons:**
  - Start Krawl Mode icon
  - Download icon
  - Share icon
  - Map icon

##### Videos
- **Optional Krawl Video:**
  - User-submitted video of Krawl experience (if applicable)
  - Format: MP4 (WebM fallback)
  - Captions: Required if audio

---

### Creation Pages

#### 6. Gem Creation Page
**Route:** `/gems/create`  
**Access:** Authenticated users only

##### Text Content
- **Page Title:** "Create a Gem"
- **Multi-Step Form:**
  
  **Step 1: Location**
  - Heading: "Where is this Gem?"
  - Instructions: "Pin the location on the map. Make sure it's within Cebu City."
  - Map interface with draggable pin
  - Location validation message
  - Address input (auto-filled from coordinates)
  - "Next" button
  
  **Step 2: Basic Info**
  - Heading: "Tell us about this Gem"
  - Form fields:
    - Name (required, max 100 characters)
    - Category (dropdown, required)
    - Description (required, 50-500 characters)
    - Cultural significance notes (optional, max 300 characters)
    - Tags (optional, up to 5 tags)
  - Character counters
  - "Back" and "Next" buttons
  
  **Step 3: Media**
  - Heading: "Add Photos"
  - Instructions: "Upload 1-5 photos of this Gem"
  - Photo upload interface
  - Photo previews
  - Delete photo option
  - Photo requirements text
  - "Back" and "Next" buttons
  
  **Step 4: Additional Details**
  - Heading: "Additional Information"
  - Optional fields:
    - Best time to visit
    - Accessibility notes
    - Additional tips
  - "Back" and "Submit" buttons
  
- **Draft Saving:**
  - "Save as Draft" button
  - Draft saved message
  
- **Preview Mode:**
  - "Preview" button
  - Preview modal with Gem preview
  
- **Validation Messages:**
  - Required field errors
  - Character limit errors
  - Location boundary errors
  - Photo upload errors
  
- **Success Message:**
  - "Gem created successfully!"
  - "View your Gem" link

##### Images
- **Map Interface:**
  - Map with draggable pin
  - Location marker
  
- **Photo Upload Interface:**
  - Upload area/button
  - Photo preview thumbnails
  - Delete icon
  
- **Category Icons:**
  - Icons for category selection
  - Format: SVG

##### Videos
- **Optional Tutorial Video:**
  - How to create a Gem tutorial
  - Format: MP4
  - Captions: Required

---

#### 7. Krawl Creation Page
**Route:** `/krawls/create`  
**Access:** Authenticated users only

##### Text Content
- **Page Title:** "Create a Krawl"
- **Form Sections:**
  
  **Basic Information:**
  - Name (required, max 100 characters)
  - Description (required, 50-500 characters)
  - Category/theme (dropdown)
  - Difficulty level (dropdown: Easy, Moderate, Hard)
  - Cover image upload
  
  **Gem Selection:**
  - Heading: "Select Gems for Your Krawl"
  - Instructions: "Choose at least 2 Gems to create a Krawl"
  - Search/select Gems interface
  - Selected Gems list
  - Minimum 2 Gems validation
  
  **Reorder Gems:**
  - Heading: "Arrange Your Krawl"
  - Instructions: "Drag and drop to reorder Gems"
  - Drag-and-drop interface
  - Gem order numbers
  
  **Route Visualization:**
  - Heading: "Route Preview"
  - Map showing route
  - Route optimization suggestion (if applicable)
  - Estimated duration (auto-calculated)
  - Total distance (auto-calculated)
  
  **Additional Details:**
  - Best time to start
  - Tips and recommendations
  - Safety notes (optional)
  
- **Draft Saving:**
  - "Save as Draft" button
  
- **Preview Mode:**
  - "Preview" button
  
- **Validation Messages:**
  - Required field errors
  - Minimum Gem count error
  - Route validation errors
  
- **Success Message:**
  - "Krawl created successfully!"
  - "View your Krawl" link

##### Images
- **Cover Image Upload:**
  - Upload interface
  - Preview thumbnail
  
- **Gem Selection Interface:**
  - Gem cards with thumbnails
  - Selected state indicator
  
- **Route Map:**
  - Map visualization
  - Route line
  - Gem markers
  
- **Icons:**
  - Drag handle icon
  - Delete icon
  - Add icon

##### Videos
- **Optional Tutorial Video:**
  - How to create a Krawl tutorial
  - Format: MP4
  - Captions: Required

---

### Interactive Experience Pages

#### 8. Krawl Mode Page
**Route:** `/krawls/:id/mode`  
**Access:** Public (requires location permission)

##### Text Content
- **Pre-Start Checklist:**
  - Heading: "Ready to Start?"
  - Checklist items:
    - Location permission granted
    - Krawl downloaded (if offline)
    - Battery level adequate
    - Comfortable walking shoes
  - "Start Krawl" button
  - "Cancel" button
  
- **Full-Screen Map View:**
  - Current location indicator
  - Next Gem marker
  - Route line
  - Progress indicator
  
- **Next Gem Indicator:**
  - Heading: "Next: [Gem Name]"
  - Distance to next Gem
  - Estimated time to arrival
  - "View Gem Details" link
  
- **Turn-by-Turn Directions:**
  - Current instruction
  - Next instruction preview
  - Distance to next turn
  
- **Progress Tracking:**
  - Progress bar
  - "X of Y Gems completed"
  - Completion percentage
  
- **Arrival Detection:**
  - "You've arrived!" message
  - Gem name
  - "View Gem Details" button
  - "Continue to Next Gem" button
  
- **Completion Celebration:**
  - "Congratulations!" heading
  - "You've completed [Krawl Name]!"
  - Completion stats:
    - Total distance
    - Total time
    - Gems visited
  - "Rate this Krawl" button
  - "Share Your Experience" button
  - "Explore More Krawls" button
  
- **Exit Confirmation:**
  - "Exit Krawl Mode?" message
  - "Your progress will be saved"
  - "Exit" and "Continue" buttons

##### Images
- **Map Interface:**
  - Full-screen map
  - Current location marker
  - Next Gem marker
  - Route line
  - Completed Gem markers
  
- **Progress Icons:**
  - Gem completion checkmark
  - Progress indicator icon
  
- **Celebration Graphics:**
  - Completion celebration illustration
  - Format: SVG or optimized image

##### Videos
- **None Required** (real-time location-based experience)

---

### User Management Pages

#### 9. User Profile Page
**Route:** `/users/:id`  
**Access:** Public (viewing), Authenticated (own profile editing)

##### Text Content
- **Profile Header:**
  - User display name
  - Bio/description (optional)
  - Join date
  - "Edit Profile" button (own profile only)
  
- **Statistics Section:**
  - Heading: "Contributions"
  - Stats:
    - Gems created count
    - Krawls created count
    - Vouches given count
    - Krawls completed count
  
- **Created Gems Section:**
  - Heading: "Gems Created"
  - Gem cards grid
  - "View All" link (if more than displayed)
  - Empty state: "No Gems created yet"
  
- **Created Krawls Section:**
  - Heading: "Krawls Created"
  - Krawl cards grid
  - "View All" link
  - Empty state: "No Krawls created yet"
  
- **Vouched Gems Section:**
  - Heading: "Vouched Gems"
  - Gem cards grid
  - Empty state: "No vouched Gems yet"
  
- **Completed Krawls Section:**
  - Heading: "Completed Krawls"
  - Krawl cards grid
  - Empty state: "No completed Krawls yet"
  
- **Activity Feed (Optional):**
  - Heading: "Recent Activity"
  - Activity items:
    - Created Gem
    - Created Krawl
    - Vouched Gem
    - Completed Krawl
    - Commented on Gem

##### Images
- **User Avatar:**
  - Profile picture
  - Format: WebP or JPEG
  - Size: 128x128px (large), 64x64px (thumbnail)
  - Default avatar if none
  
- **Gem Thumbnails:**
  - Primary photos from created Gems
  - Format: WebP or JPEG
  - Size: Optimized thumbnails
  
- **Krawl Cover Images:**
  - Cover images from created Krawls
  - Format: WebP or JPEG
  - Size: Optimized thumbnails
  
- **Icons:**
  - Edit icon
  - Stats icons
  - Activity icons

##### Videos
- **None Required**

---

#### 10. Profile Settings Page
**Route:** `/users/settings`  
**Access:** Authenticated users only

##### Text Content
- **Page Title:** "Profile Settings"
  
- **Edit Profile Section:**
  - Heading: "Profile Information"
  - Form fields:
    - Display name (required)
    - Bio/description (optional, max 500 characters)
    - Avatar upload
  - "Save Changes" button
  
- **Notification Preferences:**
  - Heading: "Notifications"
  - Toggle options:
    - Email notifications
    - Push notifications (if PWA supports)
    - New Gem notifications
    - New Krawl notifications
    - Comment notifications
  - "Save Preferences" button
  
- **Privacy Settings:**
  - Heading: "Privacy"
  - Options:
    - Profile visibility
    - Activity visibility
    - Email visibility
  - "Save Privacy Settings" button
  
- **Account Management:**
  - Heading: "Account"
  - Connected accounts:
    - Google account (connected)
    - "Disconnect" option
  - "Delete Account" button (with confirmation)
  
- **App Preferences:**
  - Heading: "Preferences"
  - Options:
    - Map style preference
    - Language preference
    - Distance units (metric/imperial)
    - Theme (light/dark, if applicable)
  - "Save Preferences" button
  
- **Success Messages:**
  - "Profile updated successfully"
  - "Settings saved"

##### Images
- **Avatar Upload:**
  - Current avatar preview
  - Upload interface
  - Crop tool (if applicable)
  
- **Icons:**
  - Settings category icons
  - Toggle switch graphics
  - Account icons

##### Videos
- **None Required**

---

#### 11. Offline Downloads Page
**Route:** `/offline`  
**Access:** Authenticated users only

##### Text Content
- **Page Title:** "Offline Downloads"
  
- **Storage Usage:**
  - Heading: "Storage"
  - Usage indicator: "X MB used of Y MB available"
  - Progress bar
  - "Clear Cache" button
  
- **Downloaded Krawls:**
  - Heading: "Downloaded Krawls"
  - Krawl list with:
    - Krawl name
    - Download date
    - File size
    - Last sync date/time
    - "Start Offline" button
    - "Delete Download" button
  - Empty state: "No downloaded Krawls yet"
  
- **Download New Krawl:**
  - "Download Krawl" button
  - Opens Krawl selection modal
  
- **Download Status:**
  - Download progress indicator
  - "Downloading..." message
  - "Download complete" message
  - Error messages (if download fails)
  
- **Sync Information:**
  - "Last synced: [date/time]"
  - "Sync Now" button (if applicable)

##### Images
- **Krawl Cover Images:**
  - Thumbnails for downloaded Krawls
  - Format: WebP or JPEG
  
- **Icons:**
  - Download icon
  - Delete icon
  - Sync icon
  - Storage icon
  - Offline indicator icon

##### Videos
- **None Required**

---

### Authentication Pages

#### 12. Sign In Page
**Route:** `/auth/signin`  
**Access:** Public

##### Text Content
- **Page Title:** "Sign In to Krawl"
  
- **Welcome Message:**
  - Heading: "Welcome to Krawl"
  - Subheading: "The Living Map of Filipino Culture"
  - Brief value proposition (1-2 sentences)
  
- **Social Login:**
  - "Sign in with Google" button (primary)
  - Additional providers (if added):
    - "Sign in with GitHub" (optional)
    - "Sign in with Facebook" (optional)
  
- **Guest Option:**
  - "Continue as Guest" link
  - Guest limitations explained:
    - Can explore Gems and Krawls
    - Cannot create content
    - Cannot vouch or rate
    - "Sign in to unlock all features" message
  
- **Trust Indicators:**
  - "Secure authentication" note
  - "We never share your data" message
  
- **Legal Links:**
  - "By signing in, you agree to our"
  - Links to:
    - Terms of Service
    - Privacy Policy
  
- **Loading States:**
  - "Signing in..." message
  - "Redirecting..." message
  
- **Error Messages:**
  - Authentication error messages
  - "Try again" option

##### Images
- **Logo:**
  - Krawl logo (full-color)
  - Format: SVG or PNG
  - Size: Appropriate for page
  
- **Social Provider Icons:**
  - Google logo/icon
  - GitHub logo/icon (if applicable)
  - Facebook logo/icon (if applicable)
  - Format: SVG or PNG
  
- **Background Image (Optional):**
  - Subtle background image of Cebu City
  - Format: WebP or JPEG
  - Size: Optimized, low opacity overlay

##### Videos
- **None Required**

---

### Onboarding Flow

#### 13. Onboarding Flow
**Route:** `/onboarding`  
**Access:** First-time users (optional)

##### Text Content
- **Welcome Screen:**
  - Heading: "Welcome to Krawl!"
  - Subheading: "The Living Map of Filipino Culture"
  - Brief introduction (2-3 sentences)
  - "Get Started" button
  - "Skip" link
  
- **Step 1: What is Krawl?**
  - Heading: "Discover Authentic Filipino Culture"
  - Description: Brief explanation of Gems and Krawls
  - Visual: Illustration or screenshot
  - "Next" button
  
- **Step 2: Explore Gems**
  - Heading: "Find Cultural Gems"
  - Description: How to discover Gems on the map
  - Visual: Map screenshot
  - "Next" button
  
- **Step 3: Follow Krawls**
  - Heading: "Follow Cultural Trails"
  - Description: How to use Krawl Mode
  - Visual: Krawl Mode screenshot
  - "Next" button
  
- **Step 4: Create Content**
  - Heading: "Share Your Knowledge"
  - Description: How to create Gems and Krawls
  - Visual: Creation interface screenshot
  - "Get Started" button
  
- **Permission Requests:**
  - Location permission:
    - Heading: "Enable Location Services"
    - Explanation: Why location is needed
    - "Allow" and "Not Now" buttons
  - Notification permission (optional):
    - Heading: "Enable Notifications"
    - Explanation: What notifications you'll receive
    - "Allow" and "Not Now" buttons
  
- **Quick Start Options:**
  - "Explore as Guest" button
  - "Sign In to Create" button

##### Images
- **Illustrations:**
  - Welcome illustration
  - Gems illustration
  - Krawls illustration
  - Creation illustration
  - Format: SVG or optimized images
  
- **Screenshots:**
  - Map view screenshot
  - Krawl Mode screenshot
  - Creation interface screenshot
  - Format: WebP or JPEG
  - Size: Optimized
  
- **Icons:**
  - Step indicator icons
  - Permission icons
  - Format: SVG

##### Videos
- **Optional Onboarding Video:**
  - Short video tour of Krawl (60-90 seconds)
  - Format: MP4
  - Captions: Required
  - Autoplay: Optional, with controls

---

## Content Types and Specifications

### Text Content

#### Character Limits
- **Gem Name:** Maximum 100 characters
- **Gem Description:** 50-500 characters (required)
- **Krawl Name:** Maximum 100 characters
- **Krawl Description:** 50-500 characters (required)
- **User Bio:** Maximum 500 characters (optional)
- **Comment:** Maximum 1000 characters
- **Tags:** Maximum 5 tags per Gem, 20 characters per tag

#### Language Support
- **Primary Language:** English
- **Secondary Languages:** Tagalog, Cebuano (future support)
- **Character Encoding:** UTF-8
- **Special Characters:** Support for Filipino language characters (ñ, Ñ, etc.)

#### Content Guidelines
- Use clear, simple language
- Avoid jargon and technical terms
- Maintain consistent terminology (Gem, Krawl, vouch, etc.)
- Follow brand tone of voice
- Ensure cultural sensitivity
- Proofread for spelling and grammar

#### SEO Content Guidelines

When creating content for Gems and Krawls, consider the following SEO requirements:

- **Keyword Integration:** Naturally include relevant keywords in names and descriptions (e.g., "Cebu City", cultural terms, category keywords)
- **Meta Description Considerations:** Descriptions should be compelling and include primary keywords naturally (aim for 150-160 characters for optimal search result display)
- **Alt Text Requirements:** All images must have descriptive alt text that includes relevant keywords when appropriate (e.g., "Basilica del Santo Niño exterior view in Cebu City")
- **URL Structure:** Use SEO-friendly URLs with descriptive, keyword-rich slugs (e.g., `/gems/basilica-del-santo-nino` instead of `/gems/123`)
- **Natural Language:** Keywords should flow naturally—avoid keyword stuffing or forced keyword placement
- **Local SEO:** Include location-specific keywords (Cebu City, district names) where relevant
- **Brand Alignment:** All SEO optimization must align with brand tone of voice and maintain authenticity

For comprehensive SEO guidelines, keyword strategy, meta tag templates, and optimization recommendations, see [SEO_PLAN_AND_KEYWORD_STRATEGY.md](./SEO_PLAN_AND_KEYWORD_STRATEGY.md).

---

### Images

#### Technical Specifications

**Formats:**
- **Primary:** WebP (preferred for better compression)
- **Fallback:** JPEG (for compatibility)
- **Icons/Logos:** SVG (preferred) or PNG (for transparency)

**Sizes:**
- **Hero Images:** 1920x1080px (16:9), optimized to <200KB
- **Thumbnails:** 400x400px (1:1) or 600x450px (4:3), optimized to <50KB
- **Cover Images:** 1200x675px (16:9), optimized to <150KB
- **Avatars:** 128x128px (large), 64x64px (thumbnail), optimized to <20KB
- **Icons:** 24x24px to 48x48px (SVG preferred)

**Aspect Ratios:**
- **Hero:** 16:9 or 21:9
- **Cards:** 16:9 or 4:3
- **Thumbnails:** 1:1 or 4:3
- **Avatars:** 1:1 (square)

**Optimization:**
- Compress images before upload
- Use responsive images (srcset)
- Lazy load images below the fold
- Provide appropriate alt text for accessibility

#### Content Guidelines
- Use authentic, community-contributed images when possible
- Ensure images are culturally respectful
- Avoid stock photos or overly commercial imagery
- Show real people, real places, real cultural experiences
- Maintain consistent visual style
- Ensure proper permissions for image use

---

### Videos

#### Technical Specifications

**Formats:**
- **Primary:** MP4 (H.264 codec)
- **Fallback:** WebM (for better compression)
- **Container:** MP4 or WebM

**Sizes:**
- **Hero Videos:** 1920x1080px, optimized to <5MB for 30-60 seconds
- **Tutorial Videos:** 1280x720px, optimized to <10MB for 2-5 minutes
- **User-Submitted Videos:** Maximum 50MB, maximum 5 minutes

**Optimization:**
- Compress videos for web
- Provide multiple quality options (if applicable)
- Use lazy loading for videos
- Provide captions/subtitles for accessibility
- Include poster images for video players

#### Content Guidelines
- Keep videos concise and engaging
- Ensure videos are culturally respectful
- Provide captions for all videos with audio
- Use videos to enhance, not replace, text content
- Optimize for mobile viewing
- Ensure proper permissions for video use

---

## Content Creation Guidelines

### Content Quality Standards

1. **Authenticity:** Content must represent genuine Filipino cultural experiences
2. **Accuracy:** Information must be factually accurate and verified
3. **Completeness:** All required fields must be filled appropriately
4. **Cultural Sensitivity:** Content must respect Filipino culture and traditions
5. **Accessibility:** Content must be accessible to all users
6. **Consistency:** Content should maintain consistent tone and style

### Content Review Process

1. **Pre-Submission:** Creator reviews content using quality checklist
2. **Automated Validation:** System validates required fields and boundaries
3. **Manual Review:** Content reviewed for quality and cultural appropriateness
4. **Community Review:** Post-publication community vouching and rating
5. **Ongoing Monitoring:** Regular review of reported or flagged content

### Content Maintenance

- Regular updates to outdated information
- Flagging and removal of inappropriate content
- Community-driven quality control through vouching
- Periodic content audits
- User feedback integration

---

## Recommended Tools and Services

### Content Management

#### Image Hosting and Optimization
- **Cloudinary** (Free Tier: 7,500 images/month, 2GB storage, 5GB bandwidth)
  - Image optimization and transformation
  - Automatic format conversion (WebP)
  - Responsive image delivery
  - URL: https://cloudinary.com
  - **Verification:** Check https://cloudinary.com/pricing for current free tier limits (verified as of November 14, 2025)
  - **Note:** For comprehensive free tier limits, see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md#free-tier-service-limits) (single source of truth)

- **Next.js Image Optimization** (Free, Built-in)
  - Automatic image optimization
  - Lazy loading
  - Responsive images
  - No external service needed

#### Video Hosting (Optional)
- **Cloudinary** (Free Tier: 2GB storage, 5GB bandwidth)
  - Video optimization and transformation
  - Automatic format conversion
  - Streaming support
  - URL: https://cloudinary.com
  - **Note:** For comprehensive free tier limits, see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md#free-tier-service-limits) (single source of truth)

- **YouTube** (Free)
  - Embed videos for tutorials or promotional content
  - Automatic captions
  - URL: https://www.youtube.com

#### Image Editing
- **Canva** (Free Tier: Limited features, sufficient for basic editing)
  - Image editing and optimization
  - Templates for social media
  - URL: https://www.canva.com
  - **Verification:** Check https://www.canva.com/pricing for current free tier

- **GIMP** (Free, Open Source)
  - Advanced image editing
  - No limitations
  - URL: https://www.gimp.org

#### Video Editing
- **DaVinci Resolve** (Free)
  - Professional video editing
  - No watermarks
  - URL: https://www.blackmagicdesign.com/products/davinciresolve

- **OpenShot** (Free, Open Source)
  - Simple video editing
  - URL: https://www.openshot.org

### Authentication

#### Social Login Providers
- **NextAuth.js v5 (Auth.js)** (Free, Open Source)
  - Social login integration
  - Supports Google, GitHub, Facebook, etc.
  - Excellent Next.js integration
  - URL: https://next-auth.js.org
  - **Verification:** Check https://github.com/nextauthjs/next-auth for latest version (verified as of November 14, 2025)

- **Google OAuth** (Free)
  - Generous free tier
  - Widely used
  - URL: https://developers.google.com/identity/protocols/oauth2
  - **Verification:** Check Google Cloud Console for current quotas

- **Clerk** (Free Tier: 10,000 MAU)
  - Easy social login setup
  - Built-in UI components
  - URL: https://clerk.com
  - **Verification:** Check https://clerk.com/pricing for current free tier limits (verify before implementation)

### Content Planning and Organization

#### Project Management
- **Trello** (Free Tier: Unlimited cards, 10 boards per workspace)
  - Content planning and organization
  - Task management
  - URL: https://trello.com
  - **Verification:** Check https://trello.com/pricing for current free tier

- **Notion** (Free Tier: Personal use, unlimited blocks)
  - Content documentation
  - Content inventory tracking
  - URL: https://www.notion.so
  - **Verification:** Check https://www.notion.so/pricing for current free tier

#### Design and Prototyping
- **Figma** (Free Tier: Unlimited files, 3 projects)
  - UI/UX design
  - Content mockups
  - URL: https://www.figma.com
  - **Verification:** Check https://www.figma.com/pricing for current free tier

### Analytics and Monitoring

#### Analytics
- **Google Analytics 4 (GA4)** (Free)
  - Content performance tracking
  - User behavior analysis
  - URL: https://analytics.google.com

- **Vercel Analytics** (Free Tier: Included with Vercel hosting)
  - Web vitals tracking
  - Performance monitoring
  - URL: https://vercel.com/analytics

### Email Services (If Needed)

#### Transactional Email
- **Brevo (formerly Sendinblue)** (Free Tier: 300 emails/day, unlimited contacts)
  - Transactional emails and templated notifications (sign-up confirmations, Krawl completion summaries)
  - SMTP + REST API support with analytics dashboard
  - URL: https://www.brevo.com
  - **Verification:** Check https://www.brevo.com/pricing for current free tier limits (verified as of November 14, 2025)

### Hosting and Deployment

#### Frontend Hosting
- **Vercel** (Free Tier: Unlimited personal projects, 100GB bandwidth/month)
  - Next.js optimized hosting
  - Automatic deployments
  - URL: https://vercel.com
  - **Verification:** Check https://vercel.com/pricing for current free tier

- **Netlify** (Free Tier: 100GB bandwidth/month, 300 build minutes/month)
  - Static site hosting
  - PWA support
  - URL: https://www.netlify.com
  - **Verification:** Check https://www.netlify.com/pricing for current free tier

### Map Services

#### Map Integration
- **Mapbox** (Free Tier: 50,000 map loads/month)
  - Interactive maps
  - Custom styling
  - Directions API
  - URL: https://www.mapbox.com
  - **Verification:** Check https://www.mapbox.com/pricing for current free tier limits (verified as of November 14, 2025)

---

## Content Management Workflow

### Content Creation Workflow

1. **Planning:**
   - Identify content needs
   - Assign content creators
   - Set deadlines
   - Review content guidelines

2. **Creation:**
   - Create text content
   - Gather/optimize images
   - Create videos (if needed)
   - Review against guidelines

3. **Review:**
   - Quality check
   - Cultural sensitivity review
   - Accessibility check
   - Brand consistency check

4. **Approval:**
   - Final approval
   - Content published
   - Community review enabled

5. **Maintenance:**
   - Monitor community feedback
   - Update outdated content
   - Address reported issues
   - Regular content audits

### Content Inventory Tracking

- Maintain content inventory spreadsheet
- Track content status (draft, review, published, archived)
- Monitor content performance
- Update content regularly
- Document content decisions

---

## Scalability and Maintainability

### Scalable Content Architecture

1. **Modular Content Structure:**
   - Reusable content components
   - Consistent content patterns
   - Easy content updates

2. **Content Versioning:**
   - Track content changes
   - Maintain content history
   - Rollback capabilities

3. **Content Caching:**
   - Optimize content delivery
   - Reduce server load
   - Improve performance

### Maintainable Content Practices

1. **Documentation:**
   - Content guidelines documented
   - Content inventory maintained
   - Content decisions recorded

2. **Automation:**
   - Automated content validation
   - Automated image optimization
   - Automated content backups

3. **Monitoring:**
   - Content performance tracking
   - User feedback collection
   - Content quality metrics

### Agile Content Development

1. **Iterative Approach:**
   - Start with MVP content
   - Add content based on feedback
   - Continuously improve content

2. **User Feedback Integration:**
   - Collect user feedback
   - Prioritize content improvements
   - Implement changes quickly

3. **Continuous Improvement:**
   - Regular content reviews
   - A/B testing (if applicable)
   - Content optimization

---

## References

### Related Documents
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview and objectives
- [SITEMAP.md](./SITEMAP.md) - Complete page structure and navigation
- [BRAND_BRIEF.md](./BRAND_BRIEF.md) - Brand strategy and tone of voice
- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md) - Visual identity and design system
- [CONTENT_SEEDING_STRATEGY.md](./CONTENT_SEEDING_STRATEGY.md) - Initial content creation guidelines
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed page specifications

### External Resources

#### Content Management
- **Content Strategy Guide:** https://www.contentmarketinginstitute.com/articles/content-strategy-guide/
- **Web Content Accessibility Guidelines (WCAG):** https://www.w3.org/WAI/WCAG21/quickref/

#### Image Optimization
- **WebP Guide:** https://developers.google.com/speed/webp
- **Image Optimization Best Practices:** https://web.dev/fast/#optimize-your-images

#### Video Optimization
- **Video Optimization Guide:** https://web.dev/fast/#optimize-your-videos
- **Video Compression Tools:** https://handbrake.fr/ (Free, Open Source)

---

## Appendices

### Appendix A: Content Inventory Checklist

**For Each Page, Verify:**
- [ ] All required text content is defined
- [ ] All required images are specified
- [ ] Video requirements are documented (if applicable)
- [ ] Character limits are defined
- [ ] Content guidelines are followed
- [ ] Accessibility requirements are met
- [ ] Brand consistency is maintained

### Appendix B: Content Creation Template

**Gem Content Template:**
- Name: [Required, max 100 characters]
- Category: [Required, select from list]
- Description: [Required, 50-500 characters]
- Location: [Required, within Cebu City]
- Photos: [1-5 images, optimized]
- Cultural Significance: [Optional, max 300 characters]
- Tags: [Optional, up to 5 tags]

**Krawl Content Template:**
- Name: [Required, max 100 characters]
- Description: [Required, 50-500 characters]
- Category/Theme: [Required, select from list]
- Difficulty: [Required, Easy/Moderate/Hard]
- Gems: [Required, minimum 2 Gems]
- Cover Image: [Required, optimized]
- Estimated Duration: [Auto-calculated]
- Total Distance: [Auto-calculated]

### Appendix C: Content Quality Checklist

**Before Publishing Content:**
- [ ] Content is authentic and culturally appropriate
- [ ] All required fields are completed
- [ ] Character limits are respected
- [ ] Images are optimized and have alt text
- [ ] Videos have captions (if applicable)
- [ ] Content follows brand tone of voice
- [ ] Spelling and grammar are correct
- [ ] Content is accessible
- [ ] Cultural sensitivity is maintained
- [ ] Location is within Cebu City boundaries (for Gems/Krawls)

### Appendix D: Tool Verification Checklist

**Before Using Any Tool:**
- [ ] Verify current free tier limits
- [ ] Check tool maintenance status
- [ ] Review latest documentation
- [ ] Test tool functionality
- [ ] Verify compatibility with tech stack
- [ ] Check for breaking changes
- [ ] Review terms of service
- [ ] Document tool usage

**Last Verified:** November 14, 2025

---

## Document Metadata

**Document Type:** Content Strategy / Content Inventory  
**Target Audience:** Development Team, Content Creators, Designers, Project Managers  
**Related Documents:**
- PROJECT_BRIEF.md
- SITEMAP.md
- BRAND_BRIEF.md
- BRAND_GUIDELINES.md
- CONTENT_SEEDING_STRATEGY.md
- SCOPE_OF_WORK.md

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Free Tier Tools Only:** All recommended tools and services are free or offer generous free tiers suitable for student projects. Always verify current free tier limits before implementation.

2. **Social Login Only:** Authentication uses social login providers (Google, GitHub, etc.) through NextAuth.js or Clerk. No email/password authentication is implemented.

3. **Current as of 2025-11-14:** All tool recommendations, free tier limits, and service information are verified as of November 14, 2025. **Always verify current status before implementation** - use the Tool Verification Checklist in Appendix D.

4. **Scalability & Maintainability:** Content structure is designed for scalability and maintainability, using modular components, consistent patterns, and agile principles.

5. **Cultural Sensitivity:** All content must respect Filipino culture and traditions. When in doubt, consult with community members or cultural advisors.

6. **Accessibility:** All content must meet WCAG 2.1 Level AA standards for accessibility, including proper alt text, captions, and contrast ratios.

7. **Agile Principles:** Content development follows agile principles, with iterative improvements based on user feedback and continuous monitoring.

---

*This Content Inventory and Content Plan serves as the comprehensive guide for all content needs across the Krawl PWA, ensuring consistency, quality, and cultural respect in all content creation and management efforts.*

