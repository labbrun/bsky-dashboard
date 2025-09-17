# Technical Requirements & Constraints
## Bluesky Analytics Dashboard

### System Architecture

#### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Service Layer   │───▶│   External APIs │
│                 │    │                  │    │                 │
│ • Components    │    │ • blueskyService │    │ • Bluesky API   │
│ • Pages         │    │ • aiService      │    │ • AI Services   │
│ • Layouts       │    │ • localService   │    │ • Supabase      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Local Storage   │    │   Configuration  │    │   Error Logging │
│                 │    │                  │    │                 │
│ • User Data     │    │ • app.config.js  │    │ • Error Boundary│
│ • Cache         │    │ • Credentials    │    │ • Console Logs  │
│ • Session       │    │ • Environment    │    │ • Service Logs  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### Technology Stack Constraints

**Frontend Framework**
- **React 19.1.1**: Must use latest stable React features
- **React Router 7.8.0**: Client-side routing with proper navigation
- **React Hooks**: Functional components only, no class components
- **ES6+ Syntax**: Modern JavaScript features required

**UI/UX Libraries**
- **Tailwind CSS 3.4.0**: Utility-first styling approach
- **Untitled UI Components**: Custom component library
- **Lucide React 0.539.0**: Icon system (no other icon libraries)
- **Recharts 3.1.2**: Data visualization (no Chart.js or D3.js)

**Build & Development**
- **Create React App 5.0.1**: Build toolchain (no custom Webpack config)
- **Node.js 18+**: Runtime requirement
- **NPM**: Package management (no Yarn or PNPM)

### Performance Requirements

#### Load Time Constraints
```javascript
// Performance Budgets
const PERFORMANCE_BUDGETS = {
  initialPageLoad: 3000,      // 3 seconds max
  apiResponseTime: 2000,      // 2 seconds max
  chartRenderTime: 1000,      // 1 second max
  navigationTime: 500,        // 0.5 seconds max
  searchFilterTime: 300       // 0.3 seconds max
};
```

#### Memory Constraints
- **Browser Memory**: < 100MB total memory usage
- **Local Storage**: < 10MB data storage
- **Component Memory**: Proper cleanup in useEffect hooks
- **Image Loading**: Lazy loading for post images

#### Bundle Size Constraints
- **Initial Bundle**: < 2MB gzipped
- **Code Splitting**: Route-based chunking required
- **Asset Optimization**: Image compression and optimization
- **Tree Shaking**: Eliminate unused code

### Security Requirements

#### Authentication Security
```javascript
// Password Requirements
const PASSWORD_POLICY = {
  minLength: 8,
  requireSpecialChar: false,  // Keep simple for MVP
  requireNumbers: false,      // Keep simple for MVP
  hashingAlgorithm: 'SHA-256',
  saltRounds: 'N/A'          // Using crypto.subtle.digest
};

// Session Management
const SESSION_CONFIG = {
  storageType: 'localStorage',
  keyName: 'bluesky-dashboard-auth',
  timeout: 'none',           // No auto-logout for MVP
  secureTransmission: true
};
```

#### API Security
- **Credential Storage**: Encrypted storage of API keys
- **Request Validation**: Input sanitization for all API calls
- **Error Handling**: No sensitive data in error messages
- **Rate Limiting**: Respect API rate limits

#### Data Protection
- **PII Handling**: Minimal collection, secure storage
- **Data Retention**: Clear data when user logs out
- **Cross-Site Scripting**: Input sanitization
- **Content Security Policy**: Implement CSP headers

### API Integration Constraints

#### Bluesky API Requirements
```javascript
// API Configuration
const BLUESKY_API_CONFIG = {
  baseURL: 'https://bsky.social/xrpc/',
  endpoints: {
    profile: 'app.bsky.actor.getProfile',
    feed: 'app.bsky.feed.getAuthorFeed',
    posts: 'app.bsky.feed.getPosts'
  },
  rateLimit: {
    requestsPerMinute: 100,
    burstLimit: 20
  },
  timeout: 10000,  // 10 seconds
  retryConfig: {
    maxRetries: 3,
    backoffMs: 1000
  }
};
```

#### Error Handling Requirements
- **Network Errors**: Graceful degradation
- **API Errors**: User-friendly error messages
- **Rate Limiting**: Automatic retry with backoff
- **Timeout Handling**: Clear timeout notifications

### Data Storage Constraints

