package com.krawl.controller;

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

import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VouchController.class)
@SuppressWarnings("null")
class VouchControllerTest {

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

    @BeforeEach
    void setUp() {
        testGemId = TestDataFactory.randomUUID();
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testToggleVouch_ValidGemId_ReturnsToggleResponse() throws Exception {
        // Given
        when(gemService.toggleVouch(eq(testGemId), any(UUID.class))).thenReturn(5);
        when(gemService.hasUserVouchedForGem(eq(testGemId), any(UUID.class))).thenReturn(true);

        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/vouch", testGemId.toString())
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vouchCount").value(5))
                .andExpect(jsonPath("$.isVouchedByCurrentUser").value(true));

        verify(gemService).toggleVouch(eq(testGemId), any(UUID.class));
        verify(gemService).hasUserVouchedForGem(eq(testGemId), any(UUID.class));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testToggleVouch_Unvouch_ReturnsFalse() throws Exception {
        // Given
        when(gemService.toggleVouch(eq(testGemId), any(UUID.class))).thenReturn(4);
        when(gemService.hasUserVouchedForGem(eq(testGemId), any(UUID.class))).thenReturn(false);

        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/vouch", testGemId.toString())
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vouchCount").value(4))
                .andExpect(jsonPath("$.isVouchedByCurrentUser").value(false));
    }

    @Test
    void testToggleVouch_Unauthenticated_ReturnsUnauthorized() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/vouch", testGemId.toString())
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(gemService, never()).toggleVouch(any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testToggleVouch_InvalidUUID_ReturnsBadRequest() throws Exception {
        // Given
        String invalidId = "invalid-uuid";

        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/vouch", invalidId)
                .with(csrf()))
                .andExpect(status().isBadRequest());

        verify(gemService, never()).toggleVouch(any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testToggleVouch_GemNotFound_ReturnsNotFound() throws Exception {
        // Given
        UUID nonExistentId = TestDataFactory.randomUUID();
        when(gemService.toggleVouch(eq(nonExistentId), any(UUID.class)))
                .thenThrow(new ResourceNotFoundException("Gem", "id", nonExistentId));

        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/vouch", nonExistentId.toString())
                .with(csrf()))
                .andExpect(status().isNotFound());
    }
}

