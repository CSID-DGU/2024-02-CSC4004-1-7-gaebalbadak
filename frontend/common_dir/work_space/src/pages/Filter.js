//필요한 모듈 import
import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import { useNavigate } from "react-router-dom";

//필요한 이미지 import
import logo from "../assets/img/filter-logo-img.png";
import refreshButton from "../assets/img/refresh-icon.png";
import ping from "../assets/img/ping.png";
import footer_img from "../assets/img/footer.png";
import default_img from "../assets/img/main-logo-img.png";

//한 페이지 당 몇 개의 식당을 보여줄 지 설정
const ITEMS_PER_PAGE = 4;

const Filter = () => {
  //필요한 변수 선언
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState();
  const [restaurantName, setRestaurantName] = useState([]);
  const [aiScore, setAiScore] = useState([]);
  const [hasReviewEvent, setHasReviewEvent] = useState([]);
  const [address, setAddress] = useState([]);
  const [truthRatio, setTruthRatio] = useState([]);
  const [positiveRatio, setPositiveRatio] = useState([]);
  const [restaurantImg, setRestaurantImg] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]); // 필터 상태 유지
  const [selectedSort, setSelectedSort] = useState(null); // 필터 상태 유지
  const [selectedReviewEvent, setSelectedReviewEvent] = useState(null); // 필터 상태 유지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const totalPages = Math.ceil(restaurantName.length / ITEMS_PER_PAGE); // 전체 페이지 수
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE; // 현재 페이지의 데이터 계산
  const endIndex = startIndex + ITEMS_PER_PAGE; // 현재 페이지의 데이터 계산
  const currentRestaurants = restaurantName.slice(startIndex, endIndex); // 현재 페이지의 데이터 계산
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // 페이지 버튼 생성
  
  //페이지 변경 기능
  const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); }; 

  //필터 초기화 기능
  const handleRefreshClick = () => {
    setSelectedCategory(null);
    setSelectedSort(null);
    setSelectedReviewEvent(null);
    setCurrentPage(1); // 페이지도 1로 초기화
  };

  //카테고리 버튼 클릭 기능
  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((item) => item !== category)
        : [...prevCategories, category]
    );
  };

  //이동 버튼 클릭 기능
  const handleMoveClick = (id) => {
    navigate(`/details/${id}`);
  };

  // 버튼 클릭 시 이동 처리 및 상태 갱신
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === "home") {
      navigate("/main"); // Filter.js로 이동
    }
  };  

  //Apply 버튼 클릭 시 수정하는 기능
  const handleApplyClick = async () => {
    try {
      const data = await postFilterData(); // 서버에 데이터 전송 후 결과 받기

      if (data) {
        const restaurants = Array.isArray(data) ? data : data.results; // 배열이 아니면 data.results로 접근
        if (!restaurants || !Array.isArray(restaurants)) {
          console.error("올바른 데이터 형식이 아닙니다:", data);
          return;
        }
        // 서버에서 받은 데이터로 상태 갱신
        const names = restaurants.map((restaurant) => restaurant.name);
        const scores = restaurants.map((restaurant) => Math.floor(restaurant.ai_score));
        const reviewEvents = restaurants.map((restaurant) => restaurant.has_review_event ? "O" : "X");
        const addresses = restaurants.map((restaurant) => restaurant.address);
        const truthRatios = restaurants.map((restaurant) => `${(restaurant.true_review_ratio * 100).toFixed(0)}%`);
        const positiveRatios = restaurants.map((restaurant) => `${(restaurant.positive_ratio * 100).toFixed(0)}%`);
        const images = restaurants.map((restaurant) => restaurant.main_image_url !== null ? restaurant.main_image_url : default_img);
        const ids = restaurants.map((restaurant) => restaurant.id);
        setRestaurantName(names);
        setAiScore(scores);
        setHasReviewEvent(reviewEvents);
        setAddress(addresses);
        setTruthRatio(truthRatios);
        setPositiveRatio(positiveRatios);
        setRestaurantImg(images);
        setRestaurantId(ids);

        // 현재 페이지를 첫 번째 페이지로 초기화
        setCurrentPage(1);

        //콘솔로 선택한 결과 check
        console.log("데이터 갱신 성공");
        console.log("Apply button clicked");
        console.log("Selected Category:", selectedCategory);
        console.log("Selected Sort:", selectedSort);
        console.log("Selected Review Event:", selectedReviewEvent);

      } else {
        console.error("서버로부터 데이터를 받지 못했습니다.");
      }
    } catch (error) {
      console.error("데이터 전송 실패:", error);
    }
  };

  //restApi로 정보 받아오기
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        //http://34.47.82.254:8000/api/restaurants/filter/  --> 실제 서버 ip
        //http://localhost:8000/api/restaurants/filter/ --> 로컬 환경의 경우
        const response = await fetch("http://34.47.82.254:8000/api/restaurants/filter/");
        const results = await response.json();

        //restApi에서 가져온 정보로 변수 값 설정
        const names = results.map((restaurant) => restaurant.name);
        const scores = results.map((restaurant) => Math.floor(restaurant.ai_score));
        const reviewEvents = results.map((restaurant) => restaurant.has_review_event ? "O" : "X");
        const addresses = results.map((restaurant) => restaurant.address);
        const images = results.map((restaurant) => restaurant.main_image_url ? restaurant.main_image_url : default_img);
        const ids = results.map((restaurant) => restaurant.id);
        setRestaurantName(names);
        setAiScore(scores);
        setHasReviewEvent(reviewEvents);
        setAddress(addresses);
        setRestaurantImg(images);
        setRestaurantId(ids);

        //콘솔로 가져온 결과를 check
        console.log("Fetched results:", results);
        results.forEach((restaurant, index) => {
          console.log(
            `Restaurant ${index} positive_ratio:`,
            restaurant.positive_ratio
          );
        });
      } catch (error) {
        console.error("서버 데이터 가져오기 실패:", error);
      }
    };

    fetchFilterData();
  }, []); // 빈 배열로 인해 컴포넌트 마운트 시 한 번만 호출됨

  // 서버에 POST 요청 보내기
  const postFilterData = async () => {
    // 카테고리를 숫자로 매핑
    const categoryMap = {
      "한식": 1,
      "중식": 2,
      "양식": 3,
      "아시아": 4,
      "간식": 5,
      "카페": 6,
      "술집": 7,
      "기타": 8,
    };

    // 선택된 카테고리를 숫자로 변환
    const categories = selectedCategory.map((category) => categoryMap[category]);
    
    const payload = {
      categories, // 선택된 카테고리 배열 전달
      sort:
        selectedSort === "Ai점수"
          ? "ai_score"
          : selectedSort === "진실비율"
          ? "true_review_ratio"
          : "positive_ratio", // 정렬 방식
      has_review_event:
        selectedReviewEvent === "O" ? true : selectedReviewEvent === "X" ? false : null, // 리뷰 이벤트
    };

    console.log("전송할 필터 데이터:", payload);

    try {
      //http://34.47.82.254:8000/api/restaurants/filter/ --> 실제 서버 주소
      //http://localhost:8000/api/restaurants/filter/ --> 로컬 test 주소

      const response = await fetch("http://localhost:8000/api/restaurants/filter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("서버 응답:", data);
        return data; // 데이터를 반환
      } else {
        console.error("서버 요청 실패:", response.status, response.statusText);
        return null; // 실패 시 null 반환
      }
    } catch (error) {
      console.error("요청 중 에러 발생:", error);
      return null; // 실패 시 null 반환
    }
  };


  //페이지 구현부
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}></div>
      <div className={styles.contents}>
        <div className={styles.logo_area}>
          <img src={logo} className={styles.logo_img} alt="logo" />
        </div>
        <div className={styles.contents_area}>
          <div className={styles.raw_text_area}>

            <div className={styles.raw_text_left_area}>
              <div className={styles.raw_text_filter}>필터 | </div>
              <div className={styles.refresh_icon_area}>
                <button
                  type="button"
                  className={styles.refresh_button}
                  onClick={handleRefreshClick}
                >
                  <img
                    src={refreshButton}
                    className={styles.refresh_button_img}
                    alt="refresh_button"
                  />
                </button>
              </div>
              <div className={styles.raw_refresh_text}>
                <div className={styles.raw_refres_text_area}>초기화</div>
              </div>
            </div>

            <div className={styles.raw_text_right_area}>
                <button className={`${styles.home_nav_button} ${activeButton === "filter" ? styles.active : ""}`} 
                                    onClick={() => handleButtonClick("home")}>
                  홈
                </button>
            </div>
          </div>
          <div className={styles.buttons_area}>
            <div className={styles.buttons_sum}>
              <div className={styles.buttons_line}>
                <div className={styles.filter_thema_text}>분류</div>
                <div className={styles.filter_buttons_line}>
                  {["한식", "중식", "양식", "아시아", "간식", "카페", "술집", "기타"].map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={
                        selectedCategory.includes(category)
                          ? styles.pressedButton
                          : styles.unpressedButton
                      }
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>;
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}>정렬</div>
              <div className={styles.filter_buttons_line}>
                {["Ai점수", "진실비율", "긍정비율"].map((sortOption) => ( // 긍정비율 추가
                  <button
                    key={sortOption}
                    type="button"
                    className={
                      selectedSort === sortOption
                        ? styles.pressedButton
                        : styles.unpressedButton
                    }
                    onClick={() =>
                      setSelectedSort(sortOption === selectedSort ? null : sortOption)
                    }
                  >
                    {sortOption}
                  </button>
                ))}
              </div>
            </div>
              <div className={styles.buttons_line}>
                <div className={styles.filter_thema_text_review}>리뷰이벤트</div>
                <div className={styles.filter_buttons_line}>
                  {["O", "X"].map((eventOption) => (
                    <button
                      key={eventOption}
                      type="button"
                      className={
                        selectedReviewEvent === eventOption
                          ? styles.pressedButton
                          : styles.unpressedButton
                      }
                      onClick={() =>
                        setSelectedReviewEvent(
                          eventOption === selectedReviewEvent ? null : eventOption
                        )
                      }
                    >
                      {eventOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Apply 버튼 */}
          <button className={styles.apply_button} onClick={handleApplyClick}>
            Apply
          </button>

          <div className={styles.raw_text_area}>
            <div className={styles.raw_text_filter_result}>필터 검색 결과</div>
          </div>

          {/* 결과 영역 */}
          <div className={styles.results_area}>
            {currentRestaurants.length > 0 ? (
              currentRestaurants.map((name, index) => (
                <div
                  className={index === currentRestaurants.length - 1 ? styles.last_result : styles.result}
                  key={startIndex + index}
                >
                  <div className={styles.result_title}>
                    <div className={styles.ping_area}>
                      <img src={ping} className={styles.ping_img} alt="Ping" />
                    </div>
                    <div className={styles.result_title_text}>{name}</div>
                    <button
                      className={styles.moveButton}
                      onClick={() => handleMoveClick(restaurantId[startIndex + index])}
                    >
                      바로가기
                    </button>
                  </div>
                  <div className={styles.result_contents}>
                    <div className={styles.result_contents_text_1}>
                      <div className={styles.rctc2_1}>Ai score: {aiScore[startIndex + index]}</div>
                      <div className={styles.rctc2_2}>
                        리뷰이벤트: {hasReviewEvent[startIndex + index]}
                      </div>
                      <div className={styles.rctc2_3}>주소: {address[startIndex + index]}</div>
                      <div className={styles.rctc2_4}>
                        진실리뷰비율: {truthRatio[startIndex + index]}
                      </div>
                    </div>
                    <img
                      src={restaurantImg[startIndex + index]}
                      className={styles.restaurant}
                      alt={`Restaurant ${startIndex + index}`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.no_results_message}>
                검색 결과가 존재하지 않습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 영역 */}
          {currentRestaurants.length > 0 && (
            <div className={styles.pagination_area}>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={
                    number === currentPage ? styles.activePageButton : styles.pageButton
                  }
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.footer_area}>
          <img src={footer_img} className={styles.footer_img} alt="footer" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
