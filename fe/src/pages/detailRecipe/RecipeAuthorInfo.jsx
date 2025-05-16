import React from 'react';
import './RecipeAuthorInfo.scss';

const RecipeAuthorInfo = ({
  avatar = 'https://randomuser.me/api/portraits/women/44.jpg',
  name = 'Annie Vo',
  username = '@AnnieVo',
  time = 'vào 30 tháng 4 năm 2025',
  location = 'TPHCM',
  description = 'Mỗi lần vào bếp là mỗi niềm vui'
}) => (
  <div className="recipe-author-info">
    <h2 className="recipe-author-title">Viết bởi</h2>
    <div className="recipe-author-main">
      <img className="recipe-author-avatar" src={avatar} alt={name} />
      <div className="recipe-author-meta">
        <div>
          <span className="recipe-author-name">{name}</span>
          <span className="recipe-author-username">{username}</span>
        </div>
        <div className="recipe-author-time">
          {time}
          <span className="recipe-author-location">
            <i className="fas fa-map-marker-alt" style={{ marginRight: 4 }}></i>
            {location}
          </span>
        </div>
        <button className="recipe-author-friend-btn">Kết Bạn Bếp</button>
      </div>
    </div>
    <div className="recipe-author-desc">{description}</div>
  </div>
);

export default RecipeAuthorInfo;