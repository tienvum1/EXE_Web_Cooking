import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeCard.scss';

const RecipeCard = ({ id, mainImage, title, time, author }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to /detail-recipe/:id
    navigate(`/detail-recipe/${id}`);
  };

  return (
    <div className="recipe-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="recipe-card__image-box">
        <img src={mainImage} alt={title} className="recipe-card__image" />
      </div>

      <div className="recipe-card__content">
        <h3 className="recipe-card__title">{title}</h3>

        <div className="recipe-card__info">
          <span>
            <i className="far fa-clock" /> {time} phút
          </span>
        </div>

        {author && (
          <div className="recipe-card__author">
            <i className="fas fa-user recipe-card__author-icon" />
            <span>{author}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;