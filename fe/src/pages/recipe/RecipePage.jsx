import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeGrid from '../../components/recipeCard/RecipeGrid';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import categoriesData from '../../components/category/categoriesData';
import { checkPremiumStatus } from '../../api/premium';
import './RecipePage.scss';

const SidebarFilter = ({ filters, setFilters, isPremium, loadingPremiumStatus }) => {
  const [includeIngredients, setIncludeIngredients] = useState('');
  const [excludeIngredients, setExcludeIngredients] = useState('');

  const handleApplyFilters = () => {
    setFilters(prev => ({
      ...prev,
      includeIngredients: includeIngredients.split(',').map(i => i.trim()).filter(i => i),
      excludeIngredients: excludeIngredients.split(',').map(i => i.trim()).filter(i => i)
    }));
  };

  const handleClearFilters = () => {
    setIncludeIngredients('');
    setExcludeIngredients('');
    setFilters(prev => ({
      ...prev,
      includeIngredients: [],
      excludeIngredients: []
    }));
  };

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
          disabled={!isPremium && !loadingPremiumStatus}
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
          disabled={!isPremium && !loadingPremiumStatus}
        />
      </div>

      <div className="sidebar-filter-section">
        <label>Hiển thị các món với:</label>
        <textarea
          placeholder="Gõ vào tên các nguyên liệu, phân cách bằng dấu phẩy..."
          value={includeIngredients}
          onChange={e => setIncludeIngredients(e.target.value)}
          rows={3}
          disabled={!isPremium && !loadingPremiumStatus}
        />
      </div>

      <div className="sidebar-filter-section">
        <label>Hiển thị các món không có:</label>
        <textarea
          placeholder="Gõ vào tên các nguyên liệu, phân cách bằng dấu phẩy..."
          value={excludeIngredients}
          onChange={e => setExcludeIngredients(e.target.value)}
          rows={3}
          disabled={!isPremium && !loadingPremiumStatus}
        />
      </div>

      {!loadingPremiumStatus && !isPremium && (
        <p style={{ color: '#e67e22', fontSize: '0.9em', marginBottom: '1rem', textAlign: 'center' }}>
          ✨ Bộ lọc nâng cao là tính năng Premium. Vui lòng đăng ký Premium để sử dụng.
        </p>
      )}

      <div className="filter-buttons">
        <button 
          className="apply-filter-btn"
          onClick={handleApplyFilters}
          disabled={!isPremium && !loadingPremiumStatus}
        >
          Áp dụng bộ lọc
        </button>
        <button 
          className="clear-filter-btn"
          onClick={handleClearFilters}
          disabled={!isPremium && !loadingPremiumStatus}
        >
          Bỏ sàng lọc
        </button>
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
  const [filters, setFilters] = useState({ 
    maxCookTime: '', 
    maxCalories: '',
    includeIngredients: [],
    excludeIngredients: []
  });
  const [savedIds, setSavedIds] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loadingPremiumStatus, setLoadingPremiumStatus] = useState(true);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const response = await checkPremiumStatus();
        if (response.data) {
          setIsPremium(response.data.isPremium);
        }
      } catch (err) {
        console.error('Error fetching premium status:', err);
        setIsPremium(false);
      } finally {
        setLoadingPremiumStatus(false);
      }
    };
    fetchPremiumStatus();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError('');
      try {
        let url = 'https://exe-web-cooking.onrender.com/api/recipes';
        if (category) url += `?category=${encodeURIComponent(category)}`;
        const res = await axios.get(url);
        console.log('Raw recipes data from backend:', res.data);
        const mapped = res.data.map(r => ({
          id: r._id,
          mainImage: r.mainImage || '',
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

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get('https://exe-web-cooking.onrender.com/api/saved-recipes/list', { withCredentials: true });
        setSavedIds(res.data.map(item => item.recipe._id));
      } catch {}
    };
    fetchSaved();
  }, []);

  useEffect(() => {
    setSearch(queryQ);
  }, [queryQ]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchCookTime = !filters.maxCookTime || (parseInt(recipe.cookTime) || 0) <= parseInt(filters.maxCookTime);
    const matchCalories = !filters.maxCalories || recipe.calories <= parseInt(filters.maxCalories);
    
    const matchIncludeIngredients = filters.includeIngredients.length === 0 || 
      filters.includeIngredients.every(ingredient => 
        recipe.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );

    const matchExcludeIngredients = filters.excludeIngredients.length === 0 ||
      !filters.excludeIngredients.some(ingredient =>
        recipe.ingredients.some(recipeIngredient =>
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );

    return matchSearch && matchCookTime && matchCalories && matchIncludeIngredients && matchExcludeIngredients;
  });

  const handleCategoryFilter = (catName) => {
    if (catName === category) {
      navigate('/recipes');
    } else {
      navigate(`/recipes?category=${encodeURIComponent(catName)}`);
    }
  };

  const handleToggleSave = async (recipeId, isSaved) => {
    try {
      if (!isSaved) {
        const MAX_FREE_SAVED_RECIPES = 5;
        if (!isPremium && savedIds.length >= MAX_FREE_SAVED_RECIPES) {
          alert(`Bạn đã đạt giới hạn ${MAX_FREE_SAVED_RECIPES} công thức được lưu. Vui lòng đăng ký gói Premium để lưu không giới hạn!`);
          return;
        }
        await axios.post('https://exe-web-cooking.onrender.com/api/saved-recipes/save', { recipeId }, { withCredentials: true });
        setSavedIds(prev => [...prev, recipeId]);
      } else {
        await axios.post('https://exe-web-cooking.onrender.com/api/saved-recipes/unsave', { recipeId }, { withCredentials: true });
        setSavedIds(prev => prev.filter(id => id !== recipeId));
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert(err.response.data.message);
      } else if (err.response && err.response.status === 400 && err.response.data.message === 'Đã lưu công thức này') {
        console.log('Công thức này đã được lưu.');
      } else if (err.response && err.response.status === 401) {
        alert('Vui lòng đăng nhập để sử dụng chức năng này!');
      } else {
        console.error('Lỗi khi lưu/bỏ lưu công thức:', err);
        alert('Đã xảy ra lỗi khi lưu/bỏ lưu công thức. Vui lòng thử lại.');
      }
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="recipe-page-container" style={{ display: 'flex', gap: 32 }}>
        <SidebarFilter filters={filters} setFilters={setFilters} isPremium={isPremium} loadingPremiumStatus={loadingPremiumStatus} />
        <div style={{ flex: 1 }}>
          <h1 className="recipe-page-title">
            {category ? `Công thức thuộc danh mục: ${category}` : 'Tất cả công thức'}
          </h1>
          <p className="recipe-page-desc">Khám phá hàng trăm công thức ngon, lành mạnh và dễ làm cho mọi bữa ăn!</p>
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