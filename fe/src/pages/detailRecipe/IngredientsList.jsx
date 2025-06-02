import React from 'react';

const IngredientsList = ({ mainDish, sauce }) => {
  const renderItem = (item, index) => (
    <li key={index} className="ingredient-item">
      <span className="ingredient-text">{item}</span>
    </li>
  );

  return (
    <div className="ingredients-list">
      <h2 className="section-title">Nguyên liệu</h2>

      <ul className="ingredient-items">{mainDish.map(renderItem)}</ul>
    
    </div>
  );
};

export default IngredientsList;