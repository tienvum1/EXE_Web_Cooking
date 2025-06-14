import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RecipeComments.module.scss';


const RecipeComments = ({ recipeId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Lấy user hiện tại (nếu có)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('https://exe-web-cooking.onrender.com/api/users/me', { withCredentials: true });
        setUserId(res.data._id);
        setCurrentUser(res.data);
      } catch {
        setUserId(null);
        setCurrentUser(null);
      }
    };
    fetchMe();
  }, []);

  // Lấy danh sách bình luận
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`https://exe-web-cooking.onrender.com/api/comments/${recipeId}`);
        setComments(res.data);
      } catch {
        setError('Không thể tải bình luận');
      } finally {
        setLoading(false);
      }
    };
    if (recipeId) fetchComments();
  }, [recipeId]);

  // Thêm bình luận
  const handleSend = async () => {
    if (comment.trim() === '') return;
    try {
      const res = await axios.post('https://exe-web-cooking.onrender.com/api/comments/add', { recipeId, content: comment }, { withCredentials: true });
      setComments(prev => [res.data, ...prev]);
      setComment('');
    } catch {
      alert('Vui lòng đăng nhập để bình luận!');
    }
  };

  // Xóa bình luận
  const handleDelete = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await axios.delete(`https://exe-web-cooking.onrender.com/api/comments/${commentId}`, { withCredentials: true });
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {
      alert('Không thể xóa bình luận!');
    }
  };

  return (
    <div className={styles.commentWrapper}>
      <h2 className={styles.title}>Bình luận</h2>
      <div className={styles.inputWrapper}>
        <div className={styles.avatar}>
          {currentUser?.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.username} 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <img 
              src={'data:image/png;base64,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'} 
              alt="Default avatar" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          )}
        </div>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Thêm bình luận"
          className={styles.input}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button onClick={handleSend} className={styles.sendButton} aria-label="Gửi bình luận">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      {loading && <div>Đang tải bình luận...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className={styles.commentList}>
        {comments.map((c) => (
          <div key={c._id} className={styles.commentItem}>
            <div className={styles.avatarSmall}>
              {c.user?.avatar ? (
                <img 
                  src={c.user.avatar} 
                  alt={c.user.username} 
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <img 
                  src={'data:image/png;base64,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'} 
                  alt="Default avatar" 
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                />
              )}
            </div>
            <div style={{flex: 1}}>
              <div className={styles.commentHeader}>
                {c.user?.username || 'Ẩn danh'}
                <span className={styles.commentTime}>{new Date(c.createdAt).toLocaleString('vi-VN')}</span>
                {userId && c.user?._id === userId && (
                  <button
                    style={{ color: '#f44336', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, marginLeft: 8 }}
                    onClick={() => handleDelete(c._id)}
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div className={styles.commentContent}>{c.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeComments;
