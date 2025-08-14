# AI Insights Styling Standard

## Overview
This document defines the standard styling pattern for AI Insights boxes across all pages in the Bluesky Analytics Dashboard.

## Standard Layout Pattern

### 1. Main Container
```jsx
<div style={{backgroundColor: '#13336b'}} className="rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
```

### 2. Header Section
```jsx
<div className="flex items-start gap-4">
  <div className="p-3 bg-white/10 rounded-xl">
    <Sparkles size={24} className="text-yellow-400" />
  </div>
  <div className="flex-1">
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'Inter', fontWeight: 700 }}>
        AI Insights & Recommendations
      </h2>
      <Badge variant="warning" size="sm">LIVE</Badge>
    </div>
```

### 3. AI Observation Section (NEW STANDARD)
```jsx
<div className="mb-6 p-4 rounded-xl" style={{backgroundColor: '#0c2146', border: '1px solid #4b5563'}}>
  {hasTyped || !currentObservation ? (
    <p className="text-sm" style={{ 
      fontFamily: 'Inter', 
      fontWeight: 400, 
      lineHeight: '1.5', 
      color: '#d5d7da' 
    }}>
      {currentObservation}
    </p>
  ) : (
    <TypingEffect 
      text={currentObservation}
      speed={30}
      onComplete={() => setHasTyped(true)}
    />
  )}
</div>
```

### 4. Individual Insight Boxes
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div style={{backgroundColor: '#0c2146'}} className="rounded-xl p-4 border border-gray-600">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className="text-success-400" />
      <span className="text-success-400 font-semibold text-sm" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Category</span>
    </div>
    <p className="text-sm" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '1.5', color: '#d5d7da' }}>
      Content here
    </p>
  </div>
</div>
```

## Required Components
- `TypingEffect` component for AI observations
- State management: `hasTyped`, `currentObservation` 
- `Sparkles` icon for main header
- `Badge` component for "LIVE" indicator

## Color Scheme
- **Main background**: `#13336b`
- **Observation box**: `#0c2146`
- **Individual boxes**: `#0c2146`
- **Text color**: `#d5d7da`
- **Success accent**: `text-success-400`
- **Warning badge**: `variant="warning"`

## Typography
- **Headers**: Inter font, fontWeight: 700
- **Labels**: Inter font, fontWeight: 600  
- **Content**: Inter font, fontWeight: 400, lineHeight: '1.5'

## Pages to Update
- [ ] Performance page
- [ ] Insights page
- [x] Overview page (COMPLETED)

## Implementation Notes
- Typing effect should only trigger once on first page load
- Content should be dynamic based on real data analysis
- Time range changes should update observation content
- Maintain consistent spacing and layout across all pages