# ⚠️ MANDATORY IMAGE EXTRACTION RULES ⚠️

## CRITICAL REQUIREMENT
**ALL components, services, and functions MUST extract and display images/avatars when available.**

## NEVER FORGET
- Profile avatars
- Post images  
- Banner images
- External thumbnails
- Featured images
- Any visual content

## IMPLEMENTATION REQUIREMENTS

### 1. Service Level (blueskyService.js)
- ✅ `extractAvatar()` utility function implemented
- ✅ All API functions enhanced with image extraction
- ✅ Comprehensive fallback chains for missing images
- ✅ Generated avatar fallbacks using vercel.sh

### 2. Component Level
- ✅ All ProfileCard components display avatars
- ✅ Top Amplifiers show profile images
- ✅ Recent Posts display embedded images  
- ✅ ImageGallery component handles multiple images

### 3. Fallback Strategy
```javascript
const avatar = profileData.avatar || 
              follower.avatar || 
              profileData.profile?.avatar ||
              `https://avatar.vercel.sh/${handle}.svg?text=${initial}`;
```

### 4. Testing Checklist
Before any deployment, verify:
- [ ] Top Amplifiers show avatars
- [ ] ProfileCard components show avatars
- [ ] Recent Posts show embedded images
- [ ] All fallbacks generate proper placeholder images
- [ ] No broken image links exist

## VIOLATION CONSEQUENCES
**Any code that doesn't extract available images is considered broken and must be fixed immediately.**

## IMPLEMENTATION DATE
August 15, 2025 - This rule is now permanently enforced across the codebase.