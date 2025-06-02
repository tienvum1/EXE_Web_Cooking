import React, { useState } from 'react';
import './MenuSuggestion.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { getAIMenuSuggestion } from '../../api/recipe';

// Hàm giả lập AI phân tích (bạn thay bằng API thực tế sau này)
// async function getMenuSuggestionAI(prompt) {
//   // Gửi lên API thực tế ở đây
//   // const res = await fetch('/api/ai-menu', { method: 'POST', body: JSON.stringify({ prompt }) });
//   // return await res.json();
//   // Tạm thời trả về dữ liệu mẫu
//   return [
//     {
//       meal: 'Breakfast',
//       nutrition: { fat: 10, protein: 30, carbs: 40, calories: 400 },
//       recipes: [
//         {
//           name: 'Yến mạch sữa chua trái cây',
//           image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
//           kcal: 200,
//           protein: 8,
//           carbs: 30,
//           fat: 5,
//           time: '10 phút',
//           type: 'Eat Clean',
//         },
//       ],
//     },
//     {
//       meal: 'Lunch',
//       nutrition: { fat: 15, protein: 40, carbs: 60, calories: 600 },
//       recipes: [
//         {
//           name: 'Cơm gạo lứt ức gà',
//           image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
//           kcal: 300,
//           protein: 20,
//           carbs: 40,
//           fat: 7,
//           time: '20 phút',
//           type: 'Eat Clean',
//         },
//       ],
//     },
//     {
//       meal: 'Dinner',
//       nutrition: { fat: 12, protein: 35, carbs: 50, calories: 500 },
//       recipes: [
//         {
//           name: 'Salad cá hồi áp chảo',
//           image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
//           kcal: 250,
//           protein: 15,
//           carbs: 20,
//           fat: 8,
//           time: '15 phút',
//           type: 'Salad',
//         },
//       ],
//     },
//   ];
// }

const MenuSuggestion = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setMenu(null);
    // const result = await getMenuSuggestionAI(prompt);
    try {
      const result = await getAIMenuSuggestion(prompt); // Call the actual API
      setMenu(result);
      navigate('/menu-suggestion/result', { state: { menu: result } });
    } catch (error) {
      console.error('Error getting AI menu suggestion:', error);
      // Optionally, display an error message to the user
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
        {menu && (
          <div className="menu-suggestion-result-v2">
            <h1 className="menu-title">Menu gợi ý cho bạn</h1>
            <div className="menu-suggestion-list">
              {menu.map((meal, idx) => (
                <div className="menu-meal-row" key={meal.meal}>
                  <div className="menu-meal-main">
                    <h2 className="menu-meal-title">{meal.meal}</h2>
                    <div className="menu-meal-recipes">
                      {meal.recipes.map((r, i) => (
                        <div className="menu-recipe-card" key={i}>
                          <div className="menu-recipe-imgbox">
                            <img src={r.image} alt={r.name} />
                          </div>
                          <div className="menu-recipe-info">
                            <div className="menu-recipe-name">{r.name}</div>
                            <div className="menu-recipe-nutri">{r.kcal} kcal<br/>Protein: {r.protein}g, Carbs: {r.carbs}g, Fat: {r.fat}g</div>
                            <div className="menu-recipe-meta">
                              <span><i className="far fa-clock"></i> {r.time}</span>
                              <span><i className="fas fa-utensils"></i> {r.type}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="menu-meal-nutrition">
                    <div className="nutrition-title">Nutrition Information</div>
                    <div className="nutrition-row"><span>Total Fat</span><span>{meal.nutrition.fat} g</span></div>
                    <div className="nutrition-row"><span>Protein</span><span>{meal.nutrition.protein} g</span></div>
                    <div className="nutrition-row"><span>Carbohydrate</span><span>{meal.nutrition.carbs} g</span></div>
                    <div className="nutrition-row"><span>Calories</span><span>{meal.nutrition.calories} kcal</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MenuSuggestion; 