# Spring Boot Swagger/OpenAPI Annotations Guide

This guide shows how to use Spring Boot annotations to generate OpenAPI/Swagger documentation automatically from code.

## Prerequisites

### Maven Dependencies

Add the following dependencies to your `pom.xml`:

```xml
<dependencies>
    <!-- SpringDoc OpenAPI (Swagger UI) -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
</dependencies>
```

### Configuration

Add the following to your `application.yml`:

```yaml
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
  show-actuator: false
```

## Basic Annotations

### Controller-Level Annotations

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/gems")
@Tag(name = "Gems", description = "Gem management endpoints")
public class GemController {
    
    // Controller methods here
}
```

### Method-Level Annotations

#### GET Endpoint Example

```java
@GetMapping("/{id}")
@Operation(
    summary = "Get Gem by ID",
    description = "Retrieve detailed information about a specific Gem by its unique identifier."
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Gem found",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = GemResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "404",
        description = "Gem not found",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    )
})
@SecurityRequirement(name = "bearerAuth")
public ResponseEntity<GemResponse> getGemById(
    @Parameter(
        description = "Unique identifier of the Gem",
        required = true,
        example = "123e4567-e89b-12d3-a456-426614174000"
    )
    @PathVariable UUID id
) {
    // Implementation
}
```

#### POST Endpoint Example

```java
@PostMapping
@Operation(
    summary = "Create a new Gem",
    description = "Create a new Gem with the provided information. Requires authentication."
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "201",
        description = "Gem created successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = GemResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "400",
        description = "Validation error",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "401",
        description = "Authentication required",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    )
})
@SecurityRequirement(name = "bearerAuth")
public ResponseEntity<GemResponse> createGem(
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "Gem creation request",
        required = true,
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = CreateGemRequest.class),
            examples = @ExampleObject(
                name = "Example Request",
                value = """
                    {
                      "name": "Basilica del Santo Niño",
                      "description": "Historic Catholic basilica...",
                      "latitude": 10.3157,
                      "longitude": 123.8854,
                      "category": "historic",
                      "images": ["https://example.com/image.jpg"]
                    }
                    """
            )
        )
    )
    @Valid @RequestBody CreateGemRequest request
) {
    // Implementation
}
```

#### GET with Query Parameters Example

```java
@GetMapping
@Operation(
    summary = "List Gems",
    description = "Retrieve a paginated list of Gems with optional filtering and sorting."
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "List of Gems retrieved successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = GemListResponse.class)
        )
    )
})
public ResponseEntity<GemListResponse> listGems(
    @Parameter(
        description = "Page number (1-indexed)",
        example = "1"
    )
    @RequestParam(defaultValue = "1") int page,
    
    @Parameter(
        description = "Number of items per page (max: 100)",
        example = "20"
    )
    @RequestParam(defaultValue = "20") @Max(100) int limit,
    
    @Parameter(
        description = "Filter by category",
        example = "historic"
    )
    @RequestParam(required = false) String category,
    
    @Parameter(
        description = "Latitude for location-based search",
        example = "10.3157"
    )
    @RequestParam(required = false) Double lat,
    
    @Parameter(
        description = "Longitude for location-based search",
        example = "123.8854"
    )
    @RequestParam(required = false) Double lng
) {
    // Implementation
}
```

## Request/Response Schema Annotations

### Request DTO Example

```java
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to create a new Gem")
public class CreateGemRequest {
    
    @Schema(
        description = "Name of the Gem (3-100 characters)",
        example = "Basilica del Santo Niño",
        required = true,
        minLength = 3,
        maxLength = 100
    )
    @NotBlank
    @Size(min = 3, max = 100)
    private String name;
    
    @Schema(
        description = "Detailed description of the Gem (10-2000 characters)",
        example = "Historic Catholic basilica in Cebu City...",
        required = true,
        minLength = 10,
        maxLength = 2000
    )
    @NotBlank
    @Size(min = 10, max = 2000)
    private String description;
    
    @Schema(
        description = "Latitude coordinate (-90 to 90)",
        example = "10.3157",
        required = true,
        minimum = "-90",
        maximum = "90"
    )
    @NotNull
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private BigDecimal latitude;
    
    @Schema(
        description = "Longitude coordinate (-180 to 180)",
        example = "123.8854",
        required = true,
        minimum = "-180",
        maximum = "180"
    )
    @NotNull
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private BigDecimal longitude;
    
    @Schema(
        description = "Category of the Gem",
        example = "historic",
        required = true,
        allowableValues = {"historic", "cultural", "food", "nature", "art", "religious", "market", "other"}
    )
    @NotBlank
    private String category;
    
    @Schema(
        description = "Array of image URLs (max 10 images)",
        example = "[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"]",
        maxItems = 10
    )
    @Size(max = 10)
    private List<String> images;
    
    // Getters and setters
}
```

### Response DTO Example

```java
@Schema(description = "Gem response object")
public class GemResponse {
    
    @Schema(
        description = "Unique identifier",
        example = "123e4567-e89b-12d3-a456-426614174000"
    )
    private UUID id;
    
    @Schema(
        description = "Name of the Gem",
        example = "Basilica del Santo Niño"
    )
    private String name;
    
