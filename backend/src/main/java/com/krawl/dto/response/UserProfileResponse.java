package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private String id;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private UserStatisticsResponse statistics;
    private Map<String, Object> privacySettings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

