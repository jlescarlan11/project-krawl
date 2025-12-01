# Gem Components

This directory contains all components related to displaying gem details.

## Rating & Vouching Components

### Component Hierarchy

```
GemRatingsVouches (Main Container)
├── Ratings Section
│   ├── Average Rating Display (large number)
│   ├── StarRating Component
│   ├── Total Ratings Count
│   └── RatingBreakdown Component
│       └── Progress bars for each star level
└── Vouches Section
    └── VouchDisplay Component
        ├── Vouch Count Header
        ├── Vouch Button (if authenticated)
        └── User List (expandable)
```

### StarRating Component

**File**: `StarRating.tsx`

Displays visual star ratings with partial fill support.

**Props**:
- `rating: number` - Rating value (0-5)
- `maxRating?: number` - Maximum stars (default: 5)
- `size?: "sm" | "md" | "lg"` - Star size
- `showValue?: boolean` - Show numeric value (default: true)
- `className?: string` - Additional CSS classes

**Usage**:
```tsx
<StarRating rating={4.5} size="lg" />
```

### RatingBreakdown Component

**File**: `RatingBreakdown.tsx`

Shows distribution of ratings across 5 star levels.

**Props**:
- `breakdown: RatingBreakdown` - Object with counts for each star level
- `totalRatings: number` - Total number of ratings

**Usage**:
```tsx
<RatingBreakdown 
  breakdown={{ 5: 85, 4: 30, 3: 8, 2: 3, 1: 1 }}
  totalRatings={127}
/>
```

### VouchDisplay Component

**File**: `VouchDisplay.tsx`

Displays vouch count, user list, and vouch button.

**Props**:
- `vouches: GemVouch[]` - Array of vouch objects
- `vouchCount: number` - Total vouch count
- `isVouchedByCurrentUser?: boolean` - Whether current user has vouched
- `onVouch?: () => Promise<void>` - Vouch action handler
- `isAuthenticated?: boolean` - Whether user is logged in

**Features**:
- Shows first 5 vouches by default
- Expandable to show all vouches
- User avatars with fallback
- Vouch dates
- Optimistic UI updates

**Usage**:
```tsx
<VouchDisplay
  vouches={gem.vouchesData?.vouches || []}
  vouchCount={gem.vouchesData?.vouchCount || 0}
  isVouchedByCurrentUser={false}
  onVouch={handleVouch}
  isAuthenticated={true}
/>
```

### GemRatingsVouches Component

**File**: `GemRatingsVouches.tsx`

Main container that combines ratings and vouching in a single card.

**Props**:
- `gem: GemDetail` - Full gem data including ratingsData and vouchesData
- `isAuthenticated?: boolean` - Whether user is logged in

**Features**:
- Displays average rating prominently
- Shows rating breakdown
- Manages vouch state locally
- Handles empty states for both sections
- Optimistic updates for vouching

**Usage**:
```tsx
<GemRatingsVouches gem={gem} isAuthenticated={false} />
```

## Data Types

### RatingBreakdown
```typescript
interface RatingBreakdown {
  1: number; // Count of 1-star ratings
  2: number; // Count of 2-star ratings
  3: number; // Count of 3-star ratings
  4: number; // Count of 4-star ratings
  5: number; // Count of 5-star ratings
}
```

### GemRatingsData
```typescript
interface GemRatingsData {
  averageRating: number;
  totalRatings: number;
  breakdown: RatingBreakdown;
}
```

### GemVouch
```typescript
interface GemVouch {
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}
```

### GemVouchesData
```typescript
interface GemVouchesData {
  vouchCount: number;
  vouches: GemVouch[];
  isVouchedByCurrentUser?: boolean;
}
```

## Integration Example

In a gem detail page:

```tsx
import { GemRatingsVouches } from "@/components/gems/GemRatingsVouches";

export default function GemDetailPage({ gem }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Main content */}
      </div>
      <div className="lg:col-span-1">
        <GemRatingsVouches gem={gem} isAuthenticated={false} />
      </div>
    </div>
  );
}
```

## Empty States

Both ratings and vouches sections handle missing data gracefully:

- **No ratings**: Shows icon with "No ratings yet" message
- **No vouches**: Shows icon with "No vouches yet" message
- **Zero division**: Progress bars show 0% width when totalRatings is 0

## API Integration

To connect to real API, update the TODO comments in:
1. `VouchDisplay.tsx` - handleVouch function
2. `GemRatingsVouches.tsx` - handleVouch function

Expected API endpoints:
- `POST /api/gems/:id/vouch` - Add vouch
- `DELETE /api/gems/:id/vouch` - Remove vouch

## Styling

Components use Tailwind CSS with the following color scheme:
- **Ratings**: `accent-orange` (orange stars and highlights)
- **Vouches**: `primary-green` (green icons and buttons)
- **Text**: Standard text hierarchy (text-primary, text-secondary, text-tertiary)
- **Backgrounds**: White cards with gray borders
