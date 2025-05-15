import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.scss';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="footer__brand">
        <h2 className="footer__logo">FitMeal</h2>
        <p className="footer__slogan">The Perfect Combination of Taste & Health</p>
      </div>
      <nav className="footer__nav">
        <a href="#recipes">Recipes</a>
        <a href="#blog">Blog</a>
        <a href="#contact">Contact</a>
        <a href="#about">About us</a>
      </nav>
    </div>

    <div className="footer__bottom">
      <div></div> {/* để trống bên trái */}
      <div className="footer__social">
        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
