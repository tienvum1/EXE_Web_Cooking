import React from 'react';
import RecipeGrid from '../../components/recipeCard/RecipeGrid';

const featuredRecipes = [
  {
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
    title: 'Greek-Style Shrimp Salad',
    time: '30 Minutes',
    type: 'Sea Food',
    author: 'Chef Anna',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Fruity Pancake with Orange & Blueberry',
    time: '30 Minutes',
    type: 'Sweet',
    author: 'Chef Tom',
  },
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: 'The Best Easy One Pot Chicken and Rice',
    time: '30 Minutes',
    type: 'Meat',
    author: 'Chef Steve',
  },
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    title: 'Stir-Fried Vegan Rice Noodles',
    time: '30 Minutes',
    type: 'Noodles',
    author: 'Chef Lisa',
  },
];

const FeaturedRecipes = () => (
  <section style={{margin: '2.5rem 0'}}>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
      <h2 style={{fontSize: '2rem', fontWeight: 700, color: '#2d3a2f', margin: 0, textAlign: 'center'}}>
        Featured Delicious Recipes
      </h2>
      <div style={{fontSize: '1.05rem', color: '#4a5a41', marginTop: '0.3rem', textAlign: 'center', maxWidth: 600}}>
        Enjoy our most popular and highly rated dishes, selected just for you.
      </div>
    </div>
    <RecipeGrid recipes={featuredRecipes} />
  </section>
);

export default FeaturedRecipes; 