import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { getUserWithRecipes, getCurrentUser, updateUserProfile } from '../../api/user';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

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
        if (data) {
          setFormData({
            username: data.username || '',
            fullName: data.fullName || '',
          });
        }
      } catch (err) {
        setError('Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    try {
      // Call backend API to update user profile
      // Create a new object with only allowed fields for update
      const dataToUpdate = {
        fullName: formData.fullName,
        // Add other fields here if you add them to the form (e.g., bio, introduce)
      };
      const updatedUser = await updateUserProfile(user._id, dataToUpdate); // Call the API with user ID and filtered form data
      setUser(updatedUser); // Update user state with the response
      setIsEditing(false);
    } catch (saveError) {
      console.error('Error saving profile:', saveError);
      // Optionally, display an error message to the user
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="profile-page">
        {isEditing ? (
          <div className="edit-profile-form">
            <h2>Chỉnh sửa thông tin cá nhân</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fullName">Họ và Tên:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
          </div>
        ) : (
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
                {/* Display count of users this user is following */}
                <b>{user.following?.length || 0}</b> Đang theo dõi
              </span>
              <span>
                {/* Display count of users following this user */}
                <b>{user.followers?.length || 0}</b> Người theo dõi
              </span>
            </div>
            <button className="edit-btn" onClick={handleEditClick}>Sửa thông tin cá nhân</button>
          </div>
        )}

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
                mainImage={recipe.mainImage}
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