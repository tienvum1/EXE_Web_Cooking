import React, { useState } from 'react';
import BlogPostItem from './BlogPostItem';

const blogPosts = [
  {
    id: 1,
    title: 'Crochet Projects for Noodle Lovers',
    description: 'Lorem ipsum dolor sit amet, consecteturipisicing elit, sed do eiusmod tempor incididunt et dolore magna aliquit enim',
    author: 'Wade Warren',
    date: '12 November 2021',
    authorImg: '/authors/wade.jpg',
    image: '/posts/spaghetti.jpg',
  },
  {
    id: 2,
    title: '10 Vegetarian Recipes To Eat This Month',
    description: 'Lorem ipsum dolor sit amet, consecteturipisicing elit, sed do eiusmod tempor incididunt et dolore magna aliquit enim',
    author: 'Robert Fox',
    date: '12 November 2021',
    authorImg: '/authors/robert.jpg',
    image: '/posts/fruits.jpg',
  },
  // thêm bài khác nếu cần
];

const tastyRecipes = [
  {
    id: 1,
    title: 'Chicken Meatballs with Cream Cheese',
    author: 'Andreas Paula',
    image: '/tasty/meatballs.jpg',
  },
  {
    id: 2,
    title: 'Traditional Bolognaise Ragu',
    author: 'Andreas Paula',
    image: '/tasty/bolognaise.jpg',
  },
  {
    id: 3,
    title: 'Pork and Chive Chinese Dumplings',
    author: 'Andreas Paula',
    image: '/tasty/dumplings.jpg',
  },
];

const BlogList = () => {
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="blog">
      <h1 className="blog__title">Blog & Article</h1>
      <p className="blog__desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      </p>

      <div className="blog__search">
        <input
          type="text"
          placeholder="Search article, news or recipe..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button>Search</button>
      </div>

      <div className="blog__content">
        <div className="blog__posts">
          {filteredPosts.map(post => (
            <BlogPostItem key={post.id} post={post} />
          ))}
        </div>

        <aside className="blog__sidebar">
          <h3>Tasty</h3>

</aside>
</section>
</div>)}

