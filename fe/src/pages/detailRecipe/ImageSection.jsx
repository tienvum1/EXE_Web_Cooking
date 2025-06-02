import React from 'react';
import './ImageSection.scss';

const ImageSection = ({ mainImage, alt }) => {
  if (!mainImage) {
    // Optionally return a placeholder or null if image is not available
    return (
      <div className="image-section">
        <div className="image-placeholder">
          {/* You can add a placeholder image or text here */}
          No Image Available
        </div>
      </div>
    );
  }

  return (
    <div className="image-section">
      <img src={mainImage} alt={alt} className="recipe-main-image" /> {/* Use mainImage (URL) directly */}
    </div>
  );
};

export default ImageSection;