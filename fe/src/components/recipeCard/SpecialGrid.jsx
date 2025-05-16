import React from 'react';
import RecipeCard from './RecipeCard';
import './SpecialGrid.scss';

const SpecialGrid = ({ recipes }) => (
  <div className="special-grid">
    {recipes && recipes.length > 0 ? (
      recipes.map((r, idx) => <RecipeCard key={r.id || idx} {...r} />)
    ) : (
      <div className="special-grid__empty">No special recipes found.</div>
    )}
  </div>
);

export default SpecialGrid; 