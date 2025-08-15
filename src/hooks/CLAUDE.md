# Hooks Directory Rules

This directory contains custom React hooks for the Bluesky Analytics Dashboard.

## Custom Hooks Guidelines

### File Organization
- Hook files should use camelCase naming with "use" prefix (e.g., `useBlueskyData.js`)
- Each hook should be in its own file for better reusability
- Group related hooks when they share common functionality
- Export hooks as named exports for better tree-shaking

### Hook Design Principles
- Hooks should follow the Rules of Hooks (only call at top level)
- Use descriptive names that clearly indicate their purpose
- Keep hooks focused on a single responsibility
- Return consistent data structures and naming conventions

### Common Hook Patterns
- **Data Fetching Hooks**: Handle API calls, loading states, and error handling
- **State Management Hooks**: Manage complex local state logic
- **Effect Hooks**: Handle side effects and lifecycle management
- **Utility Hooks**: Provide reusable logic across components

### Expected Hook Categories

#### Data Management
- `useBlueskyApi` - Bluesky API integration and data fetching
- `useProfileData` - User profile data management
- `useAnalytics` - Analytics data fetching and processing
- `useInsights` - AI insights data management

#### UI State Management  
- `useModal` - Modal state and control logic
- `useNotifications` - Notification system state
- `useCelebration` - Celebration overlay state management
- `useTheme` - Theme and styling state

#### Performance & Optimization
- `useDebounce` - Input debouncing for search/filters
- `useInfiniteScroll` - Infinite scrolling implementation
- `useVirtualization` - List virtualization for performance
- `useCache` - Client-side caching logic

### Error Handling Standards
- Hooks should include proper error boundaries
- Return error states in a consistent format
- Include retry mechanisms for failed operations
- Log errors appropriately for debugging

### Performance Considerations
- Use useCallback and useMemo appropriately
- Implement proper dependency arrays
- Avoid unnecessary re-renders
- Consider lazy initialization for expensive operations

### Testing Guidelines
- Custom hooks should be unit tested using React Testing Library
- Test different scenarios and edge cases
- Mock external dependencies appropriately
- Maintain high test coverage for critical hooks