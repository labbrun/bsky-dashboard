import React from 'react';

const ImageGallery = ({ 
  images, 
  size = 'md', 
  maxImages = 2, 
  className = '',
  showCounter = true,
  rounded = 'lg'
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const sizeClass = sizes[size];
  const roundedClass = roundedClasses[rounded];

  return (
    <div className={`flex gap-2 mt-2 ${className}`}>
      {images.slice(0, maxImages).map((image, idx) => (
        <div key={idx} className="relative">
          <img 
            src={image.thumb || image.fullsize || image}
            alt={image.alt || `Image ${idx + 1}`}
            className={`${sizeClass} object-cover ${roundedClass} border border-gray-200`}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'flex';
              }
            }}
          />
          <div 
            className={`${sizeClass} bg-gray-200 ${roundedClass} border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-sans`}
            style={{ display: 'none' }}
          >
            🖼️
          </div>
        </div>
      ))}
      {showCounter && images.length > maxImages && (
        <div className={`${sizeClass} bg-gray-100 ${roundedClass} border border-gray-200 flex items-center justify-center`}>
          <span className="text-xs text-gray-600 font-semibold font-sans">
            +{images.length - maxImages}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;