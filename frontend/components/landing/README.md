# Landing Components

This folder contains components for the landing page, including both guest and authenticated variants. The landing page displays featured content, popular Gems, and personalized user activity for authenticated users.

## Components

### FeaturedKrawlsCarousel

`FeaturedKrawlsCarousel` displays a horizontal scrolling carousel of featured Krawls with navigation controls and pagination dots.

**Props:**
- `featuredKrawls?: FeaturedKrawl[]` - Array of featured Krawls to display
- `loading?: boolean` - Loading state

**Usage:**
```tsx
import { FeaturedKrawlsCarousel } from "@/components/landing";

<FeaturedKrawlsCarousel featuredKrawls={krawls} loading={false} />
```

### PopularGemsSection

`PopularGemsSection` displays a grid of popular Gems with a "Browse All Gems" CTA.

**Props:**
- `gems?: PopularGem[]` - Array of popular Gems to display
- `loading?: boolean` - Loading state

**Usage:**
```tsx
import { PopularGemsSection } from "@/components/landing";

<PopularGemsSection gems={gems} loading={false} />
```

### AuthenticatedHeroSection

`AuthenticatedHeroSection` displays a personalized hero section for authenticated users with a welcome message and creation CTAs.

**Props:**
- `user: User` - Authenticated user object (from auth store)

**Features:**
- Personalized greeting: "Welcome back, [Name]!"
- Creation CTAs: "Create Gem", "Create Krawl", "Explore Map"
- Responsive layout (full-width buttons on mobile, auto-width on desktop)

**Usage:**
```tsx
import { AuthenticatedHeroSection } from "@/components/landing";
import { useAuthUser } from "@/stores";

function MyComponent() {
  const user = useAuthUser();
  
  if (!user) return null;
  
  return <AuthenticatedHeroSection user={user} />;
}
```

**Edge Cases:**
- Handles missing user name gracefully (shows "there" as fallback)
- Trims whitespace from user name

### UserStatsSection

`UserStatsSection` displays user's contribution statistics with animated count-up numbers.

**Props:**
- `stats?: UserStats` - User statistics object

**Statistics Displayed:**
- Gems Created
- Krawls Created
- Vouches Given
- Krawls Completed

**Features:**
- Animated count-up when scrolled into view
- Number formatting (K for thousands, M for millions)
- Loading state with skeletons
- Responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop)

**Usage:**
```tsx
import { UserStatsSection } from "@/components/landing";

const userStats = {
  gemsCreated: 12,
  krawlsCreated: 3,
  vouchesGiven: 28,
  krawlsCompleted: 7,
};

<UserStatsSection stats={userStats} />
```

**Edge Cases:**
- Handles undefined stats (shows loading state)
- Displays zero values correctly
- Formats large numbers with K/M suffixes

### UserActivitySection

`UserActivitySection` displays user's recent activity including Gems created, saved Krawls, and completed Krawls.

**Props:**
- `activity?: UserActivityResponse` - User activity data
- `loading?: boolean` - Loading state

**Sections:**
1. **Recent Gems Created** - Shows user's recently created Gems
2. **Saved Krawls** - Shows Krawls the user has saved/favorited
3. **Completed Krawls** - Shows Krawls the user has completed

**Features:**
- Empty states with icons and CTAs for each section
- Loading skeletons
- Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- Limits display to 6 items per section with "View All" CTAs

**Usage:**
```tsx
import { UserActivitySection } from "@/components/landing";

const userActivity = {
  stats: { /* ... */ },
  recentGems: [ /* ... */ ],
  savedKrawls: [ /* ... */ ],
  completedKrawls: [ /* ... */ ],
};

<UserActivitySection activity={userActivity} loading={false} />
```

**Edge Cases:**
- Returns `null` when activity is undefined
- Shows empty states when arrays are empty
- Handles loading state with skeletons

### UserActivityItem

`UserActivityItem` displays a single activity item (Gem or Krawl) in the user activity section.

**Props:**
- `item: UserActivityItemData` - Activity item data
- `className?: string` - Additional CSS classes

**Features:**
- Supports both Gem and Krawl types
- Displays image with fallback
- Shows category badge (Gem category or "Krawl")
- Links to detail page
- Hover effects

**Usage:**
```tsx
import { UserActivityItem } from "@/components/landing";

const gemItem = {
  id: "gem-1",
  type: "gem",
  name: "Tisa Mango Float Pop-up",
  category: "Food & Drink",
  district: "Tisa",
  thumbnailUrl: "https://example.com/image.jpg",
  createdAt: new Date().toISOString(),
};

<UserActivityItem item={gemItem} />
```

**Edge Cases:**
- Handles missing thumbnail/coverImage gracefully
- Handles missing optional fields (district, gemsCount)

## Types

### FeaturedKrawl

```typescript
interface FeaturedKrawl {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  rating?: number;
  difficulty?: string;
  estimatedDurationMinutes?: number;
  gemsCount?: number;
}
```

### PopularGem

```typescript
interface PopularGem {
  id: string;
  name: string;
  category: string;
  district: string;
  thumbnailUrl: string;
  rating?: number;
  vouchCount?: number;
  viewCount?: number;
  shortDescription?: string;
}
```

### UserStats

```typescript
interface UserStats {
  gemsCreated: number;
  krawlsCreated: number;
  vouchesGiven: number;
  krawlsCompleted: number;
}
```

### UserActivityItemData

```typescript
interface UserActivityItemData {
  id: string;
  type: "gem" | "krawl";
  name: string;
  thumbnailUrl?: string;
  createdAt: string;
  // Gem-specific fields
  category?: string;
  district?: string;
  // Krawl-specific fields
  coverImage?: string;
  difficulty?: string;
  gemsCount?: number;
}
```

### UserActivityResponse

```typescript
interface UserActivityResponse {
  stats: UserStats;
  recentGems: UserActivityItemData[];
  savedKrawls: UserActivityItemData[];
  completedKrawls: UserActivityItemData[];
}
```

## Testing

Unit tests are available in `frontend/__tests__/components/landing/`:

- `AuthenticatedHeroSection.test.tsx` - Tests personalized greeting, CTAs, responsive layout, accessibility
- `UserStatsSection.test.tsx` - Tests statistics display, number formatting, loading states
- `UserActivitySection.test.tsx` - Tests activity display, empty states, loading states
- `UserActivityItem.test.tsx` - Tests Gem/Krawl rendering, optional fields, accessibility

Run tests with:
```bash
npm test -- landing
```

## API Integration

The landing components fetch data from API routes in `frontend/app/api/landing/`:

- `/api/landing/featured-krawls` - Featured Krawls (mock until TASK-085)
- `/api/landing/popular-gems` - Popular Gems (mock until TASK-085)
- `/api/landing/user-activity` - User activity data (mock until TASK-085)

**Note:** Currently using mock data. Will be replaced with backend API calls when TASK-085 is complete.

## Conditional Rendering

The landing page (`app/page.tsx`) conditionally renders components based on authentication state:

- **Authenticated:** Shows `AuthenticatedHeroSection`, `UserStatsSection`, `UserActivitySection`
- **Guest:** Shows `HeroSection`, `HeroStatsSection`, `FeaturedKrawlsCarousel`, `PopularGemsSection`

Authentication is detected server-side using `auth()` from NextAuth.js.







