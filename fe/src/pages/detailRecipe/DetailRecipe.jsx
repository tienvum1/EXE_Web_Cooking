import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeById } from '../../api/recipe';
import { fetchUserById } from '../../api/user';
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


const DetailRecipe = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorInfo, setAuthorInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchRecipeById(id);
        setRecipeData(data);
        if (data.author && data.author._id) {
          const user = await fetchUserById(data.author._id);
          setAuthorInfo(user);
        }
      } catch (err) {
        setError('Không thể tải chi tiết công thức.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!recipeData) return null;

  return (
    <> <Header />
     <Sidebar />
    <div className="detail-layout">
     
      <RecipeHeader
        title={recipeData.title}
        user={{ name: recipeData.author?.username, date: recipeData.createdAt, avatar: '/avatar.jpg' }}
        prepTime={recipeData.prepTime || ''}
        cookTime={recipeData.cookTime || ''}
        servings={recipeData.servings}
        recipeId={recipeData._id}
        authorName={recipeData.author?.username}
      />
      <div className="top-section">
        <div className="left-col">
          <ImageSection src={recipeData.mainImage || ''} alt={recipeData.title} />
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
  );
};

export default DetailRecipe;