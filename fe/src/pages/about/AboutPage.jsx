import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AboutPage.scss';
import teamImg from '../../assets/images/wellnessChef.png'; // Use your own team image if available

const AboutPage = () => (
  <>
    <Header />
    <div className="about-container">
      <h1 className="about-title">About FitMeal</h1>
      <p className="about-desc">
        Welcome to <b>FitMeal</b> – your trusted companion on the journey to a healthier, happier, and more delicious life! We believe that every meal is an opportunity to nourish your body, connect with loved ones, and celebrate the joy of cooking.
      </p>

      <div className="about-section about-mission">
        <h2>Our Mission</h2>
        <p>
          At FitMeal, our mission is to inspire and empower people everywhere to embrace healthy eating habits and discover the pleasure of home-cooked meals. We strive to make nutritious cooking accessible, enjoyable, and rewarding for everyone – from busy professionals to passionate home chefs and families of all sizes.
        </p>
        <p>
          We are committed to building a vibrant community where members can share recipes, exchange experiences, and support each other in making positive lifestyle changes. Together, we can create a world where healthy eating is not a challenge, but a joyful and sustainable way of life.
        </p>
      </div>

      <div className="about-section about-values">
        <h2>Our Core Values</h2>
        <ul>
          <li>
            <b>Community:</b> We believe in the power of sharing and learning from one another. Every recipe, tip, and story helps us grow stronger together.
          </li>
          <li>
            <b>Creativity:</b> We encourage experimentation in the kitchen and celebrate the diversity of flavors, cultures, and traditions that make every meal unique.
          </li>
          <li>
            <b>Wellness:</b> We prioritize health and well-being, promoting balanced nutrition and mindful eating without sacrificing taste or enjoyment.
          </li>
          <li>
            <b>Integrity:</b> We are dedicated to providing reliable, high-quality content and fostering a safe, respectful, and inclusive environment for all.
          </li>
        </ul>
      </div>

      <div className="about-section about-story">
        <h2>Our Story</h2>
        <p>
          FitMeal was born from a simple idea: that healthy eating should be easy, fun, and accessible to everyone. Our founders, a group of food lovers and wellness advocates, saw the need for a platform that not only offers delicious recipes but also supports people in building lasting healthy habits.
        </p>
        <p>
          Since our launch, we have grown into a thriving community of passionate cooks, nutritionists, and everyday heroes who inspire us daily with their creativity and commitment to well-being. We are proud to be part of your journey and grateful for the trust you place in us.
        </p>
      </div>

      <div className="about-section about-team">
        <h2>Meet the FitMeal Team</h2>
        <div className="about-team-flex">
          <img src={teamImg} alt="FitMeal Team" className="about-team-img" />
          <div>
            <p>
              Our team is made up of dedicated professionals with backgrounds in nutrition, culinary arts, technology, and community building. We are united by a shared passion for food, health, and helping others succeed.
            </p>
            <p>
              Every day, we work to bring you new recipes, helpful articles, and innovative features that make healthy cooking easier and more enjoyable. We listen to your feedback and are always looking for ways to improve and grow.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section about-join">
        <h2>Join Us on the Journey</h2>
        <p>
          Whether you are a seasoned chef or just starting out, FitMeal is here to support you every step of the way. Explore our collection of recipes, connect with fellow food enthusiasts, and discover the joy of cooking and eating well.
        </p>
        <p>
          Thank you for being part of the FitMeal family. Together, let’s make every meal a celebration of health, happiness, and community!
        </p>
      </div>
    </div>
    <Footer />
  </>
);

export default AboutPage;