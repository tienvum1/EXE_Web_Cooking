import React, { useState, useEffect } from 'react';
import './MenuSuggestion.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MenuSuggestion = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [allRecipes, setAllRecipes] = useState([]);
  const navigate = useNavigate();

  // Lấy tất cả công thức khi component mount
  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await axios.get('https://localhost:4567/api/recipes');
        setAllRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchAllRecipes();
  }, []);

  // Phân tích yêu cầu người dùng
  const analyzeRequirements = (text) => {
    const requirements = {
      mealCount: 3, // Mặc định 3 bữa
      maxCalories: null,
      maxTime: null,
      includeIngredients: [],
      excludeIngredients: [],
      dietType: null,
      preferences: []
    };

    // Phân tích số bữa
    const mealCountMatch = text.match(/(\d+)\s*bữa/);
    if (mealCountMatch) {
      requirements.mealCount = parseInt(mealCountMatch[1]);
    }

    // Phân tích calories
    const caloriesMatch = text.match(/(\d+)\s*kcal/);
    if (caloriesMatch) {
      requirements.maxCalories = parseInt(caloriesMatch[1]);
    }

    // Phân tích thời gian
    const timeMatch = text.match(/(\d+)\s*phút/);
    if (timeMatch) {
      requirements.maxTime = parseInt(timeMatch[1]);
    }

    // Phân tích loại chế độ ăn
    const dietTypes = ['eat clean', 'giảm cân', 'tăng cân', 'healthy', 'vegetarian', 'vegan'];
    dietTypes.forEach(type => {
      if (text.toLowerCase().includes(type)) {
        requirements.dietType = type;
      }
    });

    // Phân tích nguyên liệu
    const includeMatch = text.match(/với\s*([^,.]+)/);
    if (includeMatch) {
      requirements.includeIngredients = includeMatch[1].split(',').map(i => i.trim());
    }

    const excludeMatch = text.match(/không\s*([^,.]+)/);
    if (excludeMatch) {
      requirements.excludeIngredients = excludeMatch[1].split(',').map(i => i.trim());
    }

    return requirements;
  };

  // Lọc công thức theo yêu cầu
  const filterRecipes = (recipes, requirements) => {
    return recipes.filter(recipe => {
      // Kiểm tra calories
      if (requirements.maxCalories && recipe.nutrition?.calories > requirements.maxCalories) {
        return false;
      }

      // Kiểm tra thời gian
      if (requirements.maxTime && recipe.cookTime > requirements.maxTime) {
        return false;
      }

      // Kiểm tra nguyên liệu cần có
      if (requirements.includeIngredients.length > 0) {
        const hasAllIngredients = requirements.includeIngredients.every(ingredient =>
          recipe.ingredients.some(recipeIngredient =>
            recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        );
        if (!hasAllIngredients) return false;
      }

      // Kiểm tra nguyên liệu không được có
      if (requirements.excludeIngredients.length > 0) {
        const hasExcludedIngredient = requirements.excludeIngredients.some(ingredient =>
          recipe.ingredients.some(recipeIngredient =>
            recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        );
        if (hasExcludedIngredient) return false;
      }

      // Kiểm tra loại chế độ ăn
      if (requirements.dietType) {
        if (requirements.dietType === 'vegetarian' && recipe.type?.toLowerCase().includes('meat')) {
          return false;
        }
        if (requirements.dietType === 'vegan' && 
            (recipe.type?.toLowerCase().includes('meat') || recipe.type?.toLowerCase().includes('dairy'))) {
          return false;
        }
      }

      return true;
    });
  };

  // Tạo thực đơn
  const generateMenu = (recipes, requirements) => {
    const meals = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];
    const menu = [];

    for (let i = 0; i < requirements.mealCount; i++) {
      const mealName = meals[i] || `Bữa ${i + 1}`;
      const filteredRecipes = filterRecipes(recipes, requirements);
      
      // Lấy ngẫu nhiên 2-3 món cho mỗi bữa
      const recipeCount = Math.floor(Math.random() * 2) + 2;
      const selectedRecipes = [];
      
      for (let j = 0; j < recipeCount; j++) {
        if (filteredRecipes.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
          selectedRecipes.push(filteredRecipes[randomIndex]);
          filteredRecipes.splice(randomIndex, 1);
        }
      }

      // Tính toán dinh dưỡng
      const nutrition = selectedRecipes.reduce((acc, recipe) => ({
        calories: (acc.calories || 0) + (recipe.nutrition?.calories || 0),
        protein: (acc.protein || 0) + (recipe.nutrition?.protein || 0),
        carbs: (acc.carbs || 0) + (recipe.nutrition?.carbs || 0),
        fat: (acc.fat || 0) + (recipe.nutrition?.fat || 0)
      }), {});

      menu.push({
        meal: mealName,
        recipes: selectedRecipes.map(recipe => ({
          _id: recipe._id,
          name: recipe.title,
          image: recipe.mainImage,
          kcal: recipe.nutrition?.calories || 0,
          protein: recipe.nutrition?.protein || 0,
          carbs: recipe.nutrition?.carbs || 0,
          fat: recipe.nutrition?.fat || 0,
          time: `${recipe.cookTime} phút`,
          type: recipe.type
        })),
        nutrition
      });
    }

    return menu;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);

    try {
      // Phân tích yêu cầu
      const requirements = analyzeRequirements(prompt);
      
      // Tạo thực đơn
      const suggestedMenu = generateMenu(allRecipes, requirements);
      
      // Chuyển đến trang kết quả với thực đơn đã tạo
      navigate('/menu-suggestion/result', { state: { menu: suggestedMenu } });
    } catch (error) {
      console.error('Error generating menu:', error);
      alert('Có lỗi xảy ra khi tạo thực đơn. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="menu-suggestion-page">
        <h1 className="menu-title">AI Menu Gợi ý thực đơn</h1>
        <p className="menu-desc">Nhập yêu cầu/thông tin của bạn vào ô dưới đây, AI sẽ gợi ý thực đơn phù hợp.</p>
        <form className="menu-form" onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto' }}>
          <textarea
            className="menu-ai-textarea"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ví dụ: Tôi muốn thực đơn Eat Clean cho 3 bữa, ít tinh bột, nhiều rau, phù hợp giảm cân, thời gian nấu dưới 30 phút..."
            rows={5}
            style={{ width: '100%', fontSize: 17, padding: 16, borderRadius: 10, border: '1.5px solid #ddd', marginBottom: 20 }}
          />
          <div className="menu-form-actions" style={{ textAlign: 'right' }}>
            <button type="submit" className="menu-btn menu-btn-submit" disabled={loading}>
              {loading ? 'Đang phân tích...' : 'Gợi ý thực đơn'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default MenuSuggestion; 