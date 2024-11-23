import React, { useState } from 'react';
import NaverMap from '../components/NaverMap';
import SearchBar from '../components/SearchBar';
import logoImage from '../img/filter-logo-img.png'; // 이미지 파일 import

const Main = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      alert('검색어를 입력하세요!');
      return;
    }

    console.log('검색 실행:', searchTerm);
    // API 호출
  };

  return (
    <div className="container">
      <header className="header">
        <div className="top-bar"  style={{
    textAlign: "center",

  }}>Sign up and get 20% off to your first order. Sign Up Now</div>
        <div className="header-image">
          <img src={logoImage} alt="Header Example" /> {/* 이미지 import 사용 */}
        </div>
       
      </header>
      <div className="main">
        <SearchBar
          searchTerm={searchTerm}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
      </div>
      <div className="map-container">
        <NaverMap />
      </div>

      <footer>
        <div className="footer-container">
          <img
            src={logoImage} // footer에서도 동일한 이미지 사용
            alt="Fine Dining Logo"
            className="footer-logo"
          />
          <div className="footer-column">
            <h3>Product</h3>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Case studies</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#">Updates</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Culture</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Downloads</h3>
            <ul>
              <li><a href="#">iOS</a></li>
              <li><a href="#">Android</a></li>
              <li><a href="#">Mac</a></li>
              <li><a href="#">Windows</a></li>
              <li><a href="#">Chrome</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Getting started</a></li>
              <li><a href="#">Help center</a></li>
              <li><a href="#">Server status</a></li>
              <li><a href="#">Report a bug</a></li>
              <li><a href="#">Chat support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <hr />
          <p>© 2024 Food Finding | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Main;
