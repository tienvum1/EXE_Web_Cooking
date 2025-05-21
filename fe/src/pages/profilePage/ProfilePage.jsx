import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { getUserWithRecipes, getCurrentUser } from '../../api/user';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        let userId = id;
        if (!userId) {
          const currentUser = await getCurrentUser();
          userId = currentUser?._id;
        }
        if (!userId) {
          setError('Không tìm thấy user.');
          setLoading(false);
          return;
        }
        const data = await getUserWithRecipes(userId);
        setUser(data);
      } catch (err) {
        setError('Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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