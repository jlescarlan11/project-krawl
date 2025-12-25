# Krawl Optimization Guide

## Overview

This guide covers optimization strategies for TASK-223 through TASK-227, providing implementation instructions for frontend bundle size, image loading, map rendering, code splitting, and API response time optimizations.

---

## TASK-223: Frontend Bundle Size Optimization

### Current Analysis
```bash
cd frontend
npm run build

# Analyze bundle
npx @next/bundle-analyzer
```

### Optimization Strategies

#### 1. Tree Shaking
```typescript
// Bad: imports entire library
import _ from 'lodash';

// Good: import specific functions
import debounce from 'lodash/debounce';
```

#### 2. Remove Unused Dependencies
```bash
# Find unused dependencies
npx depcheck

# Remove unused packages
npm uninstall <package-name>
```

#### 3. Dynamic Imports (see TASK-226)

### Target Metrics
- Initial bundle < 200KB (gzipped)
- Total bundle < 500KB (gzipped)

---

## TASK-224: Image Loading and Caching

### Implementation

#### 1. Use Next.js Image Component
```typescript
// Bad
<img src="/photo.jpg" alt="Gem" />

// Good
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Gem"
  width={800}
  height={600}
  priority={false}
  loading="lazy"
  quality={85}
/>
```

#### 2. Cloudinary Optimization
```typescript
// lib/cloudinary/urls.ts
export function getOptimizedUrl(publicId: string, width: number) {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/` +
    `f_auto,q_auto,w_${width}/${publicId}`;
}
```

#### 3. Lazy Loading
```typescript
// components/LazyImage.tsx
import dynamic from 'next/dynamic';

const LazyImage = dynamic(() => import('./OptimizedImage'), {
  loading: () => <div className="skeleton" />,
  ssr: false
});
```

---

## TASK-225: Map Rendering Performance

### Optimizations

#### 1. Lazy Load Markers
```typescript
// Only render markers in viewport
const visibleMarkers = markers.filter(marker =>
  isInViewport(marker, mapBounds)
);
```

#### 2. Marker Clustering
Already implemented - verify efficient clustering thresholds

#### 3. Reduce Map Updates
```typescript
// Debounce map updates
const debouncedUpdate = useMemo(
  () => debounce(updateMarkers, 300),
  []
);
```

---

## TASK-226: Code Splitting and Lazy Loading

### Implementation

#### 1. Route-Based Splitting
```typescript
// app/gems/[id]/page.tsx
import dynamic from 'next/dynamic';

const GemDetailClient = dynamic(
  () => import('./GemDetailClient'),
  { loading: () => <GemDetailSkeleton /> }
);
```

#### 2. Component Lazy Loading
```typescript
// Load heavy components only when needed
const MapComponent = dynamic(
  () => import('@/components/map/MapExample'),
  { ssr: false }
);
```

---

## TASK-227: API Response Time Optimization

### Backend Optimizations

#### 1. Database Indexes
✅ Already implemented in V20 migration

#### 2. Query Optimization
```java
// Add @EntityGraph for related data
@EntityGraph(attributePaths = {"creator", "photos"})
List<Gem> findAllWithDetails();
```

#### 3. Response Caching
```java
@Cacheable(value = "popularGems", key = "#limit")
public List<Gem> findPopularGems(int limit) {
    // Cache popular gems for 1 hour
}
```

#### 4. Pagination
```java
// Add pagination to all list endpoints
Page<GemRating> findByGemId(UUID gemId, Pageable pageable);
```

### Target Metrics
- Simple endpoints < 200ms
- Complex endpoints < 500ms
- 95th percentile improved by 50%

---

## Performance Monitoring

### Metrics to Track
- Bundle size (Webpack Bundle Analyzer)
- Page load time (Lighthouse)
- API response times (Spring Boot Actuator)
- Database query times (Slow query log)
- Image load times (Browser DevTools)

**Last Updated:** December 23, 2025
