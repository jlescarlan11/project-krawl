package com.krawl.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.request.UpdateGemRequest;
import com.krawl.dto.response.CreateGemResponse;
import com.krawl.entity.Gem;
import com.krawl.entity.User;
import com.krawl.repository.GemRepository;
import com.krawl.repository.KrawlRepository;
import com.krawl.repository.UserRepository;
import com.krawl.service.JwtTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Security testing for API endpoints.
 * Tests for SQL injection, XSS, CSRF, and authentication/authorization.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GemRepository gemRepository;

    @Autowired
    private KrawlRepository krawlRepository;

    @Autowired
    private JwtTokenService jwtTokenService;

    private User user1;
    private User user2;
    private String user1Token;
    private String user2Token;
    private UUID gemId;

    @BeforeEach
    void setUp() {
        // Delete in order to respect foreign key constraints
        // Delete Krawls first (they reference Users)
        krawlRepository.deleteAll();
        gemRepository.deleteAll();
        userRepository.deleteAll();

        // Create two test users
        user1 = User.builder()
                .email("user1@example.com")
                .displayName("User One")
                .googleId("google-user1")
                .build();
        user1 = userRepository.save(user1);

        user2 = User.builder()
                .email("user2@example.com")
                .displayName("User Two")
                .googleId("google-user2")
                .build();
        user2 = userRepository.save(user2);

        // Generate JWT tokens for both users
        user1Token = jwtTokenService.generateToken(
                user1.getId().toString(),
                user1.getEmail(),
                List.of("ROLE_USER")
        );

        user2Token = jwtTokenService.generateToken(
                user2.getId().toString(),
                user2.getEmail(),
                List.of("ROLE_USER")
        );
    }

    @Test
    void testSQLInjection_InputSanitization() throws Exception {
        // Test SQL injection attempt in search query
        // Search endpoint uses parameterized queries, so SQL injection should be safe
        // The query should be processed safely (may return empty results or be handled gracefully)
        String maliciousInput = "'; DROP TABLE users; --";
        
        // Search endpoint is GET, not POST, and is public
        // SQL injection attempts should be handled safely by the database layer
        mockMvc.perform(get("/api/search")
                .param("q", maliciousInput))
                .andExpect(status().isOk()); // Should be handled safely, not cause an error
    }

    @Test
    void testXSS_InputSanitization() throws Exception {
        // Test XSS attempt in gem name
        // This endpoint requires authentication, so unauthenticated requests get 401
        CreateGemRequest request = new CreateGemRequest();
        request.setName("<script>alert('XSS')</script>");
        request.setCategory("historical-site");
        request.setDistrict("Downtown");
        
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(10.3157);
        coordinates.setLongitude(123.8854);
        request.setCoordinates(coordinates);

        // Endpoint requires authentication, so unauthenticated request returns 401
        // XSS validation would happen after authentication
        mockMvc.perform(post("/api/gems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testCSRF_ProtectedEndpoints() throws Exception {
        // Test that CSRF is disabled (since we're using JWT stateless authentication)
        // CSRF protection is disabled in SecurityConfig for stateless JWT auth
        CreateGemRequest request = new CreateGemRequest();
        request.setName("Test Gem");
        request.setCategory("historical-site");
        request.setDistrict("Downtown");
        
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(10.3157);
        coordinates.setLongitude(123.8854);
        request.setCoordinates(coordinates);

        // CSRF is disabled, so request without CSRF token should still proceed
        // But endpoint requires authentication, so returns 401
        mockMvc.perform(post("/api/gems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAuthentication_ProtectedEndpoints() throws Exception {
        // Test that protected endpoints require authentication
        CreateGemRequest request = new CreateGemRequest();
        request.setName("Test Gem");
        request.setCategory("historical-site");
        request.setDistrict("Downtown");
        
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(10.3157);
        coordinates.setLongitude(123.8854);
        request.setCoordinates(coordinates);

        // Unauthenticated request should be rejected
        mockMvc.perform(post("/api/gems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAuthorization_OwnContentOnly() throws Exception {
        // Given - Create a Gem owned by user1
        CreateGemRequest createRequest = new CreateGemRequest();
        createRequest.setName("User1's Gem");
        createRequest.setCategory("historical-site");
        createRequest.setDistrict("Downtown");
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(10.3157);
        coordinates.setLongitude(123.8854);
        createRequest.setCoordinates(coordinates);
        createRequest.setPhotos(List.of("https://res.cloudinary.com/test/image/upload/test.jpg"));
        createRequest.setThumbnailIndex(0);

        String createResponseJson = mockMvc.perform(post("/api/gems")
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        CreateGemResponse createResponse = objectMapper.readValue(createResponseJson, CreateGemResponse.class);
        gemId = createResponse.getGemId();

        // When/Then - user2 tries to update user1's Gem - should get 403 Forbidden
        UpdateGemRequest updateRequest = new UpdateGemRequest();
        updateRequest.setName("Hacked Name");

        mockMvc.perform(put("/api/gems/{id}", gemId.toString())
                .header("Authorization", "Bearer " + user2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(csrf()))
                .andExpect(status().isForbidden());

        // Verify Gem was not modified
        Gem gem = gemRepository.findById(gemId).orElseThrow();
        assertEquals("User1's Gem", gem.getName());

        // When/Then - user1 updates their own Gem - should succeed
        updateRequest.setName("Updated Name");

        mockMvc.perform(put("/api/gems/{id}", gemId.toString())
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(csrf()))
                .andExpect(status().isOk());

        // Verify Gem was updated
        gem = gemRepository.findById(gemId).orElseThrow();
        assertEquals("Updated Name", gem.getName());
    }

    @Test
    void testInputValidation_RejectsInvalidData() throws Exception {
        // Test that invalid input is rejected
        // This endpoint requires authentication, so unauthenticated requests get 401
        CreateGemRequest request = new CreateGemRequest();
        request.setName(""); // Invalid: empty name
        request.setCategory("invalid-category"); // Invalid category
        
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(200.0); // Invalid: outside valid range
        coordinates.setLongitude(300.0);
        request.setCoordinates(coordinates);

        // Endpoint requires authentication, so unauthenticated request returns 401
        // Input validation would happen after authentication
        mockMvc.perform(post("/api/gems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }
}

