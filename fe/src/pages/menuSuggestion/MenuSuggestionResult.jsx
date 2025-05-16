import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MenuSuggestion.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import styles from './MenuSuggestionResult.module.scss';



const DEMO_MENU = [
  {
    meal: 'Breakfast',
    nutrition: { fat: 11, protein: 62.5, carbs: 37.5, calories: 500 },
    recipes: [
      {
        name: 'Avocado Toast with Egg',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        kcal: 178,
        protein: 7,
        carbs: 15,
        fat: 10,
        time: '5 Minutes',
        type: 'Egg',
      },
      {
        name: 'Cauliflower Walnut Vegetarian Taco Meat',
        image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
        kcal: 80,
        protein: 10,
        carbs: 5,
        fat: 5,
        time: '15 Minutes',
        type: 'Breakfast',
      },
      {
        name: 'Chicken Ramen Soup with Mushroom',
        image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        kcal: 248,
        protein: 18.8,
        carbs: 31,
        fat: 5.5,
        time: '15 Minutes',
        type: 'Noodles',
      },
    ],
  },
  {
    meal: 'Lunch',
    nutrition: { fat: 17.6, protein: 110, carbs: 50, calories: 800 },
    recipes: [
      {
        name: 'The Best Easy One Pot Chicken and Rice',
        image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
        kcal: 88,
        protein: 4.5,
        carbs: 10,
        fat: 3,
        time: '30 Minutes',
        type: 'Rice',
      },
      {
        name: 'Greek salad fresh vegetables',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        kcal: 86,
        protein: 4.5,
        carbs: 10,
        fat: 3,
        time: '30 Minutes',
        type: 'Salad',
      },
      {
        name: 'Avocado Toast with Egg',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        kcal: 86,
        protein: 4.5,
        carbs: 10,
        fat: 3,
        time: '30 Minutes',
        type: 'Noodles',
      },
    ],
  },
  {
    meal: 'Dinner',
    nutrition: { fat: 15.4, protein: 87.5, carbs: 52.5, calories: 700 },
    recipes: [
      {
        name: 'Grilled Beef Salad with Quinoa and Vegetables',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        kcal: 86,
        protein: 4.5,
        carbs: 10,
        fat: 3,
        time: '30 Minutes',
        type: 'Meat',
      },
      {
        name: 'Firecracker Vegan Lettuce Wraps - Spicy!',
        image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
        kcal: 86,
        protein: 4.5,
        carbs: 10,
        fat: 3,
        time: '30 Minutes',
        type: 'Noodles',
      },
      {
        name: 'Fruity Pancake with Orange & Blueberry',
        image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        kcal: 86,
        protein: 4.5,
        carbs: 10,
        fat: 3,
        time: '30 Minutes',
        type: 'Cake',
      },
    ],
  },
];

const MenuSuggestionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Nếu có dữ liệu truyền qua state thì dùng, không thì dùng DEMO_MENU
  const menu = location.state?.menu || DEMO_MENU;

  return (
    <>
      <Header />
      <Sidebar />
      <div className={styles.resultContainer}>
        <h1 className={styles.title}>Menu suggestions</h1>
        <div className={styles.list}>
          {menu.map((meal, idx) => (
            <div className={styles.mealRow} key={meal.meal}>
              <div className={styles.mealMain}>
                <h2 className={styles.mealTitle}>{meal.meal}</h2>
                <div className={styles.mealRecipes}>
                  {meal.recipes.map((r, i) => (
                    <div className={styles.recipeCard} key={i}>
                      <div className={styles.recipeImgbox}>
                        <img src={r.image} alt={r.name} />
                        <button className={styles.recipeFav}><i className="fas fa-heart"></i></button>
                      </div>
                      <div className={styles.recipeInfo}>
                        <div className={styles.recipeName}>{r.name}</div>
                        <div className={styles.recipeNutri}>{r.kcal} kcal<br/>Protein: {r.protein}g, Carbs: {r.carbs}g, Fat: {r.fat}g</div>
                        <div className={styles.recipeMeta}>
                          <span><i className="far fa-clock"></i> {r.time}</span>
                          <span><i className="fas fa-utensils"></i> {r.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.mealNutrition}>
                <div className={styles.nutritionTitle}>Nutrition Information</div>
                <div className={styles.nutritionRow}><span>Total Fat</span><span>{meal.nutrition.fat} g</span></div>
                <div className={styles.nutritionRow}><span>Protein</span><span>{meal.nutrition.protein} g</span></div>
                <div className={styles.nutritionRow}><span>Carbohydrate</span><span>{meal.nutrition.carbs} g</span></div>
                <div className={styles.nutritionRow}><span>Calories</span><span>{meal.nutrition.calories} kcal</span></div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => navigate(-1)}>Cancel</button>
          <button className={styles.btnSubmit}>Create Menu</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MenuSuggestionResult; 