package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request to update app preferences")
public class AppPreferencesRequest {

    @Schema(description = "Map style", example = "standard", allowableValues = {"standard", "satellite", "dark"})
    private String mapStyle;

    @Schema(description = "Language preference", example = "en", allowableValues = {"en", "ceb"})
    private String language;

    @Schema(description = "Units preference", example = "metric", allowableValues = {"metric", "imperial"})
    private String units;
}

