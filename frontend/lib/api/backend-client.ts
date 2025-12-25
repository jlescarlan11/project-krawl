/**
 * Centralized Backend API Client
 *
 * Provides a single source of truth for backend API URL and helper functions
 * for making authenticated requests to the Spring Boot backend.
 */

/**
 * Backend API base URL
 * Configured via NEXT_PUBLIC_API_URL environment variable
 */
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Build headers for backend requests
 * Automatically includes Authorization header if JWT token is provided
 */
export function buildBackendHeaders(jwt?: string, additionalHeaders?: HeadersInit): HeadersInit {
  const headers: HeadersInit = {
    ...additionalHeaders,
  };

  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }

  return headers;
}

/**
 * Make an authenticated GET request to the backend
 */
export async function backendGet(
  path: string,
  jwt?: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${BACKEND_API_URL}${path}`;
  return fetch(url, {
    ...options,
    method: 'GET',
    headers: buildBackendHeaders(jwt, options?.headers),
  });
}

/**
 * Make an authenticated POST request to the backend
 */
export async function backendPost(
  path: string,
  body: any,
  jwt?: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${BACKEND_API_URL}${path}`;
  return fetch(url, {
    ...options,
    method: 'POST',
    headers: buildBackendHeaders(jwt, {
      'Content-Type': 'application/json',
      ...options?.headers,
    }),
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated PUT request to the backend
 */
export async function backendPut(
  path: string,
  body: any,
  jwt?: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${BACKEND_API_URL}${path}`;
  return fetch(url, {
    ...options,
    method: 'PUT',
    headers: buildBackendHeaders(jwt, {
      'Content-Type': 'application/json',
      ...options?.headers,
    }),
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated DELETE request to the backend
 */
export async function backendDelete(
  path: string,
  jwt?: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${BACKEND_API_URL}${path}`;
  return fetch(url, {
    ...options,
    method: 'DELETE',
    headers: buildBackendHeaders(jwt, options?.headers),
  });
}

/**
 * Make an authenticated PATCH request to the backend
 */
export async function backendPatch(
  path: string,
  body: any,
  jwt?: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${BACKEND_API_URL}${path}`;
  return fetch(url, {
    ...options,
    method: 'PATCH',
    headers: buildBackendHeaders(jwt, {
      'Content-Type': 'application/json',
      ...options?.headers,
    }),
    body: JSON.stringify(body),
  });
}
