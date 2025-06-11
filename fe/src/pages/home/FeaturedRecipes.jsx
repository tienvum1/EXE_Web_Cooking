import React, { useEffect, useState } from 'react';
import RecipeGrid from '../../components/recipeCard/RecipeGrid';
import { fetchMostLikedRecipes } from '../../api/recipe';
import { useNavigate } from 'react-router-dom';

const mapRecipe = (r) => ({
  id: r._id,
  mainImage: r.mainImage || '',
  title: r.title,
  time: r.cookTime ? `${r.cookTime}` : '',
  type: r.type || '',
  author: r.author?.username || '',
});

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMostLikedRecipes()
      .then((data) => setRecipes(data.map(mapRecipe)))
      .catch(() => setError('Failed to load featured recipes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ margin: '2rem 0' }}>
      {/* Title */}
      <h2 style={styles.title}>Công Thức Món Ngon Đặc Sắc</h2>

      {/* Description */}
      <p style={styles.description}>
      Tận hưởng những công thức nổi bật, được nhiều người đánh giá cao 
      </p>

      {/* View All Button */}
      <div style={styles.buttonWrapper}>
        <button
          style={styles.button}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(46, 184, 114, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(61, 208, 86, 0.2)';
          }}
          onClick={() => navigate('/recipes')}
        >
          View All
        </button>
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div style={styles.centerText}>Loading...</div>
      ) : error ? (
        <div style={{ ...styles.centerText, color: 'red' }}>{error}</div>
      ) : (
        <RecipeGrid recipes={recipes} />
      )}
    </section>
  );
};

const styles = {
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#3DD056',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '1.05rem',
    color: '#4a5a41',
    textAlign: 'center',
    maxWidth: 600,
    margin: '0 auto 1.5rem',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1.5rem',
    background: 'linear-gradient(90deg, #3DD056, #2EB872)',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(61, 208, 86, 0.2)',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  },
  centerText: {
    textAlign: 'center',
  },
};

export default FeaturedRecipes;
