import React from 'react';
import Header from '../../components/header/Header';
import Hero from '../../components/banner/Banner';
import SearchBar from '../../components/search/SearchBar';
import Categories from '../../components/category/Categories';
import RecipesGrid from '../../components/recipeGird/RecipesGrid';

import SpecialRecipes from '../../components/SpecialRecipes';
import WellnessChef from '../../components/wellnessChef/WellnessChef';
import InstagramFeed from '../../components/instagramFeed/InstagramFeed';
import Subscribe from '../../components/subscribe/Subscribe';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';

const HomePage = () => (
  <div >
    <Header />
    <main style={{maxWidth: '95%', margin: '0 auto', padding: '0px 10px '}}>
      <Hero />
      <SearchBar />
      <Categories />
      <RecipesGrid />
      <SpecialRecipes />
      <WellnessChef />
      <InstagramFeed />
      <Subscribe />
    </main>
    <Sidebar />
    <Footer />
  </div>
);

export default HomePage; 