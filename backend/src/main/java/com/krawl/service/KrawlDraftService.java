package com.krawl.service;

import com.krawl.dto.response.KrawlDraftResponse;
import com.krawl.entity.KrawlDraft;
import com.krawl.entity.User;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.KrawlDraftRepository;
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
 * Service for managing Krawl creation drafts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KrawlDraftService {

    private final KrawlDraftRepository draftRepository;
    private final UserRepository userRepository;
    private static final int DRAFT_EXPIRATION_DAYS = 30;

    /**
     * List all drafts for a user.
     * 
     * @param userId User ID
     * @return List of draft responses
     */
    @Transactional(readOnly = true)
    public List<KrawlDraftResponse> listDrafts(UUID userId) {
        log.debug("Listing krawl drafts for user: {}", userId);
        List<KrawlDraft> drafts = draftRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        
        // Filter out expired drafts
        List<KrawlDraft> validDrafts = drafts.stream()
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
    public KrawlDraftResponse saveDraft(@NonNull UUID userId, Map<String, Object> data) {
        log.debug("Saving krawl draft for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(DRAFT_EXPIRATION_DAYS);

        KrawlDraft draft = KrawlDraft.builder()
                .user(user)
                .data(data)
                .createdAt(now)
                .updatedAt(now)
                .expiresAt(expiresAt)
                .build();

        draft = draftRepository.save(draft);
        log.info("Krawl draft saved: {} for user: {}", draft.getId(), userId);

        return mapToResponse(draft);
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
    public KrawlDraftResponse loadDraft(UUID draftId, UUID userId) {
        log.debug("Loading krawl draft: {} for user: {}", draftId, userId);

        KrawlDraft draft = draftRepository.findByIdAndUserId(draftId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Draft", "id", draftId));

        if (draft.isExpired()) {
            log.warn("Krawl draft {} has expired", draftId);
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
        log.debug("Deleting krawl draft: {} for user: {}", draftId, userId);

        KrawlDraft draft = draftRepository.findByIdAndUserId(draftId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Draft", "id", draftId));

        draftRepository.delete(draft);
        log.info("Krawl draft deleted: {} for user: {}", draftId, userId);
    }

    /**
     * Clean up expired drafts (can be called by scheduled task).
     */
    @Transactional
    public void cleanupExpiredDrafts() {
        log.debug("Cleaning up expired krawl drafts");
        LocalDateTime now = LocalDateTime.now();
        draftRepository.deleteExpiredDrafts(now);
        log.info("Expired krawl drafts cleaned up");
    }

    /**
     * Map KrawlDraft entity to response DTO.
     */
    private KrawlDraftResponse mapToResponse(@NonNull KrawlDraft draft) {
        return KrawlDraftResponse.builder()
                .id(draft.getId())
                .data(draft.getData())
                .createdAt(draft.getCreatedAt())
                .updatedAt(draft.getUpdatedAt())
                .expiresAt(draft.getExpiresAt())
                .build();
    }
}

