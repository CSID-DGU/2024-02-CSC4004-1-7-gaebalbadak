import React, { useState } from 'react';
import NaverMap from '../components/NaverMap';
import SearchBar from '../components/SearchBar';
import styles from './Main.module.css';

import logo from '../assets/img/main-logo-img.png';
import footer_img from '../assets/img/footer.png';
import restaurant_1 from '../assets/img/restaurant1.png';
import restaurant_2 from '../assets/img/seoulkatsu.jpg';
import restaurant_3 from '../assets/img/restaurant3.png';
import ping from '../assets/img/ping.png';

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
    <div className={styles.wrapper}>
    <div className={styles.header}></div>

    <div className={styles.contents}>
      {/* Logo Area */}
      <div className={styles.logo_area}>
        <img src={logo} className={styles.logo_img} alt="logo" />
      </div>

      {/* Search and Map Area */}
      <div className={styles.search_area_wrapper}>
        <div className={styles.search_bar_area}>
          <SearchBar
            searchTerm={searchTerm}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </div>
        <div className={styles.map_area}>
          <NaverMap />
        </div>
      </div>

      {/* Recent Visit Area */}
      <div className={styles.recent_visit_wrapper}>
        <div className={styles.recent_visit_contents}>
          {/* First Recent Visit */}
          <div className={styles.recent_visit_one}>
            <div className={styles.result_title}>
              <div className={styles.ping_area}>
                <img src={ping} className={styles.ping_img} alt="Ping" />
              </div>
              <div className={styles.result_title_text}>서울카츠</div>
            </div>
            <div className={styles.result_contents}>
              <div className={styles.result_contents_text_1}>
                <div className={styles.rctc1_1}>Ai score: 65</div>
                <div className={styles.rctc1_2}>리뷰이벤트: 0</div>
                <div className={styles.rctc1_3}>Address: 서울 중구 필동 2가</div>
                <div className={styles.rctc1_4}>진실리뷰비율: 60%</div>
              </div>
              <img
                src={restaurant_1}
                className={styles.restaurant}
                alt="Restaurant 1"
              />
            </div>
          </div>

          {/* Second Recent Visit */}
          <div className={styles.recent_visit_two}>
            <div className={styles.result_title}>
              <div className={styles.ping_area}>
                <img src={ping} className={styles.ping_img} alt="Ping" />
              </div>
              <div className={styles.result_title_text}>장충족발</div>
            </div>
            <div className={styles.result_contents}>
              <div className={styles.result_contents_text_2}>
                <div className={styles.rctc2_1}>Ai score: 65</div>
                <div className={styles.rctc2_2}>리뷰이벤트: 0</div>
                <div className={styles.rctc2_3}>Address: 서울 중구 필동 2가</div>
                <div className={styles.rctc2_4}>진실리뷰비율: 60%</div>
              </div>
              <img
                src={restaurant_2}
                className={styles.restaurant}
                alt="Restaurant 2"
              />
            </div>
          </div>

          {/* Placeholder for Third Recent Visit */}
          <div className={styles.recent_visit_three}>
            <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img}></img>
                </div>
                <div className={styles.result_title_text}>
                  옛날농장
                </div>
              </div>

              <div className={styles.result_contents}>
                <div className={styles.result_contents_text_3}>
                  <div className={styles.rctc3_1}>Ai score: 65</div>
                  <div className={styles.rctc3_2}>리뷰이벤트: 0</div>
                  <div className={styles.rctc3_3}>Address: 서울 중구 필동 2가</div>
                  <div className={styles.rctc3_4}>진실리뷰비율: 60%</div>
                </div>
                <img src={restaurant_3} className={styles.restaurant}></img>
              </div>  
            </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className={styles.footer_area}>
        <img src={footer_img} className={styles.footer_img} alt="Footer" />
      </div>
    </div>
  </div>
);

};

export default Main;
