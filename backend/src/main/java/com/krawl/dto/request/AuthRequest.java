package com.krawl.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for Google OAuth authentication.
 */
@Data
public class AuthRequest {
    
    /**
     * Google OAuth access token.
     * Must be at least 20 characters long (Google tokens are typically much longer).
     */
    @NotBlank(message = "Token is required")
    @Size(min = 20, message = "Token must be at least 20 characters long")
    private String token;
}

