import searchIcon from "../img/search.png";
import React, { useState } from "react";
import PropTypes from 'prop-types';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      alert(`검색어: ${searchQuery}`); 
  
    } else {
      alert("검색어를 입력해주세요!");
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="음식점 이름을 정확히 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
       <img
          className="search-button"
          src={searchIcon} 
          alt="Search"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default SearchBar;