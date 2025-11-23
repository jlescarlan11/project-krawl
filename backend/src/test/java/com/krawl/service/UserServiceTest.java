package com.krawl.service;

import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.User;
import com.krawl.exception.AuthException;
import com.krawl.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    private GoogleUserInfo googleUserInfo;
    private User existingUser;
    
    @BeforeEach
    void setUp() {
        googleUserInfo = GoogleUserInfo.builder()
            .googleId("google-123")
            .email("test@example.com")
            .displayName("Test User")
            .avatarUrl("https://example.com/avatar.jpg")
            .build();
        
        existingUser = User.builder()
            .id(UUID.randomUUID())
            .email("test@example.com")
            .displayName("Test User")
            .avatarUrl("https://example.com/avatar.jpg")
            .googleId("google-123")
            .build();
    }
    
    @Test
    void testCreateOrUpdateUser_NewUser_CreatesUser() {
        // Given
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        
        // When
        User result = userService.createOrUpdateUser(googleUserInfo);
        
        // Then
        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
        verify(userRepository, times(1)).findByGoogleId("google-123");
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }
    
    @Test
    void testCreateOrUpdateUser_ExistingUser_UpdatesUser() {
        // Given
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.of(existingUser));
        
        // When
        User result = userService.createOrUpdateUser(googleUserInfo);
        
        // Then
        assertNotNull(result);
        verify(userRepository, never()).save(any(User.class)); // No changes, so no save
        verify(userRepository, times(1)).findByGoogleId("google-123");
    }
    
    @Test
    void testCreateOrUpdateUser_EmailConflict_ThrowsException() {
        // Given
        User differentUser = User.builder()
            .id(UUID.randomUUID())
            .email("test@example.com")
            .googleId("different-google-id")
            .build();
        
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(differentUser));
        
        // When/Then
        AuthException exception = assertThrows(AuthException.class, () -> {
            userService.createOrUpdateUser(googleUserInfo);
        });
        
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void testCreateOrUpdateUser_ConcurrentCreation_RetriesWithExisting() {
        // Given
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
            .thenThrow(new DataIntegrityViolationException("Duplicate key"))
            .thenReturn(existingUser);
        when(userRepository.findByGoogleId("google-123"))
            .thenReturn(Optional.empty())
            .thenReturn(Optional.of(existingUser));
        
        // When
        User result = userService.createOrUpdateUser(googleUserInfo);
        
        // Then
        assertNotNull(result);
        verify(userRepository, atLeastOnce()).findByGoogleId("google-123");
    }
    
    @Test
    void testCreateOrUpdateUser_UpdateUser_WithChangedData() {
        // Given
        GoogleUserInfo updatedInfo = GoogleUserInfo.builder()
            .googleId("google-123")
            .email("test@example.com")
            .displayName("Updated Name")
            .avatarUrl("https://example.com/new-avatar.jpg")
            .build();
        
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(existingUser);
        
        // When
        User result = userService.createOrUpdateUser(updatedInfo);
        
        // Then
        assertNotNull(result);
        verify(userRepository, times(1)).save(existingUser);
    }
}

