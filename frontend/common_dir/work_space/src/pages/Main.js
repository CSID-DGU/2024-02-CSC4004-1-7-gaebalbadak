import React, { useState, useEffect } from 'react';
import NaverMap from '../components/NaverMap';
import SearchBar from '../components/SearchBar';
import { Link, Route, useNavigate } from "react-router-dom"; // useNavigate 추가
import styles from './Main.module.css';

import logo from '../assets/img/main-logo-img.png';
import footer_img from '../assets/img/footer.png';
import filterIcon from '../assets/img/filter-icon.png';
import restaurant_1 from '../assets/img/restaurant1.png';
import restaurant_2 from '../assets/img/seoulkatsu.jpg';
import restaurant_3 from '../assets/img/restaurant3.png';

import ping from '../assets/img/ping.png';

const Main = () => {
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const [restaurantId, setRestaurantId] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [restaurantName, setRestaurantName] = useState([

  ]);
  const [aiScore, setAiScore] = useState([]);
  const [hasReviewEvent, setHasReviewEvent] = useState([]);
  const [averageScore, setAverageScore] = useState([]);
  const [address, setAddress] = useState([])
  const [truthRatio, setTruthRatio] = useState([]);
  const [restaurantImg, setRestaurantImg] = useState([
  
  ]);

  const [latitude, setLatitude] = useState(37.561098); // 위도 상태 추가
  const [longitude, setLongitude] = useState(126.993448); // 경도 상태 추가

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

  const getRestaurantsFromLocalStorage = () => {
    // 로컬스토리지에서 데이터 가져오기
    const storedData = localStorage.getItem("restaurantDetailsList");
  
    // 데이터를 파싱하여 배열로 반환, 없으면 빈 배열 반환
    return storedData ? JSON.parse(storedData) : [];
  };
  
  // 예시로 데이터를 출력
  const restaurantList = getRestaurantsFromLocalStorage();
  console.log("Stored restaurants:", restaurantList);  

  // moveButton 클릭 핸들러
  const handleMoveClick = (id) => {
    console.log('Navigating to details for ID:', id);  // 추가된 로그
    navigate(`/Details/${id}`);
  };

  const handleFilterClick = () => {
    navigate('/filter'); // 필터 페이지로 이동
  };

  useEffect(() => {
    const restaurantList = getRestaurantsFromLocalStorage();
  
    if (restaurantList.length > 0) {
      setRestaurantName(restaurantList.map(item => item.restaurantName || "Unknown"));
      setAiScore(restaurantList.map(item => item.aiScore || "N/A"));
      setAddress(restaurantList.map(item => item.address || "Unknown"));
      setHasReviewEvent(restaurantList.map(item => item.hasReviewEvent || "O"));
      setRestaurantImg(restaurantList.map(item => item.imgUrl || restaurant_1));
      setRestaurantId(restaurantList.map(item => item.id || 0));
      setAverageScore(restaurantList.map(item => (item.averageRate).toFixed(2) || 0));
      setTruthRatio(restaurantList.map(item => 100 - Math.floor(item.averageRate * 100) || 0))
    } else {
      console.log("로컬스토리지에 저장된 데이터가 없습니다.");
    }
  }, []);

   // 사용자 위치 가져오기
   useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            console.log("현재 위치:", position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("위치 정보를 가져오는 데 실패했습니다:", error.message);
          }
        );
      } else {
        console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
      }
    };

    fetchUserLocation();
  }, []); 

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear(); // 모든 데이터를 삭제
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); 

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
          <button className={styles.filter_icon_area} onClick={handleFilterClick}>
              <img src={filterIcon} alt="Filter" className={styles.filter_icon} />
          </button>
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
        {restaurantName.length > 0 ? (
          <div className={styles.recent_visit_contents}>
            {/* First Recent Visit */}
            {restaurantName[0] && (
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
                    <div className={styles.rctc1_4}>평균평점: {averageScore[0]}</div>
                  </div>
                  <img
                    src={restaurantImg[0]}
                    className={styles.restaurant}
                    alt="Restaurant 1"
                  />
                </div>
              </div>
            )}

            {/* Second Recent Visit */}
            {restaurantName[1] && (
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
                    <div className={styles.rctc2_4}>평균평점: {averageScore[1]}</div>
                  </div>
                  <img
                    src={restaurantImg[1]}
                    className={styles.restaurant}
                    alt="Restaurant 2"
                  />
                </div>
              </div>
            )}

            {/* Third Recent Visit */}
            {restaurantName[2] && (
              <div className={styles.recent_visit_three}>
                <div className={styles.result_title}>
                  <div className={styles.ping_area}>
                    <img src={ping} className={styles.ping_img} alt="Ping" />
                  </div>
                  <div className={styles.result_title_text}>{restaurantName[2]}</div>
                  <button className={styles.moveButton} onClick={() => handleMoveClick(restaurantId[2])}>
                    바로가기 
                  </button>
                </div>
                <div className={styles.result_contents}>
                  <div className={styles.result_contents_text_3}>
                    <div className={styles.rctc3_1}>Ai score: {aiScore[2]}</div>
                    <div className={styles.rctc3_2}>리뷰이벤트: {hasReviewEvent[2]}</div>
                    <div className={styles.rctc3_3}>Address: {address[2]}</div>
                    <div className={styles.rctc3_4}>평균평점: {averageScore[2]}</div>
                  </div>
                  <img
                    src={restaurantImg[2]}
                    className={styles.restaurant}
                    alt="Restaurant 3"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.no_results_message}>
            최근 검색한 내역이 표기됩니다. 먼저 검색을 수행해주세요.
          </div>
        )}
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

