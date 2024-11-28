import React, { useState } from "react";
import styles from './SearchBar.module.css'
import { Link } from 'react-router-dom';  //추가
import filter_logo from '../assets/img/filter-icon.png';
import searchIcon from "../assets/img/search.png";


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
    <form onSubmit={handleSubmit} className={styles.search_area}>
      <div className={styles.filter_icon_area}>
      <Link to ="/filter" type="button" className={styles.filter_button}><img src={filter_logo} className={styles.filter_icon}/></Link> 
      </div>

      <div className={styles.search_input_area}>
        <input type="text" placeholder="Search for..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.search_input_text} />
        <img className="search-button" src={searchIcon} alt="Search" onClick={handleSubmit} />
      </div>  
      
    </form>
  );
};

export default SearchBar;

