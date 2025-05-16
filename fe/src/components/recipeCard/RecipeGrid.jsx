import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipeGrid.scss';

const RecipeGrid = ({ recipes }) => (
  <div className="recipe-grid">
    {recipes && recipes.length > 0 ? (
      recipes.map((r, idx) => <RecipeCard key={idx} {...r} />)
    ) : (
      <div className="recipe-grid__empty">No recipes found.</div>
    )}
  </div>
);

export default RecipeGrid; 