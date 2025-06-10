import React, { useState, useEffect, useContext } from 'react';
import { FaRegClock, FaDrumstickBite, FaRegSave, FaShareAlt, FaRegBookmark, FaBookmark, FaDonate,FaUtensils, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import './RecipeHeader.scss';
import DonateModal from './DonateModal';
import RecipeContext from '../../contexts/RecipeContext';

const RecipeHeader = ({ title, user, prepTime, cookTime, recipeId,categories }) => {
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [donateMsg, setDonateMsg] = useState('');
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateResult, setDonateResult] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  const { isRecipeAuthor, handleEditRecipe, handleDeleteRecipe } = useContext(RecipeContext);

  const handleDownloadPdf = async () => {
    if (!recipeId) return;
    try {
      const response = await axios.get(`https://localhost:4567/api/recipes/${recipeId}/pdf`, {
        responseType: 'blob',
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title || 'recipe'}.pdf`);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Lỗi khi tải xuống PDF. Vui lòng thử lại.');
    }
  };

  const handleShare = async () => {
    try {
      // Lấy URL hiện tại
      const currentUrl = window.location.href;
      
      // Thử sử dụng Web Share API nếu trình duyệt hỗ trợ
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: currentUrl
        });
      } else {
        // Nếu không hỗ trợ Web Share API, copy URL vào clipboard
        await navigator.clipboard.writeText(currentUrl);
        setShareSuccess(true);
        // Reset trạng thái sau 2 giây
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      alert('Không thể chia sẻ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="recipe-header">
      <h1 className="recipe-title">{title}</h1>

      <div className="recipe-meta">
        <div className="user-info">
          <img className="avatar" src={user.avatar} alt={user.name} />
          <div className="user-details">
            <div className="name">{user.name}</div>
            <div className="date">{user.date}</div>
          </div>
        </div>

        <div className="time-info">
          <div className="item"><FaRegClock /> <span>Cook:</span> {cookTime}</div>
          <div className="item"><FaUtensils />
            {
              categories && Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category, index) => (
                  <span key={index} className="category-tag">
                    {category}{index < categories.length - 1 ? ', ' : ''}
                  </span>
                ))
              ) : (
                <span>N/A</span>
              )
            }
          </div>
        </div>

        <div className="actions">
          <button
            className={'btn download-pdf-btn'}
            onClick={handleDownloadPdf}
            aria-label={'Tải xuống PDF'}
          >
            <FaDownload />
            <span>Tải xuống PDF</span>
          </button>
          <button 
            className={`btn ${shareSuccess ? 'success' : ''}`} 
            onClick={handleShare}
            aria-label={'Chia sẻ công thức'}
          >
            <FaShareAlt />
            <span>{shareSuccess ? 'Đã sao chép!' : 'Chia sẻ'}</span>
          </button>
          <button className="btn donate-btn" onClick={() => setShowDonate(true)}><FaDonate /><span>Donate</span></button>

          {isRecipeAuthor && (
            < >
              <button className="btn edit-recipe-btn" onClick={handleEditRecipe}>Sửa</button>
              <button className="btn delete-recipe-btn" onClick={handleDeleteRecipe}>Xóa</button>
            </>
          )}
        </div>
      </div>

      <DonateModal
        open={showDonate}
        onClose={() => setShowDonate(false)}
        recipeId={recipeId}
      />
    </div>
  );
};

export default RecipeHeader;
