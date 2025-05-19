import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import './ProfilePage.scss';

const user = {
  name: 'Tiến Vũ',
  username: 'cook_113267840',
  avatar: '',
  friends: 0,
  followers: 0,
  recipes: [
    {
      id: 1,
      title: 'Hi',
      description: 'test',
      image: '',
      time: '30 phút',
      type: 'Món chính',
    },
    // Thêm nhiều món để test grid
  ],
};

const ProfilePage = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="profile-page">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              user.name[0]
            )}
          </div>
          <div className="name">{user.name}</div>
          <div className="username">@{user.username}</div>
          <div className="profile-stats">
            <span>
              <b>{user.friends}</b> Bạn Bếp
            </span>
            <span>
              <b>{user.followers}</b> Người quan tâm
            </span>
          </div>
          <button className="edit-btn">Sửa thông tin cá nhân</button>
        </div>

        <div className="recipes-section">
          <div className="recipes-header">
            <i className="fas fa-utensils"></i>
            <span>Các món</span>
            <span className="count">({user.recipes.length})</span>
          </div>
          <div className="recipes-list">
            {user.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                image={recipe.image}
                title={recipe.title}
                time={recipe.time}
                type={recipe.type}
                author={user.name}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="see-all-btn">Xem tất cả các món</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;