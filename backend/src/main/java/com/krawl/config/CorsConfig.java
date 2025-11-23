package com.krawl.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Getter
public class CorsConfig {
    
    @Value("${krawl.security.cors.allowed-origins:http://localhost:3000}")
    private String allowedOriginsString;
    
    public List<String> getAllowedOrigins() {
        return Arrays.asList(allowedOriginsString.split(","));
    }
}

