// Generate default favicon from Bluesky logo
// This is a one-time utility to create favicon.ico from the Bluesky logo

export const generateDefaultFavicon = async () => {
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

// Function to download the generated favicon
export const downloadFavicon = async () => {
  try {
    const faviconDataUrl = await generateDefaultFavicon();
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'favicon.png';
    link.href = faviconDataUrl;
    link.click();
    
    console.log('Favicon downloaded successfully!');
  } catch (error) {
    console.error('Failed to generate favicon:', error);
  }
};