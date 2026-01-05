package com.krawl.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.response.CreateGemResponse;
import com.krawl.entity.Gem;
import com.krawl.entity.User;
import com.krawl.repository.GemRepository;
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
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for gem creation flow.
 * Tests the complete flow from form submission to database persistence.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class GemCreationFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GemRepository gemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenService jwtTokenService;

    private User testUser;
    private String authToken;

    @BeforeEach
    void setUp() {
        gemRepository.deleteAll();
        userRepository.deleteAll();
        
        testUser = User.builder()
                .email("test@example.com")
                .displayName("Test User")
                .googleId("google-test")
                .build();
        testUser = userRepository.save(testUser);
        
        // Generate JWT token for authentication
        authToken = jwtTokenService.generateToken(
            testUser.getId().toString(),
            testUser.getEmail(),
            java.util.List.of("ROLE_USER")
        );
    }

    @Test
    void testGemCreationFlow_ValidRequest_CreatesGemInDatabase() throws Exception {
        // Given
        CreateGemRequest request = new CreateGemRequest();
        request.setName("Test Gem");
        request.setCategory("historical-site");
        request.setDistrict("Downtown");
        request.setShortDescription("A test gem");
        
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(10.3157);
        coordinates.setLongitude(123.8854);
        request.setCoordinates(coordinates);
        
        // Add required photos and thumbnailIndex
        request.setPhotos(List.of("https://res.cloudinary.com/test/image/upload/test.jpg"));
        request.setThumbnailIndex(0);

        // When
        String responseJson = mockMvc.perform(post("/api/gems")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.gemId").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Then - verify gem was created in database
        CreateGemResponse response = objectMapper.readValue(responseJson, CreateGemResponse.class);
        UUID gemId = response.getGemId();
        
        Optional<Gem> gem = gemRepository.findById(gemId);
        assertTrue(gem.isPresent());
        assertEquals("Test Gem", gem.get().getName());
        assertEquals("historical-site", gem.get().getCategory());
        assertEquals(10.3157, gem.get().getLatitude());
        assertEquals(123.8854, gem.get().getLongitude());
    }

    @Test
    void testGemCreationFlow_InvalidCoordinates_ReturnsBadRequest() throws Exception {
        // Given - coordinates outside Cebu City bounds
        CreateGemRequest request = new CreateGemRequest();
        request.setName("Test Gem");
        request.setCategory("historical-site");
        request.setDistrict("Downtown");
        
        CreateGemRequest.Coordinates coordinates = new CreateGemRequest.Coordinates();
        coordinates.setLatitude(0.0); // Invalid - outside Cebu City
        coordinates.setLongitude(0.0);
        request.setCoordinates(coordinates);
        
        // Add required photos and thumbnailIndex (even though coordinates are invalid)
        request.setPhotos(List.of("https://res.cloudinary.com/test/image/upload/test.jpg"));
        request.setThumbnailIndex(0);

        // When/Then
        mockMvc.perform(post("/api/gems")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }
}

