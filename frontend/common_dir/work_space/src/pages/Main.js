import React, { useState, useEffect } from 'react';
import NaverMap from '../components/NaverMap';
import SearchBar from '../components/SearchBar';
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import styles from './Main.module.css';

import logo from '../assets/img/main-logo-img.png';
import footer_img from '../assets/img/footer.png';
import restaurant_1 from '../assets/img/restaurant1.png';
import restaurant_2 from '../assets/img/seoulkatsu.jpg';
import restaurant_3 from '../assets/img/restaurant3.png';
import ping from '../assets/img/ping.png';

const Main = () => {
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const [restaurantId, setRestaurantId] = useState([357, 360, 371, 377]);
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurantName, setRestaurantName] = useState([
    "서울카츠",
    "장충족발",
    "옛날농장",
    "맷차",
  ]);
  const [aiScore, setAiScore] = useState(["서울카츠", "장충족발", "옛날농장", "맷차"]);
  const [hasReviewEvent, setHasReviewEvent] = useState(["60", "80", "70", "90"]);
  const [address, setAddress] = useState(["서울 중구 필동 1가", "서울 중구 필동 3가", "서울 중구 필동 4가", "서울 중구 필동 2가"])
  const [truthRatio, setTruthRatio] = useState(["60", "80", "55", "90"]);
  const [restaurantImg, setRestaurantImg] = useState([
    restaurant_1,
    restaurant_2,
    restaurant_3,
    restaurant_1,
  ]);

  const [latitude, setLatitude] = useState(37.561118); // 위도 상태 추가
  const [longitude, setLongitude] = useState(126.995013); // 경도 상태 추가

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

  // 서버에서 데이터를 받아오는 useEffect
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch("~/api/restaurants/filter");
        const results = await response.json();

        // 받아온 데이터로 상태 업데이트
        setRestaurantName(results.restaurant.name || ["서울카츠", "장충족발", "옛날농장", "맷차"]);
        setAiScore(results.restaurant.ai_review_score || ["60", "80", "70", "90"]);
        setHasReviewEvent(results.has_review_event || ["O", "X", "O", "X"]);
        setAddress(results.restaurant.road_address || ["서울 중구 필동 1가", "서울 중구 필동 3가", "서울 중구 필동 4가", "서울 중구 필동 2가"]);
        setTruthRatio(results.restaurant.prediction_accuracy * 100 || ["60", "80", "55", "90"]);
        setRestaurantImg(results.restaurant.main_image_url || [restaurant_1, restaurant_2, restaurant_3, restaurant_1]);
        setRestaurantId(results.restaurant.id || [357, 360, 371, 377]);

        // 위도와 경도 추가 설정
        setLatitude(results.map.location.latitude || 37.561118);
        setLongitude(results.map.location.longitude || 126.995013);
        
      } catch (error) {
        console.error("서버 데이터 가져오기 실패:", error);
      }
    };

    fetchFilterData();
  }, []); // 빈 배열로 인해 컴포넌트 마운트 시 한 번만 호출됨

  // moveButton 클릭 핸들러
  const handleMoveClick = (id) => {
    console.log('Navigating to details for ID:', id);  // 추가된 로그
    navigate(`/Details/${id}`);
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
          <NaverMap latitude_={latitude} longitude_={longitude} /> {/* 위도와 경도 전달 */}
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
              <div className={styles.result_title_text}>{restaurantName[0]}</div>
              <button className={styles.moveButton} onClick={() => handleMoveClick(restaurantId[0])}>
                바로가기 
              </button>
            </div>
            <div className={styles.result_contents}>
              <div className={styles.result_contents_text_1}>
                <div className={styles.rctc1_1}>Ai score: {aiScore[0]}</div>
                <div className={styles.rctc1_2}>리뷰이벤트: {hasReviewEvent[0]}</div>
                <div className={styles.rctc1_3}>Address: {address[0]}</div>
                <div className={styles.rctc1_4}>진실리뷰비율: {truthRatio[0]}%</div>
              </div>
              <img
                src={restaurantImg[0]}
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
              <div className={styles.result_title_text}>{restaurantName[1]}</div> 
              <button className={styles.moveButton} onClick={() => handleMoveClick(restaurantId[1])}>
                바로가기
              </button>
            </div>
            <div className={styles.result_contents}>
              <div className={styles.result_contents_text_2}>
              <div className={styles.rctc2_1}>Ai score: {aiScore[1]}</div>
                <div className={styles.rctc2_2}>리뷰이벤트: {hasReviewEvent[1]}</div>
                <div className={styles.rctc2_3}>Address: {address[1]}</div>
                <div className={styles.rctc2_4}>진실리뷰비율: {truthRatio[1]}%</div>
              </div>
              <img
                src={restaurantImg[1]}
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
                  {restaurantName[2]}
                </div>
                <button className={styles.moveButton} onClick={() => handleMoveClick(restaurantId[2])}>
                바로가기 
              </button>
              </div>

              <div className={styles.result_contents}>
                <div className={styles.result_contents_text_3}>
                  <div className={styles.rctc3_1}>Ai score: {aiScore[2]}</div>
                  <div className={styles.rctc3_2}>리뷰이벤트: {hasReviewEvent[2]}</div>
                  <div className={styles.rctc3_3}>Address: {address[2]}</div>
                  <div className={styles.rctc3_4}>진실리뷰비율: {truthRatio[2]}%</div>
                </div>
                <img src={restaurantImg[2]} className={styles.restaurant}></img>
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

