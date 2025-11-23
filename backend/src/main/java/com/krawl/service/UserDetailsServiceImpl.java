package com.krawl.service;

import com.krawl.entity.User;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

/**
 * Custom UserDetailsService implementation for JWT-based authentication.
 * Loads user details from database using user ID (UUID) from JWT token.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    /**
     * Loads user details by username (which is the user ID UUID in JWT-based auth).
     * 
     * @param username User ID as UUID string
     * @return UserDetails for Spring Security
     * @throws UsernameNotFoundException if user not found or invalid ID format
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // For JWT-based auth, username is the user ID (UUID)
        try {
            UUID userId = UUID.fromString(username);
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            
            // Ensure user ID is not null (should never happen, but safety check)
            if (user.getId() == null) {
                throw new UsernameNotFoundException("User ID is null for user: " + username);
            }
            
            String userIdString = user.getId().toString();
            
            return org.springframework.security.core.userdetails.User.builder()
                .username(userIdString)
                .password("") // No password for OAuth users
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
        } catch (IllegalArgumentException e) {
            throw new UsernameNotFoundException("Invalid user ID format: " + username, e);
        }
    }
}

