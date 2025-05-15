import React from 'react';
import './Banner.scss';

const BANNER_CONTENT = {
  tag: {
    icon: '🌶️',
    text: 'Hot Recipes',
  },
  title: 'Fresh Green Vegetable Salad',
  description:
    'Fresh Green Vegetable Salad is the perfect combination of fiber-rich vegetables and natural sauces to aid digestion and help you stay fit.',
  info: [
    { icon: 'fa fa-clock', text: '30 Minutes' },
    { icon: 'fa fa-utensils', text: 'Chicken' },
  ],
  author: {
    name: 'John Smith',
    date: '15 January 2025',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  button: {
    text: 'View Recipes',
    icon: '➔',
  },
  image: {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Salad',
  },
  badge: {
    text: '👍 Handpicked Recipes',
  },
};

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner__content">
        <div className="banner__tag">
          <span role="img" aria-label="hot">
            {BANNER_CONTENT.tag.icon}
          </span>
          {BANNER_CONTENT.tag.text}
        </div>

        <h1 className="banner__title">{BANNER_CONTENT.title}</h1>

        <p className="banner__desc">{BANNER_CONTENT.description}</p>

        <div className="banner__info">
          {BANNER_CONTENT.info.map((item, index) => (
            <span key={index}>
              <i className={item.icon}></i> {item.text}
            </span>
          ))}
        </div>

        <div className="banner__author">
          <img src={BANNER_CONTENT.author.image} alt="Author" />
          <div>
            <div className="banner__author-name">{BANNER_CONTENT.author.name}</div>
            <div className="banner__author-date">{BANNER_CONTENT.author.date}</div>
          </div>
        </div>

        <button className="banner__btn">
          {BANNER_CONTENT.button.text} <span>{BANNER_CONTENT.button.icon}</span>
        </button>
      </div>

      <div className="banner__image-wrapper">
        <img
          src={BANNER_CONTENT.image.src}
          alt={BANNER_CONTENT.image.alt}
          className="banner__image"
        />
        <div className="banner__badge">{BANNER_CONTENT.badge.text}</div>
      </div>
    </section>
  );
};

export default Banner;