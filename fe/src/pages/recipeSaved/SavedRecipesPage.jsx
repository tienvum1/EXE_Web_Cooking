import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeInfoCard from '../../components/recipeCard/RecipeInfoCard';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import { FaRegBookmark } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import './SavedRecipesPage.scss';

const SavedRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/saved-recipes/list`, { withCredentials: true });
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
          <h1 className="saved-title">Món Đã Lưu</h1>
        </div>
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
      </div>
      <Footer />
    </>
  );
};

export default SavedRecipesPage;