import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeCard.scss';

const RecipeCard = ({ id, image, title, time, type, author }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const toggleLike = () => setLiked(!liked);

  const handleCardClick = () => {
    // Navigate to /detail-recipe/:id
    navigate(`/detail-recipe/${id}`);
  };

  return (
    <div className="recipe-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="recipe-card__image-box">
        <img src={image} alt={title} className="recipe-card__image" />
        <button
          className={`recipe-card__like ${liked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click from firing when clicking the like button
            toggleLike();
          }}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <i className="fas fa-heart" />
        </button>
      </div>

      <div className="recipe-card__content">
        <h3 className="recipe-card__title">{title}</h3>

        <div className="recipe-card__info">
          <span>
            <i className="far fa-clock" /> {time}
          </span>
          <span>
            <i className="fas fa-utensils" /> {type} 
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