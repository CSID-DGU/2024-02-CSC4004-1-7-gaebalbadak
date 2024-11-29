import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가

import logo from "../assets/img/filter-logo-img.png";
import refreshButton from "../assets/img/refresh-icon.png";
import ping from "../assets/img/ping.png";
import footer_img from "../assets/img/footer.png";
import restaurant_1 from "../assets/img/restaurant1.png";
import restaurant_2 from "../assets/img/seoulkatsu.jpg";
import restaurant_3 from "../assets/img/restaurant3.png";

const Filter = () => {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  // 기존 상태 (서버에서 사용할 값들)
  const [restaurantId, setRestaurantId] = useState([1, 2, 3, 4]);
  const [restaurantName, setRestaurantName] = useState([
    "서울카츠",
    "장충족발",
    "옛날농장",
    "맷차",
  ]);
  const [aiScore, setAiScore] = useState(["60", "80", "70", "90"]);
  const [hasReviewEvent, setHasReviewEvent] = useState(["O", "X", "O", "X"]);
  const [address, setAddress] = useState([
    "서울 중구 필동 1가",
    "서울 중구 필동 3가",
    "서울 중구 필동 4가",
    "서울 중구 필동 2가",
  ]);
  const [truthRatio, setTruthRatio] = useState(["60%", "80%", "55%", "90%"]);
  const [restaurantImg, setRestaurantImg] = useState([
    restaurant_1,
    restaurant_2,
    restaurant_3,
    restaurant_1,
  ]);

  // 새로운 상태: 필터와 정렬 상태 관리
  const [selectedCategory, setSelectedCategory] = useState(null); // 분류
  const [selectedSort, setSelectedSort] = useState(null); // 정렬
  const [selectedReviewEvent, setSelectedReviewEvent] = useState(null); // 리뷰 이벤트

  // 필터 초기화 핸들러
  const handleRefreshClick = () => {
    setSelectedCategory(null);
    setSelectedSort(null);
    setSelectedReviewEvent(null);
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
        setAddress(results.restaurant.road_address || [
          "서울 중구 필동 1가",
          "서울 중구 필동 3가",
          "서울 중구 필동 4가",
          "서울 중구 필동 2가",
        ]);
        setTruthRatio(results.restaurant.prediction_accuracy * 100 || [
          "60%",
          "80%",
          "55%",
          "90%",
        ]);
        setRestaurantImg(results.restaurant.main_image_url || [
          restaurant_1,
          restaurant_2,
          restaurant_3,
          restaurant_1,
        ]);
        setRestaurantId(results.restaurant.id || [1, 2, 3, 4]);
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

  // Apply 버튼 클릭 핸들러
  const handleApplyClick = () => {
    console.log("Apply button clicked");
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Sort:", selectedSort);
    console.log("Selected Review Event:", selectedReviewEvent);
    postFilterData(); // POST 요청 전송
  };

  // moveButton 클릭 핸들러
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
                  {["한식", "중식", "양식", "아시아"].map((category) => (
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

          <div className={styles.results_area}>
            {/* 결과 영역 */}
            {restaurantName.map((name, index) => (
              <div
                className={index === restaurantName.length - 1 ? styles.last_result : styles.result}
                key={index}
              >
                <div className={styles.result_title}>
                  <div className={styles.ping_area}>
                    <img src={ping} className={styles.ping_img} alt="Ping" />
                  </div>
                  <div className={styles.result_title_text}>{name}</div>
                  <button
                    className={styles.moveButton}
                    onClick={() => handleMoveClick(restaurantId[index])} // 이동 핸들러 호출
                  >
                    바로가기
                  </button>
                </div>
                <div className={styles.result_contents}>
                  <div className={styles.result_contents_text_1}>
                    <div className={styles.rctc2_1}>Ai score: {aiScore[index]}</div>
                    <div className={styles.rctc2_2}>리뷰이벤트: {hasReviewEvent[index]}</div>
                    <div className={styles.rctc2_3}>Address: {address[index]}</div>
                    <div className={styles.rctc2_4}>진실리뷰비율: {truthRatio[index]}</div>
                  </div>
                  <img
                    src={restaurantImg[index]}
                    className={styles.restaurant}
                    alt={`Restaurant ${index}`}
                  />
                </div>
              </div>
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
