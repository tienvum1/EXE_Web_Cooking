import React from 'react';
import specialRecipes from '../data/specialRecipesData';
import RecipeCard from './recipeCard/RecipeCard';
import './SpecialRecipes.scss';

const SpecialRecipes = () => (
  <section className="special-recipes">
    <div className="special-recipes__header">
      <h2>Special recipes</h2>
      <a href="#" className="special-recipes__viewall">View All <span>→</span></a>
    </div>
    <div className="special-recipes__list">
      {specialRecipes.map(recipe => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  </section>
);

export default SpecialRecipes;