# Krawl API Documentation

## Overview

The Krawl API is a RESTful API built with Spring Boot 3.5.7 that provides endpoints for managing Filipino cultural experiences in Cebu City. The API uses JSON for request and response bodies and implements OAuth 2.0 for authentication.

**Base URL:** `http://localhost:8080` (development) | `https://api.krawl.app` (production)

**Interactive Documentation:** Available at `/swagger-ui.html` when the backend is running

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Headers](#common-headers)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Gems](#gem-endpoints)
   - [Krawls](#krawl-endpoints)
   - [Comments](#comment-endpoints)
   - [Ratings](#rating-endpoints)
   - [Vouches](#vouch-endpoints)
   - [Search](#search-endpoints)
   - [User Profile](#user-profile-endpoints)
   - [Krawl Mode](#krawl-mode-endpoints)
   - [Reports](#report-endpoints)
7. [Webhooks](#webhooks)
8. [Changelog](#changelog)

---

## Authentication

### OAuth 2.0 with Google

The API uses Google OAuth 2.0 for authentication. The frontend obtains a Google OAuth token which is then exchanged for a JWT access token from the backend.

**Authentication Flow:**

1. Frontend initiates Google OAuth login
2. User authenticates with Google
3. Frontend receives Google OAuth token
4. Frontend exchanges Google token for Krawl JWT via `/api/auth/google`
5. JWT token stored in httpOnly cookie
6. Subsequent requests automatically include JWT cookie

**Token Expiration:**
- Access Token: 1 hour (configurable via `JWT_EXPIRATION_MS`)
- Refresh Token: 7 days (configurable via `REFRESH_TOKEN_EXPIRATION_MS`)

---

## Common Headers

### Request Headers

```http
Content-Type: application/json
Accept: application/json
```

**Note:** JWT token is automatically sent via httpOnly cookie. No `Authorization` header needed.

### Response Headers

```http
Content-Type: application/json
Cache-Control: no-cache, no-store, must-revalidate (for protected resources)
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (optional)
    }
  },
  "timestamp": "2025-12-23T14:30:00Z"
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request successful, no content to return |
| `400 Bad Request` | Invalid request parameters or body |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | User doesn't have permission |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists or conflict |
| `422 Unprocessable Entity` | Validation failed |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Server error |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `AUTHENTICATION_REQUIRED` | User must be authenticated |
| `VALIDATION_ERROR` | Request validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `DUPLICATE_RESOURCE` | Resource with same unique field exists |
| `PERMISSION_DENIED` | User lacks required permissions |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `OUTSIDE_BOUNDARIES` | Location outside Cebu City |

---

## Rate Limiting

**Current Limits:**
- Authenticated users: 1000 requests/hour
- Unauthenticated users: 100 requests/hour
- Search endpoints: 60 requests/minute

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## API Endpoints

### Authentication Endpoints

#### Authenticate with Google

```http
POST /api/auth/google
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "google-oauth-token-here"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/photo.jpg"
  },
  "accessToken": "jwt-token",
  "expiresIn": 3600
}
```

**Errors:**
- `400`: Invalid or missing token
- `401`: Token validation failed

---

#### Sign Out

```http
POST /api/auth/signout
```

**Response:** `204 No Content`

Revokes the current JWT token.

---

### Gem Endpoints

#### Get All Gems

```http
GET /api/gems?page=0&size=20&category=FOOD
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 0) |
| `size` | integer | No | Page size (default: 20, max: 100) |
| `category` | string | No | Filter by category |
| `sortBy` | string | No | Sort field (default: createdAt) |
| `sortOrder` | string | No | `asc` or `desc` (default: desc) |

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "Sirao Flower Garden",
      "description": "Beautiful flower garden...",
      "culturalSignificance": "Known for vibrant celosia flowers...",
      "category": "NATURE",
      "location": {
        "latitude": 10.3456,
        "longitude": 123.9012,
        "address": "Sirao, Cebu City"
      },
      "photos": [
        {
          "id": "uuid",
          "cloudinaryPublicId": "krawl/gems/sirao_123",
          "url": "https://res.cloudinary.com/...",
          "displayOrder": 0
        }
      ],
      "creator": {
        "id": "uuid",
        "name": "Jane Doe",
        "picture": "https://..."
      },
      "score": 85.5,
      "vouchCount": 42,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

---

#### Get Gem by ID

```http
GET /api/gems/{id}
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Gem ID |

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Sirao Flower Garden",
  "description": "Beautiful flower garden...",
  "culturalSignificance": "Known for vibrant celosia flowers...",
  "category": "NATURE",
  "location": {
    "latitude": 10.3456,
    "longitude": 123.9012,
    "address": "Sirao, Cebu City"
  },
  "photos": [...],
  "creator": {...},
  "score": 85.5,
  "vouchCount": 42,
  "averageRating": 4.5,
  "ratingCount": 28,
  "relatedKrawls": [
    {
      "id": "uuid",
      "name": "Mountain Flower Trail",
      "coverImage": "https://..."
    }
  ],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

**Errors:**
- `404`: Gem not found

---

#### Create Gem

```http
POST /api/gems
Content-Type: application/json
```

**Authentication:** Required

**Request Body:**
```json
{
  "name": "New Cultural Site",
  "description": "A hidden gem in Cebu...",
  "culturalSignificance": "Historical significance...",
  "category": "HISTORICAL",
  "location": {
    "latitude": 10.3157,
    "longitude": 123.8854,
    "address": "Downtown, Cebu City"
  },
  "photos": [
    {
      "cloudinaryPublicId": "krawl/temp/photo_123",
      "displayOrder": 0
    }
  ],
  "tags": ["historical", "architecture", "spanish-era"]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "New Cultural Site",
  ...
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `description`: Required, 10-2000 characters
- `culturalSignificance`: Required, 10-2000 characters
- `category`: Required, valid enum value
- `location.latitude`: Required, within Cebu City bounds
- `location.longitude`: Required, within Cebu City bounds
- `photos`: Min 1, max 5 photos

**Errors:**
- `400`: Validation failed
- `401`: Authentication required
- `409`: Duplicate gem at same location
- `422`: Location outside Cebu City boundaries

---

#### Update Gem

```http
PUT /api/gems/{id}
Content-Type: application/json
```

**Authentication:** Required (must be creator)

**Request Body:** Same as Create Gem

**Response:** `200 OK`

**Errors:**
- `401`: Authentication required
- `403`: Not the gem creator
- `404`: Gem not found

---

#### Delete Gem

```http
DELETE /api/gems/{id}
```

**Authentication:** Required (must be creator)

**Response:** `204 No Content`

**Errors:**
- `401`: Authentication required
- `403`: Not the gem creator
- `404`: Gem not found

---

#### Search Gems

```http
GET /api/gems/search?q=flower&latitude=10.3157&longitude=123.8854&radius=5000
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search query (name, description) |
| `latitude` | number | No | Center latitude for radius search |
| `longitude` | number | No | Center longitude for radius search |
| `radius` | number | No | Search radius in meters (max: 50000) |
| `category` | string | No | Filter by category |
| `page` | integer | No | Page number |
| `size` | integer | No | Page size |

**Response:** `200 OK`
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Sirao Flower Garden",
      "snippet": "Beautiful <mark>flower</mark> garden...",
      "distance": 1234.5,
      "score": 85.5,
      ...
    }
  ],
  "totalResults": 15,
  "page": 0,
  "pageSize": 20
}
```

---

### Comment Endpoints

#### Get Comments for Gem

```http
GET /api/gems/{gemId}/comments?page=0&size=20
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "uuid",
      "content": "Amazing place! Highly recommend...",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "picture": "https://..."
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pageable": {...}
}
```

---

#### Create Comment

```http
POST /api/gems/{gemId}/comments
Content-Type: application/json
```

**Authentication:** Required

**Request Body:**
```json
{
  "content": "This place is amazing! The flowers are beautiful."
}
```

**Validation:**
- `content`: Required, 1-500 characters

**Response:** `201 Created`

---

### Rating Endpoints

#### Rate Gem

```http
POST /api/gems/{gemId}/rating
Content-Type: application/json
```

**Authentication:** Required

**Request Body:**
```json
{
  "rating": 5
}
```

**Validation:**
- `rating`: Required, integer 1-5

**Response:** `201 Created` or `200 OK` (if updating)

**Business Rules:**
- One rating per user per gem
- Updates existing rating if already rated

---

### Vouch Endpoints

#### Vouch for Gem

```http
POST /api/gems/{gemId}/vouch
```

**Authentication:** Required

**Response:** `201 Created`

**Business Rules:**
- One vouch per user per gem
- Idempotent: Returns success if already vouched

---

#### Remove Vouch

```http
DELETE /api/gems/{gemId}/vouch
```

**Authentication:** Required

**Response:** `204 No Content`

---

### Search Endpoints

#### Autocomplete

```http
GET /api/search/autocomplete?q=sir
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search prefix (min 2 chars) |
| `limit` | integer | No | Max suggestions (default: 10) |

**Response:** `200 OK`
```json
{
  "suggestions": [
    {
      "text": "Sirao Flower Garden",
      "type": "gem",
      "id": "uuid"
    },
    {
      "text": "Sirao Peak Trail",
      "type": "krawl",
      "id": "uuid"
    }
  ]
}
```

---

#### Popular Searches

```http
GET /api/search/popular?limit=10
```

**Response:** `200 OK`
```json
{
  "queries": [
    {
      "query": "historical sites",
      "count": 1543
    },
    {
      "query": "food tour",
      "count": 987
    }
  ]
}
```

---

### Krawl Mode Endpoints

#### Start Krawl Session

```http
POST /api/krawls/{krawlId}/session/start
```

**Authentication:** Required

**Response:** `201 Created`
```json
{
  "sessionId": "uuid",
  "krawlId": "uuid",
  "startedAt": "2025-01-15T10:30:00Z",
  "status": "IN_PROGRESS"
}
```

---

#### Update Location

```http
POST /api/krawls/{krawlId}/session/{sessionId}/location
Content-Type: application/json
```

**Authentication:** Required

**Request Body:**
```json
{
  "latitude": 10.3157,
  "longitude": 123.8854,
  "accuracy": 10.5,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Response:** `200 OK`

---

#### Complete Gem

```http
POST /api/krawls/{krawlId}/session/{sessionId}/complete-gem
Content-Type: application/json
```

**Authentication:** Required

**Request Body:**
```json
{
  "gemId": "uuid",
  "completedAt": "2025-01-15T10:30:00Z"
}
```

**Response:** `200 OK`

---

#### End Krawl Session

```http
POST /api/krawls/{krawlId}/session/{sessionId}/end
```

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "sessionId": "uuid",
  "completed": true,
  "gemsCompleted": 8,
  "totalGems": 10,
  "duration": "02:45:30",
  "distance": 5.2
}
```

---

## Webhooks

### Event Types

| Event | Description |
|-------|-------------|
| `gem.created` | New gem created |
| `krawl.created` | New krawl created |
| `session.completed` | Krawl session completed |
| `report.submitted` | Content reported |

### Webhook Payload

```json
{
  "event": "gem.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "id": "uuid",
    "name": "New Gem",
    ...
  }
}
```

---

## Code Examples

### JavaScript/TypeScript

```typescript
// Authenticate with Google token
const response = await fetch('http://localhost:8080/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: Include cookies
  body: JSON.stringify({
    token: googleOAuthToken,
  }),
});

const data = await response.json();
console.log('Authenticated:', data.user);

// Create a new gem
const gemResponse = await fetch('http://localhost:8080/api/gems', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Sends JWT cookie automatically
  body: JSON.stringify({
    name: 'New Cultural Site',
    description: 'A hidden gem...',
    culturalSignificance: 'Historical significance...',
    category: 'HISTORICAL',
    location: {
      latitude: 10.3157,
      longitude: 123.8854,
      address: 'Downtown, Cebu City',
    },
    photos: [...],
  }),
});

if (gemResponse.ok) {
  const gem = await gemResponse.json();
  console.log('Gem created:', gem.id);
}
```

---

## Testing

### Swagger UI

Access interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

Features:
- Try out API endpoints directly
- View request/response schemas
- See example values
- Test authentication flow

### Postman Collection

Import the Postman collection:
```
GET http://localhost:8080/v3/api-docs
```

---

## Versioning

**Current Version:** v1

API versioning strategy:
- Breaking changes trigger major version bump
- New endpoints/fields are backward compatible
- Deprecated endpoints supported for 6 months

---

## Support

- **Documentation:** This file and Swagger UI
- **Issues:** GitHub Issues
- **Questions:** GitHub Discussions

---

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- Authentication with Google OAuth
- CRUD operations for Gems and Krawls
- Search and filtering
- Ratings, vouches, and comments
- Krawl Mode endpoints
- Reporting system

---

**Last Updated:** December 23, 2025
**API Version:** 1.0.0
**Backend Version:** Spring Boot 3.5.7
