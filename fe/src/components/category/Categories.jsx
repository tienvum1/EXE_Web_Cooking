import React from 'react';
import categories from './categoriesData';
import CategoryCard from './CategoryCard';
import './Categories.scss';

const Categories = () => (
  <section className="categories">
    <div className="categories__header">
      <h2>Categories</h2>
    </div>
    <div className="categories__list">
      {categories.map(cat => (
        <CategoryCard key={cat.name} icon={cat.icon} name={cat.name} />
      ))}
    </div>
  </section>
);

export default Categories; 