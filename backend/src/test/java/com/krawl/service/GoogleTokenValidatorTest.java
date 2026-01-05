package com.krawl.service;

import com.krawl.exception.AuthException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for GoogleTokenValidator.
 * Note: This is a simplified test. In a real scenario, you would use MockWebServer
 * or WireMock to properly mock the Google API responses.
 */
@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class GoogleTokenValidatorTest {
    
    @Mock
    private WebClient.Builder webClientBuilder;
    
    @Mock
    private WebClient webClient;
    
    @Mock
    @SuppressWarnings("rawtypes")
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;
    
    @Mock
    @SuppressWarnings("rawtypes")
    private WebClient.RequestHeadersSpec requestHeadersSpec;
    
    @Mock
    private WebClient.ResponseSpec responseSpec;
    
    @InjectMocks
    private GoogleTokenValidator googleTokenValidator;
    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(googleTokenValidator, "tokenInfoUrl", 
            "https://www.googleapis.com/oauth2/v1/tokeninfo");
        ReflectionTestUtils.setField(googleTokenValidator, "userInfoUrl", 
            "https://www.googleapis.com/oauth2/v2/userinfo");
        ReflectionTestUtils.setField(googleTokenValidator, "timeout", 5000L);
        
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
        
        // Initialize WebClient by calling init() method
        ReflectionTestUtils.invokeMethod(googleTokenValidator, "init");
    }
    
    @Test
    @SuppressWarnings("unchecked")
    void testValidateToken_NetworkError_ThrowsException() {
        // Given
        String token = "valid-google-token";
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        Mono<Object> errorMono = Mono.error(new RuntimeException("Network error"));
        lenient().when(responseSpec.bodyToMono(any(Class.class))).thenReturn(errorMono);
        
        // When/Then
        assertThrows(AuthException.class, () -> {
            googleTokenValidator.validateToken(token);
        });
    }
    
    // Note: More comprehensive tests would require MockWebServer or WireMock
    // to properly mock Google API responses. This is a basic structure.
}

