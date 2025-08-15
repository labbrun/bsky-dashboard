// Image utility functions for consistent image handling across the application

/**
 * Extracts image URLs from various Bluesky post structures
 * @param {Object} post - The post object from Bluesky API
 * @returns {Array} Array of image objects with thumb, fullsize, and alt properties
 */
export const extractPostImages = (post) => {
  let images = [];

  // PRIMARY: Check for images in post.embed.images (processed/viewed posts)
  if (post.embed?.images) {
    images = post.embed.images.map(img => ({
      thumb: img.thumb,
      fullsize: img.fullsize,
      alt: img.alt || ''
    }));
  }
  // SECONDARY: Check for images in post.record.embed.images (raw posts)
  else if (post.record?.embed?.images) {
    images = post.record.embed.images.map(img => ({
      thumb: img.thumb,
      fullsize: img.fullsize,
      alt: img.alt || ''
    }));
  }
  // EXTERNAL: Check for external link thumbnails
  else if (post.embed?.external?.thumb) {
    images = [{
      thumb: post.embed.external.thumb,
      fullsize: post.embed.external.thumb,
      alt: post.embed.external.title || 'External link thumbnail'
    }];
  }
  // EXTERNAL RECORD: Check for external image embeds in record
  else if (post.record?.embed?.external?.thumb) {
    images = [{
      thumb: post.record.embed.external.thumb,
      fullsize: post.record.embed.external.thumb,
      alt: post.record.embed.external.title || 'External link thumbnail'
    }];
  }
  // QUOTED POSTS: Check for quoted post images
  else if (post.record?.embed?.record?.embeds?.[0]?.images) {
    images = post.record.embed.record.embeds[0].images.map(img => ({
      thumb: img.thumb,
      fullsize: img.fullsize,
      alt: img.alt || 'Quoted post image'
    }));
  }

  return images;
};

/**
 * Gets the best available image URL from an image object
 * @param {Object} image - Image object with thumb/fullsize properties
 * @param {string} preference - 'thumb' or 'fullsize'
 * @returns {string} Best available image URL
 */
export const getBestImageUrl = (image, preference = 'thumb') => {
  if (!image) return null;
  
  if (preference === 'fullsize') {
    return image.fullsize || image.thumb || image;
  } else {
    return image.thumb || image.fullsize || image;
  }
};

/**
 * Validates if an image URL is accessible
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} Promise resolving to true if image is accessible
 */
export const validateImageUrl = async (imageUrl) => {
  if (!imageUrl) return false;
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Creates a fallback image placeholder
 * @param {string} type - Type of content ('profile', 'post', 'external')
 * @returns {string} Emoji or text representation for the content type
 */
export const getImagePlaceholder = (type = 'post') => {
  const placeholders = {
    profile: '👤',
    post: '📝',
    external: '🔗',
    image: '🖼️',
    video: '🎥',
    link: '🌐'
  };
  
  return placeholders[type] || placeholders.post;
};

/**
 * Handles image loading errors by showing fallback
 * @param {Event} event - The error event from img onError
 * @param {string} fallbackType - Type of fallback to show
 */
export const handleImageError = (event, fallbackType = 'image') => {
  const img = event.target;
  const fallbackElement = img.nextElementSibling;
  
  if (fallbackElement) {
    img.style.display = 'none';
    fallbackElement.style.display = 'flex';
    
    // Update fallback content if it's empty
    if (!fallbackElement.textContent.trim()) {
      fallbackElement.textContent = getImagePlaceholder(fallbackType);
    }
  }
};

/**
 * Preloads images for better performance
 * @param {Array} imageUrls - Array of image URLs to preload
 * @returns {Promise<Array>} Promise resolving when all images are loaded
 */
export const preloadImages = (imageUrls) => {
  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = getBestImageUrl(typeof url === 'string' ? { thumb: url } : url);
    });
  });
  
  return Promise.allSettled(promises);
};