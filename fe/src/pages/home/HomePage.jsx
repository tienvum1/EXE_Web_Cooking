import React from 'react';
import Header from '../../components/header/Header';
import SearchBar from '../../components/search/SearchBar';
import Categories from '../../components/category/Categories';
import WellnessChef from '../../components/wellnessChef/WellnessChef';
import InstagramFeed from '../../components/instagramFeed/InstagramFeed';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import LatestRecipes from './LatestRecipes';
import FeaturedRecipes from './FeaturedRecipes';

const HomePage = () => (
  <div >
    <Header />
    <main style={{maxWidth: '95%', margin: '0 auto', padding: '0px 10px '}}>
      <SearchBar />
      <Categories />
      <LatestRecipes />
      <FeaturedRecipes />
      <WellnessChef />
      <InstagramFeed />
    </main>
    <Sidebar />
    <Footer />
  </div>
);

export default HomePage; 