package com.krawl.service;

import com.krawl.dto.request.*;
import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.GemVouch;
import com.krawl.entity.Krawl;
import com.krawl.entity.User;
import com.krawl.exception.AuthException;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final GemRepository gemRepository;
    private final KrawlRepository krawlRepository;
    private final GemVouchRepository gemVouchRepository;
    private final KrawlVouchRepository krawlVouchRepository;
    private final GemService gemService;
    private final KrawlService krawlService;
    private final EmailService emailService;

    /**
     * Result class for user creation/update operations.
     * Contains the user entity and a flag indicating if this is a new user.
     */
    public static class UserCreationResult {
        private final User user;
        private final boolean isNewUser;

        public UserCreationResult(User user, boolean isNewUser) {
            this.user = user;
            this.isNewUser = isNewUser;
        }

        public User getUser() {
            return user;
        }

        public boolean isNewUser() {
            return isNewUser;
        }
    }

    /**
     * Creates a new user or updates existing user from Google OAuth information.
     * Handles concurrent login attempts and email conflicts.
     * 
     * @param googleInfo Google user information from OAuth token
     * @return UserCreationResult containing user and isNewUser flag
     * @throws AuthException if email conflict occurs or user creation fails
     */
    @Transactional(rollbackFor = Exception.class)
    public UserCreationResult createOrUpdateUser(GoogleUserInfo googleInfo) {
        try {
            // Try to find existing user by Google ID
            Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleInfo.getGoogleId());
            
            boolean isNewUser = false;
            User user;
            
            if (existingByGoogleId.isPresent()) {
                // Existing user - update
                user = updateUser(existingByGoogleId.get(), googleInfo);
                log.info("User updated: {} (ID: {})", user.getEmail(), user.getId());
            } else {
                // Check for email conflict
                Optional<User> existingByEmail = userRepository.findByEmail(googleInfo.getEmail());
                if (existingByEmail.isPresent()) {
                    // Email exists but with different Google ID - account linking future feature
                    throw new AuthException(
                        "Email already exists with different account. Account linking coming soon.",
                        HttpStatus.CONFLICT);
                }
                
                // Create new user
                user = createNewUser(googleInfo);
                isNewUser = true;
                log.info("New user created: {} (ID: {})", user.getEmail(), user.getId());
                
                // Send welcome email asynchronously
                emailService.sendWelcomeEmail(user.getEmail(), user.getDisplayName());
            }
            
            // Update last login timestamp
            user.setLastLoginAt(LocalDateTime.now());
            user = userRepository.save(user);
            
            return new UserCreationResult(user, isNewUser);
            
        } catch (DataIntegrityViolationException e) {
            // Handle concurrent creation - retry by finding existing user
            log.warn("Concurrent user creation detected for Google ID: {}", googleInfo.getGoogleId());
            Optional<User> existingUser = userRepository.findByGoogleId(googleInfo.getGoogleId());
            if (existingUser.isPresent()) {
                User user = updateUser(existingUser.get(), googleInfo);
                user.setLastLoginAt(LocalDateTime.now());
                user = userRepository.save(user);
                return new UserCreationResult(user, false);
            }
            // If still not found, rethrow the exception
            throw new AuthException("Failed to create user due to database constraint violation", HttpStatus.CONFLICT);
        }
    }
    
    /**
     * Creates a new user with default avatar if not provided.
     */
    private User createNewUser(GoogleUserInfo googleInfo) {
        // Handle default avatar
        String avatarUrl = googleInfo.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            avatarUrl = generateDefaultAvatarUrl(googleInfo.getEmail(), googleInfo.getDisplayName());
        }
        
        User newUser = User.builder()
            .email(googleInfo.getEmail())
            .displayName(googleInfo.getDisplayName())
            .avatarUrl(avatarUrl)
            .googleId(googleInfo.getGoogleId())
            .lastLoginAt(LocalDateTime.now())
            .build();
        
        return userRepository.save(newUser);
    }
    
    /**
     * Updates existing user information.
     */
    private User updateUser(User user, GoogleUserInfo googleInfo) {
        boolean updated = false;
        
        if (!googleInfo.getEmail().equals(user.getEmail())) {
            user.setEmail(googleInfo.getEmail());
            updated = true;
        }
        
        if (googleInfo.getDisplayName() != null && 
            !googleInfo.getDisplayName().equals(user.getDisplayName())) {
            user.setDisplayName(googleInfo.getDisplayName());
            updated = true;
        }
        
        // Update avatar if changed, or set default if null
        String newAvatarUrl = googleInfo.getAvatarUrl();
        if (newAvatarUrl == null || newAvatarUrl.isEmpty()) {
            newAvatarUrl = generateDefaultAvatarUrl(googleInfo.getEmail(), googleInfo.getDisplayName());
        }
        
        if (!newAvatarUrl.equals(user.getAvatarUrl())) {
            user.setAvatarUrl(newAvatarUrl);
            updated = true;
        }
        
        if (updated) {
            return userRepository.save(user);
        }
        
        return user;
    }
    
    /**
     * Generates a default avatar URL using initials.
     * For now, returns a placeholder URL. Can be enhanced to use a service like UI Avatars.
     */
    private String generateDefaultAvatarUrl(String email, String displayName) {
        // Simple placeholder - can be enhanced with actual avatar generation service
        String initials = displayName != null && !displayName.isEmpty() 
            ? displayName.substring(0, Math.min(2, displayName.length())).toUpperCase()
            : email.substring(0, Math.min(2, email.length())).toUpperCase();
        
        // Using a placeholder service - replace with actual implementation if needed
        return String.format("https://ui-avatars.com/api/?name=%s&background=random&size=128", 
            initials.replace(" ", "+"));
    }

    /**
     * Get user profile with statistics
     */
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(UUID userId) {
        log.debug("Fetching user profile for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserStatisticsResponse statistics = getUserStatistics(userId);

        return UserProfileResponse.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .statistics(statistics)
                .privacySettings(user.getPrivacySettings())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Get user statistics
     */
    @Transactional(readOnly = true)
    public UserStatisticsResponse getUserStatistics(UUID userId) {
        log.debug("Calculating statistics for userId: {}", userId);

        long gemsCreated = gemRepository.countByCreatedById(userId);
        long krawlsCreated = krawlRepository.countByCreatedById(userId);
        long vouchesGiven = gemVouchRepository.countByUserId(userId);
        // TODO: Implement Krawl completion tracking when Krawl Mode is implemented
        long krawlsCompleted = 0L;

        return UserStatisticsResponse.builder()
                .gemsCreated(gemsCreated)
                .krawlsCreated(krawlsCreated)
                .vouchesGiven(vouchesGiven)
                .krawlsCompleted(krawlsCompleted)
                .build();
    }

    /**
     * Get user's created Gems (paginated)
     */
    @Transactional(readOnly = true)
    public UserContentResponse<GemDetailResponse> getUserGems(UUID userId, Pageable pageable) {
        log.debug("Fetching Gems for userId: {}, page: {}, size: {}", userId, pageable.getPageNumber(), pageable.getPageSize());

        Page<Gem> gemPage = gemRepository.findByCreatedByIdOrderByCreatedAtDesc(userId, pageable);

        List<GemDetailResponse> gemResponses = gemPage.getContent().stream()
                .map(gem -> gemService.getGemDetail(gem.getId(), null))
                .collect(Collectors.toList());

        return UserContentResponse.<GemDetailResponse>builder()
                .content(gemResponses)
                .page(gemPage.getNumber())
                .size(gemPage.getSize())
                .totalElements(gemPage.getTotalElements())
                .totalPages(gemPage.getTotalPages())
                .hasNext(gemPage.hasNext())
                .hasPrevious(gemPage.hasPrevious())
                .build();
    }

    /**
     * Get user's created Krawls (paginated)
     */
    @Transactional(readOnly = true)
    public UserContentResponse<KrawlDetailResponse> getUserKrawls(UUID userId, Pageable pageable) {
        log.debug("Fetching Krawls for userId: {}, page: {}, size: {}", userId, pageable.getPageNumber(), pageable.getPageSize());

        Page<Krawl> krawlPage = krawlRepository.findByCreatedByIdOrderByCreatedAtDesc(userId, pageable);

        List<KrawlDetailResponse> krawlResponses = krawlPage.getContent().stream()
                .map(krawl -> krawlService.getKrawlDetail(krawl.getId(), null))
                .collect(Collectors.toList());

        return UserContentResponse.<KrawlDetailResponse>builder()
                .content(krawlResponses)
                .page(krawlPage.getNumber())
                .size(krawlPage.getSize())
                .totalElements(krawlPage.getTotalElements())
                .totalPages(krawlPage.getTotalPages())
                .hasNext(krawlPage.hasNext())
                .hasPrevious(krawlPage.hasPrevious())
                .build();
    }

    /**
     * Get user's vouched Gems (paginated)
     */
    @Transactional(readOnly = true)
    public UserContentResponse<GemDetailResponse> getUserVouchedGems(UUID userId, Pageable pageable) {
        log.debug("Fetching vouched Gems for userId: {}, page: {}, size: {}", userId, pageable.getPageNumber(), pageable.getPageSize());

        Page<GemVouch> vouchPage = gemVouchRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<GemDetailResponse> gemResponses = vouchPage.getContent().stream()
                .map(vouch -> gemService.getGemDetail(vouch.getGem().getId(), null))
                .collect(Collectors.toList());

        return UserContentResponse.<GemDetailResponse>builder()
                .content(gemResponses)
                .page(vouchPage.getNumber())
                .size(vouchPage.getSize())
                .totalElements(vouchPage.getTotalElements())
                .totalPages(vouchPage.getTotalPages())
                .hasNext(vouchPage.hasNext())
                .hasPrevious(vouchPage.hasPrevious())
                .build();
    }

    /**
     * Get user's completed Krawls (paginated)
     * TODO: Implement when Krawl Mode completion tracking is available
     */
    @Transactional(readOnly = true)
    public UserContentResponse<KrawlDetailResponse> getUserCompletedKrawls(UUID userId, Pageable pageable) {
        log.debug("Fetching completed Krawls for userId: {}, page: {}, size: {}", userId, pageable.getPageNumber(), pageable.getPageSize());

        // TODO: Implement when Krawl Mode completion tracking is available
        // For now, return empty list
        return UserContentResponse.<KrawlDetailResponse>builder()
                .content(List.of())
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(0L)
                .totalPages(0)
                .hasNext(false)
                .hasPrevious(false)
            .build();
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request, UUID currentUserId) {
        log.debug("Updating profile for userId: {}", userId);

        // Check authorization
        if (!userId.equals(currentUserId)) {
            throw new ForbiddenException("You can only update your own profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        user = userRepository.save(user);
        UserStatisticsResponse statistics = getUserStatistics(userId);

        return UserProfileResponse.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .statistics(statistics)
                .privacySettings(user.getPrivacySettings())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Update notification preferences
     */
    @Transactional
    public void updateNotificationPreferences(UUID userId, NotificationPreferencesRequest request, UUID currentUserId) {
        log.debug("Updating notification preferences for userId: {}", userId);

        // Check authorization
        if (!userId.equals(currentUserId)) {
            throw new ForbiddenException("You can only update your own preferences");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Map<String, Object> preferences = new HashMap<>();
        if (request.getEmail() != null) {
            preferences.put("email", request.getEmail());
        }
        if (request.getPush() != null) {
            preferences.put("push", request.getPush());
        }

        user.setNotificationPreferences(preferences);
        userRepository.save(user);
    }

    /**
     * Update privacy settings
     */
    @Transactional
    public void updatePrivacySettings(UUID userId, PrivacySettingsRequest request, UUID currentUserId) {
        log.debug("Updating privacy settings for userId: {}", userId);

        // Check authorization
        if (!userId.equals(currentUserId)) {
            throw new ForbiddenException("You can only update your own privacy settings");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Map<String, Object> settings = new HashMap<>();
        if (request.getProfileVisibility() != null) {
            settings.put("profileVisibility", request.getProfileVisibility());
        }
        if (request.getToggles() != null) {
            settings.put("toggles", request.getToggles());
        }

        user.setPrivacySettings(settings);
        userRepository.save(user);
    }

    /**
     * Update app preferences
     */
    @Transactional
    public void updateAppPreferences(UUID userId, AppPreferencesRequest request, UUID currentUserId) {
        log.debug("Updating app preferences for userId: {}", userId);

        // Check authorization
        if (!userId.equals(currentUserId)) {
            throw new ForbiddenException("You can only update your own preferences");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Map<String, Object> preferences = new HashMap<>();
        if (request.getMapStyle() != null) {
            preferences.put("mapStyle", request.getMapStyle());
        }
        if (request.getLanguage() != null) {
            preferences.put("language", request.getLanguage());
        }
        if (request.getUnits() != null) {
            preferences.put("units", request.getUnits());
        }

        user.setAppPreferences(preferences);
        userRepository.save(user);
    }

    /**
     * Delete user account (soft delete by anonymizing)
     */
    @Transactional
    public void deleteAccount(UUID userId, UUID currentUserId) {
        log.debug("Deleting account for userId: {}", userId);

        // Check authorization
        if (!userId.equals(currentUserId)) {
            throw new ForbiddenException("You can only delete your own account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Anonymize user data
        user.setEmail("deleted_" + user.getId() + "@deleted.local");
        user.setDisplayName(null);
        user.setAvatarUrl(null);
        user.setBio(null);
        user.setGoogleId(null);
        user.setNotificationPreferences(null);
        user.setPrivacySettings(null);
        user.setAppPreferences(null);

        userRepository.save(user);
    }

    /**
     * Disconnect OAuth provider
     */
    @Transactional
    public void disconnectOAuthProvider(UUID userId, String provider, UUID currentUserId) {
        log.debug("Disconnecting {} for userId: {}", provider, userId);

        // Check authorization
        if (!userId.equals(currentUserId)) {
            throw new ForbiddenException("You can only disconnect your own accounts");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if ("google".equalsIgnoreCase(provider)) {
            // Check if this is the last authentication method
            if (user.getGoogleId() == null) {
                throw new IllegalArgumentException("Google account is not connected");
            }
            // TODO: Check if user has password or other auth methods before allowing disconnect
            user.setGoogleId(null);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
    }

}
