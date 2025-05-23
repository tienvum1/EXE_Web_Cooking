import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RecipeComments.module.scss';

const RecipeComments = ({ recipeId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  // Lấy user hiện tại (nếu có)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:4567/api/users/me', { withCredentials: true });
        setUserId(res.data._id);
      } catch {
        setUserId(null);
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
        const res = await axios.get(`http://localhost:4567/api/comments/${recipeId}`);
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
      const res = await axios.post('http://localhost:4567/api/comments/add', { recipeId, content: comment }, { withCredentials: true });
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
      await axios.delete(`http://localhost:4567/api/comments/${commentId}`, { withCredentials: true });
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {
      alert('Không thể xóa bình luận!');
    }
  };

  return (
    <div className={styles.commentWrapper}>
      <h2 className={styles.title}>Bình luận</h2>
      <div className={styles.inputWrapper}>
        <div className={styles.avatar}>T</div>
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
                <img src={c.user.avatar} alt={c.user.username} style={{ width: 32, height: 32, borderRadius: '50%' }} />
              ) : (
                c.user?.username ? c.user.username[0].toUpperCase() : 'U'
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
