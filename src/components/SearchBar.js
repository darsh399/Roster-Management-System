import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  padding-right: 30px;
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 16px;
`;

const SearchBar = ({ onSearch, searchTerm }) => {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search providers by name..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      {searchTerm && (
        <ClearSearchButton onClick={() => onSearch('')}>
          ×
        </ClearSearchButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;