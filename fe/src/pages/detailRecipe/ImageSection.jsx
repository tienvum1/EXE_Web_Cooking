import React from 'react';
import './ImageSection.scss';

const ImageSection = ({ src, alt }) => {
  return (
    <div className="image-section">
      <div className="image-placeholder">
      <video controls>
      <source src={src} type="video/mp4" />
      </video>
      </div>
     
    </div>
  );
};

export default ImageSection;