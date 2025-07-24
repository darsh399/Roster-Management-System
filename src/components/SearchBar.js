import React from 'react';
import styled from 'styled-components';

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const SearchBar = ({ onSearch }) => {
  return (
    <SearchInput
      type="text"
      placeholder="Search providers by name..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;
