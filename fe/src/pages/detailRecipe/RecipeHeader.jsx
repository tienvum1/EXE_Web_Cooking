import React, { useState } from 'react';
import { FaRegClock, FaDrumstickBite, FaRegSave, FaShareAlt, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import './RecipeHeader.scss';

const RecipeHeader = ({ title, user, prepTime, cookTime }) => {
  const [saved, setSaved] = useState(false);
  const handleSave = () => setSaved(!saved);

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
          <div className="item"><FaRegClock /> <span>Prep:</span> {prepTime}</div>
          <div className="item"><FaRegClock /> <span>Cook:</span> {cookTime}</div>
          <div className="item"><FaDrumstickBite /> <span>Beef</span></div>
        </div>

        <div className="actions">
          <button className="btn"><FaRegSave /><span>Save</span></button>
          <button className="btn"><FaShareAlt /><span>Share</span></button>
          <button
            className={saved ? 'btn saved-btn' : 'btn save-btn'}
            onClick={handleSave}
            aria-label={saved ? 'Bỏ lưu món' : 'Lưu món'}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
            <span>{saved ? 'Đã lưu' : 'Lưu món'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;
