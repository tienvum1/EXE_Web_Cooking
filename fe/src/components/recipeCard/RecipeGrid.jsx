import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipeGrid.scss';

const RecipeGrid = ({ recipes, savedIds = [], onToggleSave }) => (
  <div className="recipe-grid">
    {recipes && recipes.length > 0 ? (
      recipes.map((r, idx) => (
        <RecipeCard
          key={r.id || idx}
          {...r}
          isSaved={savedIds.includes(r.id)}
          onToggleSave={onToggleSave}
        />
      ))
    ) : (
      <div className="recipe-grid__empty">No recipes found.</div>
    )}
  </div>
);

export default RecipeGrid; 