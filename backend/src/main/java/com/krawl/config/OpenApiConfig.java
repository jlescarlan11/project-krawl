package com.krawl.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger configuration for API documentation
 * Access API docs at: /swagger-ui/index.html
 * OpenAPI spec at: /v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI krawlOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Krawl API")
                        .description("The Living Map of Filipino Culture - Backend REST API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Krawl Team")
                                .email("support@krawl.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api.krawl.com")
                                .description("Production Server")))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token obtained from /api/auth/google endpoint")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
