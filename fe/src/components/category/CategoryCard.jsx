import React from 'react';
import './CategoryCard.scss';

const CategoryCard = ({ icon, name }) => (
  <div className="category-card">
    <span className="category-card__icon">{icon}</span>
    <span className="category-card__name">{name}</span>
  </div>
);

export default CategoryCard; 