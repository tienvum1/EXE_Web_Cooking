import React from 'react';
import './Subscribe.scss';
import subscribeImage from '../../assets/images/sub.png';

const Subscribe = () => {
  return (
    <section
      className="subscribe"
      style={{ backgroundImage: `url(${subscribeImage})` }}
    >
      <div className="subscribe__overlay">
        <div className="subscribe__content">
          <h2 className="subscribe__title">Deliciousness to your inbox</h2>
          <p className="subscribe__desc">
            Love eating healthy but need fresh ideas? Subscribe now and get nutritious, delicious, and easy-to-make recipes sent straight to your inbox!
          </p>

          <form className="subscribe__form">
            <input
              type="email"
              placeholder="Your email address..."
              className="subscribe__input"
            />
            <button type="submit" className="subscribe__button">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
