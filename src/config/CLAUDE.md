# Config Directory Rules

This directory contains application configuration files for the Bluesky Analytics Dashboard.

## Configuration Guidelines

### File Organization
- Configuration files should use kebab-case naming (e.g., `app.config.js`)
- Group related configuration settings in the same file
- Use environment-specific configurations when needed
- Keep sensitive configuration in environment variables

### Current Configuration Files
- `app.config.js` - Main application configuration and settings
- `customer-avatar.config.js` - Customer avatar and profile configuration
- `labbrun-customer-avatar.config.js` - Labbrun-specific customer avatar configuration

### Configuration Structure Standards
- Export configuration objects as default exports
- Use nested objects to organize related settings
- Include proper documentation for each configuration option
- Provide sensible defaults for all configuration values

### Environment Management
- Use environment variables for sensitive data (API keys, tokens, etc.)
- Include development, staging, and production configurations
- Never commit sensitive information to version control
- Use `.env` files for local development configuration

### Configuration Categories

#### Application Settings
- API endpoints and base URLs
- Feature flags and toggles  
- Application metadata (name, version, etc.)
- Default UI settings and themes

#### API Configuration
- Service endpoints and timeouts
- Authentication settings
- Rate limiting and retry policies
- API versioning information

#### UI/UX Configuration
- Theme and styling configurations
- Default component behaviors
- Animation and transition settings
- Responsive breakpoint definitions

#### Analytics & Monitoring
- Analytics service configurations
- Logging levels and outputs
- Performance monitoring settings
- Error tracking configurations

### Security Standards
- Never store secrets in configuration files
- Use environment variable references for sensitive data
- Implement proper configuration validation
- Follow principle of least privilege for API permissions

### Validation & Error Handling
- Include configuration validation on application startup
- Provide clear error messages for invalid configurations
- Implement fallback configurations for missing values
- Log configuration loading errors appropriately

### Testing Configurations
- Provide test-specific configuration overrides
- Mock external service configurations in tests
- Include configuration validation tests
- Test different configuration scenarios

### Documentation Requirements
- Include inline documentation for complex configurations
- Maintain configuration change logs
- Document environment variable requirements
- Provide configuration examples and templates