# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm start` - Runs the app in development mode at http://localhost:3000
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - One-way operation to eject from Create React App (not recommended)

### Installation
- `npm install` - Install all dependencies

## Architecture Overview

This is a React-based Bluesky analytics dashboard built with Create React App. The application provides a secure interface for viewing Bluesky social media analytics and metrics.

### Key Technologies
- **React 19.1.1** - Main UI framework
- **Recharts 3.1.2** - Data visualization library for charts and graphs
- **Lucide React 0.539.0** - Icon library
- **React Testing Library** - For component testing

### Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Untitled UI component library
│   ├── CelebrationOverlay.js
│   └── ProfileCard.js
├── config/              # Application configuration
│   └── app.config.js    # Centralized app settings
├── constants/           # Application constants
│   └── index.js         # Navigation, metrics, messages
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
│   └── DashboardLayout.js
├── pages/               # Page components
│   ├── Overview.js
│   ├── Performance.js
│   └── Insights.js
├── services/            # API and data services
│   ├── blueskyService.js
│   ├── profileService.js
│   └── supabaseService.js
├── styles/              # Global styles
│   └── untitled-ui-variables.css
├── utils/               # Utility functions
│   ├── celebrationUtils.js
│   └── errorHandler.js
├── assets/              # Static assets
│   └── untitled-ui/     # Untitled UI design system assets
└── App.js               # Main application component
```

#### Key Components
- **App.js** - Main application with authentication and routing
- **DashboardLayout** - Sidebar navigation and main layout
- **UntitledUIComponents** - Reusable UI component library
- **Pages** - Overview, Performance, and Insights analytics views

#### Styling System
- **Untitled UI Design System** - Professional component library
- **Inter Font Family** - Primary typography
- **CSS Variables** - Consistent spacing, colors, and shadows
- **Tailwind CSS** - Utility-first styling framework

#### Application Flow
1. **Login Screen** - Password-protected access to dashboard
2. **Loading State** - Shows while fetching data from API
3. **Error Handling** - Displays connection errors with retry functionality
4. **Main Dashboard** - Multi-tab interface displaying:
   - Overview tab with metrics cards, charts, recent posts, and followers
   - Placeholder tabs for future analytics features

#### API Integration
- Fetches data from external API endpoint
- Handles loading states, error states, and data formatting
- Includes debug information for API troubleshooting

#### Key Features
- Password authentication system
- Responsive dashboard with dark theme
- Real-time data fetching with error handling
- Interactive charts and visualizations
- Post engagement tracking (likes, replies, reposts)
- Follower analytics display
- External link generation for Bluesky posts

### Development Notes
- Built on Create React App boilerplate
- Uses inline styling for components rather than CSS modules
- No state management library - uses React hooks for state