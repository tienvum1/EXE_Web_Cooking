import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MenuSuggestion.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import styles from './MenuSuggestionResult.module.scss';
import { createMenu } from '../../api/menu';

const MenuSuggestionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(location.state?.menu || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lưu thực đơn vào database
  const saveMenu = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Vui lòng đăng nhập để lưu thực đơn!');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const menuData = {
        userId: user._id,
        name: `Thực đơn ${new Date().toLocaleDateString('vi-VN')}`,
        meals: menu.map(meal => ({
          name: meal.meal,
          recipes: meal.recipes.map(recipe => ({
            recipeId: recipe._id,
            name: recipe.name,
            image: recipe.image,
            nutrition: {
              calories: recipe.kcal,
              protein: recipe.protein,
              carbs: recipe.carbs,
              fat: recipe.fat
            },
            time: recipe.time,
            type: recipe.type
          })),
          nutrition: meal.nutrition
        }))
      };

      await createMenu(menuData);
      alert('Lưu thực đơn thành công!');
      navigate('/my-menus');
    } catch (error) {
      console.error('Error saving menu:', error);
      setError('Có lỗi xảy ra khi lưu thực đơn. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết công thức khi click vào
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={styles.resultContainer}>
        <h1 className={styles.title}>Thực đơn gợi ý</h1>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.list}>
          {menu.map((meal, idx) => (
            <div className={styles.mealRow} key={meal.meal}>
              <div className={styles.mealMain}>
                <h2 className={styles.mealTitle}>{meal.meal}</h2>
                <div className={styles.mealRecipes}>
                  {meal.recipes.map((r, i) => (
                    <div 
                      className={styles.recipeCard} 
                      key={i}
                      onClick={() => handleRecipeClick(r._id)}
                    >
                      <div className={styles.recipeImgbox}>
                        <img src={r.image} alt={r.name} />
                        <button 
                          className={styles.recipeFav}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Xử lý thêm vào yêu thích
                          }}
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                      </div>
                      <div className={styles.recipeInfo}>
                        <div className={styles.recipeName}>{r.name}</div>
                        <div className={styles.recipeNutri}>
                          {r.kcal} kcal<br/>
                          Protein: {r.protein}g, Carbs: {r.carbs}g, Fat: {r.fat}g
                        </div>
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
                <div className={styles.nutritionTitle}>Thông tin dinh dưỡng</div>
                <div className={styles.nutritionRow}>
                  <span>Chất béo</span>
                  <span>{meal.nutrition.fat} g</span>
                </div>
                <div className={styles.nutritionRow}>
                  <span>Đạm</span>
                  <span>{meal.nutrition.protein} g</span>
                </div>
                <div className={styles.nutritionRow}>
                  <span>Tinh bột</span>
                  <span>{meal.nutrition.carbs} g</span>
                </div>
                <div className={styles.nutritionRow}>
                  <span>Calo</span>
                  <span>{meal.nutrition.calories} kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.btnCancel} 
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
          <button 
            className={styles.btnSubmit}
            onClick={saveMenu}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu thực đơn'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MenuSuggestionResult; 