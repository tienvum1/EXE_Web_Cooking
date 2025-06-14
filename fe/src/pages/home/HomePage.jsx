import React from 'react';
import Header from '../../components/header/Header';
import SearchBar from '../../components/search/SearchBar';
import Categories from '../../components/category/Categories';
import WellnessChef from '../../components/wellnessChef/WellnessChef';
import InstagramFeed from '../../components/InstagramFeed/InstagramFeed.jsx';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import LatestRecipes from './LatestRecipes';
import FeaturedRecipes from './FeaturedRecipes';
import ChatBot from '../../components/sidebar/ChatBot';


const HomePage = () => (
  <div>
    <Header />
    <main style={{maxWidth: '95%', margin: '0 auto', padding: '0px 10px '}}>
      <div style={{textAlign: 'center', margin: '32px 0 16px 0'}}>
        <h1 style={{fontSize: '2.2rem', fontWeight: 700, marginBottom: 8, color: '#3DD056'}}>Chào mừng bạn đến với FitMeal!</h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#455a64',
          maxWidth: 1000,
          margin: '0 auto',
          lineHeight: 1.6,
          fontWeight: 500,
          borderRadius: '10px',
          padding: '14px 16px',
    
        }}>
          <span role="img" aria-label="chef" style={{fontSize: '1.2em'}}>👨‍🍳</span>
          <span style={{marginLeft: 8}}>
            Khám phá, lưu lại và chia sẻ công thức nấu ăn ngon cùng cộng đồng <b>FitMeal</b>!
          </span>
        </p>
      </div>
      <SearchBar />
      <Categories />
      <LatestRecipes />
      <FeaturedRecipes />
      <WellnessChef />
      <InstagramFeed />
    </main>
    <ChatBot />
    <Sidebar />
    <Footer />
  </div>
);

export default HomePage; 