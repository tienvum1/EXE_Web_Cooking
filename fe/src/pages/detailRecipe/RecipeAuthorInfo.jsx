import React from 'react';
import './RecipeAuthorInfo.scss';

const RecipeAuthorInfo = ({
  avatar,
  name,
  username,
  time,
  location,
  description
}) => {
  return (
    <div className="recipe-author-info">
      <h2 className="recipe-author-title">Viết bởi</h2>
      <div className="recipe-author-main">
        <img
          className="recipe-author-avatar"
          src={avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt={name || 'Ẩn danh'}
        />
        <div className="recipe-author-meta">
          <div>
            <span className="recipe-author-name">{name || 'Ẩn danh'}</span>
            {username && <span className="recipe-author-username">{username}</span>}
          </div>
          <div className="recipe-author-time">
            {time && <span>{time}</span>}
            {location && (
              <span className="recipe-author-location">
                <i className="fas fa-map-marker-alt" style={{ marginRight: 4 }}></i>
                {location}
              </span>
            )}
          </div>
          <button className="recipe-author-friend-btn">Kết Bạn Bếp</button>
        </div>
      </div>
      <div className="recipe-author-desc">{description || 'Chưa có mô tả.'}</div>
    </div>
  );
};

export default RecipeAuthorInfo;