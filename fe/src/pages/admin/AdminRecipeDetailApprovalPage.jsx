import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecipeById, updateRecipeStatus } from '../../api/recipe'; // Corrected relative path again
import './AdminRecipeDetailApprovalPage.scss'; // We will create this SCSS file

const AdminRecipeDetailApprovalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        // TODO: Add logic to check if the current user is an admin
        setLoading(true);
        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Không thể tải chi tiết công thức.');
      } finally {
        setLoading(false);
      }
    };

    getRecipe();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      const result = await updateRecipeStatus(id, status);
      setUpdateMessage(result.message);
      // Optionally, remove the recipe from the list or navigate back
      setTimeout(() => {
        navigate('/admin/recipes/pendings'); // Navigate back after a short delay
      }, 1500); // Delay for 1.5 seconds to show message
    } catch (err) {
      console.error(`Error updating recipe status to ${status}:`, err);
      setUpdateMessage(`Lỗi cập nhật trạng thái: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-recipe-detail-approval-page">
  
        <div className="container">
          <p>Đang tải chi tiết công thức...</p>
        </div>
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-recipe-detail-approval-page">
    
        <div className="container">
          <p className="error-message">{error}</p>
        </div>

      </div>
    );
  }

  if (!recipe) {
    return (
        <div className="admin-recipe-detail-approval-page">
          <div className="container">
            <p>Không tìm thấy công thức.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="admin-recipe-detail-approval-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Quay lại danh sách chờ duyệt
        </button>

        <h1>{recipe.title}</h1>
        <p className="author-info">Tác giả: {recipe.author ? recipe.author.username : 'N/A'}</p>
        <p className="date-info">Ngày gửi: {new Date(recipe.createdAt).toLocaleDateString()}</p>

        {recipe.mainImage && (
          <div className="main-image-container">
            <img src={recipe.mainImage} alt={recipe.title} />
          </div>
        )}

        <div className="recipe-section">
          <h2>Mô tả</h2>
          <p>{recipe.desc}</p>
        </div>

        <div className="recipe-section">
          <h2>Thông tin cơ bản</h2>
          <p>Khẩu phần: {recipe.servings}</p>
          <p>Thời gian nấu: {recipe.cookTime}</p>
        </div>

        <div className="recipe-section">
          <h2>Nguyên liệu</h2>
          {recipe.ingredients && Array.isArray(recipe.ingredients) && (
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          )}
           {(!recipe.ingredients || !Array.isArray(recipe.ingredients)) && <p>Không có thông tin nguyên liệu.</p>}
        </div>

        <div className="recipe-section">
          <h2>Các bước thực hiện</h2>
          {recipe.steps && Array.isArray(recipe.steps) && (
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>
                  <p>{step.text}</p>
                  {step.images && Array.isArray(step.images) && step.images.map((image, imgIndex) => (
                    <img key={imgIndex} src={image.url} alt={`Bước ${index + 1} hình ${imgIndex + 1}`} className="step-image"/>
                  ))}
                </li>
              ))}
            </ol>
          )}
          {(!recipe.steps || !Array.isArray(recipe.steps)) && <p>Không có thông tin các bước thực hiện.</p>}
        </div>

        {recipe.nutrition && (typeof recipe.nutrition === 'object') && (
          <div className="recipe-section">
            <h2>Thông tin dinh dưỡng</h2>
            <p>Calories: {recipe.nutrition.calories || 'N/A'}</p>
            <p>Fat: {recipe.nutrition.fat || 'N/A'}</p>
            <p>Protein: {recipe.nutrition.protein || 'N/A'}</p>
            <p>Carbs: {recipe.nutrition.carbs || 'N/A'}</p>
          </div>
        )}

        <div className="approval-actions">
          <button
            className="approve-button"
            onClick={() => handleUpdateStatus('approved')}
            disabled={isUpdating}
          >
            {isUpdating ? 'Đang duyệt...' : 'Duyệt công thức'}
          </button>
          <button
            className="reject-button"
            onClick={() => handleUpdateStatus('rejected')}
            disabled={isUpdating}
          >
            {isUpdating ? 'Đang từ chối...' : 'Không duyệt'}
          </button>
        </div>

        {updateMessage && <p className="update-message">{updateMessage}</p>}

      </div>
    </div>
  );
};

export default AdminRecipeDetailApprovalPage; 