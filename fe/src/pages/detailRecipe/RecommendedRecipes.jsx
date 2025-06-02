import React, { useState, useEffect } from 'react';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import './RecommendedRecipes.scss';
import { fetchMostLikedRecipes } from '../../api/recipe';

const RecommendedRecipes = () => {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendedRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMostLikedRecipes();
        const mappedRecipes = data.map(recipe => ({
          id: recipe._id,
          mainImage: recipe.mainImage || '',
          title: recipe.title,
          time: recipe.cookTime || '',
          type: recipe.type || '',
          author: recipe.author?.username || 'Ẩn danh',
        }));
        setRecommendedRecipes(mappedRecipes);
      } catch (err) {
        console.error('Failed to fetch recommended recipes:', err);
        setError('Không thể tải danh sách công thức đề xuất.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedRecipes();
  }, []);

  return (
    <div className="recommended-recipes">
      <h2 className="recommended-recipes__title">You may like these recipe too</h2>
      <div className="recommended-recipes__grid">
        {loading && <div>Đang tải công thức đề xuất...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && recommendedRecipes.length === 0 && <div>Không tìm thấy công thức đề xuất nào.</div>}
        {!loading && !error && recommendedRecipes.length > 0 && (
          recommendedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              mainImage={recipe.mainImage}
              title={recipe.title}
              time={recipe.time}
              type={recipe.type}
              author={recipe.author}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedRecipes;