import React from 'react';
import './WellnessChef.scss';
import chefImage from '../../assets/images/wellnessChef.png';
import { useNavigate } from 'react-router-dom';

const WellnessChef = () => {
  const navigate = useNavigate();
  return (
    <section className="wellness-chef">
      <div className="wellness-chef__text">
        <h1>
          Everyone can become a wellness chef,
          creating nutritious and healthy meals
          in their own home kitchen.
        </h1>
        <p>
          Fuel your body with wholesome ingredients, embrace a balanced lifestyle,
          and make every meal a step toward better health!
        </p>
        <button className="wellness-chef__btn" onClick={() => navigate('/blog')}>Learn More</button>
      </div>

      <div className="wellness-chef__image-wrapper">
        <img src={chefImage} alt="Wellness Chef" className="wellness-chef__image" />
      </div>
    </section>
  );
};

export default WellnessChef;
