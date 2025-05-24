import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeGrid from '../../components/recipeCard/RecipeGrid';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import categoriesData from '../../components/category/categoriesData';
import './RecipePage.scss';

const SidebarFilter = ({ filters, setFilters }) => {
  return (
    <aside className="sidebar-filter">
      <h3>Bộ lọc nâng cao</h3>
      <div className="sidebar-filter-section">
        <label>Thời gian nấu (phút):</label>
        <input
          type="number"
          min={0}
          placeholder="Tối đa..."
          value={filters.maxCookTime || ''}
          onChange={e => setFilters(f => ({ ...f, maxCookTime: e.target.value }))}
        />
      </div>
      <div className="sidebar-filter-section">
        <label>Lượng calories tối đa:</label>
        <input
          type="number"
          min={0}
          placeholder="Ví dụ: 300"
          value={filters.maxCalories || ''}
          onChange={e => setFilters(f => ({ ...f, maxCalories: e.target.value }))}
        />
      </div>
    </aside>
  );
};

const RecipePage = () => {
  const { search: urlSearch } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(urlSearch);
  const category = params.get('category');
  const queryQ = params.get('q') || '';

  const [search, setSearch] = useState(queryQ);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ maxCookTime: '', maxCalories: '' });
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError('');
      try {
        let url = 'https://localhost:4567/api/recipes';
        if (category) url += `?category=${encodeURIComponent(category)}`;
        const res = await axios.get(url);
        const mapped = res.data.map(r => ({
          id: r._id,
          image: r.mainImage || '',
          title: r.title,
          time: r.cookTime || '',
          cookTime: r.cookTime,
          type: r.type || '',
          author: r.author?.username || 'Ẩn danh',
          likes: r.likes || 0,
          calories: r.nutrition?.calories || 0,
          ingredients: r.ingredients || [],
        }));
        setRecipes(mapped);
      } catch (err) {
        setError('Không thể tải danh sách công thức.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [category]);

  // Lấy danh sách recipe đã lưu khi mount
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get('https://localhost:4567/api/saved-recipes/list', { withCredentials: true });
        setSavedIds(res.data.map(item => item.recipe._id));
      } catch {}
    };
    fetchSaved();
  }, []);

  // Khi queryQ thay đổi (chuyển trang từ search), cập nhật search input
  useEffect(() => {
    setSearch(queryQ);
  }, [queryQ]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchCookTime = !filters.maxCookTime || (parseInt(recipe.cookTime) || 0) <= parseInt(filters.maxCookTime);
    const matchCalories = !filters.maxCalories || recipe.calories <= parseInt(filters.maxCalories);
    return matchSearch && matchCookTime && matchCalories;
  });

  // Chọn category filter
  const handleCategoryFilter = (catName) => {
    if (catName === category) {
      navigate('/recipes'); // Bỏ lọc nếu click lại
    } else {
      navigate(`/recipes?category=${encodeURIComponent(catName)}`);
    }
  };

  // Hàm xử lý lưu/bỏ lưu
  const handleToggleSave = async (recipeId, isSaved) => {
    try {
      if (!isSaved) {
        await axios.post('http://localhost:4567/api/saved-recipes/save', { recipeId }, { withCredentials: true });
        setSavedIds(prev => [...prev, recipeId]);
      } else {
        await axios.post('http://localhost:4567/api/saved-recipes/unsave', { recipeId }, { withCredentials: true });
        setSavedIds(prev => prev.filter(id => id !== recipeId));
      }
    } catch (err) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!');
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="recipe-page-container" style={{ display: 'flex', gap: 32 }}>
        <SidebarFilter filters={filters} setFilters={setFilters} />
        <div style={{ flex: 1 }}>
          <h1 className="recipe-page-title">
            {category ? `Công thức thuộc danh mục: ${category}` : 'Tất cả công thức'}
          </h1>
          <p className="recipe-page-desc">Khám phá hàng trăm công thức ngon, lành mạnh và dễ làm cho mọi bữa ăn!</p>
          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '1.2rem 0 1.5rem 0' }}>
            <button
              onClick={() => navigate('/recipes')}
              style={{
                background: !category ? '#e6f7ea' : '#f7f7f7',
                border: !category ? '1.5px solid #3DD056' : '1.5px solid #e0e0e0',
                color: '#222',
                borderRadius: 16,
                padding: '6px 18px',
                fontWeight: 500,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.18s',
                outline: 'none',
              }}
            >
              <span style={{ fontSize: 20 }}>🍽️</span> All
            </button>
            {categoriesData.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleCategoryFilter(cat.name)}
                style={{
                  background: cat.name === category ? '#e6f7ea' : '#f7f7f7',
                  border: cat.name === category ? '1.5px solid #3DD056' : '1.5px solid #e0e0e0',
                  color: '#222',
                  borderRadius: 16,
                  padding: '6px 18px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.18s',
                  outline: 'none',
                }}
              >
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
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
          {!loading && !error && <RecipeGrid recipes={filteredRecipes} savedIds={savedIds} onToggleSave={handleToggleSave} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecipePage;