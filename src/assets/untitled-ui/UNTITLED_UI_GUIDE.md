# Untitled UI Design System Guide

## Available Assets

### 1. Typography - Inter Font Family
- **Location**: `src/assets/untitled-ui/Additional assets/Inter-4.0/`
- **Web Fonts**: `src/assets/untitled-ui/Additional assets/Inter-4.0/web/`
- **Weights Available**: 100-900 (Thin to Black)
- **Styles**: Normal and Italic
- **Variable Font**: InterVariable.woff2 (recommended for modern browsers)

### 2. Icons - Untitled UI Icons PRO (v1.6)
- **Location**: `src/assets/untitled-ui/Additional assets/Untitled UI Icons – PRO (v1.6) (Line icons only)/`
- **Categories**:
  - Alerts & feedback (26 icons)
  - Arrows (100+ navigation icons)
  - Charts (40+ data visualization icons)
  - Communication (50+ messaging icons)
  - Development (coding and browser icons)
  - And many more categories...

### 3. Avatars
- **Portrait Avatars**: `src/assets/untitled-ui/Additional assets/Avatars portrait/`
  - Formats: JPEG, WebP
  - 28 unique portrait images
  
- **Square Avatars**: `src/assets/untitled-ui/Additional assets/Avatars square/`
  - Formats: JPEG, WebP, PNG (with transparent background)
  - 140+ unique avatar images

### 4. Mesh Gradients
- **Location**: `src/assets/untitled-ui/Additional assets/Mesh gradients/`
- **Count**: 28 unique gradient designs
- **Formats**: JPG and PNG
- **Usage**: Backgrounds, cards, headers, hero sections

### 5. Company Logos
- **Location**: `src/assets/untitled-ui/Additional assets/Company logos/`
- **Styles**: Default, Badge, Avatar formats

## Implementation Guide

### Using Inter Font
```css
/* Import in your main CSS file */
@import url('../assets/untitled-ui/Additional assets/Inter-4.0/web/inter.css');

/* Apply to your app */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* For variable font support */
@supports (font-variation-settings: normal) {
  body {
    font-family: 'InterVariable', sans-serif;
    font-optical-sizing: auto;
  }
}
```

### Using Icons
```jsx
// Import SVG icons as React components
import AlertCircle from './assets/untitled-ui/Additional assets/Untitled UI Icons – PRO (v1.6) (Line icons only)/Untitled UI Icons – PRO (v1.6) (Line icons)/Alerts & feedback/alert-circle.svg';

// Or use as img src
<img src="/assets/untitled-ui/.../bell-01.svg" alt="Notification" />
```

### Using Avatars
```jsx
// Square avatar with transparent background
import Avatar from './assets/untitled-ui/Additional assets/Avatars square/PNG (transparent background)/Olivia Rhye.png';

// Portrait avatar
import ProfilePic from './assets/untitled-ui/Additional assets/Avatars portrait/JPEG/Annie Stanley.jpg';
```

### Using Mesh Gradients
```css
/* As background image */
.hero-section {
  background-image: url('../assets/untitled-ui/Additional assets/Mesh gradients/01.jpg');
  background-size: cover;
  background-position: center;
}
```

## Design Tokens (Already in Tailwind Config)

### Color Palette
- **Primary**: `#002945` (primary-500)
- **Brand**: `#2B54BE` (brand-500)
- **Accent**: `#3A5393` (accent-500)
- **Electric**: `#0E4CE8` (electric-500)
- **Gray Scale**: 25, 50, 100-950
- **Semantic Colors**: error, warning, success

### Typography Scale
- **Display**: 2xl (72px) to xs (24px)
- **Body**: xs (12px) to xl (20px)
- **Line Heights**: Optimized for readability

### Spacing & Radius
- **Border Radius**: xs (2px) to 3xl (24px)
- **Shadows**: xs to 3xl (layered shadows)

## Best Practices

1. **Consistency**: Always use Untitled UI components and tokens
2. **Typography**: Use Inter font family for all text
3. **Icons**: Use line icons from the PRO pack for consistency
4. **Colors**: Stick to the defined color palette
5. **Spacing**: Use Tailwind's spacing utilities based on the config
6. **Shadows**: Use the predefined shadow scales

## Quick Reference

### Common Icon Categories
- Navigation: arrow-*, chevron-*
- Actions: edit-*, trash-*, plus-*, minus-*
- Communication: message-*, mail-*, phone-*
- Media: play-*, pause-*, video-*, image-*
- Files: file-*, folder-*, download-*, upload-*

### Avatar Naming Convention
All avatars use real names for diversity and authenticity:
- Format: `[First Name] [Last Name].[extension]`
- Example: `Olivia Rhye.png`, `Alex Holland.jpg`

### Gradient Usage
- Gradients 01-10: Subtle, professional backgrounds
- Gradients 11-20: Vibrant, attention-grabbing
- Gradients 21-28: Bold, statement pieces