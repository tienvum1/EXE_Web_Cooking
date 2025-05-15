import React from 'react';
import styles from './SearchBar.module.scss';

const SearchBar = () => (
  <form className={styles.searchBar} onSubmit={e => e.preventDefault()}>
    <input type="text" placeholder="Search recipe..." className={styles.input} />
    <button type="submit" className={styles.button}>Search</button>
  </form>
);

export default SearchBar; 