import React from 'react';
import RecipeGrid from '../../components/recipeCard/RecipeGrid';

const latestRecipes = [
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    title: 'Avocado Toast with Egg',
    time: '20 Minutes',
    type: 'Breakfast',
    author: 'Chef Linda',
  },
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: 'Fresh Lime Roasted Salmon',
    time: '25 Minutes',
    type: 'Fish',
    author: 'Chef John',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Vegan Buddha Bowl',
    time: '30 Minutes',
    type: 'Vegan',
    author: 'Chef Anna',
  },
  {
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    title: 'Healthy Mixed Salad',
    time: '15 Minutes',
    type: 'Salad',
    author: 'Chef Mark',
  },
];

const LatestRecipes = () => (
  <section style={{margin: '2.5rem 0'}}>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
      <h2 style={{fontSize: '2rem', fontWeight: 700, color: '#2d3a2f', margin: 0, textAlign: 'center'}}>
        Latest Healthy Recipes
      </h2>
      <div style={{fontSize: '1.05rem', color: '#4a5a41', marginTop: '0.3rem', textAlign: 'center', maxWidth: 600}}>
        Discover the latest, healthy and delicious dishes updated daily.
      </div>
    </div>
    <RecipeGrid recipes={latestRecipes} />
  </section>
);

export default LatestRecipes; 