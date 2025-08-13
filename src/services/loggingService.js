// Centralized Logging Service
// Replaces console statements with proper logging

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class LoggingService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logs = [];
    this.maxLogs = 1000;
  }

  // Core logging method
  log(level, message, details = null, context = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      details,
      context,
      id: this.generateLogId()
    };

    // Store in memory (limited size)
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Output based on environment
    if (!this.isProduction) {
      this.outputToConsole(logEntry);
    }

    // In production, could send to logging service
    if (this.isProduction && level === LOG_LEVELS.ERROR) {
      this.sendToRemoteLogging(logEntry);
    }

    return logEntry.id;
  }

  // Convenience methods
  error(message, details = null, context = null) {
    return this.log(LOG_LEVELS.ERROR, message, details, context);
  }

  warn(message, details = null, context = null) {
    return this.log(LOG_LEVELS.WARN, message, details, context);
  }

  info(message, details = null, context = null) {
    return this.log(LOG_LEVELS.INFO, message, details, context);
  }

  debug(message, details = null, context = null) {
    return this.log(LOG_LEVELS.DEBUG, message, details, context);
  }

  // Development console output
  outputToConsole(logEntry) {
    const { level, message, details, context, timestamp } = logEntry;
    const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
    
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(prefix, message);
        if (details) console.error('Details:', details);
        if (context) console.error('Context:', context);
        break;
      case LOG_LEVELS.WARN:
        console.warn(prefix, message);
        if (details) console.warn('Details:', details);
        break;
      case LOG_LEVELS.INFO:
        console.info(prefix, message);
        if (details) console.info('Details:', details);
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(prefix, message);
        if (details) console.debug('Details:', details);
        break;
      default:
        console.log(prefix, message);
    }
  }

  // Production logging (placeholder for remote service)
  sendToRemoteLogging(logEntry) {
    // In a real app, this would send to services like:
    // - Sentry
    // - LogRocket  
    // - DataDog
    // - CloudWatch
    // - Custom logging API
    
    // For now, store in localStorage as fallback
    try {
      const existingLogs = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 50 error logs in localStorage
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('app_error_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      // Fallback failed, but don't throw - logging should never break app
    }
  }

  // Get recent logs
  getRecentLogs(level = null, limit = 100) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-limit);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Generate unique log ID
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get error logs from localStorage (production)
  getStoredErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_error_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored error logs
  clearStoredErrorLogs() {
    try {
      localStorage.removeItem('app_error_logs');
    } catch {
      // Silently fail
    }
  }
}

// Create singleton instance
const logger = new LoggingService();

// Export singleton and class
export { LoggingService, LOG_LEVELS };
export default logger;