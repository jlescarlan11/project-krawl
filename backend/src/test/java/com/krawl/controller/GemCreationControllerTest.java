package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.request.DuplicateCheckRequest;
import com.krawl.dto.request.UpdateGemRequest;
import com.krawl.dto.response.DuplicateCheckResponse;
import com.krawl.service.DuplicateDetectionService;
import com.krawl.service.GemDraftService;
import com.krawl.service.GemService;
import com.krawl.service.JwtTokenService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
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

@WebMvcTest(controllers = GemCreationController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class GemCreationControllerTest {

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
    private DuplicateDetectionService duplicateDetectionService;

    @MockitoBean
    private GemService gemService;

    @MockitoBean
    private GemDraftService gemDraftService;

    private UUID testGemId;
    private CreateGemRequest createGemRequest;
    private DuplicateCheckRequest duplicateCheckRequest;

    @BeforeEach
    void setUp() {
        testGemId = TestDataFactory.randomUUID();

        createGemRequest = new CreateGemRequest();
        createGemRequest.setName("Test Gem");
        createGemRequest.setCategory("historical-site");
        createGemRequest.setDistrict("Downtown");
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(10.3157);
        coordinates.setLongitude(123.8854);
        createGemRequest.setCoordinates(coordinates);
        createGemRequest.setPhotos(java.util.Arrays.asList("https://example.com/photo.jpg"));
        createGemRequest.setThumbnailIndex(0);

        duplicateCheckRequest = new DuplicateCheckRequest();
        duplicateCheckRequest.setName("Test Gem");
        DuplicateCheckRequest.Coordinates dupCoordinates = new DuplicateCheckRequest.Coordinates();
        dupCoordinates.setLatitude(10.3157);
        dupCoordinates.setLongitude(123.8854);
        duplicateCheckRequest.setCoordinates(dupCoordinates);
    }

    @Test
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCheckDuplicate_NoDuplicate_ReturnsNotDuplicate() throws Exception {
        // Given
        DuplicateCheckResponse response = DuplicateCheckResponse.builder()
                .isDuplicate(false)
                .build();

        when(duplicateDetectionService.checkForDuplicates(
                eq("Test Gem"), eq(10.3157), eq(123.8854)))
                .thenReturn(response);

        // When/Then
        mockMvc.perform(post("/api/v1/gems/check-duplicate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateCheckRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDuplicate").value(false));

        verify(duplicateDetectionService).checkForDuplicates(
                eq("Test Gem"), eq(10.3157), eq(123.8854));
    }

    @Test
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCheckDuplicate_DuplicateFound_ReturnsDuplicate() throws Exception {
        // Given
        DuplicateCheckResponse.DuplicateGemData existingGem = DuplicateCheckResponse.DuplicateGemData.builder()
                .id(testGemId.toString())
                .name("Test Gem")
                .similarity(0.95)
                .build();
        DuplicateCheckResponse response = DuplicateCheckResponse.builder()
                .isDuplicate(true)
                .existingGem(existingGem)
                .build();

        when(duplicateDetectionService.checkForDuplicates(
                eq("Test Gem"), eq(10.3157), eq(123.8854)))
                .thenReturn(response);

        // When/Then
        mockMvc.perform(post("/api/v1/gems/check-duplicate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateCheckRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDuplicate").value(true))
                .andExpect(jsonPath("$.existingGem.id").value(testGemId.toString()));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCreateGem_ValidRequest_ReturnsCreated() throws Exception {
        // Given
        when(gemService.createGem(any(CreateGemRequest.class), any(UUID.class)))
                .thenReturn(testGemId);

        // When/Then
        mockMvc.perform(post("/api/gems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createGemRequest))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.gemId").value(testGemId.toString()))
                .andExpect(jsonPath("$.message").value("Gem created successfully"));

        verify(gemService).createGem(any(CreateGemRequest.class), any(UUID.class));
    }

    @Test
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCreateGem_Unauthenticated_ReturnsUnauthorized() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/gems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createGemRequest))
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(gemService, never()).createGem(any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testUpdateGem_OwnGem_ReturnsUpdated() throws Exception {
        // Given
        UpdateGemRequest updateRequest = new UpdateGemRequest();
        updateRequest.setName("Updated Gem");

        when(gemService.updateGem(eq(testGemId), any(UpdateGemRequest.class), any(UUID.class)))
                .thenReturn(testGemId);

        // When/Then
        mockMvc.perform(put("/api/gems/{id}", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gemId").value(testGemId.toString()));

        verify(gemService).updateGem(eq(testGemId), any(UpdateGemRequest.class), any(UUID.class));
    }
}