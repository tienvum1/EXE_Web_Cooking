import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeAuthorInfo.scss';
import { followUser } from '../../api/user';

const RecipeAuthorInfo = ({
  avatar,
  name,
  username,
  time,
  location,
  description,
  authorId
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (authorId) {
      navigate(`/profile/${authorId}`);
    }
  };

  const handleFollow = async () => {
    if (!authorId) {
      console.error("Cannot follow user: authorId is missing.");
      return;
    }
    try {
      const result = await followUser(authorId);
      console.log('Follow user response:', result);
      alert(result.message || 'Theo dõi thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi theo dõi.');
    }
  };

  return (
    <div className="recipe-author-info">
      <h2 className="recipe-author-title" onClick={handleClick} style={{cursor: authorId ? 'pointer' : 'default', color: authorId ? '#2e7d32' : undefined}}>
        Viết bởi
      </h2>
      <div className="recipe-author-main" onClick={handleClick} style={{cursor: authorId ? 'pointer' : 'default'}}>
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
          {authorId && (
            <button className="recipe-author-friend-btn" onClick={handleFollow}>
              Theo dõi
            </button>
          )}
        </div>
      </div>
      <div className="recipe-author-desc">{description || 'Chưa có mô tả.'}</div>
    </div>
  );
};

export default RecipeAuthorInfo;