package com.krawl.controller;

import com.krawl.dto.request.CreateReportRequest;
import com.krawl.dto.response.ReportResponse;
import com.krawl.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reports", description = "API endpoints for reporting content (Gems and Krawls)")
public class ReportController {

    private final ReportService reportService;

    /**
     * POST /api/reports
     * Create a new report for a Gem or Krawl
     */
    @Operation(
            summary = "Create a report",
            description = "Creates a new report for a Gem or Krawl. Authentication is optional - guests can report content."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Report created successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ReportResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or validation error"),
            @ApiResponse(responseCode = "404", description = "Content (Gem/Krawl) not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody CreateReportRequest request) {

        log.debug("POST /api/reports for contentType: {}, contentId: {}",
                request.getContentType(), request.getContentId());

        // Get current user ID (nullable for guest reports)
        UUID userId = getCurrentUserId();

        ReportResponse response = reportService.createReport(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get current user ID from authentication context
     * Returns null if user is not authenticated (allows guest reports)
     *
     * @return User ID or null if not authenticated
     */
    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return UUID.fromString(userDetails.getUsername());
        } catch (Exception e) {
            log.warn("Failed to extract user ID from authentication", e);
            return null;
        }
    }
}

