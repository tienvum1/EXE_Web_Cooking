import React from 'react';
import './Header.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => (
  <header className="header">
    <div className="header__container">
      <div className="header__logo"> FitMeal</div>

      <nav className="header__nav">
        <a href="/">Home</a>
        <a href="/recipes">Recipes</a>
        <a href="/blog">Blog</a>
        <a href="/contact">Contact</a>
        <a href="/about">About us</a>
      </nav>

      <div className="header__social">
        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
      </div>
    </div>
  </header>
);

export default Header;
