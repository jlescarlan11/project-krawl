package com.krawl.service;

import com.krawl.dto.request.CompleteGemRequest;
import com.krawl.dto.request.UpdateProgressRequest;
import com.krawl.dto.response.KrawlProgressResponse;
import com.krawl.dto.response.KrawlSessionResponse;
import com.krawl.entity.*;
import com.krawl.exception.AuthException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KrawlModeService {

    private final KrawlSessionRepository krawlSessionRepository;
    private final KrawlProgressRepository krawlProgressRepository;
    private final KrawlRepository krawlRepository;
    private final GemRepository gemRepository;
    private final UserRepository userRepository;

    /**
     * Start a new Krawl Mode session
     *
     * @param krawlId The UUID of the krawl to start
     * @param userId The UUID of the user starting the session
     * @return KrawlSessionResponse with session information
     * @throws ResourceNotFoundException if krawl not found
     * @throws AuthException if user not found
     */
    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public KrawlSessionResponse startSession(@NonNull UUID krawlId, @NonNull UUID userId) {
        log.debug("Starting Krawl Mode session for krawlId: {}, userId: {}", krawlId, userId);

        // Validate krawl exists
        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.UNAUTHORIZED));

        // Check if there's an active session for this user and krawl
        krawlSessionRepository.findActiveSessionByKrawlAndUser(krawlId, userId)
                .ifPresent(existingSession -> {
                    log.debug("Found existing active session, returning it");
                    // Return existing session instead of creating a new one
                });

        // Create new session
        KrawlSession session = KrawlSession.builder()
                .krawl(krawl)
                .user(user)
                .status(KrawlSession.SessionStatus.ACTIVE)
                .totalDistanceMeters(0.0)
                .build();

        // JPA save() is guaranteed to return non-null per specification
        KrawlSession savedSession = krawlSessionRepository.save(session);
        session = Objects.requireNonNull(savedSession, "Session save failed");
        log.info("Created Krawl Mode session: {}", session.getId());

        return buildSessionResponse(session);
    }

    /**
     * Stop a Krawl Mode session
     *
     * @param krawlId The UUID of the krawl
     * @param userId The UUID of the user
     * @return KrawlSessionResponse with updated session information
     */
    @Transactional
    public KrawlSessionResponse stopSession(@NonNull UUID krawlId, @NonNull UUID userId) {
        log.debug("Stopping Krawl Mode session for krawlId: {}, userId: {}", krawlId, userId);

        KrawlSession session = krawlSessionRepository.findActiveSessionByKrawlAndUser(krawlId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Active session", "krawlId and userId", krawlId + "/" + userId));

        session.abandon();
        session = krawlSessionRepository.save(session);

        log.info("Stopped Krawl Mode session: {}", session.getId());
        return buildSessionResponse(session);
    }

    /**
     * Get current active session for a krawl
     *
     * @param krawlId The UUID of the krawl
     * @param userId The UUID of the user
     * @return KrawlSessionResponse with session information
     */
    @Transactional(readOnly = true)
    public KrawlSessionResponse getSession(@NonNull UUID krawlId, @NonNull UUID userId) {
        log.debug("Getting Krawl Mode session for krawlId: {}, userId: {}", krawlId, userId);

        KrawlSession session = krawlSessionRepository.findActiveSessionByKrawlAndUser(krawlId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Active session", "krawlId and userId", krawlId + "/" + userId));

        return buildSessionResponse(session);
    }

    /**
     * Update progress for a session
     *
     * @param krawlId The UUID of the krawl
     * @param userId The UUID of the user
     * @param request Update progress request
     * @return KrawlSessionResponse with updated session information
     */
    @Transactional
    public KrawlSessionResponse updateProgress(@NonNull UUID krawlId, @NonNull UUID userId, @NonNull UpdateProgressRequest request) {
        log.debug("Updating progress for krawlId: {}, userId: {}", krawlId, userId);

        KrawlSession session = krawlSessionRepository.findActiveSessionByKrawlAndUser(krawlId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Active session", "krawlId and userId", krawlId + "/" + userId));

        if (request.getTotalDistanceMeters() != null) {
            session.setTotalDistanceMeters(request.getTotalDistanceMeters());
            session = krawlSessionRepository.save(session);
        }

        return buildSessionResponse(session);
    }

    /**
     * Mark a gem as completed in a session
     *
     * @param krawlId The UUID of the krawl
     * @param userId The UUID of the user
     * @param request Complete gem request
     * @return KrawlProgressResponse with updated progress
     */
    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public KrawlProgressResponse completeGem(@NonNull UUID krawlId, @NonNull UUID userId, @NonNull CompleteGemRequest request) {
        log.debug("Completing gem {} for krawlId: {}, userId: {}", request.getGemId(), krawlId, userId);

        KrawlSession session = krawlSessionRepository.findActiveSessionByKrawlAndUser(krawlId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Active session", "krawlId and userId", krawlId + "/" + userId));

        // Validate gem exists
        UUID gemId = Objects.requireNonNull(request.getGemId(), "Gem ID is required");
        Gem gem = gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        // Check if gem is already completed
        if (krawlProgressRepository.existsBySessionIdAndGemId(session.getId(), gemId)) {
            log.debug("Gem {} already completed in session {}", gemId, session.getId());
        } else {
            // Create progress entry
            KrawlProgress.ArrivalMethod arrivalMethod = "MANUAL".equals(request.getArrivalMethod())
                    ? KrawlProgress.ArrivalMethod.MANUAL
                    : KrawlProgress.ArrivalMethod.AUTOMATIC;

            KrawlProgress progress = KrawlProgress.builder()
                    .session(session)
                    .gem(gem)
                    .distanceToGemMeters(request.getDistanceToGemMeters())
                    .arrivalMethod(arrivalMethod)
                    .build();

            // JPA save() is guaranteed to return non-null per specification
            KrawlProgress savedProgress = krawlProgressRepository.save(progress);
            Objects.requireNonNull(savedProgress, "Progress save failed");
            log.info("Marked gem {} as completed in session {}", gemId, session.getId());
        }

        // Check if all gems are completed
        Krawl krawl = session.getKrawl();
        long completedCount = krawlProgressRepository.countBySessionId(session.getId());
        int totalGems = krawl.getGems().size();

        if (completedCount >= totalGems) {
            session.complete();
            krawlSessionRepository.save(session);
            log.info("All gems completed, marking session {} as completed", session.getId());
        }

        return buildProgressResponse(session);
    }

    /**
     * Get progress for a session
     *
     * @param krawlId The UUID of the krawl
     * @param userId The UUID of the user
     * @return KrawlProgressResponse with progress information
     */
    @Transactional(readOnly = true)
    public KrawlProgressResponse getProgress(@NonNull UUID krawlId, @NonNull UUID userId) {
        log.debug("Getting progress for krawlId: {}, userId: {}", krawlId, userId);

        KrawlSession session = krawlSessionRepository.findActiveSessionByKrawlAndUser(krawlId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Active session", "krawlId and userId", krawlId + "/" + userId));

        return buildProgressResponse(session);
    }

    /**
     * Build session response from entity
     */
    private KrawlSessionResponse buildSessionResponse(KrawlSession session) {
        long completedGemsCount = krawlProgressRepository.countBySessionId(session.getId());
        int totalGemsCount = session.getKrawl().getGems().size();

        return KrawlSessionResponse.builder()
                .sessionId(session.getId())
                .krawlId(session.getKrawl().getId())
                .userId(session.getUser().getId())
                .startedAt(session.getStartedAt())
                .endedAt(session.getEndedAt())
                .status(session.getStatus().name())
                .totalDistanceMeters(session.getTotalDistanceMeters())
                .completedGemsCount(completedGemsCount)
                .totalGemsCount(totalGemsCount)
                .build();
    }

    /**
     * Build progress response from session
     */
    private KrawlProgressResponse buildProgressResponse(KrawlSession session) {
        long completedGemsCount = krawlProgressRepository.countBySessionId(session.getId());
        int totalGemsCount = session.getKrawl().getGems().size();
        double progressPercentage = totalGemsCount > 0
                ? (completedGemsCount * 100.0) / totalGemsCount
                : 0.0;

        List<UUID> completedGemIds = krawlProgressRepository.findBySessionId(session.getId()).stream()
                .map(progress -> progress.getGem().getId())
                .collect(Collectors.toList());

        // Find next gem ID
        UUID nextGemId = null;
        List<KrawlGem> gems = session.getKrawl().getGems();
        for (KrawlGem krawlGem : gems) {
            if (!completedGemIds.contains(krawlGem.getGem().getId())) {
                nextGemId = krawlGem.getGem().getId();
                break;
            }
        }

        return KrawlProgressResponse.builder()
                .sessionId(session.getId())
                .completedGemsCount(completedGemsCount)
                .totalGemsCount(totalGemsCount)
                .progressPercentage(progressPercentage)
                .completedGemIds(completedGemIds)
                .nextGemId(nextGemId)
                .build();
    }
}

