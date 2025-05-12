import React from 'react';
import './RecipeCard.scss';

const RecipeCard = ({ image, title, time, type }) => (
  <div className="recipe-card">
    <img src={image} alt={title} />
    <div className="title">{title}</div>
    <div className="info">
      <span>⏱️ {time}</span>
      <span>{type}</span>
    </div>
  </div>
);

export default RecipeCard; 