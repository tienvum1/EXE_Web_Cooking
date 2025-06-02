import React from 'react';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import './RecommendedRecipes.scss';

const RecommendedRecipes = () => {
  const recipes = [
    {
      image: '/images/mixed-tropical-fruit-salad.jpg',
      title: 'Mixed Tropical Fruit Salad with Superfood Boosts',
      time: '30 Minutes',
      type: 'Healthy',
      author: 'Jane Doe',
    },
    {
      image: '/images/greek-shrimp-salad.jpg',
      title: 'Greek-Style Shrimp Salad with Feta and Olives',
      time: '30 Minutes',
      type: 'Western',
      author: 'John Smith',
    },
    {
      image: '/images/japanese-fried-rice.jpg',
      title: 'Healthy Japanese Fried Rice with Asparagus',
      time: '30 Minutes',
      type: 'Healthy',
      author: 'Emily Brown',
    },
    
  ];

  return (
    <div className="recommended-recipes">
      <h2 className="recommended-recipes__title">You may like these recipe too</h2>
      <div className="recommended-recipes__grid">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe._id}
            id={recipe._id}
            mainImage={recipe.mainImage}
            title={recipe.title}
            time={recipe.time}
            type={recipe.type}
            author={recipe.author}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedRecipes;