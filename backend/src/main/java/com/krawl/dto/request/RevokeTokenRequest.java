package com.krawl.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for token revocation endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevokeTokenRequest {
    
    @NotBlank(message = "Access token is required")
    private String accessToken;
    
    private String refreshToken; // Optional - if provided, should not be blank
}

