package com.krawl.dto.response;

import com.krawl.entity.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private String id;
    private Report.ContentType contentType;
    private String contentId;
    private Report.ReportReason reason;
    private String description;
    private Report.ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
}







