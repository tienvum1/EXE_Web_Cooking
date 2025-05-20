import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.scss';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { getBlogById } from '../../api/blog';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        setError('Không tìm thấy bài viết.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!blog) return null;

  return (
    <>
      <Header />
      <div className="blog-detail-wrapper">
        <div className="blog-detail-container">
          <button className="blog-detail-back" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <div className="blog-detail-header">
            <h1 className="blog-detail-title">{blog.title}</h1>
            <div className="blog-detail-meta">
              <div className="blog-detail-author-info">
                <img className="blog-detail-avatar" src={blog.authorAvatar} alt={blog.authorName} />
                <div>
                  <span className="blog-detail-author">{blog.authorName}</span>
                  <span className="blog-detail-date">{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            <div className="blog-detail-desc">{blog.desc}</div>
          </div>
          <div className="blog-detail-image">
            <img src={blog.image} alt={blog.title} />
          </div>
          <div className="blog-detail-content">
            {blog.sections && blog.sections.map((section, idx) => (
              <section className="blog-detail-section" key={idx}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}
            {blog.quote && (
              <blockquote className="blog-detail-quote">
                <span className="quote-icon">“</span>
                {blog.quote}
                <span className="quote-icon">”</span>
              </blockquote>
            )}
          </div>
          <div className="blog-detail-share">
            <span className="blog-detail-share-label">Chia sẻ bài viết:</span>
            <div className="blog-detail-share-icons">
              <a href="#" title="Chia sẻ Facebook" className="blog-detail-share-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" title="Chia sẻ Twitter" className="blog-detail-share-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" title="Chia sẻ Instagram" className="blog-detail-share-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showUserInfo && user && (
        <div className="header__user-popup" onClick={() => setShowUserInfo(false)}>
          <div className="header__user-popup-content" onClick={e => e.stopPropagation()}>
            <img className="header__user-popup-avatar" src={user.avatar} alt={user.fullName || user.username} />
            <div className="header__user-popup-name">{user.fullName || user.username}</div>
            <div className="header__user-popup-username">@{user.username}</div>
            <div className="header__user-popup-email">{user.email}</div>
            {user.bio && <div className="header__user-popup-bio">{user.bio}</div>}
            <button onClick={() => { setShowUserInfo(false); navigate('/profile'); }}>Trang cá nhân</button>
            <button onClick={() => { setShowUserInfo(false); navigate('/settings'); }}>Cài đặt</button>
            <button className="logout-btn">Đăng xuất</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogDetail;