/**
 * Custom hook for managing async operations with loading and error states
 * Reduces boilerplate code for common async patterns
 * @module useAsyncOperation
 */

import { useState, useCallback } from 'react';
import logger from '../services/loggingService';

/**
 * Hook for managing async operations with consistent loading/error handling
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} State and control functions
 */
export const useAsyncOperation = (operation, options = {}) => {
  const {
    initialLoading = false,
    logContext = 'Async operation',
    onSuccess = null,
    onError = null
  } = options;

  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info(`${logContext} started`);
      const result = await operation(...args);
      setData(result);
      
      logger.info(`${logContext} completed successfully`);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      logger.error(`${logContext} failed`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [operation, logContext, onSuccess, onError]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};

/**
 * Hook for managing multiple related async operations
 * @param {Object} operations - Object with operation names as keys and functions as values
 * @param {Object} options - Configuration options
 * @returns {Object} State and control functions for each operation
 */
export const useMultipleAsyncOperations = (operations, options = {}) => {
  const [states, setStates] = useState(() => 
    Object.keys(operations).reduce((acc, key) => ({
      ...acc,
      [key]: { loading: false, error: null, data: null }
    }), {})
  );

  const executeOperation = useCallback(async (operationName, ...args) => {
    if (!operations[operationName]) {
      throw new Error(`Operation '${operationName}' not found`);
    }

    setStates(prev => ({
      ...prev,
      [operationName]: { ...prev[operationName], loading: true, error: null }
    }));

    try {
      logger.info(`${operationName} operation started`);
      const result = await operations[operationName](...args);
      
      setStates(prev => ({
        ...prev,
        [operationName]: { loading: false, error: null, data: result }
      }));
      
      logger.info(`${operationName} operation completed successfully`);
      return result;
    } catch (err) {
      logger.error(`${operationName} operation failed`, err);
      
      setStates(prev => ({
        ...prev,
        [operationName]: { loading: false, error: err, data: null }
      }));
      
      throw err;
    }
  }, [operations]);

  const resetOperation = useCallback((operationName) => {
    setStates(prev => ({
      ...prev,
      [operationName]: { loading: false, error: null, data: null }
    }));
  }, []);

  const resetAll = useCallback(() => {
    setStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: { loading: false, error: null, data: null }
      }), {})
    );
  }, []);

  return {
    states,
    executeOperation,
    resetOperation,
    resetAll,
    // Helper getters
    isAnyLoading: Object.values(states).some(state => state.loading),
    hasAnyError: Object.values(states).some(state => state.error)
  };
};