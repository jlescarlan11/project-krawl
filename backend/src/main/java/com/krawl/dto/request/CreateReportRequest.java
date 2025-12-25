package com.krawl.dto.request;

import com.krawl.entity.Report;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReportRequest {

    @NotNull(message = "Content type is required")
    private Report.ContentType contentType;

    @NotNull(message = "Content ID is required")
    private UUID contentId;

    @NotNull(message = "Report reason is required")
    private Report.ReportReason reason;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}




