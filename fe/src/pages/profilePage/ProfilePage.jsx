import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { getUserWithRecipes, getCurrentUser } from '../../api/user';
import './ProfilePage.scss';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Lấy user hiện tại từ cookie
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser._id) {
          setError('Không tìm thấy user.');
          setLoading(false);
          return;
        }
        const data = await getUserWithRecipes(currentUser._id);
        setUser(data);
      } catch (err) {
        setError('Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

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
              user.fullName ? user.fullName[0] : user.username[0]
            )}
          </div>
          <div className="name">{user.fullName || user.username}</div>
          <div className="username">@{user.username}</div>
          <div className="profile-stats">
            <span>
              <b>{user.friends || 0}</b> Bạn Bếp
            </span>
            <span>
              <b>{user.followers || 0}</b> Người quan tâm
            </span>
          </div>
          <button className="edit-btn">Sửa thông tin cá nhân</button>
        </div>

        <div className="recipes-section">
          <div className="recipes-header">
            <i className="fas fa-utensils"></i>
            <span>Các món</span>
            <span className="count">({user.recipes?.length || 0})</span>
          </div>
          <div className="recipes-list">
            {user.recipes && user.recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                image={recipe.mainImage}
                title={recipe.title}
                time={recipe.cookTime}
                type={recipe.type}
                author={user.fullName || user.username}
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