    @Schema(
        description = "Description of the Gem",
        example = "Historic Catholic basilica..."
    )
    private String description;
    
    @Schema(
        description = "Latitude coordinate",
        example = "10.3157"
    )
    private BigDecimal latitude;
    
    @Schema(
        description = "Longitude coordinate",
        example = "123.8854"
    )
    private BigDecimal longitude;
    
    @Schema(
        description = "Category of the Gem",
        example = "historic"
    )
    private String category;
    
    @Schema(
        description = "Array of image URLs",
        example = "[\"https://example.com/image1.jpg\"]"
    )
    private List<String> images;
    
    @Schema(
        description = "Number of vouches",
        example = "15"
    )
    private Integer vouchesCount;
    
    @Schema(
        description = "Average rating (1-5)",
        example = "4.8",
        nullable = true
    )
    private BigDecimal averageRating;
    
    @Schema(description = "Creator information")
    private UserInfo creator;
    
    @Schema(
        description = "Creation timestamp (ISO 8601)",
        example = "2025-11-14T10:00:00Z"
    )
    private LocalDateTime createdAt;
    
    @Schema(
        description = "Last update timestamp (ISO 8601)",
        example = "2025-11-14T11:00:00Z"
    )
    private LocalDateTime updatedAt;
    
    // Getters and setters
}
```

### Nested Object Example

```java
@Schema(description = "User information")
public class UserInfo {
    
    @Schema(
        description = "User ID",
        example = "123e4567-e89b-12d3-a456-426614174000"
    )
    private UUID id;
    
    @Schema(
        description = "Display name",
        example = "John Doe"
    )
    private String displayName;
    
    @Schema(
        description = "Avatar URL",
        example = "https://example.com/avatar.jpg",
        nullable = true
    )
    private String avatarUrl;
}
```

## Error Response Schema

```java
@Schema(description = "Error response object")
public class ErrorResponse {
    
    @Schema(description = "Error details")
    private ErrorDetails error;
    
    @Schema(description = "Error details")
    public static class ErrorDetails {
        
        @Schema(
            description = "Error code",
            example = "VALIDATION_ERROR"
        )
        private String code;
        
        @Schema(
            description = "Human-readable error message",
            example = "Validation failed"
        )
        private String message;
        
        @Schema(
            description = "Additional error details",
            example = "{\"field\": \"Error message\"}"
        )
        private Map<String, Object> details;
        
        // Getters and setters
    }
    
    // Getters and setters
}
```

## Global API Configuration

### OpenAPI Configuration Class

```java
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
    info = @Info(
        title = "Krawl API",
        version = "1.0.0",
        description = "API documentation for Krawl - The Living Map of Filipino Culture",
        contact = @Contact(
            name = "Krawl Development Team",
            email = "dev@krawl.app"
        ),
        license = @License(
            name = "MIT",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8080/api/v1",
            description = "Development server"
        ),
        @Server(
            url = "https://api.krawl.app/api/v1",
            description = "Production server"
        )
    }
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "JWT token obtained from authentication endpoint"
)
public class OpenApiConfig {
    // Configuration class
}
```

## Complete Controller Example

```java
package com.krawl.controller;

import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.response.GemResponse;
import com.krawl.dto.response.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gems")
@Tag(name = "Gems", description = "Gem management endpoints")
public class GemController {
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get Gem by ID",
        description = "Retrieve detailed information about a specific Gem by its unique identifier."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Gem found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = GemResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Gem not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    })
    public ResponseEntity<GemResponse> getGemById(
        @Parameter(
            description = "Unique identifier of the Gem",
            required = true,
            example = "123e4567-e89b-12d3-a456-426614174000"
        )
        @PathVariable UUID id
    ) {
        // Implementation
        return ResponseEntity.ok(new GemResponse());
    }
    
    @PostMapping
    @Operation(
        summary = "Create a new Gem",
        description = "Create a new Gem with the provided information. Requires authentication."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Gem created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = GemResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Validation error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Authentication required",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<GemResponse> createGem(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Gem creation request",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CreateGemRequest.class)
            )
        )
        @Valid @RequestBody CreateGemRequest request
    ) {
        // Implementation
        return ResponseEntity.status(HttpStatus.CREATED).body(new GemResponse());
    }
}
```

## Accessing Swagger UI

After adding the dependencies and annotations:

1. Start your Spring Boot application
2. Navigate to: `http://localhost:8080/swagger-ui.html`
3. View interactive API documentation
4. Test endpoints directly from the UI

## Best Practices

1. **Use Descriptive Summaries:** Write clear, concise summaries for each endpoint
2. **Document All Responses:** Include all possible response codes (200, 400, 401, 404, 500, etc.)
3. **Provide Examples:** Use `@ExampleObject` for request/response examples
4. **Document Parameters:** Always document path and query parameters
5. **Use Schema Annotations:** Annotate DTOs with `@Schema` for better documentation
6. **Group Related Endpoints:** Use `@Tag` to group related endpoints
7. **Document Security:** Use `@SecurityRequirement` for protected endpoints
8. **Keep It Updated:** Update annotations when code changes

## Additional Resources

- [SpringDoc OpenAPI Documentation](https://springdoc.org/)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger Annotations Reference](https://github.com/swagger-api/swagger-core/wiki/Swagger-2.X---Annotations)

