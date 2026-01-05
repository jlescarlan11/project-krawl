package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.AuthRequest;
import com.krawl.dto.request.RefreshTokenRequest;
import com.krawl.dto.request.RevokeTokenRequest;
import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.User;
import com.krawl.exception.AuthException;
import com.krawl.service.GoogleTokenValidator;
import com.krawl.service.JwtTokenService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import com.krawl.service.UserService;
import com.krawl.util.TestDataFactory;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;

import java.time.Instant;
import java.util.Date;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
@Import(com.krawl.service.JwtTokenService.class)
@TestPropertySource(properties = {
    "krawl.security.jwt.secret=test-secret-key-for-jwt-token-generation-and-validation-testing",
    "krawl.security.jwt.expiration=86400000",
    "krawl.security.jwt.refresh-expiration=2592000000",
    "krawl.security.jwt.clock-skew-seconds=300"
})
@MockitoSettings(strictness = Strictness.LENIENT)
@SuppressWarnings("null")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GoogleTokenValidator googleTokenValidator;

    @MockitoBean
    private UserService userService;

    @MockitoSpyBean
    private JwtTokenService jwtTokenService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private TokenBlacklistService tokenBlacklistService;

    @MockitoBean
    private PlatformTransactionManager transactionManager;

    private User testUser;
    private GoogleUserInfo googleUserInfo;
    private UserService.UserCreationResult userCreationResult;

    @BeforeEach
    void setUp() {
        // Reset all mocks before each test
        reset(googleTokenValidator, userService, userDetailsService, 
              tokenBlacklistService, transactionManager);
        
        testUser = TestDataFactory.createUser();
        googleUserInfo = TestDataFactory.createGoogleUserInfo();
        userCreationResult = new UserService.UserCreationResult(testUser, false);
        
        // Configure transaction manager mock to support @Transactional
        TransactionStatus transactionStatus = mock(TransactionStatus.class);
        when(transactionStatus.isNewTransaction()).thenReturn(true);
        when(transactionStatus.isRollbackOnly()).thenReturn(false);
        when(transactionStatus.hasSavepoint()).thenReturn(false);
        when(transactionStatus.isCompleted()).thenReturn(false);
        when(transactionManager.getTransaction(any(TransactionDefinition.class))).thenReturn(transactionStatus);
        doNothing().when(transactionManager).commit(transactionStatus);
        doNothing().when(transactionManager).rollback(transactionStatus);
    }

    @Test
    void testAuthenticate_ValidToken_ReturnsAuthResponse() throws Exception {
        // Given
        String googleToken = "valid-google-oauth-token-12345678901234567890";
        String accessToken = "access-token";
        String refreshToken = "refresh-token";

        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);

        when(googleTokenValidator.validateToken(googleToken)).thenReturn(googleUserInfo);
        when(userService.createOrUpdateUser(googleUserInfo)).thenReturn(userCreationResult);
        when(jwtTokenService.generateToken(anyString(), anyString(), anyList())).thenReturn(accessToken);
        when(jwtTokenService.generateRefreshToken(anyString(), anyString())).thenReturn(refreshToken);

        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value(accessToken))
                .andExpect(jsonPath("$.refreshToken").value(refreshToken))
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.isNewUser").value(false));

        verify(googleTokenValidator).validateToken(googleToken);
        verify(userService).createOrUpdateUser(googleUserInfo);
        verify(jwtTokenService).generateToken(eq(testUser.getId().toString()), eq(testUser.getEmail()), anyList());
        verify(jwtTokenService).generateRefreshToken(eq(testUser.getId().toString()), eq(testUser.getEmail()));
    }

    @Test
    void testAuthenticate_NewUser_ReturnsIsNewUserTrue() throws Exception {
        // Given
        String googleToken = "valid-google-oauth-token-12345678901234567890";
        UserService.UserCreationResult newUserResult = 
                new UserService.UserCreationResult(testUser, true);

        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);

        when(googleTokenValidator.validateToken(googleToken)).thenReturn(googleUserInfo);
        when(userService.createOrUpdateUser(googleUserInfo)).thenReturn(newUserResult);
        when(jwtTokenService.generateToken(anyString(), anyString(), anyList())).thenReturn("access-token");
        when(jwtTokenService.generateRefreshToken(anyString(), anyString())).thenReturn("refresh-token");

        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isNewUser").value(true));
    }

    @Test
    void testAuthenticate_InvalidTokenFormat_ReturnsBadRequest() throws Exception {
        // Given
        AuthRequest request = new AuthRequest();
        request.setToken("short"); // Too short, violates @Size(min = 20)

        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(googleTokenValidator, never()).validateToken(anyString());
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
        String googleToken = "invalid-google-oauth-token-12345678901234567890";
        AuthRequest request = new AuthRequest();
        request.setToken(googleToken);

        when(googleTokenValidator.validateToken(googleToken))
                .thenThrow(new AuthException("Invalid token", HttpStatus.UNAUTHORIZED));

        // When/Then
        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());

        verify(userService, never()).createOrUpdateUser(any());
    }

    @Test
    void testRefreshToken_ValidToken_ReturnsNewTokens() throws Exception {
        // Given
        String userId = testUser.getId().toString();
        String email = testUser.getEmail();
        String newAccessToken = "new-access-token";
        String newRefreshToken = "new-refresh-token";
        
        String refreshToken = jwtTokenService.generateRefreshToken(userId, email);

        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken(refreshToken);

        Claims realClaims = jwtTokenService.validateRefreshToken(refreshToken);
        
        doReturn(realClaims).when(jwtTokenService).validateRefreshToken(refreshToken);
        when(tokenBlacklistService.isBlacklisted(refreshToken)).thenReturn(false);
        when(jwtTokenService.generateToken(eq(userId), eq(email), anyList())).thenReturn(newAccessToken);
        when(jwtTokenService.generateRefreshToken(userId, email)).thenReturn(newRefreshToken);

        // When/Then
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(newAccessToken))
                .andExpect(jsonPath("$.refreshToken").value(newRefreshToken));

        verify(jwtTokenService, atLeast(1)).validateRefreshToken(refreshToken);
        verify(tokenBlacklistService).isBlacklisted(refreshToken);
        verify(tokenBlacklistService).addToBlacklist(eq(refreshToken), any(Instant.class));
    }

    @Test
    void testRefreshToken_BlacklistedToken_ReturnsUnauthorized() throws Exception {
        // Given
        String refreshToken = "blacklisted-refresh-token";
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken(refreshToken);

        Claims claims = mock(Claims.class);
        when(claims.getSubject()).thenReturn(testUser.getId().toString());
        when(claims.get("email")).thenReturn(testUser.getEmail());

        doReturn(claims).when(jwtTokenService).validateRefreshToken(refreshToken);
        when(tokenBlacklistService.isBlacklisted(refreshToken)).thenReturn(true);

        // When/Then
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());

        verify(tokenBlacklistService, never()).addToBlacklist(anyString(), any(Instant.class));
    }

    @Test
    void testRefreshToken_InvalidToken_ReturnsUnauthorized() throws Exception {
        // Given
        String refreshToken = "invalid-refresh-token";
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken(refreshToken);

        doThrow(new AuthException("Invalid token", HttpStatus.UNAUTHORIZED))
                .when(jwtTokenService).validateRefreshToken(refreshToken);

        // When/Then
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testRevokeToken_ValidTokens_ReturnsSuccess() throws Exception {
        // Given
        String accessToken = "valid-access-token";
        String refreshToken = "valid-refresh-token";

        RevokeTokenRequest request = new RevokeTokenRequest();
        request.setAccessToken(accessToken);
        request.setRefreshToken(refreshToken);

        Claims accessClaims = mock(Claims.class);
        when(accessClaims.getExpiration()).thenReturn(Date.from(Instant.now().plusSeconds(3600)));

        Claims refreshClaims = mock(Claims.class);
        when(refreshClaims.getExpiration()).thenReturn(Date.from(Instant.now().plusSeconds(86400)));

        doReturn(accessClaims).when(jwtTokenService).validateToken(accessToken);
        doReturn(refreshClaims).when(jwtTokenService).validateRefreshToken(refreshToken);

        // When/Then
        mockMvc.perform(post("/api/auth/revoke")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Tokens revoked successfully"));

        verify(tokenBlacklistService).addToBlacklist(eq(accessToken), any(Instant.class));
        verify(tokenBlacklistService).addToBlacklist(eq(refreshToken), any(Instant.class));
    }

    @Test
    void testRevokeToken_InvalidAccessToken_StillReturnsSuccess() throws Exception {
        // Given
        String accessToken = "invalid-access-token";
        RevokeTokenRequest request = new RevokeTokenRequest();
        request.setAccessToken(accessToken);

        doThrow(new AuthException("Invalid token", HttpStatus.UNAUTHORIZED))
                .when(jwtTokenService).validateToken(accessToken);

        // When/Then - Should return success even with invalid token
        mockMvc.perform(post("/api/auth/revoke")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Tokens revoked successfully"));
    }
}