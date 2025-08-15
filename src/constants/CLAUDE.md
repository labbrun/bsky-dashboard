# Constants Directory Rules

This directory contains application constants and static data for the Bluesky Analytics Dashboard.

## Constants Guidelines

### File Organization
- Use camelCase or kebab-case naming for constant files
- Group related constants in the same file (e.g., `index.js` for general constants)
- Export constants as named exports for better tree-shaking
- Use UPPER_SNAKE_CASE for individual constant names

### Current Constants File
- `index.js` - Main constants file containing navigation, metrics, messages, and other application constants

### Constant Categories

#### Navigation Constants
- Route paths and navigation menu items
- Navigation labels and display text
- Menu structure and hierarchy
- Icon mappings for navigation items

#### UI/UX Constants
- Color schemes and theme definitions
- Typography scales and font weights
- Spacing and layout constants
- Animation durations and easing functions

#### Data & Metrics Constants
- Chart configuration defaults
- Metric display formats and units
- Data visualization color palettes
- Default values for analytics displays

#### API Constants
- Endpoint paths and service URLs
- HTTP status codes and error messages
- Request timeout values
- API versioning information

#### Validation Constants
- Form validation rules and patterns
- Input length limits and constraints
- Regular expressions for validation
- Error message templates

### Naming Conventions
- Use descriptive, self-documenting constant names
- Group constants with common prefixes (e.g., `API_`, `UI_`, `VALIDATION_`)
- Avoid magic numbers and strings throughout the codebase
- Use TypeScript-style const assertions when appropriate

### Organization Patterns
```javascript
// Group by functionality
export const NAVIGATION = {
  ROUTES: { ... },
  LABELS: { ... }
};

export const METRICS = {
  DEFAULTS: { ... },
  UNITS: { ... }
};
```

### Immutability Standards
- Use Object.freeze() for complex objects to prevent mutation
- Use const assertions for arrays and objects
- Avoid mutable constant references
- Consider using libraries like Immutable.js for complex constants

### Documentation Requirements
- Include JSDoc comments for complex constants
- Document the purpose and usage of constant groups
- Provide examples when constants have specific formats
- Maintain consistency in documentation style

### Environment-Specific Constants
- Separate development, staging, and production constants
- Use environment variables for deployment-specific values
- Avoid hardcoding environment-specific URLs or keys
- Provide fallback values for optional constants

### Performance Considerations
- Keep constants lightweight and avoid heavy computations
- Use lazy loading for large constant objects when appropriate
- Consider code splitting for constants used in specific features
- Minimize bundle size impact of constants