package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateCommentRequest;
import com.krawl.dto.request.UpdateCommentRequest;
import com.krawl.dto.response.CommentPageResponse;
import com.krawl.dto.response.CommentResponse;
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
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = GemCommentController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class GemCommentControllerTest {

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
    private UUID testCommentId;
    private CreateCommentRequest createCommentRequest;
    private CommentResponse commentResponse;

    @BeforeEach
    void setUp() {
        testGemId = TestDataFactory.randomUUID();
        testCommentId = TestDataFactory.randomUUID();
        createCommentRequest = new CreateCommentRequest();
        createCommentRequest.setContent("Great gem!");

        commentResponse = CommentResponse.builder()
                .id(testCommentId.toString())
                .content("Great gem!")
                .build();
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCreateComment_ValidRequest_ReturnsCreated() throws Exception {
        // Given
        when(gemService.createComment(eq(testGemId), any(UUID.class), any(CreateCommentRequest.class)))
                .thenReturn(commentResponse);

        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/comments", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createCommentRequest))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(testCommentId.toString()))
                .andExpect(jsonPath("$.content").value("Great gem!"));

        verify(gemService).createComment(eq(testGemId), any(UUID.class), any(CreateCommentRequest.class));
    }

    @Test
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCreateComment_Unauthenticated_ReturnsUnauthorized() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/comments", testGemId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createCommentRequest))
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(gemService, never()).createComment(any(), any(), any());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testCreateComment_InvalidUUID_ReturnsBadRequest() throws Exception {
        // Given
        String invalidId = "invalid-uuid";

        // When/Then
        mockMvc.perform(post("/api/gems/{gemId}/comments", invalidId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createCommentRequest))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetComments_ValidGemId_ReturnsComments() throws Exception {
        // Given
        CommentPageResponse pageResponse = CommentPageResponse.builder()
                .comments(Arrays.asList(commentResponse))
                .totalComments(1L)
                .totalPages(1)
                .currentPage(0)
                .hasNext(false)
                .build();

        when(gemService.getComments(eq(testGemId), eq(0), eq(20)))
                .thenReturn(pageResponse);

        // When/Then
        mockMvc.perform(get("/api/gems/{gemId}/comments", testGemId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comments").isArray())
                .andExpect(jsonPath("$.comments.length()").value(1))
                .andExpect(jsonPath("$.totalComments").value(1));

        verify(gemService).getComments(eq(testGemId), eq(0), eq(20));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testUpdateComment_OwnComment_ReturnsUpdatedComment() throws Exception {
        // Given
        UpdateCommentRequest updateRequest = new UpdateCommentRequest();
        updateRequest.setContent("Updated comment");

        CommentResponse updatedResponse = CommentResponse.builder()
                .id(testCommentId.toString())
                .content("Updated comment")
                .build();

        when(gemService.updateComment(eq(testCommentId), any(UUID.class), any(UpdateCommentRequest.class)))
                .thenReturn(updatedResponse);

        // When/Then
        mockMvc.perform(put("/api/gems/{gemId}/comments/{commentId}", testGemId.toString(), testCommentId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated comment"));

        verify(gemService).updateComment(eq(testCommentId), any(UUID.class), any(UpdateCommentRequest.class));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MediaType and MockMvc methods are guaranteed non-null
    void testUpdateComment_OtherUserComment_ReturnsForbidden() throws Exception {
        // Given
        UpdateCommentRequest updateRequest = new UpdateCommentRequest();
        updateRequest.setContent("Updated comment");

        when(gemService.updateComment(eq(testCommentId), any(UUID.class), any(UpdateCommentRequest.class)))
                .thenThrow(new ForbiddenException("Cannot update other user's comment"));

        // When/Then
        mockMvc.perform(put("/api/gems/{gemId}/comments/{commentId}", testGemId.toString(), testCommentId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    @SuppressWarnings("null") // MockMvc methods are guaranteed non-null
    void testDeleteComment_OwnComment_ReturnsNoContent() throws Exception {
        // Given
        doNothing().when(gemService).deleteComment(eq(testCommentId), any(UUID.class));

        // When/Then
        mockMvc.perform(delete("/api/gems/{gemId}/comments/{commentId}", testGemId.toString(), testCommentId.toString())
                .with(csrf()))
                .andExpect(status().isNoContent());

        verify(gemService).deleteComment(eq(testCommentId), any(UUID.class));
    }
}

