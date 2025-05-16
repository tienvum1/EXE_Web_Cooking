import React from 'react';

const IngredientsList = ({ mainDish, sauce }) => {
  const renderItem = (item, index) => (
    <li key={index} className="ingredient-item">
      <span className="ingredient-text">{item}</span>
    </li>
  );

  return (
    <div className="ingredients-list">
      <h2 className="section-title">Ingredients</h2>
      <h3 className="subsection-title">For main dish</h3>
      <ul className="ingredient-items">{mainDish.map(renderItem)}</ul>
      <h3 className="subsection-title">For the sauce</h3>
      <ul className="ingredient-items">{sauce.map(renderItem)}</ul>
    </div>
  );
};

export default IngredientsList;