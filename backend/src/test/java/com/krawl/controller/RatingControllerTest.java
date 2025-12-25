package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateOrUpdateRatingRequest;
import com.krawl.dto.response.CreateOrUpdateRatingResponse;
import com.krawl.dto.response.RatingResponse;
import com.krawl.exception.ForbiddenException;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = RatingController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
@SuppressWarnings("null")
class RatingControllerTest {

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
    private GemService gemService;

    private UUID testGemId;
    private CreateOrUpdateRatingRequest ratingRequest;

    @BeforeEach
    void setUp() {
        testGemId = TestDataFactory.randomUUID();
        ratingRequest = new CreateOrUpdateRatingRequest();
        ratingRequest.setRating(5);
        ratingRequest.setComment("Great gem!");
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testCreateOrUpdateRating_ValidRequest_ReturnsRatingResponse() throws Exception {
        CreateOrUpdateRatingResponse response = CreateOrUpdateRatingResponse.builder()
                .rating(5)
                .comment("Great gem!")
                .newAverageRating(4.5)
                .totalRatings(10L)
                .build();

        when(gemService.createOrUpdateRating(eq(testGemId), any(UUID.class), any(CreateOrUpdateRatingRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/gems/{gemId}/rating", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Great gem!"))
                .andExpect(jsonPath("$.newAverageRating").value(4.5))
                .andExpect(jsonPath("$.totalRatings").value(10));

        verify(gemService).createOrUpdateRating(eq(testGemId), any(UUID.class), any(CreateOrUpdateRatingRequest.class));
    }

    @Test
    void testCreateOrUpdateRating_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/gems/{gemId}/rating", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingRequest))
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(gemService, never()).createOrUpdateRating(any(), any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testCreateOrUpdateRating_InvalidUUID_ReturnsBadRequest() throws Exception {
        String invalidId = "invalid-uuid";

        mockMvc.perform(post("/api/gems/{gemId}/rating", invalidId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingRequest))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testCreateOrUpdateRating_OwnGem_ReturnsForbidden() throws Exception {
        when(gemService.createOrUpdateRating(eq(testGemId), any(UUID.class), any(CreateOrUpdateRatingRequest.class)))
                .thenThrow(new ForbiddenException("Cannot rate own gem"));

        mockMvc.perform(post("/api/gems/{gemId}/rating", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingRequest))
                .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testCreateOrUpdateRating_InvalidRating_ReturnsBadRequest() throws Exception {
        ratingRequest.setRating(6); 

        mockMvc.perform(post("/api/gems/{gemId}/rating", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingRequest))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetRatings_ValidGemId_ReturnsRatingsList() throws Exception {
        RatingResponse rating1 = RatingResponse.builder().rating(5).comment("Great!").build();
        RatingResponse rating2 = RatingResponse.builder().rating(4).comment("Good").build();
        List<RatingResponse> ratings = Arrays.asList(rating1, rating2);

        when(gemService.getAllRatingsForGem(testGemId)).thenReturn(ratings);

        mockMvc.perform(get("/api/gems/{gemId}/ratings", testGemId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].rating").value(5))
                .andExpect(jsonPath("$[1].rating").value(4));

        verify(gemService).getAllRatingsForGem(testGemId);
    }

    @Test
    void testGetRatings_InvalidUUID_ReturnsBadRequest() throws Exception {
        String invalidId = "invalid-uuid";

        mockMvc.perform(get("/api/gems/{gemId}/ratings", invalidId))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testGetMyRating_UserHasRated_ReturnsRating() throws Exception {
        RatingResponse rating = RatingResponse.builder().rating(5).comment("Great gem!").build();

        when(gemService.getUserRatingForGem(eq(testGemId), any(UUID.class)))
                .thenReturn(Optional.of(rating));

        mockMvc.perform(get("/api/gems/{gemId}/rating/me", testGemId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Great gem!"));

        verify(gemService).getUserRatingForGem(eq(testGemId), any(UUID.class));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void testGetMyRating_UserHasNotRated_ReturnsNotFound() throws Exception {
        when(gemService.getUserRatingForGem(eq(testGemId), any(UUID.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/gems/{gemId}/rating/me", testGemId.toString()))
                .andExpect(status().isNotFound());

        verify(gemService).getUserRatingForGem(eq(testGemId), any(UUID.class));
    }

    @Test
    void testGetMyRating_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/gems/{gemId}/rating/me", testGemId.toString()))
                .andExpect(status().isUnauthorized());
    }
}