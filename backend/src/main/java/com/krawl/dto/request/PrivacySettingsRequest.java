package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Map;

@Data
@Schema(description = "Request to update privacy settings")
public class PrivacySettingsRequest {

    @Schema(description = "Profile visibility", example = "public", allowableValues = {"public", "private", "friends_only"})
    private String profileVisibility;

    @Schema(description = "Privacy toggles", example = "{\"showEmail\": false, \"showStatistics\": true, \"showActivity\": true}")
    private Map<String, Boolean> toggles;
}

