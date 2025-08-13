// Centralized error handling utilities

export class AppError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Error codes
export const ERROR_CODES = {
  API_CONNECTION_FAILED: 'API_CONNECTION_FAILED',
  AUTH_FAILED: 'AUTH_FAILED',
  DATA_FETCH_FAILED: 'DATA_FETCH_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Handle different error types
export const handleError = (error) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return {
      message: 'Network error. Please check your connection.',
      code: ERROR_CODES.NETWORK_ERROR,
      details: error.message,
    };
  }

  if (error.status === 401 || error.status === 403) {
    return {
      message: 'Authentication failed. Please check your credentials.',
      code: ERROR_CODES.AUTH_FAILED,
      details: error.message,
    };
  }

  if (error.status >= 400 && error.status < 500) {
    return {
      message: 'Request failed. Please check your input.',
      code: ERROR_CODES.VALIDATION_ERROR,
      details: error.message,
    };
  }

  if (error.status >= 500) {
    return {
      message: 'Server error. Please try again later.',
      code: ERROR_CODES.API_CONNECTION_FAILED,
      details: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred.',
    code: ERROR_CODES.UNKNOWN_ERROR,
    details: error.message || 'No details available',
  };
};

// Log errors in development only
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔴 Error ${context ? `in ${context}` : ''}`);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Details:', error);
    console.groupEnd();
  }
};