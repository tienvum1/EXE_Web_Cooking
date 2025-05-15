import React, { useState } from 'react';
import './RecipeCard.scss';

const RecipeCard = ({ image, title, time, type, author }) => {
  const [liked, setLiked] = useState(false);
  const toggleLike = () => setLiked(!liked);

  return (
    <div className="recipe-card">
      <div className="recipe-card__image-box">
        <img src={image} alt={title} className="recipe-card__image" />
        <button
          className={`recipe-card__like ${liked ? 'liked' : ''}`}
          onClick={toggleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <i className="fas fa-heart" />
        </button>
      </div>

      <div className="recipe-card__content">
        <h3 className="recipe-card__title">{title}</h3>

        <div className="recipe-card__info">
          <span><i className="far fa-clock" /> {time}</span>
          <span><i className="fas fa-utensils" /> {type}</span>
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
