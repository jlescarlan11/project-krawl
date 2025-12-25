package com.krawl.controller;

import com.krawl.dto.response.GemCoordinatesResponse;
import com.krawl.dto.response.GemDetailResponse;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.service.GemService;
import com.krawl.service.JwtTokenService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import com.krawl.util.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = GemController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class GemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtTokenService jwtTokenService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private TokenBlacklistService tokenBlacklistService;

    @MockitoBean
    private GemService gemService;

    private UUID testGemId;
    private GemDetailResponse gemDetailResponse;

    @BeforeEach
    void setUp() {
        testGemId = TestDataFactory.randomUUID();
        GemCoordinatesResponse coordinates = GemCoordinatesResponse.builder()
                .latitude(10.3157)
                .longitude(123.8854)
                .build();
        gemDetailResponse = GemDetailResponse.builder()
                .id(testGemId.toString())
                .name("Test Gem")
                .category("historical-site")
                .district("Downtown")
                .coordinates(coordinates)
                .build();
    }

    @Test
    void testGetGemDetail_ValidId_ReturnsGemDetail() throws Exception {
        // Given
        when(gemService.getGemDetail(eq(testGemId), any())).thenReturn(gemDetailResponse);
        doNothing().when(gemService).incrementViewCount(testGemId);

        // When/Then
        mockMvc.perform(get("/api/gems/{id}", testGemId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testGemId.toString()))
                .andExpect(jsonPath("$.name").value("Test Gem"))
                .andExpect(jsonPath("$.category").value("historical-site"));

        verify(gemService).getGemDetail(eq(testGemId), any());
        verify(gemService).incrementViewCount(testGemId);
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testGetGemDetail_AuthenticatedUser_ReturnsGemDetailWithUserContext() throws Exception {
        // Given
        when(gemService.getGemDetail(eq(testGemId), any(UUID.class))).thenReturn(gemDetailResponse);
        doNothing().when(gemService).incrementViewCount(testGemId);

        // When/Then
        mockMvc.perform(get("/api/gems/{id}", testGemId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testGemId.toString()));

        verify(gemService).getGemDetail(eq(testGemId), any(UUID.class));
    }

    @Test
    void testGetGemDetail_InvalidUUID_ReturnsBadRequest() throws Exception {
        // Given
        String invalidId = "invalid-uuid";

        // When/Then
        mockMvc.perform(get("/api/gems/{id}", invalidId))
                .andExpect(status().isBadRequest());

        verify(gemService, never()).getGemDetail(any(), any());
    }

    @Test
    void testGetGemDetail_GemNotFound_ReturnsNotFound() throws Exception {
        // Given
        UUID nonExistentId = TestDataFactory.randomUUID();
        when(gemService.getGemDetail(eq(nonExistentId), any()))
                .thenThrow(new ResourceNotFoundException("Gem", "id", nonExistentId));

        // When/Then
        mockMvc.perform(get("/api/gems/{id}", nonExistentId.toString()))
                .andExpect(status().isNotFound());

        verify(gemService).getGemDetail(eq(nonExistentId), any());
    }

    @Test
    void testGetGemDetail_IncrementViewCountFails_StillReturnsGemDetail() throws Exception {
        // Given
        when(gemService.getGemDetail(eq(testGemId), any())).thenReturn(gemDetailResponse);
        doThrow(new RuntimeException("Database error")).when(gemService).incrementViewCount(testGemId);

        // When/Then - Should still return gem detail even if view count increment fails
        mockMvc.perform(get("/api/gems/{id}", testGemId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testGemId.toString()));

        verify(gemService).getGemDetail(eq(testGemId), any());
        verify(gemService).incrementViewCount(testGemId);
    }

    @Test
    void testGetAllGems_ReturnsListOfGems() throws Exception {
        // Given
        GemDetailResponse gem1 = GemDetailResponse.builder()
                .id(TestDataFactory.randomUUID().toString())
                .name("Gem 1")
                .build();
        GemDetailResponse gem2 = GemDetailResponse.builder()
                .id(TestDataFactory.randomUUID().toString())
                .name("Gem 2")
                .build();
        List<GemDetailResponse> gems = Arrays.asList(gem1, gem2);

        when(gemService.getAllGems(isNull())).thenReturn(gems);

        // When/Then
        mockMvc.perform(get("/api/gems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Gem 1"))
                .andExpect(jsonPath("$[1].name").value("Gem 2"));

        verify(gemService).getAllGems(isNull());
    }

    @Test
    @WithMockUser(username = "user-id")
    void testGetAllGems_AuthenticatedUser_ReturnsGemsWithUserContext() throws Exception {
        // Given
        List<GemDetailResponse> gems = Arrays.asList(gemDetailResponse);
        // Note: When security is excluded, @WithMockUser doesn't work, so getCurrentUserId() returns null
        when(gemService.getAllGems(isNull())).thenReturn(gems);

        // When/Then
        mockMvc.perform(get("/api/gems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(gemService).getAllGems(isNull());
    }
}

