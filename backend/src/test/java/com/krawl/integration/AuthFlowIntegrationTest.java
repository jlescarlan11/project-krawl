package com.krawl.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.AuthRequest;
import com.krawl.dto.response.AuthResponse;
import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.User;
import com.krawl.repository.UserRepository;
import com.krawl.service.GoogleTokenValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for authentication flow.
 * Tests the complete flow from OAuth token to user creation/update and JWT generation.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private GoogleTokenValidator googleTokenValidator;

    @BeforeEach
    void setUp() {
        // No need to delete - @Transactional will rollback all changes after each test
        // If there's leftover data, it will be cleaned up by the transaction rollback
    }

    @Test
    void testCompleteAuthFlow_NewUser_CreatesUserAndReturnsJWT() throws Exception {
        // Given
        String googleToken = "valid-google-oauth-token-12345678901234567890";
        GoogleUserInfo googleUserInfo = GoogleUserInfo.builder()
                .googleId("google-123")
                .email("newuser@example.com")
                .displayName("New User")
                .avatarUrl("https://example.com/avatar.jpg")
                .build();

        when(googleTokenValidator.validateToken(googleToken)).thenReturn(googleUserInfo);

        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);

        // When
        String responseJson = mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.isNewUser").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Then - verify user was created in database
        Optional<User> user = userRepository.findByGoogleId("google-123");
        assertTrue(user.isPresent());
        assertEquals("newuser@example.com", user.get().getEmail());
        assertEquals("New User", user.get().getDisplayName());

        // Verify response structure
        AuthResponse response = objectMapper.readValue(responseJson, AuthResponse.class);
        assertNotNull(response.getJwt());
        assertNotNull(response.getRefreshToken());
        assertNotNull(response.getUser());
        assertTrue(response.isNewUser());
    }

    @Test
    void testCompleteAuthFlow_ExistingUser_UpdatesUserAndReturnsJWT() throws Exception {
        // Given - create existing user
        User existingUser = User.builder()
                .email("existing@example.com")
                .displayName("Existing User")
                .googleId("google-456")
                .build();
        userRepository.save(existingUser);

        String googleToken = "valid-google-oauth-token-12345678901234567890";
        GoogleUserInfo googleUserInfo = GoogleUserInfo.builder()
                .googleId("google-456")
                .email("existing@example.com")
                .displayName("Updated User")
                .avatarUrl("https://example.com/new-avatar.jpg")
                .build();

        when(googleTokenValidator.validateToken(googleToken)).thenReturn(googleUserInfo);

        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);

        // When
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isNewUser").value(false));

        // Then - verify user was updated
        Optional<User> user = userRepository.findByGoogleId("google-456");
        assertTrue(user.isPresent());
        assertEquals("Updated User", user.get().getDisplayName());
    }
}

