/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 * @module errorUtils
 */

import logger from '../services/loggingService';

/**
 * Standard error types used across the application
 */
export const ErrorTypes = {
  API_ERROR: 'API_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR', 
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR'
};

/**
 * Creates a standardized error with logging
 * @param {string} type - Error type from ErrorTypes
 * @param {string} message - Human-readable error message
 * @param {Object} details - Additional error details
 * @param {Error} originalError - Original caught error (optional)
 * @returns {Error} Standardized error object
 */
export const createError = (type, message, details = null, originalError = null) => {
  const error = new Error(message);
  error.type = type;
  error.details = details;
  error.originalError = originalError;
  error.timestamp = new Date().toISOString();
  
  // Log the error
  logger.error(`${type}: ${message}`, {
    details,
    originalError: originalError?.message,
    stack: originalError?.stack
  });
  
  return error;
};

/**
 * Handles API response errors consistently
 * @param {Response} response - Fetch response object
 * @param {string} context - Context where error occurred
 * @throws {Error} Standardized API error
 */
export const handleApiError = async (response, context = 'API call') => {
  let errorMessage = `${context} failed`;
  let details = { status: response.status, statusText: response.statusText };
  
  try {
    const errorData = await response.text();
    if (errorData) {
      try {
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.message || parsed.error || errorMessage;
        details.body = parsed;
      } catch {
        details.body = errorData;
      }
    }
  } catch {
    // If we can't read the response body, continue with basic error
  }
  
  throw createError(ErrorTypes.API_ERROR, errorMessage, details);
};

/**
 * Validates that a service is properly configured
 * @param {string} serviceName - Name of the service
 * @param {Object} config - Configuration object to validate
 * @param {string[]} requiredFields - Required configuration fields
 * @throws {Error} Configuration error if invalid
 */
export const validateServiceConfig = (serviceName, config, requiredFields) => {
  if (!config) {
    throw createError(
      ErrorTypes.CONFIGURATION_ERROR,
      `${serviceName} not configured. Please configure it in Settings.`,
      { serviceName, requiredFields }
    );
  }
  
  const missing = requiredFields.filter(field => !config[field]);
  if (missing.length > 0) {
    throw createError(
      ErrorTypes.CONFIGURATION_ERROR,
      `${serviceName} missing required configuration: ${missing.join(', ')}`,
      { serviceName, missingFields: missing, requiredFields }
    );
  }
};

/**
 * Wraps async operations with consistent error handling
 * @param {Function} operation - Async function to execute
 * @param {string} context - Context for error logging
 * @param {Object} options - Options for error handling
 * @returns {Promise<*>} Result of operation or throws standardized error
 */
export const withErrorHandling = async (operation, context, options = {}) => {
  const { retryCount = 0, retryDelay = 1000 } = options;
  
  let lastError = null;
  
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // If this is already a standardized error, just re-throw
      if (error.type) {
        throw error;
      }
      
      // If we have retries left and it's a network error, retry
      if (attempt < retryCount && (
        error.name === 'NetworkError' || 
        error.message.includes('fetch') ||
        error.message.includes('network')
      )) {
        logger.warn(`${context} failed, retrying in ${retryDelay}ms`, {
          attempt: attempt + 1,
          maxAttempts: retryCount + 1,
          error: error.message
        });
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // Create standardized error for the final failure
      throw createError(
        ErrorTypes.API_ERROR,
        `${context} failed: ${error.message}`,
        { attempt: attempt + 1, maxAttempts: retryCount + 1 },
        error
      );
    }
  }
  
  throw lastError;
};

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {string} context - Context for error logging
 * @returns {Object} Parsed object or null if invalid
 */
export const safeJsonParse = (jsonString, context = 'JSON parsing') => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.warn(`${context} failed - invalid JSON`, { 
      jsonString: jsonString?.substring(0, 100) + '...' 
    });
    return null;
  }
};