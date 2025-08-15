# Pages Directory Rules

This directory contains all page-level components for the Bluesky Analytics Dashboard.

## Page Guidelines

### File Organization
- Each page should be a separate `.js` file using PascalCase naming
- Page components represent full application views/routes
- Version files (e.g., `OverviewV2.js`) indicate iterative improvements

### Current Pages
- `Overview.js` - Main dashboard overview page with metrics, charts, and recent activity
- `OverviewV2.js` - Enhanced version of the overview page
- `Performance.js` - Performance analytics and metrics page
- `PerformanceV2.js` - Enhanced version of the performance page  
- `Insights.js` - AI-driven insights and analytics page

### Page Structure Standards
- Use functional components with React hooks
- Include loading states for data fetching
- Implement error boundaries and error handling
- Follow consistent layout patterns using `DashboardLayout`

### Data Integration
- Pages should use services from `services/` directory for API calls
- Implement proper loading and error states
- Use consistent data fetching patterns
- Handle authentication and authorization appropriately

### UI/UX Standards
- Maintain consistency with Untitled UI design system
- Use responsive design patterns
- Follow established color schemes and typography
- Implement proper spacing and layout grids

### Performance Optimization
- Use React.memo for expensive page renders
- Implement proper data caching strategies
- Avoid unnecessary API calls on re-renders
- Use proper dependency arrays in useEffect hooks

### Analytics Integration
- Pages should integrate with Recharts for data visualization
- Use consistent chart styling and color schemes
- Implement interactive chart features where appropriate
- Handle edge cases for missing or incomplete data

### Navigation
- Pages should work with the established routing system
- Maintain proper URL structure and navigation patterns
- Include proper meta tags and page titles
- Handle back/forward browser navigation correctly