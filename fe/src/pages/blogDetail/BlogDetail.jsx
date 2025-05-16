import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BlogDetail.scss';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

const BlogDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  if (!post) {
    navigate('/blog');
    return null;
  }

  return (
    <>
    <Header />
    <div className="blog-detail-container">
      {/* Title on top */}
      <h1 className="blog-detail-title">{post.title}</h1>
      {/* Header */}
      <div className="blog-detail-header blog-detail-header--centered">
        <img className="blog-detail-avatar blog-detail-avatar--large" src={post.author.avatar} alt={post.author.name} />
        <div className="blog-detail-meta">
          <div className="blog-detail-author blog-detail-author--main">{post.author.name}</div>
          <div className="blog-detail-date blog-detail-date--main">{post.date}</div>
        </div>
      </div>
      {/* Description */}
      <div className="blog-detail-desc blog-detail-desc--highlight">{post.desc}</div>
      {/* Main Image */}
      <img className="blog-detail-mainimg blog-detail-mainimg--large" src={post.image} alt={post.title} />
      {/* Section 1 + Share */}
      <div className="blog-detail-flex-row">
        <div className="blog-detail-section blog-detail-section--grow">
          <h2>Why is healthy cooking important?</h2>
          <p>Healthy cooking helps provide adequate nutrients for the body, improve health, maintain a reasonable weight and reduce the risk of diseases such as cardiovascular disease, diabetes or obesity.</p>
        </div>
        <div className="blog-detail-share blog-detail-share--side">
          <span>SHARE THIS ON:</span>
          <div className="blog-detail-share__links">
            <a href="#"><i className="fab fa-facebook-f" /></a>
            <a href="#"><i className="fab fa-twitter" /></a>
            <a href="#"><i className="fab fa-instagram" /></a>
          </div>
        </div>
      </div>
      {/* Section 2 */}
      <div className="blog-detail-section">
        <h2>What are the basic principles of healthy cooking?</h2>
        <ul>
          <li>Use fresh, organic ingredients when possible.</li>
          <li>Practice a workout regimen and prepare variations.</li>
          <li>Prioritize low-fat cooking methods such as steaming, poaching, and baking.</li>
          <li>Balance protein, fiber, and good fats.</li>
        </ul>
      </div>
      {/* Section 3 */}
      <div className="blog-detail-section">
        <h2>How to keep the taste delicious and still healthy?</h2>
        <img className="blog-detail-mainimg blog-detail-mainimg--medium" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" alt="healthy cooking" />
        <p>
          Using natural spices such as lime, ginger, turmeric, pepper or herbs like basil and rosemary enhances flavor without excess salt or fat. Changing cooking methods like baking or grilling helps preserve both taste and nutrition.
        </p>
      </div>
      {/* Section 4 */}
      <div className="blog-detail-section">
        <h2>What foods should be included in your daily meals?</h2>
        <ul>
          <li>Colorful vegetables to provide vitamins and fiber.</li>
          <li>Healthy fats from avocados, nuts, olive oil.</li>
          <li>Protein from lean meat, fish, eggs, or plant-based sources like beans and legumes.</li>
          <li>Whole grains such as brown rice, oats, and sweet potatoes.</li>
        </ul>
      </div>
      {/* Quote */}
      <blockquote className="blog-detail-quote blog-detail-quote--highlight">
        Healthy eating is not about restriction, but about nourishing your body with balanced, natural, and wholesome foods for a vibrant and energetic life.
      </blockquote>
      {/* Section 5 */}
      <div className="blog-detail-section">
        <h2>How to maintain healthy eating habits long term?</h2>
        <p>
          Start with small changes like replacing unhealthy snacks with fruit, drinking enough water every day, and cooking more at home. Planning meals ahead and exploring new recipes makes it easier to maintain a healthy lifestyle!
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default BlogDetail;
