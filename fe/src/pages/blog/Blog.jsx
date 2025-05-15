import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
import './Blog.scss';

const blogPosts = [
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: 'Crochet Projects for Noodle Lovers',
    desc: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim',
    author: {
      name: 'Wade Warren',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    date: '12 November 2021',
  },
  {
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    title: '10 Vegetarian Recipes To Eat This Month',
    desc: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim',
    author: {
      name: 'Robert Fox',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    },
    date: '12 November 2021',
  },
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: 'The Ultimate Guide to Healthy & Nutritious Cooking',
    desc: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim',
    author: {
      name: 'Dianne Russell',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    date: '12 November 2021',
  },
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    title: 'Simple & Delicious Vegetarian Lasagna',
    desc: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim',
    author: {
      name: 'Leslie Alexander',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    },
    date: '12 November 2021',
  },
  {
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
    title: 'Plantain and Pinto Stew with Aji Verde',
    desc: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim',
    author: {
      name: 'Courtney Henry',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    date: '12 November 2021',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'Were Hiring a Communications Assistant!',
    desc: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim',
    author: {
      name: 'Albert Flores',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    date: '12 November 2021',
  },
];

const tastyRecipes = [
  {
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80',
    title: 'Chicken Meatballs with Cream Cheese',
    author: 'Andreas Paula',
  },
  {
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80',
    title: 'Traditional Bolognaise Ragu',
    author: 'Andreas Paula',
  },
  {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80',
    title: 'Pork and Chive Chinese Dumplings',
    author: 'Andreas Paula',
  },
];

const Blog = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
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
            {filteredPosts.map((post, idx) => (
              <div className="blog-card" key={idx} onClick={() => navigate('/blog-detail', { state: { post } })} style={{cursor: 'pointer'}} >
                <img className="blog-card-img" src={post.image} alt={post.title} loading="lazy" />
                <div className="blog-card-info">
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-desc">{post.desc}</p>
                  <div className="blog-card-meta">
                    <img className="blog-card-avatar" src={post.author.avatar} alt={post.author.name} loading="lazy" />
                    <span className="blog-card-author">{post.author.name}</span>
                    <span className="blog-card-dot">•</span>
                    <span className="blog-card-date">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="blog-side">
            <div className="tasty-recipes">
              <h2 className="tasty-title">Tasty Recipes</h2>
              <div className="tasty-list">
                {tastyRecipes.map((r, idx) => (
                  <div className="tasty-item" key={idx}>
                    <img className="tasty-img" src={r.image} alt={r.title} loading="lazy" />
                    <div className="tasty-info">
                      <div className="tasty-recipe-title">{r.title}</div>
                      <div className="tasty-recipe-author">By {r.author}</div>
                    </div>
                  </div>
                ))}
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
