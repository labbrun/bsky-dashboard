// Security Service - Enhanced security utilities and validation
// Implements security best practices for the application

import logger from './loggingService';

class SecurityService {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxFailedAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.sessionKey = 'labb-analytics-session';
    this.failedAttemptsKey = 'labb-analytics-failed-attempts';
    this.lockoutKey = 'labb-analytics-lockout';
  }

  // Enhanced authentication with session management
  authenticate(password, configPassword) {
    // Check if account is locked out
    if (this.isAccountLockedOut()) {
      const lockoutEnd = this.getLockoutEndTime();
      const timeRemaining = Math.ceil((lockoutEnd - Date.now()) / 1000 / 60);
      logger.warn('Authentication attempt on locked account', { timeRemaining });
      return {
        success: false,
        error: `Account locked. Try again in ${timeRemaining} minutes.`,
        lockout: true
      };
    }

    // Validate password
    if (!this.validatePassword(password)) {
      logger.warn('Invalid password format in authentication attempt');
      return {
        success: false,
        error: 'Invalid password format',
        validation: false
      };
    }

    // Check password
    if (password === configPassword) {
      // Success - reset failed attempts and create session
      this.resetFailedAttempts();
      this.createSecureSession();
      logger.info('Successful authentication');
      
      return {
        success: true,
        sessionId: this.generateSessionId()
      };
    } else {
      // Failed attempt
      const failedAttempts = this.recordFailedAttempt();
      logger.warn('Failed authentication attempt', { failedAttempts });
      
      if (failedAttempts >= this.maxFailedAttempts) {
        this.lockoutAccount();
        return {
          success: false,
          error: 'Too many failed attempts. Account locked for 15 minutes.',
          lockout: true
        };
      }
      
      return {
        success: false,
        error: 'Invalid password',
        attemptsRemaining: this.maxFailedAttempts - failedAttempts
      };
    }
  }

  // Validate password format
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return false;
    }
    
    // Basic validation - minimum length
    if (password.length < 8) {
      return false;
    }
    
    // Check for obviously weak passwords
    const weakPasswords = ['password', '12345678', 'qwerty123'];
    if (weakPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
      return false;
    }
    
    return true;
  }

  // Create secure session with timeout
  createSecureSession() {
    const session = {
      id: this.generateSessionId(),
      createdAt: Date.now(),
      expiresAt: Date.now() + this.sessionTimeout,
      valid: true
    };
    
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    
    // Set automatic cleanup
    setTimeout(() => {
      this.cleanupExpiredSession();
    }, this.sessionTimeout);
    
    return session;
  }

  // Validate current session
  validateSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) {
        return { valid: false, reason: 'No session found' };
      }
      
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      if (!session.valid) {
        return { valid: false, reason: 'Session invalidated' };
      }
      
      if (now > session.expiresAt) {
        this.invalidateSession();
        return { valid: false, reason: 'Session expired' };
      }
      
      // Extend session if more than half the timeout has passed
      const halfTimeout = this.sessionTimeout / 2;
      if (now - session.createdAt > halfTimeout) {
        this.extendSession();
      }
      
      return { valid: true, session };
      
    } catch (error) {
      logger.error('Session validation failed', { error: error.message });
      return { valid: false, reason: 'Session validation error' };
    }
  }

  // Extend current session
  extendSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.expiresAt = Date.now() + this.sessionTimeout;
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        logger.debug('Session extended');
      }
    } catch (error) {
      logger.error('Failed to extend session', { error: error.message });
    }
  }

  // Invalidate session
  invalidateSession() {
    localStorage.removeItem(this.sessionKey);
    logger.info('Session invalidated');
  }

  // Cleanup expired session
  cleanupExpiredSession() {
    const validation = this.validateSession();
    if (!validation.valid) {
      this.invalidateSession();
    }
  }

  // Generate secure session ID
  generateSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Failed attempt tracking
  recordFailedAttempt() {
    try {
      const attempts = this.getFailedAttempts() + 1;
      localStorage.setItem(this.failedAttemptsKey, attempts.toString());
      localStorage.setItem(`${this.failedAttemptsKey}_timestamp`, Date.now().toString());
      return attempts;
    } catch (error) {
      logger.error('Failed to record failed attempt', { error: error.message });
      return 0;
    }
  }

  getFailedAttempts() {
    try {
      const attempts = localStorage.getItem(this.failedAttemptsKey);
      const timestamp = localStorage.getItem(`${this.failedAttemptsKey}_timestamp`);
      
      // Reset failed attempts if more than 1 hour has passed
      if (timestamp && Date.now() - parseInt(timestamp) > 60 * 60 * 1000) {
        this.resetFailedAttempts();
        return 0;
      }
      
      return attempts ? parseInt(attempts) : 0;
    } catch (error) {
      return 0;
    }
  }

  resetFailedAttempts() {
    localStorage.removeItem(this.failedAttemptsKey);
    localStorage.removeItem(`${this.failedAttemptsKey}_timestamp`);
  }

  // Account lockout management
  lockoutAccount() {
    const lockoutEnd = Date.now() + this.lockoutDuration;
    localStorage.setItem(this.lockoutKey, lockoutEnd.toString());
    logger.warn('Account locked due to failed attempts', { lockoutEnd });
  }

  isAccountLockedOut() {
    try {
      const lockoutEnd = localStorage.getItem(this.lockoutKey);
      if (!lockoutEnd) return false;
      
      const now = Date.now();
      const lockoutTime = parseInt(lockoutEnd);
      
      if (now < lockoutTime) {
        return true;
      } else {
        // Lockout expired, clean up
        localStorage.removeItem(this.lockoutKey);
        this.resetFailedAttempts();
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  getLockoutEndTime() {
    try {
      const lockoutEnd = localStorage.getItem(this.lockoutKey);
      return lockoutEnd ? parseInt(lockoutEnd) : null;
    } catch (error) {
      return null;
    }
  }

  // Input sanitization utilities
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential XSS patterns
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Validate URL safety
  isUrlSafe(url) {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS (except localhost for development)
      if (urlObj.protocol !== 'https:' && 
          !['localhost', '127.0.0.1', '0.0.0.0'].includes(urlObj.hostname)) {
        return false;
      }
      
      // Block potentially dangerous protocols
      const blockedProtocols = ['javascript:', 'data:', 'file:', 'ftp:'];
      if (blockedProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // Content Security Policy helpers
  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Security headers validation
  validateSecurityHeaders(response) {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection'
    ];
    
    const missing = requiredHeaders.filter(header => !response.headers.get(header));
    
    if (missing.length > 0) {
      logger.warn('Missing security headers', { missing });
    }
    
    return missing.length === 0;
  }

  // Rate limiting (client-side basic implementation)
  rateLimit(action, limit = 10, windowMs = 60000) {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    
    try {
      const data = localStorage.getItem(key);
      let attempts = data ? JSON.parse(data) : [];
      
      // Remove attempts outside the window
      attempts = attempts.filter(timestamp => now - timestamp < windowMs);
      
      if (attempts.length >= limit) {
        return { allowed: false, resetIn: windowMs - (now - attempts[0]) };
      }
      
      // Record this attempt
      attempts.push(now);
      localStorage.setItem(key, JSON.stringify(attempts));
      
      return { allowed: true, remaining: limit - attempts.length };
    } catch (error) {
      logger.error('Rate limiting error', { error: error.message });
      return { allowed: true }; // Fail open
    }
  }

  // Security monitoring
  reportSecurityEvent(event, details = {}) {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getCurrentSessionId()
    };
    
    logger.warn('Security event reported', securityEvent);
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Implementation would send to security monitoring service
    }
    
    return securityEvent;
  }

  getCurrentSessionId() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        return session.id;
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  }

  // Get security status summary
  getSecurityStatus() {
    const session = this.validateSession();
    const failedAttempts = this.getFailedAttempts();
    const isLockedOut = this.isAccountLockedOut();
    
    return {
      authenticated: session.valid,
      sessionValid: session.valid,
      failedAttempts,
      isLockedOut,
      lockoutEndTime: this.getLockoutEndTime(),
      sessionExpiresAt: session.valid ? session.session?.expiresAt : null
    };
  }
}

// Create singleton instance
const securityService = new SecurityService();

export { SecurityService };
export default securityService;