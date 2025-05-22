import React from 'react';
import './CategoryCard.scss';

const CategoryCard = ({ icon, name, onClick }) => (
  <div className="category-card" onClick={onClick}>
    <span className="category-card__icon">{icon}</span>
    <span className="category-card__name">{name}</span>
  </div>
);

export default CategoryCard; 