import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
import { getAllBlogs } from '../../api/blog';
import { fetchMostLikedRecipes } from '../../api/recipe';
import Sidebar from '../../components/sidebar/Sidebar';
import './Blog.scss';

const Blog = () => {
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [tastyRecipes, setTastyRecipes] = useState([]);
  const [tastyLoading, setTastyLoading] = useState(true);
  const [tastyError, setTastyError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Không thể tải danh sách blog.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const getTastyRecipes = async () => {
      setTastyLoading(true);
      setTastyError('');
      try {
        const data = await fetchMostLikedRecipes();
        const mappedRecipes = data.map(r => ({
          _id: r._id,
          image: r.mainImage || '',
          title: r.title,
          authorName: r.author?.username || 'Ẩn danh',
        }));
        setTastyRecipes(mappedRecipes);
      } catch (err) {
        setTastyError('Không thể tải danh sách công thức nổi bật.');
        console.error('Failed to fetch most liked recipes:', err);
      } finally {
        setTastyLoading(false);
      }
    };
    getTastyRecipes();
  }, []);

  const filteredPosts = blogs.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <div className="blog-main-container">
        <h1 className="blog-title">Blog & Article</h1>
        <p className="blog-desc"> Explore the world of healthy eating, tasty recipes, and expert tips to elevate your cooking skills.</p>
        <form className="blog-search-bar" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search article, news or recipe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="blog-content-layout">
          <div className="blog-list">
            {loading && <div>Đang tải...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && !error && filteredPosts.map((post, idx) => (
              <div className="blog-card" key={post._id || idx} onClick={() => navigate(`/blog-detail/${post._id}`)} style={{cursor: 'pointer'}} >
                <img className="blog-card-img" src={post.image} alt={post.title} loading="lazy" />
                <div className="blog-card-info">
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-desc">{post.desc}</p>
                  <div className="blog-card-meta">
                    <img className="blog-card-avatar" src={post.authorAvatar} alt={post.authorName} loading="lazy" />
                    <span className="blog-card-author">{post.authorName}</span>
                    <span className="blog-card-dot">•</span>
                    <span className="blog-card-date">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="blog-side">
            <div className="tasty-recipes">
              <h2 className="tasty-title">Tasty Recipes</h2>
              <div className="tasty-list">
                {tastyLoading && <div>Đang tải công thức nổi bật...</div>}
                {tastyError && <div style={{ color: 'red' }}>{tastyError}</div>}
                {!tastyLoading && !tastyError && tastyRecipes.map((r, idx) => (
                  <div className="tasty-item" key={r._id || idx} onClick={() => navigate(`/recipe/${r._id}`)} style={{cursor: 'pointer'}}>
                    <img className="tasty-img" src={r.image} alt={r.title} loading="lazy" />
                    <div className="tasty-info">
                      <div className="tasty-recipe-title">{r.title}</div>
                      <div className="tasty-recipe-author">By {r.authorName || 'Unknown Author'}</div>
                    </div>
                  </div>
                ))}
                {!tastyLoading && !tastyError && tastyRecipes.length === 0 && (
                    <div>Không tìm thấy công thức nổi bật nào.</div>
                )}
              </div>
            </div>
            <div className="blog-banner">
              <img className="banner-img" src={logo} alt="healthy food" loading="lazy" />
            </div>
          </div>
        </div>
        <div className="blog-pagination">
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn">5</button>
          <span className="page-dots">...</span>
          <button className="page-btn">›</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
