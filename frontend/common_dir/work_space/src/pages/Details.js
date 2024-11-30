import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Details.module.css';
import NaverMap from '../components/NaverMap';

import logo from '../assets/img/filter-logo-img.png';
import ping from '../assets/img/ping.png';

import ai_gauge from '../assets/img/ai_gauge_bar.png';
import aiGaugeLevel5 from '../assets/img/ai_gauge_bar_level_5.png';
import aiGaugeLevel4 from '../assets/img/ai_gauge_bar_level_4.png';
import aiGaugeLevel3 from '../assets/img/ai_gauge_bar_level_3.png';
import aiGaugeLevel2 from '../assets/img/ai_gauge_bar_level_2.png';
import aiGaugeLevel1 from '../assets/img/ai_gauge_bar_level_1.png';

import restaurant_img from '../assets/img/main-logo-img.png';
import footer_img from '../assets/img/footer.png';  
import five_star from '../assets/img/five_star.png';
import three_star from '../assets/img/three_star.png';

const Details = () => {
  const { id } = useParams(); // URL에서 id 가져오기 -> router에서 동적으로 details/id 로 url을 생성하기 위해 필요

  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState(null);

  const [logoImg, setLogoImg] = useState(logo);
  const [pingImg, setPingImg] = useState(ping);
  const [aiGaugeImg, setAiGauge] = useState(ai_gauge);
  const [restaurantImg, setRestaurantImg] = useState(restaurant_img);
  const [footerImg, setFooterImg] = useState(footer_img);
  const [fiveStarImg, setFiveStarImg] = useState(five_star);
  const [threeStarImg, setThreeStarImg] = useState(three_star);

  const [restaurantName, setRestaurantName] = useState();
  const [aiScore, setAiScore] = useState('0');
  const [aiPredicAccur, setAiPredicAccur] = useState('0');
  const [reviewSummaryText, setReviewSummaryText] = useState('0');
  const [overViewText, setOverViewText] = useState('null');
  const [overViewAiPositiveText, setOverViewAiPositiveText] = useState('null'); //'긍정리뷰 요약'
  const [overViewAiNegativeText, setOverViewAiNegativeText] = useState('null');
  const [fakeReviewRate, setfakeReviewRate] = useState('0');

  const [baeminReviewCount, setBaeminReviewCount] = useState('0');
  const [naverReviewCount, setNaverReviewCount] = useState('0');
  const [coupangEatsCount, setCoupangEatsCount] = useState('0');

  const [positiveReviewRatio, setPositiveReviewRatio] = useState('0');
  const [negativeReviewRatio, setNegativeReviewRatio] = useState('0');
  const [neutralReviewRatio, setNeutralReviewRatio] = useState('0');

  const [latitude, setLatitude] = useState(); // 위도 상태 추가
  const [longitude, setLongitude] = useState(); // 경도 상태 추가

  const updateScoreColor = (score) => {
    if (score > 80) {
      document.documentElement.style.setProperty('--ai-score-color', '#1DDB16'); // 100점 이하
    } else if (score > 60) {
      document.documentElement.style.setProperty('--ai-score-color', '#fde11d'); // 80점 이하
    } else if (score > 40) {
      document.documentElement.style.setProperty('--ai-score-color', '#ffbe2a'); // 60점 이하
    } else if (score > 20) {
      document.documentElement.style.setProperty('--ai-score-color', '#ff7a39'); // 40점 이하
    } else {
      document.documentElement.style.setProperty('--ai-score-color', '#fa2524'); // 20점 이하
    }
  };

  const updatePredicAccColor = (score) => {
    if (score > 80) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#1DDB16'); // 100점 이하
    } else if (score > 60) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#fde11d'); // 80점 이하
    } else if (score > 40) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#ffbe2a'); // 60점 이하
    } else if (score > 20) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#ff7a39'); // 40점 이하
    } else {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#fa2524'); // 20점 이하
    }
  };

  const updateReviewSummaryText = (summary) => {
    if (summary == 'GOOD') {
      document.documentElement.style.setProperty('--ai-reveiw-summary-color', '#1DDB16'); // GOOD인 경우
    } else {
      document.documentElement.style.setProperty('--ai-reveiw-summary-color', '#fde11d'); // Not Bad인 경우
    }   
  };

  const updateGaugeBar = (score) => {
    if (score > 80) {
      setAiGauge(aiGaugeLevel5); // 80점 이상
    } else if (score > 60) {
      setAiGauge(aiGaugeLevel4); // 60-80점
    } else if (score > 40) {
      setAiGauge(aiGaugeLevel3); // 40-60점
    } else if (score > 20) {
      setAiGauge(aiGaugeLevel2); // 20-40점
    } else {
      setAiGauge(aiGaugeLevel1); // 20점 이하
    }
  };

  const [activeButton, setActiveButton] = useState(null);

  // 버튼 클릭 시 이동 처리 및 상태 갱신
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "filter") {
      navigate("/filter"); // Filter.js로 이동
    } else if (buttonName === "home") {
      navigate("/main"); // Main.js로 이동
    }
  };

  // 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/restaurants/${id}/details/`) //로컬 test 환경시 '/detailTest.json'
        // const response = await fetch(`/api/restaurant/details/${id}`); // id를 URL에 추가
        if (!response.ok) throw new Error('Failed to fetch data');
        const results = await response.json();
        console.log(results); // 전체 데이터를 확인
        console.log(results.ai_review); // ai_review 확인
        console.log(results.ai_review.review_sentiment_ratio); // review_sentiment_ratio 확인

        // 상태 업데이트
        setRestaurantName(results.restaurant.name || 'null');
        setAiScore(Math.floor(results.restaurant.ai_review_score) || '0');
        setAiPredicAccur(Math.floor(results.restaurant.prediction_accuracy) || '0');
        setRestaurantImg(results.restaurant.main_image_url || restaurant_img);

        setReviewSummaryText(results.ai_review.opinion || 'Not Available');
        setOverViewText(
          results.ai_review.overview.description === "No description available." 
              ? "가게에서 설정한 소개글이 없습니다." 
              : results.ai_review.overview.description || "플랫폼에 있는 가게 소개글입니다."
        );
        setOverViewAiPositiveText(results.ai_review.review_summary.positive_summary); // || '긍정리뷰 요약'
        setOverViewAiNegativeText(results.ai_review.review_summary.negative_summary); // || '부정리뷰 요약'
        setfakeReviewRate(results.ai_review.review_fake_ratio);

        // 추후 리뷰 비율 및 리뷰 별점 조회 되면 구현 필요 + 별점 표시기능 구현 필요
        // setBaeminReviewCount(results.ai_review.reviews[0].count);
        // setNaverReviewCount(results.ai_review.reviews[1].count || '0');
        // setCoupangEatsCount(results.ai_review.reviews[2].count || '0');

        setPositiveReviewRatio(results.ai_review.review_sentiment_ratio.positive * 100);
        console.log('Positive Review Ratio:', results.ai_review.review_sentiment_ratio.positive * 100);
        setNegativeReviewRatio(results.ai_review.review_sentiment_ratio.negative * 100);
        setNeutralReviewRatio((100 - (results.ai_review.review_sentiment_ratio.positive * 100) - ((results.ai_review.review_sentiment_ratio.negative) * 100)));

        // 위도와 경도 추가 설정
        setLatitude(results.restaurant.latitude );  // || 37.561118
        setLongitude(results.restaurant.longitude);  // || 126.995013  

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]); // id 변경 시마다 fetch 재실행

  useEffect(() => {
    updateScoreColor(aiScore);
  }, [aiScore]);
  
  useEffect(() => {
    updateGaugeBar(aiScore);
  }, [aiScore]);

  useEffect(() => {
    updatePredicAccColor(aiPredicAccur);
  }, [aiPredicAccur]);

  useEffect(() => {
    updateReviewSummaryText(reviewSummaryText);
  }, [reviewSummaryText]);

  return (
    <div className={styles.wrapper}>
        <div className={styles.header}></div>
        <div className={styles.contents}>
          <div className={styles.logo_area}>
            <img src={logoImg} className={styles.logo_img} alt='logo'></img>
          </div>
          <div className={styles.restaurants_name_area}>
              <div className={styles.restaurants_name_left_area}>
                <img src={pingImg} className={styles.ping_img} alt='ping'></img>
                <div className={styles.nameText}>{restaurantName}</div>
              </div>
              <div className={styles.restaurants_name_right_area}>
                <button className={`${styles.filter_nav_button} ${activeButton === "filter" ? styles.active : ""}`} 
                                    onClick={() => handleButtonClick("filter")}>
                  필터
                </button>
                <button className={`${styles.filter_nav_button} ${activeButton === "filter" ? styles.active : ""}`}
                                    onClick={() => handleButtonClick("home")}>
                  홈
                </button>
              </div>
          </div>
          <div className={styles.contents_area}>
            <div className={styles.review_area}>
              <div className={styles.ai_score_area}>
                  <div className={styles.ai_score_text}>{aiScore}</div>
                  <img src={aiGaugeImg} className={styles.ai_gauge_img} alt='ai_gauge'></img>
                  <div className={styles.text_about_ai}>A.I<br></br>score</div>
              </div>
              <div className={styles.ai_prediction_area}>
                  <div className={styles.ai_predic_area_wrapper}>
                    <div className={styles.ai_predic_accuracy}>{aiPredicAccur}</div>
                    <div className={styles.ai_predic_acc_text}>Ai 예측 정확도</div>
                    <div className={styles.ai_predic_acc_description}>*예측 정확도는  A.i score의 <br></br> 정확도를 의미합니다.</div>
                  </div>
              </div>
              <div className={styles.review_summary_area}>
                  <div className={styles.review_summary_wrapper}>
                    <div className={styles.review_summary_text}>"{reviewSummaryText}"</div>
                    <div className={styles.restaurants_img_area}>
                      <img src={restaurantImg} className={styles.restaurant_img} alt='restaurant_img'></img>
                    </div>
                  </div>
              </div>
            </div>
            <div className={styles.overview_area}>
              <div className={styles.overview_bottom_area}>
                <div className={styles.overview_raw_text_area}>Overview</div>
                <div className={styles.overview_text_area}>
                    {overViewText}
                </div>
                <div className={styles.overview_raw_text_area}>A.i - Review Summary</div>
                <div className={styles.overview_ai_text_area}>
                    <div className={styles.overview_ai_positive_text_area}>긍정 리뷰량: {overViewAiPositiveText}</div>
                    <div className={styles.overview_ai_negative_text_area}>부정 리뷰량: {overViewAiNegativeText}</div>
                    <div className={styles.overview_ai_neutral_text_area}>거짓 리뷰 비율: {fakeReviewRate * 100}%</div>
                </div>

                <div className={styles.overview_under_ai_text_area}>
                    <div className={styles.overview_under_left_side}>
                      <div className={styles.ovw_under_left_wrapper}>
                        <div className={styles.ovw_under_left_text}>
                          <div className={styles.ovw_ult_top}>
                            <div className={styles.ovw_ult_top_top}>
                              <div className={styles.ovw_ult_top_top_1}>
                                배민 리뷰
                              </div>
                              <div className={styles.ovw_ult_top_top_2}>
                                ({baeminReviewCount}개)
                              </div>
                            </div>
                            <div className={styles.ovw_ult_top_bottom}>
                              <img src={three_star} className={styles.ovw_ult_top_img}></img>
                            </div>
                          </div>
                          <div className={styles.ovw_ult_mid}>
                            <div className={styles.ovw_ult_mid_mid}>
                              <div className={styles.ovw_ult_mid_mid_1}>
                                네이버 리뷰
                              </div>
                              <div className={styles.ovw_ult_mid_mid_2}>
                                ({naverReviewCount}개)
                              </div>
                            </div>
                            <div className={styles.ovw_ult_mid_bottom}>
                              <img src={five_star} className={styles.ovw_ult_mid_img}></img>
                            </div>
                          </div>

                          <div className={styles.ovw_ult_bottom}>
                            <div className={styles.ovw_ult_bottom_bottom}>
                              <div className={styles.ovw_ult_bottom_bottom_1}>
                                쿠팡이츠 리뷰
                              </div>
                              <div className={styles.ovw_ult_bottom_bottom_2}>
                                ({coupangEatsCount}개)
                              </div>
                            </div>
                            <div className={styles.ovw_ult_bottom_bottom_bottom}>
                                <img src={three_star} className={styles.ovw_ult_bottom_bottom_bottom_img}></img>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.overview_under_right_side}>
                      <div className={styles.ovw_under_right_wrapper}>
                        <div className={styles.ovw_under_right_side_top}>
                          <div className={styles.ovw_under_right_side_top_1}>
                            <div className={styles.over_under_right_side_top1_top}>
                              긍정 리뷰 비율:
                            </div>
                            <div className={styles.over_under_right_side_top1_bottom}>
                              {positiveReviewRatio}%
                            </div>
                          </div>
                          <div className={styles.ovw_under_right_side_top_2}>
                            <div className={styles.over_under_right_side_top2_top}>
                              부정 리뷰 비율:
                            </div>
                            <div className={styles.over_under_right_side_top2_bottom}>
                              {negativeReviewRatio}%
                            </div>
                          </div>
                          <div className={styles.ovw_under_right_side_top_3}>
                            <div className={styles.ovw_under_right_side_top_3_top}>
                              중립 리뷰 비율:
                            </div>
                            <div className={styles.ovw_under_right_side_top_3_bottom}>
                              {neutralReviewRatio}%
                            </div>
                          </div>
                        </div>
                        <div className={styles.ovw_under_right_side_bottom}>
                          <NaverMap latitude_={latitude} longitude_={longitude} /> {/* 위도와 경도 전달 */}
                        </div>
                      </div>

                    </div>
                </div>
              </div>
            </div>

            <div className={styles.footer_area}>
              <img src={footerImg} className={styles.footer_img}></img>
            </div>



          </div>
          
          {/* <div className={styles.footer_area}>
            <img src={footer_img} className={styles.footer_img}></img>
          </div> */}


        </div>
        
    </div>
  )
}

export default Details