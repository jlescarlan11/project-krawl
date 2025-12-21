package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Map;

@Data
@Schema(description = "Request to update notification preferences")
public class NotificationPreferencesRequest {

    @Schema(description = "Email notification preferences", example = "{\"comments\": true, \"vouches\": true, \"ratings\": true, \"weeklyDigest\": false}")
    private Map<String, Boolean> email;

    @Schema(description = "Push notification preferences (future)", example = "{\"krawlModeUpdates\": true, \"newContent\": false}")
    private Map<String, Boolean> push;
}

