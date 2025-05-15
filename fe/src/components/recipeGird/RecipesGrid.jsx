import React from 'react';
import RecipeCard from '../recipeCard/RecipeCard';
import './RecipesGrid.scss';

const recipes = [
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    title: 'Greek salad fresh vegetables',
    time: '30 Minutes',
    type: 'Salad',
    author: 'Chef Maria',
  },
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: 'Fresh Lime Roasted Salmon with Ginger Sauce',
    time: '30 Minutes',
    type: 'Fish',
    author: 'Chef John',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Avocado Toast with Egg',
    time: '30 Minutes',
    type: 'Breakfast',
    author: 'Chef Linda',
  },
  {
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    title: 'Fresh and Healthy Mixed Mayonnaise Salad',
    time: '30 Minutes',
    type: 'Salad',
    author: 'Chef Mark',
  },
  {
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
    title: 'Greek-Style Shrimp Salad with Feta and Olives',
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
    title: 'Stir-Fried Vegan Rice Noodles with Vegetables and Peanuts',
    time: '30 Minutes',
    type: 'Noodles',
    author: 'Chef Lisa',
  },
];

const RecipesGrid = () => (
  <section className="recipes-grid">
    <div className="recipes-grid__header">
      <h2>Simple, healthy, and nutritious recipes</h2>
    </div>
    <div className="recipes-grid__list">
      {recipes.map((r, idx) => <RecipeCard key={idx} {...r} />)}
    </div>
  </section>
);

export default RecipesGrid; 