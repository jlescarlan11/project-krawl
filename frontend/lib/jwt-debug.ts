/**
 * JWT Debugging Utility
 * 
 * Provides utilities for debugging JWT tokens in development mode only.
 * These utilities decode JWT tokens without verification for debugging purposes.
 * 
 * WARNING: These functions should ONLY be used in development mode.
 * They do NOT verify token signatures and should never be used for authentication.
 */

/**
 * Decodes a JWT token payload without verification.
 * This is for debugging purposes only and does not verify the token signature.
 * 
 * @param token - JWT token string
 * @returns Decoded payload object or null if decoding fails
 * @throws Error if used in production mode
 */
export function decodeJwtPayload(token: string): Record<string, any> | null {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT debugging utilities should not be used in production');
  }

  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('[JWT Debug] Invalid JWT format: expected 3 parts, got', parts.length);
      return null;
    }

    // Decode payload (second part)
    const payload = parts[1];
    // Base64 URL decode
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('[JWT Debug] Failed to decode JWT payload:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired based on its expiration claim.
 * 
 * @param token - JWT token string
 * @returns Object with expiration status and details
 */
export function checkTokenExpiration(token: string): {
  isExpired: boolean;
  expirationDate: Date | null;
  timeUntilExpiration: number | null;
  expirationStatus: 'expired' | 'expiring_soon' | 'valid' | 'unknown';
} {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT debugging utilities should not be used in production');
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return {
      isExpired: true,
      expirationDate: null,
      timeUntilExpiration: null,
      expirationStatus: 'unknown',
    };
  }

  const exp = payload.exp;
  if (!exp) {
    return {
      isExpired: false,
      expirationDate: null,
      timeUntilExpiration: null,
      expirationStatus: 'unknown',
    };
  }

  // JWT exp is in seconds, convert to milliseconds
  const expirationDate = new Date(exp * 1000);
  const now = new Date();
  const timeUntilExpiration = expirationDate.getTime() - now.getTime();
  const isExpired = timeUntilExpiration <= 0;

  let expirationStatus: 'expired' | 'expiring_soon' | 'valid' | 'unknown';
  if (isExpired) {
    expirationStatus = 'expired';
  } else if (timeUntilExpiration < 5 * 60 * 1000) {
    // Expiring within 5 minutes
    expirationStatus = 'expiring_soon';
  } else {
    expirationStatus = 'valid';
  }

  return {
    isExpired,
    expirationDate,
    timeUntilExpiration,
    expirationStatus,
  };
}

/**
 * Formats JWT token information for logging.
 * Only shows safe information and never exposes the full token.
 * 
 * @param token - JWT token string
 * @returns Formatted token information object
 */
export function formatTokenInfo(token: string): {
  preview: string;
  length: number;
  payload: Record<string, any> | null;
  expiration: {
    isExpired: boolean;
    expirationDate: string | null;
    timeUntilExpiration: string | null;
    expirationStatus: string;
  };
} {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT debugging utilities should not be used in production');
  }

  const preview = token.length > 50 ? token.substring(0, 50) + '...' : token;
  const payload = decodeJwtPayload(token);
  const expiration = checkTokenExpiration(token);

  return {
    preview,
    length: token.length,
    payload,
    expiration: {
      isExpired: expiration.isExpired,
      expirationDate: expiration.expirationDate?.toISOString() || null,
      timeUntilExpiration: expiration.timeUntilExpiration
        ? `${Math.floor(expiration.timeUntilExpiration / 1000 / 60)} minutes`
        : null,
      expirationStatus: expiration.expirationStatus,
    },
  };
}

/**
 * Safely logs JWT token information for debugging.
 * Only logs in development mode and never exposes full tokens.
 * 
 * @param token - JWT token string
 * @param label - Optional label for the log message
 */
export function logTokenInfo(token: string, label?: string): void {
  if (process.env.NODE_ENV === 'production') {
    return; // Silently return in production
  }

  try {
    const info = formatTokenInfo(token);
    const logLabel = label ? `[JWT Debug] ${label}` : '[JWT Debug]';
    console.log(logLabel, {
      preview: info.preview,
      length: info.length,
      userId: info.payload?.sub || 'unknown',
      email: info.payload?.email || 'unknown',
      expiration: info.expiration,
    });
  } catch (error) {
    console.error('[JWT Debug] Failed to log token info:', error);
  }
}


