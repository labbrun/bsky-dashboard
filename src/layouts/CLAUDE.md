# Layouts Directory Rules

This directory contains layout components that define the structure and navigation for the Bluesky Analytics Dashboard.

## Layout Guidelines

### File Organization
- Layout files should use PascalCase naming (e.g., `DashboardLayout.js`)
- Each layout should handle a specific application structure
- Layouts should be reusable across multiple pages
- Keep layout-specific styling and navigation logic contained

### Current Layouts
- `DashboardLayout.js` - Main dashboard layout with sidebar navigation and content area

### Layout Structure Standards
- Layouts should provide consistent navigation and header/footer structure
- Include proper responsive design patterns
- Handle authentication and route protection at layout level
- Maintain consistent styling with Untitled UI design system

### Navigation Patterns
- Implement sidebar navigation with active state indicators
- Include proper keyboard navigation and accessibility
- Handle mobile responsive navigation (collapsible sidebar)
- Use consistent navigation styling and transitions

### Content Area Management
- Provide flexible content areas for page components
- Handle scrolling and overflow appropriately
- Include proper spacing and padding patterns
- Support different content layouts (full-width, constrained, etc.)

### State Management
- Layouts should manage navigation state (sidebar open/closed)
- Handle user authentication state display
- Manage global UI state (loading indicators, notifications)
- Include proper state persistence across route changes

### Responsive Design
- Implement mobile-first responsive design
- Handle different screen sizes gracefully
- Include proper breakpoint management
- Test layouts across different devices and screen sizes

### Accessibility Standards
- Include proper ARIA labels and roles
- Implement keyboard navigation support
- Ensure proper focus management
- Meet WCAG 2.1 accessibility guidelines
- Include screen reader support

### Performance Considerations
- Layouts should render efficiently
- Minimize layout shifts and reflows
- Use proper React memoization for expensive operations
- Implement lazy loading for non-critical layout elements

### Integration with Routing
- Layouts should work seamlessly with React Router
- Handle nested routing appropriately
- Include proper route protection and authentication checks
- Support dynamic navigation based on user permissions