import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeInfoCard from '../../components/recipeCard/RecipeInfoCard';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import { FaRegBookmark } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import './SavedRecipesPage.scss';

const SavedRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`https://exe-web-cooking.onrender.com/api/saved-recipes/list`, { withCredentials: true });
        setRecipes(res.data.map(item => item.recipe));
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="saved-recipes-container">
        <div className="saved-title-row">
          <FaRegBookmark className="saved-title-icon" />
          <h1 className="saved-title">Món Đã Lưu ({recipes.length})</h1>
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
            ↑↓ Đã Xem Gần Nhất
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
              <h2>Chưa có công thức nào</h2>
              <p>Các công thức bạn lưu sẽ xuất hiện ở đây!</p>
              <a href="/recipe" className="saved-explore-btn">Khám phá công thức</a>
            </div>
          ) : (
            <div className="saved-recipes-list">
              {recipes.map(recipe => (
                <RecipeInfoCard key={recipe._id} recipe={recipe} />
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

export default SavedRecipesPage;