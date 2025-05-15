import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import './RecipePage.scss';

const recipes = [
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Greek Salad Fresh Vegetables',
    time: '30 Minutes',
    type: 'Salad',
    author: 'Chef Maria',
  },
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: 'Fresh Lime Roasted Salmon',
    time: '40 Minutes',
    type: 'Fish',
    author: 'Chef John',
  },
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    title: 'Stir-Fried Vegan Rice Noodles',
    time: '25 Minutes',
    type: 'Noodles',
    author: 'Chef Lisa',
  },
  {
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    title: 'Berry Yogurt Breakfast Bowl',
    time: '15 Minutes',
    type: 'Breakfast',
    author: 'Chef Anna',
  },
  {
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
    title: 'Plantain and Pinto Stew',
    time: '35 Minutes',
    type: 'Stew',
    author: 'Chef Henry',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'Classic Margherita Pizza',
    time: '50 Minutes',
    type: 'Pizza',
    author: 'Chef Marco',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Avocado Toast with Egg',
    time: '10 Minutes',
    type: 'Breakfast',
    author: 'Chef Linda',
  },
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: 'Fruity Pancake with Orange & Blueberry',
    time: '20 Minutes',
    type: 'Dessert',
    author: 'Chef Tom',
  },
  {
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    title: 'Traditional Bolognaise Ragu',
    time: '60 Minutes',
    type: 'Meat',
    author: 'Chef Paula',
  },
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    title: 'Pork and Chive Chinese Dumplings',
    time: '45 Minutes',
    type: 'Dumplings',
    author: 'Chef Ming',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Simple & Delicious Vegetarian Lasagna',
    time: '55 Minutes',
    type: 'Vegetarian',
    author: 'Chef Leslie',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'Chicken Meatballs with Cream Cheese',
    time: '35 Minutes',
    type: 'Chicken',
    author: 'Chef Andreas',
  },
];

const RecipePage = () => {
  const [search, setSearch] = useState('');
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <div className="recipe-page-container">
        <h1 className="recipe-page-title">Tất cả công thức</h1>
        <p className="recipe-page-desc">Khám phá hàng trăm công thức ngon, lành mạnh và dễ làm cho mọi bữa ăn!</p>
        <form className="recipe-page-search" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Tìm kiếm công thức..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        <div className="recipe-page-grid">
          {filteredRecipes.map((r, idx) => (
            <div className="recipe-card" key={idx}>
              <img className="recipe-card-img" src={r.image} alt={r.title} />
              <div className="recipe-card-info">
                <h3 className="recipe-card-title">{r.title}</h3>
                <div className="recipe-card-meta">
                  <span><i className="far fa-clock" /> {r.time}</span>
                  <span><i className="fas fa-utensils" /> {r.type}</span>
                </div>
                <div className="recipe-card-author">
                  <i className="fas fa-user" /> {r.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecipePage;