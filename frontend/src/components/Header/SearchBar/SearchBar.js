import React, { useState,useEffect } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, clearInput }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (clearInput) {
      setQuery('');
    }
  }, [clearInput]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>Search</button>
    
    </form>
  );
};

export default SearchBar;
