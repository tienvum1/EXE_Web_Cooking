import React from 'react';

const DirectionsList = ({ directions }) => (
  <div className="directions-list">
    <h2 className="section-title">Directions</h2>
    {directions.map((step, index) => (
      <div key={index} className="direction-step">
        <span className="step-title">{index + 1}. {step.text}</span>
        <p className="step-description">{step.description}</p>
        {step.images && step.images.length > 0 && (
          <div className="step-images">
            {step.images.map((img, i) => (
              <img key={i} src={img} alt={`step-${index + 1}-${i + 1}`} className="step-image" />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default DirectionsList;