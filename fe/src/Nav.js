import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <NavLink to="/" style={{ margin: '0 1rem' }} end>Home</NavLink>
      <NavLink to="/about" style={{ margin: '0 1rem' }}>About</NavLink>
    </nav>
  );
};

export default Nav; 