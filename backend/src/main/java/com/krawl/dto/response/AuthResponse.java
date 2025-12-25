package com.krawl.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String jwt; // Access token
    private String refreshToken; // Refresh token
    private UserResponse user;
    @JsonProperty("isNewUser")
    private boolean isNewUser;
}

