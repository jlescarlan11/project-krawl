package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request to start a Krawl Mode session")
public class StartKrawlModeRequest {
    // Currently no fields needed - session is created based on krawl ID and authenticated user
    // Future: could add initial location, device info, etc.
}

