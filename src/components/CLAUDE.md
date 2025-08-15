# Components Directory Rules

This directory contains reusable React components for the Bluesky Analytics Dashboard.

## Component Guidelines

### File Organization
- All component files should use `.js` extension
- Component names should use PascalCase (e.g., `CelebrationOverlay.js`)
- Group related components in subdirectories when appropriate
- UI library components are organized in the `ui/` subdirectory

### Component Structure
- Each component should be a functional component using React hooks
- Use consistent prop destructuring patterns
- Follow the existing styling approach using inline styles with Untitled UI design system
- Include PropTypes or TypeScript definitions when beneficial

### Current Components
- `CelebrationOverlay.js` - Celebration animation overlay component
- `ProfileCard.js` - User profile display card component  
- `TypingEffect.js` - Text typing animation effect component
- `ui/UntitledUIComponents.js` - Untitled UI design system component library

### Styling Standards
- Use the Untitled UI design system variables from `styles/untitled-ui-variables.css`
- Maintain consistency with Inter font family using `font-sans` Tailwind class
- Follow established color palette and spacing patterns
- Use Tailwind CSS utility classes instead of inline styles
- **MANDATORY**: All content boxes with background colors must use `bg-primary-850` (#0c2146)
- Content boxes should include `border border-gray-700 shadow-xl text-white` for consistency

### Dependencies
- All components should work with React 19.1.1
- Use Lucide React for icons
- Leverage existing utility functions from `utils/` directory

### Testing
- Components should be testable with React Testing Library
- Include basic accessibility considerations
- Ensure components work across different screen sizes

### Performance
- Implement proper memoization for complex components
- Avoid unnecessary re-renders
- Use lazy loading for heavy components when appropriate