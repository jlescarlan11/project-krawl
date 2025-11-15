# API Documentation Templates

This directory contains templates and guides for documenting API endpoints in the Krawl project.

## Overview

The Krawl API uses OpenAPI 3.0 specification for API documentation. Documentation can be generated automatically from Spring Boot code annotations or written manually using the provided templates.

## Files in This Directory

### 1. `API_ENDPOINT_TEMPLATE_OPENAPI.yaml`

**Purpose:** OpenAPI 3.0 YAML template for documenting endpoints

**Use Case:** 
- When creating comprehensive OpenAPI specification files
- When integrating with API documentation tools
- When generating client SDKs from API documentation

**How to Use:**
1. Copy the template file
2. Fill in endpoint details following the template structure
3. Replace placeholder schemas with actual request/response schemas
4. Add to your main OpenAPI specification file or use as standalone

**Key Features:**
- Complete OpenAPI 3.0 structure
- Reusable component schemas
- Security scheme definitions
- Comprehensive error response examples
- Support for nested objects and complex structures

### 2. `API_ENDPOINT_TEMPLATE_MARKDOWN.md`

**Purpose:** Markdown template for manual API endpoint documentation

**Use Case:**
- When writing human-readable API documentation
- When documenting endpoints in markdown files
- When creating developer guides or API reference documentation

**How to Use:**
1. Copy the template for each endpoint
2. Fill in all sections marked with `[REPLACE]` or `<!-- ... -->`
3. Remove placeholder comments
4. Follow the structure consistently across all endpoints

**Key Features:**
- Detailed endpoint documentation structure
- Request/response examples
- Error response documentation
- Edge case documentation
- Rate limiting information
- Related endpoints cross-references

### 3. `SPRING_BOOT_SWAGGER_ANNOTATIONS.md`

**Purpose:** Guide for using Spring Boot annotations to generate OpenAPI documentation

**Use Case:**
- When implementing endpoints in Spring Boot
- When generating documentation automatically from code
- When setting up Swagger UI for interactive API documentation

**How to Use:**
1. Add SpringDoc OpenAPI dependency to `pom.xml`
2. Configure `application.yml` for Swagger UI
3. Add annotations to controllers and DTOs following the examples
4. Access Swagger UI at `/swagger-ui.html`

**Key Features:**
- Complete annotation examples
- Request/Response DTO annotation patterns
- Error response schema examples
- Global API configuration
- Best practices and tips

## Documentation Workflow

### Option 1: Code-First Approach (Recommended)

1. **Implement Endpoint:** Write Spring Boot controller with Swagger annotations
2. **Generate Documentation:** Documentation is automatically generated from annotations
3. **View in Swagger UI:** Access interactive documentation at `/swagger-ui.html`
4. **Export OpenAPI Spec:** Export OpenAPI YAML from Swagger UI if needed

**Advantages:**
- Documentation stays in sync with code
- Less manual work
- Interactive testing via Swagger UI
- Automatic validation

### Option 2: Documentation-First Approach

1. **Write OpenAPI Spec:** Create OpenAPI YAML using the template
2. **Generate Code:** Use OpenAPI Generator to create Spring Boot code stubs
3. **Implement Logic:** Fill in the generated code with business logic
4. **Maintain:** Keep OpenAPI spec updated as code evolves

**Advantages:**
- API design before implementation
- Contract-first development
- Can generate client SDKs

### Option 3: Hybrid Approach

1. **Design API:** Create initial OpenAPI spec for planning
2. **Implement Endpoint:** Write Spring Boot code with annotations
3. **Sync Documentation:** Update OpenAPI spec to match implementation
4. **Maintain Both:** Keep both code annotations and OpenAPI spec updated

## Template Structure

### OpenAPI Template Structure

```
openapi: 3.0.3
info:
  - API metadata (title, version, description)
servers:
  - Server URLs (dev, staging, prod)
tags:
  - Endpoint grouping
paths:
  - Individual endpoint definitions
components:
  - Reusable schemas
  - Security schemes
```

