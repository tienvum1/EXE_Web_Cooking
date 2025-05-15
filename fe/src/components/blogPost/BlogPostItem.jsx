import React from 'react';

const BlogPostItem = ({ post }) => {
  return (
    <article className="blog__post">
      <img src={post.image} alt={post.title} />
      <div className="blog__post-info">
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <div className="blog__post-author">
          <img src={post.authorImg} alt={post.author} />
          <strong>{post.author}</strong>
          <span>{post.date}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogPostItem;
