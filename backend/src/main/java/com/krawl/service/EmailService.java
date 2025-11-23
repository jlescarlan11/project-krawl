package com.krawl.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for sending transactional emails via Brevo (formerly Sendinblue).
 * Handles welcome emails and other user communication.
 * Email sending is asynchronous to avoid blocking account creation.
 */
@Service
@Slf4j
public class EmailService {
    
    @Value("${brevo.api.key}")
    private String brevoApiKey;
    
    @Value("${brevo.sender.email}")
    private String senderEmail;
    
    @Value("${brevo.sender.name}")
    private String senderName;
    
    private WebClient webClient;
    private boolean isEnabled = false;
    
    /**
     * Initializes the Brevo API client after dependency injection.
     * Logs warning if API key is not configured.
     */
    @PostConstruct
    public void init() {
        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            log.warn("Brevo API key not configured. Email service will be disabled.");
            return;
        }
        
        try {
            webClient = WebClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .defaultHeader("api-key", brevoApiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
            isEnabled = true;
            log.info("Email service initialized with sender: {} <{}>", senderName, senderEmail);
        } catch (Exception e) {
            log.error("Failed to initialize email service", e);
        }
    }
    
    /**
     * Sends a welcome email to a newly created user.
     * Executes asynchronously to avoid blocking account creation.
     * 
     * @param email User's email address
     * @param displayName User's display name
     */
    @Async("emailTaskExecutor")
    public void sendWelcomeEmail(String email, String displayName) {
        if (!isEnabled || webClient == null) {
            log.warn("Email service not initialized. Skipping welcome email to: {}", email);
            return;
        }
        
        try {
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            
            // Set sender
            Map<String, String> sender = new HashMap<>();
            sender.put("email", senderEmail);
            sender.put("name", senderName);
            requestBody.put("sender", sender);
            
            // Set recipient
            List<Map<String, String>> toList = List.of(
                Map.of("email", email)
            );
            requestBody.put("to", toList);
            
            // Set email content
            requestBody.put("subject", "Welcome to Krawl!");
            requestBody.put("htmlContent", buildWelcomeEmailContent(displayName));
            requestBody.put("textContent", buildWelcomeEmailTextContent(displayName));
            
            // Send email via Brevo API
            webClient.post()
                .uri("/smtp/email")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(10))
                .block();
            
            log.info("Welcome email sent successfully to: {}", email);
            
        } catch (WebClientResponseException e) {
            // Handle rate limiting (429) separately
            if (e.getStatusCode().value() == 429) {
                log.warn("Brevo rate limit reached. Welcome email queued for: {}", email);
            } else {
                log.error("Failed to send welcome email to: {}. Status: {}, Message: {}", 
                    email, e.getStatusCode(), e.getMessage(), e);
            }
            // Don't throw exception - email failure shouldn't affect account creation
        } catch (Exception e) {
            log.error("Unexpected error sending welcome email to: {}", email, e);
        }
    }
    
    /**
     * Builds HTML content for welcome email.
     * 
     * @param displayName User's display name
     * @return HTML email content
     */
    private String buildWelcomeEmailContent(String displayName) {
        String name = displayName != null && !displayName.isEmpty() ? displayName : "there";
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Krawl</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2563eb;">Welcome to Krawl, %s!</h1>
                <p>Thank you for joining Krawl, the living map of Filipino culture in Cebu City.</p>
                <p>You can now:</p>
                <ul>
                    <li>Discover cultural gems across Cebu City</li>
                    <li>Create your own Krawls (cultural trails)</li>
                    <li>Share and vouch for your favorite places</li>
                    <li>Connect with the community</li>
                </ul>
                <p>Start exploring Cebu's rich culture today!</p>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    Best regards,<br>
                    The Krawl Team
                </p>
            </body>
            </html>
            """, name);
    }
    
    /**
     * Builds plain text content for welcome email.
     * 
     * @param displayName User's display name
     * @return Plain text email content
     */
    private String buildWelcomeEmailTextContent(String displayName) {
        String name = displayName != null && !displayName.isEmpty() ? displayName : "there";
        return String.format("""
            Welcome to Krawl, %s!
            
            Thank you for joining Krawl, the living map of Filipino culture in Cebu City.
            
            You can now:
            - Discover cultural gems across Cebu City
            - Create your own Krawls (cultural trails)
            - Share and vouch for your favorite places
            - Connect with the community
            
            Start exploring Cebu's rich culture today!
            
            Best regards,
            The Krawl Team
            """, name);
    }
}

