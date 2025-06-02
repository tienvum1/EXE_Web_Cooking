import React from 'react';

const DirectionsList = ({ directions }) => {
  if (!directions || !Array.isArray(directions)) {
    return null; // Or display a message like "No directions available"
  }

  return (
    <div className="directions-list">
      <h2 className="section-title">Hướng dẫn</h2>
      {directions.map((step, stepIndex) => (
        <div key={stepIndex} className="direction-step">
          <span className="step-title">{stepIndex + 1}. {step.text}</span>
          {/* Assuming step.description is not used based on previous data sample */}
          {/* <p className="step-description">{step.description}</p> */}
          {/* Check if there are images for this step */}
          {step.images && step.images.length > 0 && (
            <div className="step-images">
              {step.images.map((image, imageIndex) => (
                <img
                  key={imageIndex}
                  src={image.url}
                  alt={`step-${stepIndex + 1}-${imageIndex + 1}`}
                  className="step-image"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DirectionsList;