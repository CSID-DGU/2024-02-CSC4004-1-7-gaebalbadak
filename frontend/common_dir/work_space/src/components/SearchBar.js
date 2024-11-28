import React, { useState } from "react";
import styles from './SearchBar.module.css';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import filter_logo from '../assets/img/filter-icon.png';
import searchIcon from "../assets/img/search.png";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await fetch("~/api/autoComplete/", { // 실제 서버 주소로 변경 필요
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        if (!response.ok) {
          throw new Error("API 요청에 실패했습니다.");
        }

        const result = await response.json();
        console.log("API 응답 결과:", result);

        if (result && result.id) {  // result가 존재하는지 + result에 id가 존재하는지 -> 존재하면 해당 id로 페이지 이동
          // result.id를 'details' 페이지로 전달
          navigate(`/details/${result.id}`); 
        } else {
          alert("결과에서 ID를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("오류 발생:", error);
        alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("검색어를 입력해주세요!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.search_area}>
      <div className={styles.filter_icon_area}>
        <Link to="/filter" type="button" className={styles.filter_button}>
          <img src={filter_logo} className={styles.filter_icon} />
        </Link>
      </div>

      <div className={styles.search_input_area}>
        <input
          type="text"
          placeholder="Search for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.search_input_text}
        />
        <img
          className="search-button"
          src={searchIcon}
          alt="Search"
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default SearchBar;
