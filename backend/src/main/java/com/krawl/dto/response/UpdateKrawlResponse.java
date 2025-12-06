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
@Schema(description = "Response from update Krawl endpoint")
public class UpdateKrawlResponse {

    @Schema(description = "ID of the updated Krawl", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID krawlId;

    @Schema(description = "Success message", example = "Krawl updated successfully")
    private String message;
}
