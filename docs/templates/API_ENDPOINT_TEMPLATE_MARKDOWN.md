# API Endpoint Documentation Template

## How to Use This Template

1. Copy this template for each new endpoint
2. Fill in all sections marked with `[REPLACE]` or `<!-- ... -->`
3. Remove placeholder comments and examples
4. Follow the structure consistently across all endpoints
5. Update the table of contents if adding to a larger document

---

## Endpoint: `[HTTP_METHOD] /api/v1/[endpoint-path]`

### Summary

**Brief one-line description of what this endpoint does.**

### Description

Detailed description of the endpoint functionality, including:
- What the endpoint does
- When to use it
- Important business logic or constraints
- Any special considerations

### Authentication

- **Required:** `[Yes / No]`
- **Method:** `[Bearer Token / Cookie / None]`
- **Token Type:** `[JWT / OAuth Token / etc.]`

**Note:** If authentication is required, describe how to obtain and use the token.

### Endpoint Details

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/[endpoint-path]` |
| **Method** | `[GET / POST / PUT / DELETE / PATCH]` |
| **Base URL** | `http://localhost:8080/api/v1` (dev) / `https://api.krawl.app/api/v1` (prod) |
| **Content-Type** | `application/json` |

### Path Parameters

<!-- Remove this section if no path parameters -->

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | `uuid` | Yes | Unique identifier for the resource | `123e4567-e89b-12d3-a456-426614174000` |
| `[paramName]` | `[type]` | `[Yes/No]` | `[Description]` | `[Example]` |

### Query Parameters

<!-- Remove this section if no query parameters -->

| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| `page` | `integer` | No | `1` | Page number for pagination (1-indexed) | `1` |
| `limit` | `integer` | No | `20` | Number of items per page (max: 100) | `20` |
| `[paramName]` | `[type]` | `[Yes/No]` | `[default]` | `[Description]` | `[Example]` |

**Query Parameter Notes:**
- Additional notes about query parameters
- Validation rules
- Special behaviors

### Request Body

<!-- Remove this section if no request body (e.g., GET requests) -->

**Content-Type:** `application/json`

#### Schema

```json
{
  "field1": "string (required, 3-100 chars)",
  "field2": "integer (required, 0-100)",
  "field3": "boolean (optional)",
  "field4": ["string"] (optional, array),
  "nestedObject": {
    "nestedField1": "string",
    "nestedField2": "number"
  }
}
```

#### Field Descriptions

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `field1` | `string` | Yes | 3-100 characters | Description of field1 |
| `field2` | `integer` | Yes | 0-100 | Description of field2 |
| `field3` | `boolean` | No | - | Description of field3 |
| `field4` | `array<string>` | No | Max 10 items | Description of field4 |
| `nestedObject` | `object` | No | - | Description of nested object |
| `nestedObject.nestedField1` | `string` | Yes | - | Description of nested field |

#### Validation Rules

- Rule 1: Description of validation rule
- Rule 2: Description of validation rule
- Rule 3: Description of validation rule

#### Example Request

```json
{
  "field1": "Example value",
  "field2": 42,
  "field3": true,
  "field4": ["item1", "item2"],
  "nestedObject": {
    "nestedField1": "nested value",
    "nestedField2": 3.14
  }
}
```

**cURL Example:**

```bash
curl -X POST "http://localhost:8080/api/v1/endpoint-path" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "field1": "Example value",
    "field2": 42
  }'
```

### Response

#### Success Response: `200 OK`

**Description:** Successful response description

**Schema:**

```json
{
  "id": "uuid",
  "name": "string",
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T11:00:00Z"
}
```

**Response Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `uuid` | Unique identifier | `123e4567-e89b-12d3-a456-426614174000` |
| `name` | `string` | Resource name | `"Example Name"` |
| `createdAt` | `date-time` | Creation timestamp (ISO 8601) | `"2025-11-14T10:00:00Z"` |
| `updatedAt` | `date-time` | Last update timestamp (ISO 8601) | `"2025-11-14T11:00:00Z"` |

**Example Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Example Name",
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T11:00:00Z"
}
```

#### Success Response: `201 Created`

<!-- Use for POST requests that create resources -->

**Description:** Resource created successfully

**Schema:** Same as `200 OK` response

#### Error Response: `400 Bad Request`

**Description:** Validation error or invalid input

**Example Response:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field1": "Field1 must be between 3 and 100 characters",
      "field2": "Field2 must be between 0 and 100"
    }
  }
}
```

#### Error Response: `401 Unauthorized`

**Description:** Authentication required or failed

**Example Response:**

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please sign in.",
    "details": {
      "reason": "Missing or invalid JWT token"
    }
  }
}
```

#### Error Response: `403 Forbidden`

**Description:** Insufficient permissions

**Example Response:**

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

#### Error Response: `404 Not Found`

**Description:** Resource not found

**Example Response:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

#### Error Response: `429 Too Many Requests`

**Description:** Rate limit exceeded

**Example Response:**

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 3600
  }
}
```

#### Error Response: `500 Internal Server Error`

**Description:** Internal server error

**Example Response:**

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An internal server error occurred."
  }
}
```

### Example Requests/Responses

#### Example 1: [Scenario Name]

**Request:**

```http
GET /api/v1/endpoint-path/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Example Name",
  "createdAt": "2025-11-14T10:00:00Z"
}
```

#### Example 2: [Scenario Name]

<!-- Add more examples as needed -->

### Edge Cases

1. **Edge Case 1:** Description of edge case and how it's handled
2. **Edge Case 2:** Description of edge case and how it's handled
3. **Edge Case 3:** Description of edge case and how it's handled

### Rate Limiting

- **Limit:** `[X]` requests per `[time period]`
- **Headers:** Rate limit information included in response headers
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

### Notes

- Additional notes about the endpoint
- Important considerations
- Related endpoints or resources
- Future changes or deprecations

### Related Endpoints

- `[HTTP_METHOD] /api/v1/[related-endpoint]` - Description
- `[HTTP_METHOD] /api/v1/[related-endpoint]` - Description

---

## Template Usage Notes

### When Documenting Multiple Endpoints

1. Use consistent formatting across all endpoints
2. Group related endpoints together (e.g., all Gem endpoints)
3. Maintain a table of contents for easy navigation
4. Cross-reference related endpoints

### Best Practices

1. **Be Specific:** Include exact field names, types, and constraints
2. **Provide Examples:** Always include realistic example requests/responses
3. **Document Errors:** Document all possible error responses
4. **Update Regularly:** Keep documentation in sync with code changes
5. **Use Consistent Formatting:** Follow the same structure for all endpoints

### Common Patterns

#### Paginated List Endpoint

For endpoints that return lists with pagination:

```markdown
### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `1` | Page number (1-indexed) |
| `limit` | `integer` | No | `20` | Items per page (max: 100) |

### Response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Nested Object Schema

For complex nested structures:

```markdown
| Field | Type | Description |
|-------|------|-------------|
| `parentField` | `object` | Parent object description |
| `parentField.childField` | `string` | Child field description |
| `parentField.nestedObject` | `object` | Nested object description |
| `parentField.nestedObject.deepField` | `integer` | Deep nested field description |
```

