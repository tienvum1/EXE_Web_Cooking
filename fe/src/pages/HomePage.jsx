import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import Categories from './components/Categories';
import RecipesGrid from './components/RecipesGrid';

import SpecialRecipes from './components/SpecialRecipes';
import WellnessChefSection from './components/WellnessChefSection';

const HomePage = () => (
  <div style={{background: '#fafafa'}}>
    <Header />
    <main style={{maxWidth: '95%', margin: '0 auto', padding: '0 10px'}}>
      <Hero />
      <SearchBar />
      <Categories />
      <RecipesGrid />
      <SpecialRecipes />
      <WellnessChefSection />
    </main>
    <Footer />
  </div>
);

export default HomePage; 