import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeInfoCard from '../../components/recipeCard/RecipeInfoCard';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import { FaBook } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import './SavedRecipesPage.scss';

const AllRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await axios.get(`https://exe-web-cooking.onrender.com/api/recipes/me/all-recipes`, { withCredentials: true });
        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to fetch all recipes:", err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRecipes();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="saved-recipes-container">
        <div className="saved-title-row">
          <FaBook className="saved-title-icon" />
          <h1 className="saved-title">Tất cả công thức nấu ăn của bạn ({recipes.length})</h1>
        </div>
        <div className="saved-search-sort-row">
          <div className="saved-search-input">
            <input
              type="text"
              placeholder="Tìm trong kho món ngon của bạn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="saved-sort-option">
            ↑↓ Mới Nhất
          </div>
        </div>
        <div className="saved-content-area">
          {loading ? (
            <div className="saved-loading">
              <ImSpinner2 className="saved-spinner" /> Đang tải...
            </div>
          ) : recipes.length === 0 ? (
            <div className="saved-empty-state">
              <img src="/empty-bowl.png" alt="empty" className="saved-empty-img" />
              <h2>Chưa có món ăn nào</h2>
              <p>Hãy tạo món ăn đầu tiên của bạn!</p>
            </div>
          ) : (
            <div className="saved-recipes-list">
              {recipes.map(recipe => (
                <RecipeInfoCard key={recipe?._id} recipe={recipe} />
              ))}
            </div>
          )}
          <FeedbackForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllRecipesPage;