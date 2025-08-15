# Services Directory Rules

This directory contains all API integration and business logic services for the Bluesky Analytics Dashboard.

## Service Guidelines

### File Organization
- Each service should handle a specific domain of functionality
- Use camelCase naming with descriptive service names (e.g., `blueskyService.js`)
- Services should be stateless and focused on data operations
- Include proper error handling and logging

### Current Services
- `aiInsightsService.js` - AI-powered analytics and insights generation
- `blueskyService.js` - Core Bluesky API integration and data fetching
- `loggingService.js` - Application logging and monitoring service
- `profileService.js` - User profile management and data operations
- `securityService.js` - Security analysis and monitoring service
- `supabaseService.js` - Supabase database integration and operations

### API Integration Standards
- Use consistent HTTP client patterns
- Implement proper authentication handling
- Include request/response logging for debugging
- Handle rate limiting and API quotas appropriately
- Use environment variables for API endpoints and keys

### Error Handling
- Services should throw descriptive errors
- Include proper error categorization (network, auth, validation, etc.)
- Implement retry logic for transient failures
- Log errors appropriately for debugging
- Return consistent error response formats

### Data Processing
- Services should handle data transformation and normalization
- Implement proper data validation
- Use consistent date/time formatting
- Handle pagination for large datasets
- Cache frequently accessed data when appropriate

### Security Standards
- Never log sensitive data (tokens, passwords, etc.)
- Implement proper input validation and sanitization
- Use secure HTTP headers and configurations
- Handle authentication tokens securely
- Follow OWASP security guidelines

### Performance Optimization
- Implement proper caching strategies
- Use connection pooling for database services
- Minimize API calls through batching
- Implement request deduplication
- Monitor and optimize slow operations

### Testing
- Services should be unit testable
- Mock external dependencies in tests
- Include integration tests for critical paths
- Test error scenarios and edge cases
- Maintain high test coverage for business logic