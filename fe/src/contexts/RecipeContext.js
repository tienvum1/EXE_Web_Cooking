import React from 'react';

const RecipeContext = React.createContext({
  isRecipeAuthor: false,
  recipeId: null,
  handleEditRecipe: () => {},
  handleDeleteRecipe: () => {},
});

export default RecipeContext; 