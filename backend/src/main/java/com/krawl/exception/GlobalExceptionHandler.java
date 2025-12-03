package com.krawl.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for REST controllers.
 * Handles all exceptions and returns appropriate HTTP responses.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * Handles authentication-related exceptions.
     * 
     * @param e AuthException
     * @return Error response with appropriate HTTP status
     */
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException e) {
        log.error("Authentication error: {}", e.getMessage());
        ErrorResponse error = ErrorResponse.builder()
            .error(e.getClass().getSimpleName())
            .message(e.getMessage())
            .build();
        HttpStatus status = e.getStatus();
        return ResponseEntity.status(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    /**
     * Handles resource not found exceptions.
     *
     * @param e ResourceNotFoundException
     * @return Error response with 404 Not Found status
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
        log.error("Resource not found: {}", e.getMessage());
        ErrorResponse error = ErrorResponse.builder()
            .error("RESOURCE_NOT_FOUND")
            .message(e.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles validation errors (IllegalArgumentException).
     *
     * @param e IllegalArgumentException
     * @return Error response with 400 Bad Request status
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        log.error("Validation error: {}", e.getMessage());
        ErrorResponse error = ErrorResponse.builder()
            .error("VALIDATION_ERROR")
            .message(e.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles validation errors triggered by @Valid/@Validated annotated parameters.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
        log.error("Method argument validation failed: {}", e.getMessage());
        String message = e.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .filter(msg -> msg != null && !msg.isBlank())
            .findFirst()
            .orElse("Validation failed");

        ErrorResponse error = ErrorResponse.builder()
            .error("VALIDATION_ERROR")
            .message(message)
            .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles forbidden access exceptions.
     *
     * @param e ForbiddenException
     * @return Error response with 403 Forbidden status
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException e) {
        log.error("Forbidden access: {}", e.getMessage());
        ErrorResponse error = ErrorResponse.builder()
            .error("FORBIDDEN")
            .message(e.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    /**
     * Handles all other unhandled exceptions.
     * 
     * @param e Exception
     * @return Error response with 500 Internal Server Error status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        log.error("Unexpected error", e);
        ErrorResponse error = ErrorResponse.builder()
            .error("INTERNAL_ERROR")
            .message("An unexpected error occurred")
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