### Markdown Template Structure

```
1. Endpoint Summary
2. Description
3. Authentication
4. Endpoint Details
5. Path Parameters
6. Query Parameters
7. Request Body (if applicable)
8. Response Schemas
9. Error Responses
10. Example Requests/Responses
11. Edge Cases
12. Rate Limiting
13. Notes
14. Related Endpoints
```

## Required Elements

All endpoint documentation must include:

- ✅ **Endpoint URL and Method** - Complete path and HTTP method
- ✅ **Description** - What the endpoint does and when to use it
- ✅ **Request Parameters** - Path, query, and body parameters
- ✅ **Request Body Schema** - Structure and validation rules (if applicable)
- ✅ **Response Schema** - Success response structure
- ✅ **Error Responses** - All possible error codes and responses
- ✅ **Example Requests/Responses** - Realistic examples
- ✅ **Authentication Requirements** - Whether auth is required and how

## Best Practices

### 1. Consistency

- Use the same structure for all endpoints
- Follow naming conventions consistently
- Use consistent date/time formats (ISO 8601)
- Use consistent UUID formats

### 2. Completeness

- Document all possible response codes
- Include all request/response fields
- Document validation rules
- Include edge cases

### 3. Clarity

- Use clear, descriptive names
- Provide detailed descriptions
- Include realistic examples
- Explain complex business logic

### 4. Maintainability

- Keep documentation updated with code changes
- Review documentation regularly
- Remove deprecated endpoints
- Update version numbers

## Common Patterns

### Paginated List Endpoint

```yaml
parameters:
  - name: page
    in: query
    schema:
      type: integer
      default: 1
  - name: limit
    in: query
    schema:
      type: integer
      default: 20
      maximum: 100
responses:
  '200':
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              type: array
            pagination:
              $ref: '#/components/schemas/Pagination'
```

### Nested Object Schema

```yaml
components:
  schemas:
    ParentObject:
      type: object
      properties:
        nestedObject:
          type: object
          properties:
            field1:
              type: string
            field2:
              type: integer
```

### Authentication Required Endpoint

```yaml
security:
  - bearerAuth: []
```

## Integration with Existing Documentation

The templates are designed to work with the existing API documentation:

- **Location:** `docs/private-docs/technical/API_DOCUMENTATION.md`
- **Format:** Markdown with detailed endpoint descriptions
- **Purpose:** Comprehensive API reference

**Workflow:**
1. Use templates to document new endpoints
2. Add documented endpoints to main API documentation file
3. Keep both Swagger UI and markdown documentation updated

## Testing Documentation

### Verify Template Completeness

- [ ] All required sections filled in
- [ ] Examples are realistic and complete
- [ ] Error responses documented
- [ ] Authentication requirements clear
- [ ] Edge cases documented

### Verify Template Usability

- [ ] Easy to copy and modify
- [ ] Clear instructions provided
- [ ] Examples are helpful
- [ ] Structure is logical

### Verify Generated Documentation

- [ ] Swagger UI displays correctly
- [ ] All endpoints visible
- [ ] Request/response schemas accurate
- [ ] Examples work correctly
- [ ] Error responses documented

## Resources

### Documentation

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [SpringDoc OpenAPI Documentation](https://springdoc.org/)
- [Swagger Annotations Reference](https://github.com/swagger-api/swagger-core/wiki/Swagger-2.X---Annotations)

### Tools

- **Swagger UI:** Interactive API documentation (`/swagger-ui.html`)
- **OpenAPI Generator:** Generate client SDKs from OpenAPI specs
- **Postman:** Import OpenAPI specs for API testing

## Support

For questions or issues with the templates:

1. Check the examples in each template file
2. Review the Spring Boot annotations guide
3. Consult the OpenAPI 3.0 specification
4. Check existing API documentation for reference

---

**Last Updated:** 2025-11-14  
**Version:** 1.0.0  
**Status:** Active

