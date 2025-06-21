import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Rechercher..."
      className="border px-3 py-1 rounded w-full mb-4"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;