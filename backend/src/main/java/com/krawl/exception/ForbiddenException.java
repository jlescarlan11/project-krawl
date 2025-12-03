package com.krawl.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a user attempts to perform an action they don't have permission for.
 * Results in HTTP 403 Forbidden response.
 */
public class ForbiddenException extends RuntimeException {
    private final HttpStatus status = HttpStatus.FORBIDDEN;

    public ForbiddenException(String message) {
        super(message);
    }

    public HttpStatus getStatus() {
        return status;
    }
}

