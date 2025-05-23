import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() !== '') {
      navigate(`/recipes?q=${encodeURIComponent(value.trim())}`);
    } else {
      navigate('/recipes');
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search recipe..."
        className={styles.input}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit" className={styles.button}>Search</button>
    </form>
  );
};

export default SearchBar; 