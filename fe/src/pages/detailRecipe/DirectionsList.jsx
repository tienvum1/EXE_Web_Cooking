import React from 'react';

const DirectionsList = ({ directions }) => (
  <div className="directions-list">
    <h2 className="section-title">Directions</h2>
    {directions.map((step, index) => (
      <div key={index} className="direction-step">
        <label className="direction-label">
          <input type="radio" className="direction-radio" disabled />
          <span className="step-title">{index + 1}. {step.title}</span>
        </label>
        <p className="step-description">{step.description}</p>
      </div>
    ))}
  </div>
);

export default DirectionsList;