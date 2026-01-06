package com.krawl.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column
    private String email;
    
    @Column(name = "display_name")
    private String displayName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "bio")
    private String bio;
    
    @Column(name = "notification_preferences")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> notificationPreferences;
    
    @Column(name = "privacy_settings")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> privacySettings;
    
    @Column(name = "app_preferences")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> appPreferences;
    
    @Column(name = "google_id")
    private String googleId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}

