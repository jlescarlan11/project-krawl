package com.krawl.util;

import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.Gem;
import com.krawl.entity.Krawl;
import com.krawl.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Factory class for creating test data objects.
 * Provides reusable methods for creating test entities, DTOs, and security objects.
 */
public class TestDataFactory {

    // User-related test data
    public static User createUser() {
        return User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .displayName("Test User")
                .avatarUrl("https://example.com/avatar.jpg")
                .googleId("google-123")
                .build();
    }

    public static User createUser(UUID id, String email, String displayName) {
        return User.builder()
                .id(id)
                .email(email)
                .displayName(displayName)
                .avatarUrl("https://example.com/avatar.jpg")
                .googleId("google-" + id.toString())
                .build();
    }

    public static GoogleUserInfo createGoogleUserInfo() {
        return GoogleUserInfo.builder()
                .googleId("google-123")
                .email("test@example.com")
                .displayName("Test User")
                .avatarUrl("https://example.com/avatar.jpg")
                .build();
    }

    public static GoogleUserInfo createGoogleUserInfo(String googleId, String email, String displayName) {
        return GoogleUserInfo.builder()
                .googleId(googleId)
                .email(email)
                .displayName(displayName)
                .avatarUrl("https://example.com/avatar.jpg")
                .build();
    }

    public static UserDetails createUserDetails(UUID userId, String email) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(userId.toString())
                .password("")
                .authorities(new SimpleGrantedAuthority("ROLE_USER"))
                .build();
    }

    // Gem-related test data
    public static Gem createGem() {
        UUID gemId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        return Gem.builder()
                .id(gemId)
                .name("Test Gem")
                .category("historical-site")
                .district("Downtown")
                .shortDescription("A test gem")
                .fullDescription("A full description of the test gem")
                .culturalSignificance("Significant cultural value")
                .latitude(10.3157)
                .longitude(123.8854)
                .address("Test Street, Cebu City")
                .status(Gem.GemStatus.VERIFIED)
                .viewCount(0)
                .createdBy(User.builder().id(userId).build())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Gem createGem(UUID id, UUID createdById, String name) {
        return Gem.builder()
                .id(id)
                .name(name)
                .category("historical-site")
                .district("Downtown")
                .shortDescription("A test gem")
                .fullDescription("A full description of the test gem")
                .culturalSignificance("Significant cultural value")
                .latitude(10.3157)
                .longitude(123.8854)
                .address("Test Street, Cebu City")
                .status(Gem.GemStatus.VERIFIED)
                .viewCount(0)
                .createdBy(User.builder().id(createdById).build())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // Krawl-related test data
    public static Krawl createKrawl() {
        UUID krawlId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        return Krawl.builder()
                .id(krawlId)
                .name("Test Krawl")
                .description("A test krawl trail")
                .category("cultural")
                .difficulty("easy")
                .estimatedDurationMinutes(60)
                .estimatedDistanceKm(2.5)
                .createdBy(User.builder().id(userId).build())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Krawl createKrawl(UUID id, UUID createdById, String name) {
        return Krawl.builder()
                .id(id)
                .name(name)
                .description("A test krawl trail")
                .category("cultural")
                .difficulty("easy")
                .estimatedDurationMinutes(60)
                .estimatedDistanceKm(2.5)
                .createdBy(User.builder().id(createdById).build())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // Helper methods for UUIDs
    public static UUID randomUUID() {
        return UUID.randomUUID();
    }

    public static String validUUIDString() {
        return UUID.randomUUID().toString();
    }

    public static String invalidUUIDString() {
        return "invalid-uuid";
    }
}

