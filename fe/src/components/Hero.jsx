import React from 'react';
import './Hero.scss';

const Hero = () => (
  <section className="hero">
    <div className="hero__left">
      <div className="hero__tag">
        <span className="icon">🌶️</span>
        Hot Recipes
      </div>

      <h1 className="hero__title">
        Fresh Green <br /> Vegetable Salad
      </h1>

      <p className="hero__desc">
        Fresh Green Vegetable Salad is the perfect combination of fresh, fiber-rich green vegetables and natural sauces to help balance nutrition, aid digestion, and keep fit effectively.
      </p>

      <div className="hero__info">
        <span><i className="fa fa-clock"></i> 30 Minutes</span>
        <span><i className="fa fa-utensils"></i> Chicken</span>
      </div>

      <div className="hero__author">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Smith" />
        <div>
          <div className="hero__author-name">John Smith</div>
          <div className="hero__author-date">15 January 2025</div>
        </div>
      </div>

      <button className="hero__button">
        View Recipes <span className="arrow">➔</span>
      </button>
    </div>

    <div className="hero__right">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
        alt="Fresh green salad"
        className="hero__img-bg"
      />
      <div className="hero__badge">👍 HANDPICKED RECIPES</div>
    </div>
  </section>
);

export default Hero;
