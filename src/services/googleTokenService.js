// Google Analytics Token Service
// Handles automatic token generation and refresh using service account credentials

import crypto from 'crypto';

class GoogleTokenService {
  constructor() {
    this.currentToken = null;
    this.tokenExpiration = null;
    this.refreshPromise = null; // Prevent multiple concurrent refresh attempts
    
    // Service account credentials from environment
    this.serviceAccount = {
      private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
      private_key_id: process.env.REACT_APP_GOOGLE_PRIVATE_KEY_ID,
      project_id: process.env.REACT_APP_GOOGLE_PROJECT_ID
    };
  }

  // Check if credentials are available
  hasCredentials() {
    return !!(
      this.serviceAccount.private_key &&
      this.serviceAccount.client_email &&
      this.serviceAccount.private_key_id
    );
  }

  // Check if current token is valid (not expired with 5 minute buffer)
  isTokenValid() {
    if (!this.currentToken || !this.tokenExpiration) {
      return false;
    }
    
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return this.tokenExpiration > (now + bufferTime);
  }

  // Create JWT token for authentication
  createJWT() {
    if (!this.hasCredentials()) {
      throw new Error('Service account credentials not configured');
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600, // 1 hour expiration
      iat: now
    };

    // Create JWT header
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: this.serviceAccount.private_key_id
    };

    // Base64URL encode header and payload
    const encodedHeader = btoa(JSON.stringify(header))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Create signature input
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    // Note: Browser crypto.subtle doesn't support RS256 with private keys
    // This is a limitation of browser-based service account authentication
    throw new Error('JWT signing with RS256 not supported in browser environment. Use server-side token generation.');
  }

  // Get access token (with automatic refresh)
  async getAccessToken() {
    // Return cached token if valid
    if (this.isTokenValid()) {
      return this.currentToken;
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    // Start token refresh
    this.refreshPromise = this.refreshToken();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  // Refresh the access token
  async refreshToken() {
    // Check if we have environment token first (manual override)
    const envToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
    if (envToken) {
      console.log('Using manual Google Analytics token from environment');
      this.currentToken = envToken;
      // Set expiration to 50 minutes from now (tokens usually last 1 hour)
      this.tokenExpiration = Date.now() + (50 * 60 * 1000);
      return envToken;
    }

    // Browser limitation: Cannot sign JWT with private keys
    // This would need to be implemented server-side
    throw new Error(
      'Automatic token refresh requires server-side implementation. ' +
      'For browser use, set REACT_APP_GOOGLE_ACCESS_TOKEN manually or implement token refresh endpoint.'
    );
  }

  // Clear cached token (force refresh on next request)
  clearToken() {
    this.currentToken = null;
    this.tokenExpiration = null;
    this.refreshPromise = null;
  }

  // Get token status for debugging
  getStatus() {
    return {
      hasCredentials: this.hasCredentials(),
      hasToken: !!this.currentToken,
      isValid: this.isTokenValid(),
      expiresAt: this.tokenExpiration ? new Date(this.tokenExpiration) : null,
      expiresIn: this.tokenExpiration ? Math.max(0, this.tokenExpiration - Date.now()) : 0
    };
  }
}

// Export singleton instance
const googleTokenService = new GoogleTokenService();
export default googleTokenService;