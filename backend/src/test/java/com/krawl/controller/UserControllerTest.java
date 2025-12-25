package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.UpdateProfileRequest;
import com.krawl.dto.response.UserProfileResponse;
import com.krawl.dto.response.UserStatisticsResponse;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.service.JwtTokenService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import com.krawl.service.UserService;
import com.krawl.util.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UserController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private JwtTokenService jwtTokenService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private TokenBlacklistService tokenBlacklistService;

    @MockitoBean
    private UserService userService;

    private UUID testUserId;
    private UserProfileResponse userProfileResponse;
    private UserStatisticsResponse userStatisticsResponse;

    @BeforeEach
    void setUp() {
        testUserId = TestDataFactory.randomUUID();
        userProfileResponse = UserProfileResponse.builder()
                .id(testUserId.toString())
                .email("test@example.com")
                .displayName("Test User")
                .build();
        userStatisticsResponse = UserStatisticsResponse.builder()
                .gemsCreated(5L)
                .krawlsCreated(3L)
                .vouchesGiven(10L)
                .krawlsCompleted(2L)
                .build();
    }

    @Test
    void testGetUserProfile_ValidId_ReturnsProfile() throws Exception {
        // Given
        when(userService.getUserProfile(testUserId)).thenReturn(userProfileResponse);

        // When/Then
        mockMvc.perform(get("/api/users/{id}", testUserId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserId.toString()))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.displayName").value("Test User"));

        verify(userService).getUserProfile(testUserId);
    }

    @Test
    void testGetUserProfile_InvalidUUID_ReturnsBadRequest() throws Exception {
        // Given
        String invalidId = "invalid-uuid";

        // When/Then
        mockMvc.perform(get("/api/users/{id}", invalidId))
                .andExpect(status().isBadRequest());

        verify(userService, never()).getUserProfile(any());
    }

    @Test
    void testGetUserProfile_UserNotFound_ReturnsNotFound() throws Exception {
        // Given
        UUID nonExistentId = TestDataFactory.randomUUID();
        when(userService.getUserProfile(nonExistentId))
                .thenThrow(new ResourceNotFoundException("User", "id", nonExistentId));

        // When/Then
        mockMvc.perform(get("/api/users/{id}", nonExistentId.toString()))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetUserStatistics_ValidId_ReturnsStatistics() throws Exception {
        // Given
        when(userService.getUserStatistics(testUserId)).thenReturn(userStatisticsResponse);

        // When/Then
        mockMvc.perform(get("/api/users/{id}/statistics", testUserId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gemsCreated").value(5))
                .andExpect(jsonPath("$.krawlsCreated").value(3))
                .andExpect(jsonPath("$.vouchesGiven").value(10))
                .andExpect(jsonPath("$.krawlsCompleted").value(2));

        verify(userService).getUserStatistics(testUserId);
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null")
    void testUpdateUserProfile_OwnProfile_ReturnsUpdatedProfile() throws Exception {
        // Given
        UUID currentUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setDisplayName("Updated Name");
        request.setBio("Updated bio");

        UserProfileResponse updatedProfile = UserProfileResponse.builder()
                .id(currentUserId.toString())
                .displayName("Updated Name")
                .bio("Updated bio")
                .build();

        when(userService.updateProfile(eq(currentUserId), any(UpdateProfileRequest.class), eq(currentUserId)))
                .thenReturn(updatedProfile);

        // When/Then
        mockMvc.perform(put("/api/users/{id}/profile", currentUserId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("Updated Name"))
                .andExpect(jsonPath("$.bio").value("Updated bio"));

        verify(userService).updateProfile(eq(currentUserId), any(UpdateProfileRequest.class), eq(currentUserId));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null")
    void testUpdateUserProfile_OtherUserProfile_ReturnsForbidden() throws Exception {
        // Given
        UUID currentUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        UUID otherUserId = TestDataFactory.randomUUID();
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setDisplayName("Updated Name");

        when(userService.updateProfile(eq(otherUserId), any(UpdateProfileRequest.class), eq(currentUserId)))
                .thenThrow(new ForbiddenException("Cannot update other user's profile"));

        // When/Then
        mockMvc.perform(put("/api/users/{id}/profile", otherUserId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @SuppressWarnings("null")
    void testUpdateUserProfile_Unauthenticated_ReturnsUnauthorized() throws Exception {
        // Given
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setDisplayName("Updated Name");

        // When/Then
        mockMvc.perform(put("/api/users/{id}/profile", testUserId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(userService, never()).updateProfile(any(), any(), any());
    }
}

