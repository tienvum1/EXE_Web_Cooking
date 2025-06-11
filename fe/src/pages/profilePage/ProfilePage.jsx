import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { getUserWithRecipes, getCurrentUser, updateUserProfile, followUser, updateUserAvatar } from '../../api/user';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        let userId = id;
        const currentUser = await getCurrentUser();
        let currentUserId = currentUser?._id;

        if (!userId) {
          userId = currentUserId;
        }
        if (!userId) {
          setError('Không tìm thấy user.');
          setLoading(false);
          return;
        }
        const data = await getUserWithRecipes(userId);
        setUser(data);
        const isCurrent = data?._id === currentUserId;
        setIsCurrentUserProfile(isCurrent);

        if (!isCurrent && currentUser?.following) {
          setIsFollowing(currentUser.following.includes(data._id));
        }

        if (data) {
          setFormData({
            username: data.username || '',
            fullName: data.fullName || '',
            introduce: data.introduce || '',
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
        introduce: formData.introduce,
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

  const handleFollowUnfollow = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await followUser(user._id);
        setIsFollowing(false);
      } else {
        await followUser(user._id);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Error following/unfollowing user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (isCurrentUserProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const updatedUser = await updateUserAvatar(formData);
      setUser(updatedUser);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="profile-page">
        {/* Always display profile information */}
        <div className="profile-info">
          <div 
            className={`profile-avatar ${isCurrentUserProfile ? 'editable' : ''}`}
            onClick={handleAvatarClick}
          >
            {uploadingAvatar ? (
              <div className="uploading-spinner">Đang tải lên...</div>
            ) : user.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user.fullName ? user.fullName[0] : user.username[0]}
              </div>
            )}
            {isCurrentUserProfile && (
              <div className="avatar-edit-overlay">
                <i className="fas fa-camera"></i>
                <span>Thay đổi ảnh</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="name">{user.fullName || user.username}</div>
          <div className="username">@{user.username}</div>
          <div className="profile-introduce" style={{ marginTop: '10px' }}>  {user.introduce}</div>
          <div className="profile-stats">
            <span>
              <b>{user.following?.length || 0}</b> Đang theo dõi
            </span>
            <span>
              <b>{user.followers?.length || 0}</b> Người theo dõi
            </span>
          </div>
          {/* Conditionally render Edit button */}
          {isCurrentUserProfile && !isEditing && (
            <button className="edit-btn" onClick={handleEditClick}>Sửa thông tin cá nhân</button>
          )}
          {/* Conditionally render Follow/Unfollow button */}
          {!isCurrentUserProfile && user && (
            <button
              className={isFollowing ? 'follow-btn unfollow' : 'follow-btn follow'}
              onClick={handleFollowUnfollow}
              disabled={loading}
            >
              {isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
            </button>
          )}
        </div>

        {/* Conditionally render Edit form */}
        {isCurrentUserProfile && isEditing && (
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
              <div className="form-group" style={{ fontSize: '18px' ,marginBottom: '20px'}}>
                <label htmlFor="introduce" >Giới thiệu:</label>
                <textarea
                  id="introduce"
                  name="introduce"
                  value={formData.introduce || ''}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
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
                id={recipe._id}
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