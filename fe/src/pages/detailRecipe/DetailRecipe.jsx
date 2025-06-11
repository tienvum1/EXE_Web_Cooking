import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeApproveById, deleteRecipe, toggleLike, checkLikeStatus } from '../../api/recipe';
import { fetchUserById } from '../../api/user';
import { getMe } from '../../api/auth';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import RecipeHeader from './RecipeHeader';
import NutritionInfo from './NutritionInfo';
import ImageSection from './ImageSection';
import IngredientsList from './IngredientsList';
import DirectionsList from './DirectionsList';
import video from '../../assets/images/video.mp4';
import RecommendedRecipes from './RecommendedRecipes';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeComments from './RecipeComments';
import RecipeAuthorInfo from './RecipeAuthorInfo';
import logo from '../../assets/images/logo.png';
import './DetailRecipe.scss';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../../contexts/RecipeContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const DetailRecipe = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorInfo, setAuthorInfo] = useState(null);
  const [isRecipeAuthor, setIsRecipeAuthor] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchRecipeApproveById(id);
        if (!data) {
          throw new Error('Không tìm thấy công thức');
        }
        console.log('Fetched recipe data:', data);
        setRecipeData(data);

        try {
          const currentUser = await getMe();
          if (data.author && currentUser && data.author._id === currentUser._id) {
            setIsRecipeAuthor(true);
          }

          if (data.author && data.author._id) {
            const user = await fetchUserById(data.author._id);
            setAuthorInfo(user);
          }

          // Check if user has liked the recipe
          if (currentUser) {
            const likeStatus = await checkLikeStatus(id);
            setIsLiked(likeStatus.liked);
          }
        } catch (userErr) {
          console.log('User not authenticated or error fetching user data:', userErr);
          // Continue with recipe display even if user data fails
        }

      } catch (err) {
        console.error('Fetch recipe error:', err);
        setError(err.response?.data?.message || 'Không thể tải chi tiết công thức. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      if (!recipeData?._id) {
        throw new Error('Không tìm thấy ID công thức');
      }

      const response = await toggleLike(recipeData._id);
      if (response.likes !== undefined) {
        setRecipeData(prev => ({ ...prev, likes: response.likes }));
        setIsLiked(response.liked);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi thực hiện thao tác like';
      alert(errorMessage);
    }
  };

  const handleDeleteRecipe = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công thức này không?')) {
      try {
        await deleteRecipe(recipeData._id);
        alert('Công thức đã bị xóa thành công!');
        navigate('/recipes');
      } catch (err) {
        console.error('Error deleting recipe:', err);
        alert(`Không thể xóa công thức. ${err.response?.data?.message || 'Lỗi server.'}`);
      }
    }
  };

  const handleEditRecipe = () => {
    navigate(`/recipes/create?id=${recipeData._id}`);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!recipeData) return null;

  return (
    <RecipeContext.Provider value={{
      isRecipeAuthor,
      recipeId: recipeData._id,
      handleEditRecipe,
      handleDeleteRecipe,
    }}>
      <> <Header />
       <Sidebar />
      <div className="detail-layout">
       
        <RecipeHeader
          title={recipeData.title}
          user={{ name: recipeData.author?.username, date: recipeData.createdAt, avatar :authorInfo?.avatar}}
          prepTime={recipeData.prepTime || ''}
          cookTime={recipeData.cookTime || ''}
          servings={recipeData.servings}
          recipeId={recipeData._id}
          authorName={recipeData.author?.username}
          categories={recipeData.categories}
        />
        <div className="top-section">
          <div className="left-col">
            {console.log('Passing to ImageSection:', { mainImage: recipeData.mainImage, mainImageType: recipeData.mainImageType })}
            <ImageSection mainImage={recipeData.mainImage} mainImageType={recipeData.mainImageType} alt={recipeData.title} />
            <button 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span>{recipeData.likes || 0} likes</span>
            </button>
          </div>
          <div className="right-col">
            <NutritionInfo
              calories={recipeData.nutrition?.calories}
              fat={recipeData.nutrition?.fat}
              protein={recipeData.nutrition?.protein}
              carbs={recipeData.nutrition?.carbs}
            />
          </div>
        </div>
        <p className="description">{recipeData.desc}</p>
        <div className="ingredients-directions-row">
          <div className="ingredients-col">
            <IngredientsList mainDish={recipeData.ingredients} sauce={[]} />
          </div>
          <div className="directions-col">
            {console.log('Passing to DirectionsList:', { directions: recipeData.steps })}
            <DirectionsList directions={recipeData.steps} />
          </div>
        </div>
       
      </div>
      <RecipeComments recipeId={recipeData._id} />
      <RecipeAuthorInfo
        avatar={authorInfo?.avatar}
        name={authorInfo?.fullName || authorInfo?.username}
        username={`@${authorInfo?.username}`}
        time={recipeData.createdAt}
        location={authorInfo?.location || ''}
        description={authorInfo?.bio || authorInfo?.introduce || ''}
        authorId={authorInfo?._id}
      />
      <RecommendedRecipes />
    
      <Footer />
      </>
    </RecipeContext.Provider>
  );
};

export default DetailRecipe;