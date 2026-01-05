package com.krawl.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for EmailService.
 * Tests email service configuration and error handling behavior.
 * 
 * Note: Full WebClient integration testing would require MockWebServer
 * or WireMock. These tests focus on service configuration and graceful
 * error handling behavior.
 */
@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class EmailServiceTest {
    
    @InjectMocks
    private EmailService emailService;
    
    @BeforeEach
    void setUp() {
        // Set up test configuration
        ReflectionTestUtils.setField(emailService, "brevoApiKey", "test-api-key");
        ReflectionTestUtils.setField(emailService, "senderEmail", "noreply@krawl.com");
        ReflectionTestUtils.setField(emailService, "senderName", "Krawl Team");
    }
    
    @Test
    void testSendWelcomeEmail_ServiceDisabled_DoesNotThrow() {
        // Given
        ReflectionTestUtils.setField(emailService, "isEnabled", false);
        ReflectionTestUtils.setField(emailService, "webClient", null);
        
        // When/Then - Should not throw exception
        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail("test@example.com", "Test User");
        });
    }
    
    @Test
    void testSendWelcomeEmail_WebClientNull_DoesNotThrow() {
        // Given
        ReflectionTestUtils.setField(emailService, "isEnabled", true);
        ReflectionTestUtils.setField(emailService, "webClient", null);
        
        // When/Then - Should not throw exception
        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail("test@example.com", "Test User");
        });
    }
    
    @Test
    void testSendWelcomeEmail_NullDisplayName_HandlesGracefully() {
        // Given
        ReflectionTestUtils.setField(emailService, "isEnabled", false);
        ReflectionTestUtils.setField(emailService, "webClient", null);
        
        // When/Then - Should not throw exception with null display name
        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail("test@example.com", null);
        });
    }
    
    @Test
    void testSendWelcomeEmail_EmptyDisplayName_HandlesGracefully() {
        // Given
        ReflectionTestUtils.setField(emailService, "isEnabled", false);
        ReflectionTestUtils.setField(emailService, "webClient", null);
        
        // When/Then - Should not throw exception with empty display name
        assertDoesNotThrow(() -> {
            emailService.sendWelcomeEmail("test@example.com", "");
        });
    }
    
    @Test
    void testInit_NoApiKey_ServiceDisabled() {
        // Given
        ReflectionTestUtils.setField(emailService, "brevoApiKey", null);
        
        // When
        ReflectionTestUtils.invokeMethod(emailService, "init");
        
        // Then - Service should be disabled
        Boolean isEnabled = (Boolean) ReflectionTestUtils.getField(emailService, "isEnabled");
        assertFalse(Boolean.TRUE.equals(isEnabled));
    }
    
    @Test
    void testInit_EmptyApiKey_ServiceDisabled() {
        // Given
        ReflectionTestUtils.setField(emailService, "brevoApiKey", "");
        
        // When
        ReflectionTestUtils.invokeMethod(emailService, "init");
        
        // Then - Service should be disabled
        Boolean isEnabled = (Boolean) ReflectionTestUtils.getField(emailService, "isEnabled");
        assertFalse(Boolean.TRUE.equals(isEnabled));
    }
}

