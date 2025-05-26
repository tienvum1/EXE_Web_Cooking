import React from 'react';
import { FaRegClock, FaUtensils, FaUser } from 'react-icons/fa';
import './RecipeInfoCard.scss';
import { useNavigate } from 'react-router-dom';

const RecipeInfoCard = ({ recipe }) => {
  const navigate = useNavigate();
  if (!recipe) return null;
  const { _id, image, title, time, type, author } = recipe;

  // Lấy tên tác giả phù hợp
  let authorName = '';
  if (author) {
    if (typeof author === 'object' && author.username) {
      authorName = author.username;
    } else if (typeof author === 'string') {
      authorName = author;
    }
  }

  return (
    <div className="recipe-info-card">
      <div className="recipe-info-card__img-box">
        <img src={image} alt={title} className="recipe-info-card__img" />
      </div>
      <div className="recipe-info-card__content">
        <h3 className="recipe-info-card__title">{title}</h3>
        <div className="recipe-info-card__meta">
          <span><FaRegClock /> {time}</span>
          <span><FaUtensils /> {type}</span>
        </div>
        {authorName && (
          <div className="recipe-info-card__author">
            <FaUser className="recipe-info-card__author-icon" />
            <span>{authorName}</span>
          </div>
        )}
        <button className="recipe-info-card__btn" onClick={() => navigate(`/detail-recipe/${_id}`)}>
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default RecipeInfoCard; 