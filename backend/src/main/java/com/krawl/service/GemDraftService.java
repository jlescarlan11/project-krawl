package com.krawl.service;

import com.krawl.dto.response.GemDraftResponse;
import com.krawl.entity.GemDraft;
import com.krawl.entity.User;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemDraftRepository;
import com.krawl.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing Gem creation drafts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GemDraftService {

    private final GemDraftRepository draftRepository;
    private final UserRepository userRepository;
    private static final int DRAFT_EXPIRATION_DAYS = 30;

    /**
     * List all drafts for a user.
     * 
     * @param userId User ID
     * @return List of draft responses
     */
    @Transactional(readOnly = true)
    public List<GemDraftResponse> listDrafts(UUID userId) {
        log.debug("Listing drafts for user: {}", userId);
        List<GemDraft> drafts = draftRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        
        // Filter out expired drafts
        List<GemDraft> validDrafts = drafts.stream()
                .filter(draft -> !draft.isExpired())
                .collect(Collectors.toList());

        return validDrafts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Save or update a draft.
     * 
     * @param userId User ID
     * @param data Draft data
     * @return Saved draft response
     */
    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public GemDraftResponse saveDraft(@NonNull UUID userId, Map<String, Object> data) {
        log.debug("Saving draft for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(DRAFT_EXPIRATION_DAYS);

        GemDraft draft = GemDraft.builder()
                .user(user)
                .data(data)
                .createdAt(now)
                .updatedAt(now)
                .expiresAt(expiresAt)
                .build();

        GemDraft savedDraft = draftRepository.save(draft);
        log.info("Draft saved: {} for user: {}", savedDraft.getId(), userId);

        return mapToResponse(savedDraft);
    }

    /**
     * Load a draft by ID.
     * 
     * @param draftId Draft ID
     * @param userId User ID (for authorization)
     * @return Draft response
     * @throws ResourceNotFoundException if draft not found
     * @throws ForbiddenException if user doesn't own the draft
     */
    @Transactional(readOnly = true)
    public GemDraftResponse loadDraft(UUID draftId, UUID userId) {
        log.debug("Loading draft: {} for user: {}", draftId, userId);

        GemDraft draft = draftRepository.findByIdAndUserId(draftId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Draft", "id", draftId));

        if (draft.isExpired()) {
            log.warn("Draft {} has expired", draftId);
            throw new ResourceNotFoundException("Draft", "id", draftId);
        }

        return mapToResponse(draft);
    }

    /**
     * Delete a draft.
     * 
     * @param draftId Draft ID
     * @param userId User ID (for authorization)
     * @throws ResourceNotFoundException if draft not found
     * @throws ForbiddenException if user doesn't own the draft
     */
    @Transactional
    @SuppressWarnings("null") // orElseThrow() guarantees non-null, delete() expects non-null
    public void deleteDraft(UUID draftId, UUID userId) {
        log.debug("Deleting draft: {} for user: {}", draftId, userId);

        GemDraft draft = draftRepository.findByIdAndUserId(draftId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Draft", "id", draftId));

        draftRepository.delete(draft);
        log.info("Draft deleted: {} for user: {}", draftId, userId);
    }

    /**
     * Clean up expired drafts (can be called by scheduled task).
     */
    @Transactional
    public void cleanupExpiredDrafts() {
        log.debug("Cleaning up expired drafts");
        LocalDateTime now = LocalDateTime.now();
        draftRepository.deleteExpiredDrafts(now);
        log.info("Expired drafts cleaned up");
    }

    /**
     * Map GemDraft entity to response DTO.
     */
    private GemDraftResponse mapToResponse(@NonNull GemDraft draft) {
        return GemDraftResponse.builder()
                .id(draft.getId())
                .data(draft.getData())
                .createdAt(draft.getCreatedAt())
                .updatedAt(draft.getUpdatedAt())
                .expiresAt(draft.getExpiresAt())
                .build();
    }
}

