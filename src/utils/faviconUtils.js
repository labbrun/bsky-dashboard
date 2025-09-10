// Favicon Management Utilities
// Dynamically updates favicon based on custom avatar

export const generateFaviconFromAvatar = (avatarDataUrl) => {
  if (!avatarDataUrl) return null;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Set canvas size for favicon (32x32 is standard)
    canvas.width = 32;
    canvas.height = 32;

    img.onload = () => {
      // Draw rounded avatar
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, 2 * Math.PI);
      ctx.clip();
      
      // Draw the avatar image
      ctx.drawImage(img, 0, 0, 32, 32);
      
      // Convert to data URL
      const faviconDataUrl = canvas.toDataURL('image/png');
      resolve(faviconDataUrl);
    };

    img.src = avatarDataUrl;
  });
};

export const generateDefaultFavicon = () => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Set canvas size for favicon (32x32 is standard)
    canvas.width = 32;
    canvas.height = 32;

    img.onload = () => {
      // Clear with transparent background
      ctx.clearRect(0, 0, 32, 32);
      
      // Draw the Bluesky logo centered
      ctx.drawImage(img, 2, 2, 28, 28);
      
      // Convert to data URL
      const faviconDataUrl = canvas.toDataURL('image/png');
      resolve(faviconDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load Bluesky logo'));
    
    // Load the Bluesky logo
    try {
      img.src = require('../assets/bluesky-logo.png');
    } catch (error) {
      reject(error);
    }
  });
};

export const updateFavicon = async (avatarDataUrl) => {
  try {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingFavicons.forEach(link => link.remove());

    let faviconUrl;

    if (avatarDataUrl) {
      // Generate favicon from custom avatar
      faviconUrl = await generateFaviconFromAvatar(avatarDataUrl);
    } else {
      // Generate default favicon from Bluesky logo
      faviconUrl = await generateDefaultFavicon();
    }

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = faviconUrl;
    
    // Add to document head
    document.head.appendChild(link);

    // Also update apple-touch-icon
    updateAppleTouchIcon(avatarDataUrl);

  } catch (error) {
    console.error('Failed to update favicon:', error);
    // Fallback to original favicon if generation fails
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
  }
};

const updateAppleTouchIcon = async (avatarDataUrl) => {
  try {
    // Remove existing apple-touch-icon
    const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (existingAppleIcon) {
      existingAppleIcon.remove();
    }

    // Generate larger icon for Apple devices (180x180)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 180;
    canvas.height = 180;

    img.onload = () => {
      if (avatarDataUrl) {
        // Draw rounded custom avatar
        ctx.beginPath();
        ctx.arc(90, 90, 90, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 180, 180);
      } else {
        // Draw Bluesky logo centered
        ctx.clearRect(0, 0, 180, 180);
        ctx.drawImage(img, 15, 15, 150, 150);
      }
      
      // Convert to data URL
      const appleIconDataUrl = canvas.toDataURL('image/png');
      
      // Create new apple-touch-icon link
      const link = document.createElement('link');
      link.rel = 'apple-touch-icon';
      link.href = appleIconDataUrl;
      
      document.head.appendChild(link);
    };

    // Load appropriate image source
    img.src = avatarDataUrl || require('../assets/bluesky-logo.png');

  } catch (error) {
    console.error('Failed to update apple-touch-icon:', error);
  }
};

// Initialize favicon on app start
export const initializeFavicon = async () => {
  const { getCustomAvatar } = await import('../services/credentialsService');
  const customAvatar = getCustomAvatar();
  await updateFavicon(customAvatar);
};