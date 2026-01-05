package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateKrawlRequest;
import com.krawl.dto.request.UpdateKrawlRequest;
import com.krawl.dto.response.KrawlDetailResponse;
import com.krawl.service.JwtTokenService;
import com.krawl.service.KrawlDraftService;
import com.krawl.service.KrawlService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import com.krawl.util.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = KrawlController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class KrawlControllerTest {

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
    private KrawlService krawlService;

    @MockitoBean
    private KrawlDraftService krawlDraftService;

    private UUID testKrawlId;
    private KrawlDetailResponse krawlDetailResponse;
    private CreateKrawlRequest createKrawlRequest;

    @BeforeEach
    void setUp() {
        testKrawlId = TestDataFactory.randomUUID();
        krawlDetailResponse = KrawlDetailResponse.builder()
                .id(testKrawlId.toString())
                .name("Test Krawl")
                .description("A test krawl")
                .build();

        createKrawlRequest = new CreateKrawlRequest();
        createKrawlRequest.setName("Test Krawl");
        createKrawlRequest.setDescription("A test krawl");
        createKrawlRequest.setCategory("cultural");
        createKrawlRequest.setDifficulty("easy");
        
        UUID gemId1 = TestDataFactory.randomUUID();
        UUID gemId2 = TestDataFactory.randomUUID();
        
        CreateKrawlRequest.GemInKrawlRequest gemInKrawl1 = new CreateKrawlRequest.GemInKrawlRequest();
        gemInKrawl1.setGemId(gemId1.toString());
        gemInKrawl1.setSequenceOrder(1);
        gemInKrawl1.setCreatorNote("Walk through the yellow gate");
        gemInKrawl1.setLokalSecret("Ask for the off-menu spicy vinegar");
        
        CreateKrawlRequest.GemInKrawlRequest gemInKrawl2 = new CreateKrawlRequest.GemInKrawlRequest();
        gemInKrawl2.setGemId(gemId2.toString());
        gemInKrawl2.setSequenceOrder(2);
        gemInKrawl2.setCreatorNote("Turn left at the red building");
        gemInKrawl2.setLokalSecret("Try the local specialty coffee");
        
        createKrawlRequest.setGems(Arrays.asList(gemInKrawl1, gemInKrawl2));
    }

    @Test
    void testGetKrawlDetail_ValidId_ReturnsKrawlDetail() throws Exception {
        // Given
        when(krawlService.getKrawlDetail(eq(testKrawlId), any())).thenReturn(krawlDetailResponse);
        doNothing().when(krawlService).incrementViewCount(testKrawlId);

        // When/Then
        mockMvc.perform(get("/api/krawls/{id}", testKrawlId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testKrawlId.toString()))
                .andExpect(jsonPath("$.name").value("Test Krawl"));

        verify(krawlService).getKrawlDetail(eq(testKrawlId), any());
        verify(krawlService).incrementViewCount(testKrawlId);
    }

    @Test
    void testGetKrawlDetail_InvalidUUID_ReturnsBadRequest() throws Exception {
        // Given
        String invalidId = "invalid-uuid";

        // When/Then
        mockMvc.perform(get("/api/krawls/{id}", invalidId))
                .andExpect(status().isBadRequest());

        verify(krawlService, never()).getKrawlDetail(any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null")
    void testCreateKrawl_ValidRequest_ReturnsCreated() throws Exception {
        // Given
        when(krawlService.createKrawl(any(CreateKrawlRequest.class), any(UUID.class)))
                .thenReturn(testKrawlId);

        // When/Then
        mockMvc.perform(post("/api/krawls")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createKrawlRequest))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.krawlId").value(testKrawlId.toString()))
                .andExpect(jsonPath("$.message").value("Krawl created successfully"));

        verify(krawlService).createKrawl(any(CreateKrawlRequest.class), any(UUID.class));
    }

    @Test
    @SuppressWarnings("null")
    void testCreateKrawl_Unauthenticated_ReturnsUnauthorized() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/krawls")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createKrawlRequest))
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(krawlService, never()).createKrawl(any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null")
    void testUpdateKrawl_OwnKrawl_ReturnsUpdated() throws Exception {
        // Given
        UpdateKrawlRequest updateRequest = new UpdateKrawlRequest();
        updateRequest.setName("Updated Krawl");

        when(krawlService.updateKrawl(eq(testKrawlId), any(UpdateKrawlRequest.class), any(UUID.class)))
                .thenReturn(testKrawlId);

        // When/Then
        mockMvc.perform(put("/api/krawls/{id}", testKrawlId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.krawlId").value(testKrawlId.toString()));

        verify(krawlService).updateKrawl(eq(testKrawlId), any(UpdateKrawlRequest.class), any(UUID.class));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null")
    void testToggleVouch_ValidKrawlId_ReturnsToggleResponse() throws Exception {
        // Given
        when(krawlService.toggleVouch(eq(testKrawlId), any(UUID.class))).thenReturn(5);
        when(krawlService.hasUserVouchedForKrawl(eq(testKrawlId), any(UUID.class))).thenReturn(true);

        // When/Then
        mockMvc.perform(post("/api/krawls/{krawlId}/vouch", testKrawlId.toString())
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vouchCount").value(5))
                .andExpect(jsonPath("$.isVouchedByCurrentUser").value(true));

        verify(krawlService).toggleVouch(eq(testKrawlId), any(UUID.class));
        verify(krawlService).hasUserVouchedForKrawl(eq(testKrawlId), any(UUID.class));
    }
}