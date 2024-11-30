import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import { useNavigate } from "react-router-dom";

import logo from "../assets/img/filter-logo-img.png";
import refreshButton from "../assets/img/refresh-icon.png";
import ping from "../assets/img/ping.png";
import footer_img from "../assets/img/footer.png";
import restaurant_1 from "../assets/img/restaurant1.png";
import restaurant_2 from "../assets/img/seoulkatsu.jpg";
import restaurant_3 from "../assets/img/restaurant3.png";

const ITEMS_PER_PAGE = 4; // 한 페이지에 표시할 식당 수

const Filter = () => {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  // 기존 상태
  const [restaurantId, setRestaurantId] = useState(); //[1, 2, 3, 4, 5, 6, 7, 8]
  const [restaurantName, setRestaurantName] = useState([
    // "서울카츠",
    // "장충족발",
    // "옛날농장",
    // "맷차",
    // "식당1",
    // "식당2",
    // "식당3",
    // "식당4",
  ]);
  const [aiScore, setAiScore] = useState([]); //["60", "80", "70", "90", "85", "75", "95", "65"]
  const [hasReviewEvent, setHasReviewEvent] = useState([]); //["O", "X", "O", "X", "O", "X", "O", "X"]
  const [address, setAddress] = useState([
    // "서울 중구 필동 1가",
    // "서울 중구 필동 3가",
    // "서울 중구 필동 4가",
    // "서울 중구 필동 2가",
    // "서울 강남구 역삼동",
    // "서울 강남구 삼성동",
    // "서울 강남구 논현동",
    // "서울 강남구 청담동",
  ]);
  const [truthRatio, setTruthRatio] = useState([
    // "60%",
    // "80%",
    // "55%",
    // "90%",
    // "85%",
    // "75%",
    // "95%",
    // "65%",
  ]);
  const [restaurantImg, setRestaurantImg] = useState([
    // restaurant_1,
    // restaurant_2,
    // restaurant_3,
    // restaurant_1,
    // restaurant_2,
    // restaurant_3,
    // restaurant_1,
    // restaurant_2,
  ]);

  // 필터 상태 유지
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedReviewEvent, setSelectedReviewEvent] = useState(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const totalPages = Math.ceil(restaurantName.length / ITEMS_PER_PAGE); // 전체 페이지 수

  // 현재 페이지의 데이터 계산
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRestaurants = restaurantName.slice(startIndex, endIndex);

  // 페이지 버튼 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // 핸들러: 페이지 변경
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 핸들러: 필터 초기화
  const handleRefreshClick = () => {
    setSelectedCategory(null);
    setSelectedSort(null);
    setSelectedReviewEvent(null);
    setCurrentPage(1); // 페이지도 1로 초기화
  };

 // 서버에서 데이터를 받아오는 useEffect
 useEffect(() => {
  const fetchFilterData = async () => {
    try {
      const response = await fetch("/filterTest.json");
      const results = await response.json();

    // 받아온 데이터로 상태 업데이트
    const names = results.map((restaurant) => restaurant.name);
    setRestaurantName(names);

    const scores = results.map((restaurant) => restaurant.ai_score); // AI 점수 추출
    setAiScore(scores); // AI 점수 상태 업데이트

    const reviewEvents = results.map((restaurant) =>
      restaurant.has_review_event ? "O" : "X"
    );
    setHasReviewEvent(reviewEvents);

    const addresses = results.map((restaurant) => restaurant.address);
    setAddress(addresses);

    const truthRatios = results.map(
      (restaurant) => `${(restaurant.review_true_ratio * 100).toFixed(0)}%`
    );
    setTruthRatio(truthRatios);

    const images = results.map((restaurant) => restaurant.main_image_url);
    setRestaurantImg(images);

    const ids = results.map((restaurant) => restaurant.id);
    setRestaurantId(ids);
    } catch (error) {
      console.error("서버 데이터 가져오기 실패:", error);
    }
  };

  fetchFilterData();
}, []); // 빈 배열로 인해 컴포넌트 마운트 시 한 번만 호출됨

  // 서버에 POST 요청 보내기
  const postFilterData = async () => {
    const payload = {
      category: selectedCategory,
      sort: selectedSort,
      reviewEvent: selectedReviewEvent,
    };

    try {
      const response = await fetch("~/api/restaurant/filter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("서버 응답:", data);
        // 필요한 경우 서버 응답 데이터를 상태로 저장하거나 처리
      } else {
        console.error("서버 요청 실패:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("요청 중 에러 발생:", error);
    }
  };

  // 핸들러: Apply 버튼 클릭
  const handleApplyClick = () => {
    console.log("Apply button clicked");
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Sort:", selectedSort);
    console.log("Selected Review Event:", selectedReviewEvent);
  };

  // 핸들러: 이동 버튼 클릭
  const handleMoveClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}></div>
      <div className={styles.contents}>
        <div className={styles.logo_area}>
          <img src={logo} className={styles.logo_img} alt="logo" />
        </div>
        <div className={styles.contents_area}>
          <div className={styles.raw_text_area}>
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
                        selectedCategory === category
                          ? styles.pressedButton
                          : styles.unpressedButton
                      }
                      onClick={() =>
                        setSelectedCategory(category === selectedCategory ? null : category)
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.buttons_line}>
                <div className={styles.filter_thema_text}>정렬</div>
                <div className={styles.filter_buttons_line}>
                  {["Ai점수", "긍정비율"].map((sortOption) => (
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
            {currentRestaurants.map((name, index) => (
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
                    <div className={styles.rctc2_3}>주소:{address[startIndex + index]}</div>
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
            ))}
          </div>

          {/* 페이지네이션 영역 */}
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
        </div>
        <div className={styles.footer_area}>
          <img src={footer_img} className={styles.footer_img} alt="footer" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
