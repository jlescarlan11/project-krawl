# Test Cases

## Backend API Endpoints

### Authentication (TASK-211)

#### AuthController Tests
- ✅ Test authenticate with valid Google token (new user)
- ✅ Test authenticate with valid Google token (existing user)
- ✅ Test authenticate with invalid token format
- ✅ Test authenticate with missing token
- ✅ Test authenticate with invalid Google token
- ✅ Test refresh token with valid refresh token
- ✅ Test refresh token with blacklisted token
- ✅ Test refresh token with invalid token
- ✅ Test revoke token with valid tokens
- ✅ Test revoke token with invalid access token

### Gem Endpoints (TASK-211)

#### GemController Tests
- ✅ Test get gem detail with valid ID
- ✅ Test get gem detail with authenticated user
- ✅ Test get gem detail with invalid UUID
- ✅ Test get gem detail when gem not found
- ✅ Test get all gems
- ✅ Test get all gems with authenticated user

#### GemCreationController Tests
- ✅ Test check duplicate (no duplicate found)
- ✅ Test check duplicate (duplicate found)
- ✅ Test create gem with valid request
- ✅ Test create gem unauthenticated
- ✅ Test update gem (own gem)
- ✅ Test delete gem (own gem)

### Krawl Endpoints (TASK-211)

#### KrawlController Tests
- ✅ Test get krawl detail with valid ID
- ✅ Test get krawl detail with invalid UUID
- ✅ Test create krawl with valid request
- ✅ Test create krawl unauthenticated
- ✅ Test update krawl (own krawl)
- ✅ Test toggle vouch for krawl

### Search Endpoints (TASK-211)

#### SearchController Tests
- ✅ Test search with valid query
- ✅ Test search with limit and offset
- ✅ Test search with type filter
- ✅ Test search with empty query
- ✅ Test search with invalid limit
- ✅ Test search with invalid offset
- ✅ Test search with invalid type
- ✅ Test autocomplete with valid query
- ✅ Test autocomplete with empty query
- ✅ Test get popular searches

### Social Features (TASK-211)

#### VouchController Tests
- ✅ Test toggle vouch (valid gem ID)
- ✅ Test toggle vouch (unvouch)
- ✅ Test toggle vouch unauthenticated
- ✅ Test toggle vouch with invalid UUID
- ✅ Test toggle vouch when gem not found

#### RatingController Tests
- ✅ Test create/update rating (valid request)
- ✅ Test create/update rating unauthenticated
- ✅ Test create/update rating with invalid UUID
- ✅ Test create/update rating (own gem - forbidden)
- ✅ Test create/update rating with invalid rating value
- ✅ Test get ratings for gem
- ✅ Test get my rating (user has rated)
- ✅ Test get my rating (user has not rated)

#### CommentController Tests
- ✅ Test create comment (valid request)
- ✅ Test create comment unauthenticated
- ✅ Test get comments for gem
- ✅ Test update comment (own comment)
- ✅ Test update comment (other user's comment - forbidden)
- ✅ Test delete comment (own comment)

#### ReportController Tests
- ✅ Test create report (guest user)
- ✅ Test create report (authenticated user)
- ✅ Test create report with invalid request
- ✅ Test create report for krawl content

### User Endpoints (TASK-211)

#### UserController Tests
- ✅ Test get user profile (valid ID)
- ✅ Test get user profile with invalid UUID
- ✅ Test get user profile when user not found
- ✅ Test get user statistics

## Frontend Components (TASK-212)

### Authentication Components
- ✅ Test GoogleSignInButton renders correctly
- ✅ Test GoogleSignInButton onClick handler
- ✅ Test GoogleSignInButton loading state
- ✅ Test GoogleSignInButton disabled state
- ✅ Test GoogleSignInButton async onClick handler

### UI Components
- ✅ Test Button component variants
- ✅ Test Button component sizes
- ✅ Test Button loading state
- ✅ Test Button with icons
- ✅ Test Button full width
- ✅ Test Input component rendering
- ✅ Test Input with label
- ✅ Test Input error state
- ✅ Test Input success state
- ✅ Test Input with icons
- ✅ Test Input user input handling
- ✅ Test Card component variants
- ✅ Test Card interactive variant
- ✅ Test Card keyboard navigation
- ✅ Test Card sub-components (Header, Body, Footer, Actions)

## Integration Tests (TASK-213)

### Authentication Flow
- ✅ Test complete OAuth flow (new user)
- ✅ Test complete OAuth flow (existing user)
- ✅ Test user creation in database
- ✅ Test user update in database

### Gem Creation Flow
- ✅ Test gem creation (form → API → database)
- ✅ Test gem creation with invalid coordinates
- ✅ Test gem validation

## E2E Tests (TASK-214)

### Authentication
- ✅ Test navigate to sign-in page
- ✅ Test show sign-in form
- ✅ Test redirect to sign-in when accessing protected route

### Gem Creation
- ✅ Test navigate to gem creation page
- ✅ Test show gem creation form
- ✅ Test validate required fields

### Search
- ✅ Test display search page
- ✅ Test perform search
- ✅ Test show search suggestions
- ✅ Test filter by type

### Krawl Creation
- ✅ Test navigate to krawl creation page
- ✅ Test show krawl creation form
- ✅ Test select gems for krawl

### Krawl Mode
- ✅ Test navigate to krawl detail page
- ✅ Test show start krawl mode button
- ✅ Test start krawl mode
- ✅ Test show current stop in krawl mode

### Social Features
- ✅ Test vouch for gem
- ✅ Test rate gem
- ✅ Test add comment to gem
- ✅ Test download krawl for offline

## Accessibility Tests (TASK-217)

- ✅ Test no accessibility violations on landing page
- ✅ Test no accessibility violations on sign-in page
- ✅ Test no accessibility violations on map page
- ✅ Test no accessibility violations on search page
- ✅ Test keyboard navigation
- ✅ Test proper ARIA labels
- ✅ Test proper heading hierarchy
- ✅ Test sufficient color contrast

## Performance Tests (TASK-218)

- ✅ Test landing page loads within 3 seconds
- ✅ Test First Contentful Paint < 1.5s
- ✅ Test API endpoints respond within 500ms
- ✅ Test acceptable Lighthouse performance score

## Security Tests (TASK-219)

- ✅ Test SQL injection prevention
- ✅ Test XSS prevention
- ✅ Test CSRF protection
- ✅ Test authentication required for protected endpoints
- ✅ Test authorization (own content only)
- ✅ Test input validation rejects invalid data




