# Utils Directory Rules

This directory contains utility functions and helper modules for the Bluesky Analytics Dashboard.

## Utility Guidelines

### File Organization
- Use camelCase naming with descriptive function purpose (e.g., `celebrationUtils.js`)
- Group related utility functions in the same file
- Keep utility functions pure and stateless when possible
- Export functions as named exports for better tree-shaking

### Current Utilities
- `celebrationUtils.js` - Helper functions for celebration animations and effects
- `customerDataLoader.js` - Customer profile data loading and processing utilities
- `errorHandler.js` - Global error handling and logging utilities

### Function Design Principles
- Utilities should be pure functions without side effects
- Use descriptive function names that clearly indicate their purpose
- Include proper input validation and error handling
- Return consistent data types and formats

### Common Utility Categories

#### Data Processing
- Data transformation and normalization functions
- Date/time formatting and manipulation utilities
- String processing and validation helpers
- Number formatting and calculation utilities

#### Validation & Sanitization
- Input validation functions
- Data sanitization utilities
- Type checking and conversion helpers
- Format validation (email, URLs, etc.)

#### UI Helpers
- Animation and transition utilities
- DOM manipulation helpers
- Event handling utilities
- Responsive design helpers

#### Performance Utilities
- Debounce and throttle functions
- Caching and memoization helpers
- Lazy loading utilities
- Performance monitoring tools

### Error Handling Standards
- Utilities should handle edge cases gracefully
- Include proper input validation
- Throw descriptive errors for invalid inputs
- Log errors appropriately without exposing sensitive data

### Security Considerations
- Sanitize user inputs in utility functions
- Avoid eval() and other dangerous operations
- Validate data types and formats
- Follow secure coding practices

### Testing Requirements
- All utility functions should be unit tested
- Test edge cases and error scenarios
- Maintain high test coverage (>90%)
- Use property-based testing for complex utilities
- Mock external dependencies appropriately

### Performance Guidelines
- Optimize frequently used utilities
- Use efficient algorithms and data structures
- Consider memory usage for large operations
- Implement caching for expensive computations
- Profile performance-critical utilities