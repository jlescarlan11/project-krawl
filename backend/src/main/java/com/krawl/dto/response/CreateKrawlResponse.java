package com.krawl.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response from create Krawl endpoint")
public class CreateKrawlResponse {

    @Schema(description = "ID of the created Krawl", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID krawlId;

    @Schema(description = "Success message", example = "Krawl created successfully")
    private String message;
}
