import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeGrid from '../../components/recipeCard/RecipeGrid';
import axios from 'axios';
import './RecipePage.scss';

const RecipePage = () => {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError('');
      try {
        // API đã chỉ trả về recipe đã duyệt
        const res = await axios.get('http://localhost:4567/api/recipes');
        // Map về format cho RecipeGrid
        const mapped = res.data.map(r => ({
          id: r._id,
          image: r.mainImage || '',
          title: r.title,
          time: r.cookTime || '',
          type: r.type || '',
          author: r.author?.username || 'Ẩn danh',
        }));
        setRecipes(mapped);
      } catch (err) {
        setError('Không thể tải danh sách công thức.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Lọc theo search
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
        {loading && <div>Đang tải...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && <RecipeGrid recipes={filteredRecipes} />}
      </div>
      <Footer />
    </>
  );
};

export default RecipePage;