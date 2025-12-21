package com.krawl.service;

import com.krawl.dto.request.CreateReportRequest;
import com.krawl.dto.response.ReportResponse;
import com.krawl.entity.Report;
import com.krawl.entity.User;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemRepository;
import com.krawl.repository.KrawlRepository;
import com.krawl.repository.ReportRepository;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final GemRepository gemRepository;
    private final KrawlRepository krawlRepository;
    private final UserRepository userRepository;

    /**
     * Create a new report for a Gem or Krawl
     *
     * @param request The report creation request
     * @param userId  The ID of the user creating the report (null for guest reports)
     * @return ReportResponse with the created report details
     * @throws ResourceNotFoundException if the content (Gem/Krawl) doesn't exist
     */
    @Transactional
    public ReportResponse createReport(CreateReportRequest request, UUID userId) {
        log.debug("Creating report for contentType: {}, contentId: {}, userId: {}",
                request.getContentType(), request.getContentId(), userId);

        // Validate that the content exists
        validateContentExists(request.getContentType(), request.getContentId());

        // Check for duplicate reports if user is authenticated
        if (userId != null) {
            boolean alreadyReported = reportRepository.existsByUserIdAndContentTypeAndContentId(
                    userId, request.getContentType(), request.getContentId());
            if (alreadyReported) {
                log.warn("User {} has already reported {} with id {}", userId, request.getContentType(), request.getContentId());
                // Note: We could throw an exception here, but for now we'll allow it
                // to prevent abuse detection. The database constraint will handle duplicates.
            }
        }

        // Fetch user if userId is provided
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElse(null); // User might not exist, but we'll still allow the report
            if (user == null) {
                log.warn("User with id {} not found, creating report without user association", userId);
            }
        }

        // Create and save the report
        Report report = Report.builder()
                .user(user)
                .contentType(request.getContentType())
                .contentId(request.getContentId())
                .reason(request.getReason())
                .description(request.getDescription())
                .status(Report.ReportStatus.PENDING)
                .build();

        report = reportRepository.save(report);
        log.info("Report created successfully with id: {}", report.getId());

        return toReportResponse(report);
    }

    /**
     * Validate that the content (Gem or Krawl) exists
     *
     * @param contentType The type of content (GEM or KRAWL)
     * @param contentId   The ID of the content
     * @throws ResourceNotFoundException if the content doesn't exist
     */
    private void validateContentExists(Report.ContentType contentType, UUID contentId) {
        boolean exists = false;
        String contentName = "";

        switch (contentType) {
            case GEM:
                exists = gemRepository.existsById(contentId);
                contentName = "Gem";
                break;
            case KRAWL:
                exists = krawlRepository.existsById(contentId);
                contentName = "Krawl";
                break;
        }

        if (!exists) {
            log.warn("{} with id {} not found", contentName, contentId);
            throw new ResourceNotFoundException(contentName, "id", contentId);
        }
    }

    /**
     * Convert Report entity to ReportResponse DTO
     *
     * @param report The report entity
     * @return ReportResponse DTO
     */
    private ReportResponse toReportResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId().toString())
                .contentType(report.getContentType())
                .contentId(report.getContentId().toString())
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .reviewedAt(report.getReviewedAt())
                .build();
    }
}

