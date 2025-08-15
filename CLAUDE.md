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
- Uses Tailwind CSS for consistent styling with Untitled UI design system
- No state management library - uses React hooks for state

## CRITICAL DEVELOPMENT RULES

### Image Display Rule (MANDATORY)
**ALWAYS display images whenever posts, profiles, or any content has images available.**

This rule applies to:
- All post displays (Overview, Performance, tables, cards)
- Profile displays (ProfileCard, author information)
- Comments and replies
- External link previews
- Quoted posts

#### Implementation Requirements:
- Use the `ImageGallery` component for consistent image display
- Include proper error handling with `handleImageError` from `utils/imageUtils.js`
- Show image counters when there are more images than displayed
- Provide fallback placeholders for failed image loads
- Support both thumbnail and full-size images
- Handle all Bluesky image embed structures (post.embed.images, record.embed.images, external thumbnails, quoted post images)

#### Components with Image Support:
- `ImageGallery.js` - Reusable image display component
- `ProfileCard.js` - Shows profile avatars and recent post images
- `OverviewV2.js` - Recent posts section with featured images
- `PerformanceV2.js` - Post table with thumbnail previews
- `blueskyService.js` - Comprehensive image extraction logic

#### Utilities:
- `utils/imageUtils.js` - Image extraction, validation, and error handling
- Extract images using `extractPostImages(post)`
- Handle errors using `handleImageError(event, type)`
- Get best image URL using `getBestImageUrl(image, preference)`

**This rule must be followed consistently across the entire application without exceptions.**

### Content Box Background Rule (MANDATORY)
**ALWAYS use #0c2146 as the background color for any content box that has a background color.**

This rule applies to:
- AI-generated content boxes (AI Insights & Recommendations, AI Performance Intelligence)
- Profile information boxes (user profile cards, bio sections)
- Analytics content containers (metrics boxes, insights panels)
- Feature highlight boxes (announcements, notifications)
- Any standalone content containers that need background color

#### Implementation Requirements:
- Use the Tailwind class `bg-primary-850` (maps to #0c2146)
- Apply to all content boxes that need background color
- Maintain consistent border and shadow styling: `border border-gray-700 shadow-xl`
- Use `text-white` for text content inside these boxes
- Inner sections can also use `bg-primary-850` for nested content areas

#### Updated Components:
- `OverviewV2.js` - AI Insights box and profile box
- `PerformanceV2.js` - AI Performance Intelligence box
- `Overview.js` - All content boxes (legacy)
- `Performance.js` - All content boxes (legacy)
- `Insights.js` - Content containers
- `tailwind.config.js` - Added primary-850 color (#0c2146)

**This color (#0c2146) is the standard for ALL content boxes sitewide and must be used consistently.**