package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.AuthRequest;
import com.krawl.dto.response.AuthResponse;
import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.User;
import com.krawl.repository.UserRepository;
import com.krawl.service.GoogleTokenValidator;
import com.krawl.service.JwtTokenService;
import com.krawl.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController.
 * Tests the full authentication flow with mocked Google token validation.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockitoBean
    private GoogleTokenValidator googleTokenValidator;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    void testAuthenticate_ValidToken_CreatesUserAndReturnsJWT() throws Exception {
        // Given
        String googleToken = "valid-google-oauth-token";
        GoogleUserInfo googleUserInfo = GoogleUserInfo.builder()
            .googleId("google-123")
            .email("test@example.com")
            .displayName("Test User")
            .avatarUrl("https://example.com/avatar.jpg")
            .build();
        
        when(googleTokenValidator.validateToken(googleToken)).thenReturn(googleUserInfo);
        
        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);
        
        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.jwt").exists())
            .andExpect(jsonPath("$.user").exists())
            .andExpect(jsonPath("$.user.email").value("test@example.com"))
            .andExpect(jsonPath("$.user.displayName").value("Test User"));
        
        // Verify user was created
        Optional<User> user = userRepository.findByGoogleId("google-123");
        assertTrue(user.isPresent());
    }
    
    @Test
    void testAuthenticate_InvalidTokenFormat_ReturnsBadRequest() throws Exception {
        // Given
        AuthRequest request = new AuthRequest();
        request.setToken("short"); // Too short
        
        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
    
    @Test
    void testAuthenticate_MissingToken_ReturnsBadRequest() throws Exception {
        // Given
        AuthRequest request = new AuthRequest();
        request.setToken("");
        
        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
    
    @Test
    void testAuthenticate_InvalidGoogleToken_ReturnsUnauthorized() throws Exception {
        // Given
        String googleToken = "invalid-google-oauth-token";
        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);
        
        when(googleTokenValidator.validateToken(googleToken))
            .thenThrow(new com.krawl.exception.AuthException("Invalid token", 
                org.springframework.http.HttpStatus.UNAUTHORIZED));
        
        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }
}

