import React, { useState } from 'react';
 import Header from '../../components/header/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
 import Footer from '../../components/footer/Footer';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import axios from 'axios';
import './MenuSuggestionResult.scss';

const MenuSuggestionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menu = location.state?.menu;
  const [menuName, setMenuName] = useState('Thực đơn mới');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!menu || !Array.isArray(menu) || menu.length === 0) {
    return (
      <div className="menu-result-page">
        <h1>Không tìm thấy thực đơn phù hợp. Vui lòng thử lại với các tiêu chí khác.</h1>
        <button onClick={() => navigate('/menu-suggestion')} className="back-btn">
          Quay lại trang gợi ý
        </button>
      </div>
    );
  }

  const calculateTotalNutrition = (recipes) => {
    return recipes.reduce((total, recipe) => {
      // Get nutrition values from the recipe object
      // Now we have both the direct calories and the complete nutrition object
      const recipeCalories = recipe.calories || recipe.nutrition?.calories || 0;
      const recipeProtein = recipe.nutrition?.protein || 0;
      const recipeCarbs = recipe.nutrition?.carbs || 0;
      const recipeFat = recipe.nutrition?.fat || 0;

      // Add to totals with proper type conversion to ensure numbers
      return {
        calories: Number(total.calories || 0) + Number(recipeCalories),
        protein: Number(total.protein || 0) + Number(recipeProtein),
        carbs: Number(total.carbs || 0) + Number(recipeCarbs),
        fat: Number(total.fat || 0) + Number(recipeFat)
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  };

  const handleSaveMenu = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      const response = await axios.post('https://localhost:4567/api/menus/save', {
        menu,
        name: menuName
      }, {
        withCredentials: true
      });

      setSaveMessage('Lưu thực đơn thành công!');
    } catch (error) {
      console.error('Error saving menu:', error);
      setSaveMessage(error.response?.data?.message || 'Lỗi khi lưu thực đơn');
    } finally {
      setIsSaving(false);
    }
  };

  const getMealTypeInVietnamese = (mealType) => {
    const mealTypes = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối',
      snack: 'Bữa phụ'
    };
    return mealTypes[mealType] || mealType;
  };

  return (
    <>
    <Header />
    <Sidebar/>
    <div className="menu-result-page">
      <h1 className="result-title">Thực đơn được gợi ý</h1>
      
      <div className="menu-container">
        {menu.map((meal, index) => {
          const totalNutrition = calculateTotalNutrition(meal.recipes);
          
          return (
            <div key={index} className="meal-section">
              <h2 className="meal-title">
                {getMealTypeInVietnamese(meal.mealType)}
              </h2>
              
              <div className="nutrition-summary">
                <h3>Thông Tin Dinh Dưỡng</h3>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="label">Calo</span>
                    <span className="value">{totalNutrition.calories || 0} kcal</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">Chất béo</span>
                    <span className="value">{totalNutrition.fat || 0}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">Đạm</span>
                    <span className="value">{totalNutrition.protein || 0}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">Tinh bột</span>
                    <span className="value">{totalNutrition.carbs || 0}g</span>
                  </div>
                </div>
              </div>

              <div className="recipes-grid">
                {meal.recipes && meal.recipes.map((recipe, recipeIndex) => (
                  <RecipeCard
                    key={recipeIndex}
                    id={recipe._id}
                    mainImage={recipe.mainImage}
                    title={recipe.name}
                    time={recipe.cookTime}
                    author={recipe.author?.name || ' '}
                    likes={recipe.likes || 0}
                    comments={recipe.comments?.length || 0}
                    difficulty={recipe.difficulty || 'Trung bình'}
                    servings={recipe.servings || 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <div className="save-menu-section">
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="Tên thực đơn"
            className="menu-name-input"
          />
          <button 
            onClick={handleSaveMenu} 
            className="save-btn"
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thực đơn'}
          </button>
          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('thành công') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}
        </div>
        <button onClick={() => navigate('/menu-suggestion')} className="back-btn">
          Tạo thực đơn mới
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MenuSuggestionResult; 