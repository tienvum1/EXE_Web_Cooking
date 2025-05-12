import React from 'react';
import Header from './Header';
import Hero from './Hero';
import SearchBar from './SearchBar';
import Categories from './Categories';
import RecipesGrid from './RecipesGrid';
import Footer from './Footer';
import SpecialRecipes from './SpecialRecipes';
import WellnessChefSection from './WellnessChefSection';

const Home = () => (
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

export default Home; 