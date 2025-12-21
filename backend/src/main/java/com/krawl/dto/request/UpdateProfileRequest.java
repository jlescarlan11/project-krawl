package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request to update user profile")
public class UpdateProfileRequest {

    @Schema(description = "Display name (max 100 characters)", example = "John Doe")
    @Size(max = 100, message = "Display name must not exceed 100 characters")
    private String displayName;

    @Schema(description = "Bio/description (max 500 characters)", example = "I love exploring Cebu!")
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Schema(description = "Avatar URL from Cloudinary", example = "https://res.cloudinary.com/...")
    private String avatarUrl;
}

