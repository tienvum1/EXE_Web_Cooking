import React from 'react';
import { FaRegClock, FaUtensils, FaUser, FaBookmark } from 'react-icons/fa';
import './RecipeInfoCard.scss';
import { useNavigate } from 'react-router-dom';

const RecipeInfoCard = ({ recipe }) => {
  const navigate = useNavigate();
  if (!recipe) return null;
  const { _id, mainImage, title, time, type, author, desc, savedAt } = recipe;

  // Lấy tên tác giả phù hợp
  let authorName = '';
  if (author) {
    if (typeof author === 'object' && author.username) {
      authorName = author.username;
    } else if (typeof author === 'string') {
      authorName = author;
    }
  }

  // Format the saved date
  const formattedSavedDate = savedAt ? new Date(savedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).replace('tháng', 'Tháng') : '';

  return (
    <div className="recipe-info-card" onClick={() => navigate(`/detail-recipe/${_id}`)}>
      <div className="recipe-info-card__img-box">
        <img src={mainImage} alt={title} className="recipe-info-card__img" />
      </div>
      <div className="recipe-info-card__content">
        <h3 className="recipe-info-card__title">{title}</h3>
        {desc && <p className="recipe-info-card__description">{desc}</p>}
        {authorName && (
          <div className="recipe-info-card__author">
            <FaUser className="recipe-info-card__author-icon" />
            <span>{authorName}</span>
          </div>
        )}
        {formattedSavedDate && <div className="recipe-info-card__saved-date">Đã lưu ngày {formattedSavedDate}</div>}
        <FaBookmark className="recipe-info-card__bookmark-icon" />
      </div>
    </div>
  );
};

export default RecipeInfoCard; 