#### Local Storage Structure
```javascript
// Storage Schema
const STORAGE_SCHEMA = {
  'bluesky-analytics-password': 'string',    // Hashed password
  'bluesky-dashboard-auth': 'boolean',       // Session state
  'bluesky-profile-cache': 'object',         // Profile data
  'bluesky-posts-cache': 'array',            // Posts data
  'bluesky-metrics-cache': 'object',         // Calculated metrics
  'bluesky-settings': 'object'               // User preferences
};

// Cache Expiration
const CACHE_TTL = {
  profile: 3600000,      // 1 hour
  posts: 1800000,        // 30 minutes
  metrics: 1800000,      // 30 minutes
  insights: 7200000      // 2 hours
};
```

#### Database Integration (Optional)
- **Supabase**: Optional backend for data persistence
- **Fallback Strategy**: Local storage when DB unavailable
- **Data Sync**: Eventual consistency model
- **Migration Strategy**: Graceful upgrades

### Component Architecture Constraints

#### Component Organization
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   └── UntitledUIComponents.js
│   ├── CelebrationOverlay.js
│   ├── ProfileCard.js
│   ├── ImageGallery.js
│   └── ErrorBoundary.js
├── pages/                  # Route-level components
├── layouts/                # Layout wrappers
├── services/               # API and business logic
├── hooks/                  # Custom React hooks
├── utils/                  # Pure utility functions
└── constants/              # Application constants
```

#### Component Design Principles
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Prefer composition over inheritance
- **Props Interface**: TypeScript-style prop documentation
- **Error Boundaries**: Wrap components that can fail
- **Loading States**: All async components show loading

#### State Management Constraints
- **No Redux**: Use React's built-in state management
- **Context Sparingly**: Only for truly global state
- **Local State**: Prefer useState and useReducer
- **Effect Dependencies**: Proper dependency arrays required

### Development Workflow Constraints

#### Code Quality Requirements
```javascript
// ESLint Configuration (required rules)
const REQUIRED_RULES = {
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'no-unused-vars': 'error',
  'no-console': 'warn',           // Allow console.warn, error
  'prefer-const': 'error',
  'no-var': 'error'
};
```

#### Testing Requirements
- **Unit Tests**: React Testing Library for components
- **Integration Tests**: Service layer testing
- **E2E Tests**: Critical user flows
- **Coverage**: Minimum 70% code coverage

#### Documentation Requirements
- **Component Documentation**: JSDoc comments for all components
- **Service Documentation**: API interface documentation
- **README Updates**: Keep installation and usage current
- **CLAUDE.md**: Development guidance updates

### Deployment Constraints

#### Build Requirements
```bash
# Required Build Commands
npm run build          # Production build
npm test               # Test suite
npm run lint           # Code quality check
```

#### Environment Configuration
```javascript
// Environment Variables
const ENV_VARS = {
  REACT_APP_BLUESKY_HANDLE: 'string',      // Default handle
  REACT_APP_SUPABASE_URL: 'string',        // Optional DB URL
  REACT_APP_SUPABASE_KEY: 'string',        // Optional DB key
  REACT_APP_AI_SERVICE_URL: 'string'       // Optional AI endpoint
};
```

#### Docker Support
- **Multi-stage Build**: Optimize image size
- **Health Checks**: Container health monitoring
- **Environment Variables**: Configurable deployment
- **Port Mapping**: Standard port 3000

### Browser Compatibility

#### Supported Browsers
- **Chrome**: 90+ (primary target)
- **Firefox**: 88+ (secondary)
- **Safari**: 14+ (secondary)
- **Edge**: 90+ (secondary)

#### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **Enhanced Features**: JavaScript enhancements
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

### Monitoring & Observability

#### Error Tracking
```javascript
// Error Monitoring Requirements
const ERROR_TRACKING = {
  clientErrors: 'console.error + ErrorBoundary',
  apiErrors: 'Service-level logging',
  performanceErrors: 'Performance monitoring',
  userErrors: 'User action tracking'
};
```

#### Performance Monitoring
- **Core Web Vitals**: Track LCP, FID, CLS
- **API Performance**: Response time monitoring
- **User Experience**: Navigation timing
- **Error Rates**: Track error percentages

### Constraints Summary

#### Hard Constraints (Cannot Change)
- React 19.1.1 as primary framework
- Create React App build system
- Bluesky API as primary data source
- Browser localStorage for persistence

#### Soft Constraints (Can Adapt)
- Supabase for optional persistence
- AI service integration approach
- Specific UI component implementations
- Performance optimization strategies

#### Future Considerations
- Framework migration path (Next.js, Vite)
- Database alternatives (Firebase, MongoDB)
- Real-time features (WebSockets)
- Mobile app development (React Native)