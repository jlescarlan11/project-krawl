package com.krawl.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing Krawl draft information")
public class KrawlDraftResponse {

    @Schema(description = "ID of the draft", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Draft data (JSON)", example = "{\"name\": \"...\", \"category\": \"...\"}")
    private Map<String, Object> data;

    @Schema(description = "When the draft was created", example = "2025-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "When the draft was last updated", example = "2025-01-15T10:30:00")
    private LocalDateTime updatedAt;

    @Schema(description = "When the draft expires", example = "2025-02-14T10:30:00")
    private LocalDateTime expiresAt;
}

