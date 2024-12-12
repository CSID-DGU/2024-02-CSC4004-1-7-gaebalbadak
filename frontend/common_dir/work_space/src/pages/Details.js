//필요한 모듈들 import
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Details.module.css';
import NaverMap from '../components/NaverMap';

//필요한 이미지들 import
import logo from '../assets/img/filter-logo-img.png';
import ping from '../assets/img/ping.png';

import ai_gauge from '../assets/img/ai_gauge_bar.png';
import aiGaugeLevel5 from '../assets/img/ai_gauge_bar_level_5.png';
import aiGaugeLevel4 from '../assets/img/ai_gauge_bar_level_4.png';
import aiGaugeLevel3 from '../assets/img/ai_gauge_bar_level_3.png';
import aiGaugeLevel2 from '../assets/img/ai_gauge_bar_level_2.png';
import aiGaugeLevel1 from '../assets/img/ai_gauge_bar_level_1.png';

import zeroStar from '../assets/img/zero_star.png';
import oneStar from '../assets/img/one_star.png';
import twoStar from '../assets/img/two_star.png';
import threeStar from '../assets/img/three_star.png';
import fourStar from '../assets/img/four_star.png';
import fiveStar from '../assets/img/five_star.png';

import restaurant_img from '../assets/img/main-logo-img.png';
import footer_img from '../assets/img/footer.png';  


const Details = () => {
  //필요한 변수들 선언
  const { id } = useParams(); // URL에서 id 가져오기 -> router에서 동적으로 details/id 로 url을 생성하기 위해 필요
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState(null);
  const [logoImg, setLogoImg] = useState(logo);
  const [pingImg, setPingImg] = useState(ping);
  const [aiGaugeImg, setAiGauge] = useState(ai_gauge);
  const [restaurantImg, setRestaurantImg] = useState(restaurant_img);
  const [footerImg, setFooterImg] = useState(footer_img);
  const [fiveStarImg, setFiveStarImg] = useState(fiveStar);
  const [threeStarImg, setThreeStarImg] = useState(threeStar);
  const [activeButton, setActiveButton] = useState(null);
  const [restaurantName, setRestaurantName] = useState();
  const [aiScore, setAiScore] = useState('0');
  const [aiPredicAccur, setAiPredicAccur] = useState('0');
  const [reviewSummaryText, setReviewSummaryText] = useState('0');
  const [overViewText, setOverViewText] = useState('null');
  const [overViewAiPositiveText, setOverViewAiPositiveText] = useState('null'); //'긍정리뷰 요약'
  const [overViewAiNegativeText, setOverViewAiNegativeText] = useState('null');
  const [averageRate, setAverageRate] = useState([]);
  const [fakeReviewRate, setfakeReviewRate] = useState('0');
  const [truthReviewRate, setTruthReviewRate] = useState('0');
  const [totalReviewRate, setTotalReviewRate] = useState('0');
  const [baeminReviewCount, setBaeminReviewCount] = useState('0');
  const [naverReviewCount, setNaverReviewCount] = useState('0');
  const [coupangEatsCount, setCoupangEatsCount] = useState('0');
  const [baeminReviewScore, setBaeminReviewScore] = useState('0');
  const [naverReviewScore, setNaverReviewScore] = useState('0');
  const [coupangEatsScore, setCoupangEatsScore] = useState('0');
  const [positiveReviewRatio, setPositiveReviewRatio] = useState('0');
  const [negativeReviewRatio, setNegativeReviewRatio] = useState('0');
  const [neutralReviewRatio, setNeutralReviewRatio] = useState('0');
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  //restApi를 통해 서버에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        //http://34.47.82.254:8000/api/restaurants/${id}/details  --> 실제 서버 ip
        //http://localhost:8000/api/restaurants/${id}/details/  --> 로컬 환경 test
        const response = await fetch(`http://localhost:8000/api/restaurants/${id}/details`);
        if (!response.ok) throw new Error('Failed to fetch data');

        //restApi에서 가져온 결과를 저장
        const results = await response.json();
        const positiveRatio = Math.floor(results.ai_review.review_sentiment_ratio.positive * 100);
        const negativeRatio = Math.floor(results.ai_review.review_sentiment_ratio.negative * 100);

        //콘솔에서 결과 check하기
        console.log(results);
        console.log(results.ai_review);
        console.log(results.ai_review.review_sentiment_ratio);
        console.log('Positive Review Ratio:', positiveRatio);
        console.log('Negative Review Ratio:', negativeRatio);

        // 상태 업데이트
        setRestaurantName(results.restaurant.name || 'null');
        setAiScore(Math.floor(results.restaurant.ai_review_score) || '0');
        setAiPredicAccur(Math.floor(results.restaurant.prediction_accuracy) || '0');
        setAverageRate(results.restaurant.average_rating || 0);
        setRestaurantImg(results.restaurant.main_image_url || restaurant_img);
        setReviewSummaryText(results.ai_review.opinion || 'Not Available');
        setOverViewAiPositiveText(results.ai_review.review_summary.positive_summary); // || '긍정리뷰 요약'
        setOverViewAiNegativeText(results.ai_review.review_summary.negative_summary); // || '부정리뷰 요약'
        setfakeReviewRate(Math.round(results.ai_review.review_fake_ratio * 100));
        setPositiveReviewRatio(positiveRatio);
        setNegativeReviewRatio(negativeRatio);
        setLatitude(results.restaurant.latitude); // || 37.561118
        setLongitude(results.restaurant.longitude); // || 126.995013
        setOverViewText(
          results.ai_review.overview.description === "No description available."
            ? "가게에서 설정한 소개글이 없습니다."
            : results.ai_review.overview.description || "플랫폼에 있는 가게 소개글입니다."
        );

        //리뷰 카운트가 모두 0개 인 경우 대가성 리뷰 비율이 0이 되도록
        if (baeminReviewCount === 0 && naverReviewCount === 0 && coupangEatsCount=== 0) {
          setTruthReviewRate(0);
        } else {
          setTruthReviewRate(1 - fakeReviewRate);
        }

        // 긍정과 부정 비율 모두 0이면 중립 비율도 0이 되도록
        if (positiveRatio === 0 && negativeRatio === 0) { setNeutralReviewRatio(0); } 
        else { setNeutralReviewRatio(100 - positiveRatio - negativeRatio); }

        // 리뷰 데이터 처리 (processReviewData 호출)
        if (results.reviews) { processReviewData(results.reviews); }

        // 로컬 스토리지에 데이터 저장
        saveToLocalStorage({
          id,
          restaurantName: results.restaurant.name || 'null',
          aiScore: Math.floor(results.restaurant.ai_review_score) || '0',
          fakeReviewRate: results.ai_review.review_fake_ratio || 0,
          address: results.restaurant.road_address || 'Unknown Address',
          imgUrl: results.restaurant.main_image_url || restaurant_img,
          hasReviewEvent: (results.restaurant.has_review_event === true ? 'O' : 'X') || 'O',
          truthRatio: Math.floor(results.restaurant.prediction_accuracy * 100) || 0,
          averageRate: results.restaurant.average_rating || 0
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  //변수가 변화할 때 마다 실시간으로 재 랜더링을 수행하도록 설정
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
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  //AiScore에 따른 점수 text의 색상 변경 기능
  const updateScoreColor = (score) => {
    if (score > 80) {
      document.documentElement.style.setProperty('--ai-score-color', '#1DDB16');
    } else if (score > 60) {
      document.documentElement.style.setProperty('--ai-score-color', '#fde11d');
    } else if (score > 40) {
      document.documentElement.style.setProperty('--ai-score-color', '#ffbe2a');
    } else if (score > 20) {
      document.documentElement.style.setProperty('--ai-score-color', '#ff7a39');
    } else {
      document.documentElement.style.setProperty('--ai-score-color', '#fa2524');
    }
  };

  //진실리뷰 분류 정확도에 따른 text의 색상 변경 기능
  const updatePredicAccColor = (score) => {
    if (score > 80) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#1DDB16');
    } else if (score > 60) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#fde11d');
    } else if (score > 40) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#ffbe2a');
    } else if (score > 20) {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#ff7a39');
    } else {
      document.documentElement.style.setProperty('--ai-predic-acc-color', '#fa2524');
    }
  };

  //종합판단 결과에 따른 text 색상 변경 기능
  const updateReviewSummaryText = (summary) => {
    if (summary == 'GOOD') {
      document.documentElement.style.setProperty('--ai-reveiw-summary-color', '#1DDB16');
    } else {
      document.documentElement.style.setProperty('--ai-reveiw-summary-color', '#fde11d');
    }   
  };

  //aiscore에 따른 gauge 이미지 변경 기능
  const updateGaugeBar = (score) => {
    if (score > 80) {
      setAiGauge(aiGaugeLevel5);
    } else if (score > 60) {
      setAiGauge(aiGaugeLevel4);
    } else if (score > 40) {
      setAiGauge(aiGaugeLevel3);
    } else if (score > 20) {
      setAiGauge(aiGaugeLevel2);
    } else {
      setAiGauge(aiGaugeLevel1);
    }
  };

  //필터 및 홈 버튼 클릭시 해당 페이지로 이동 기능
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "filter") {
      navigate("/filter");
    } else if (buttonName === "home") {
      navigate("/main");
    }
  };

  // 로컬스토리지를 통해 최근 방문한 내역을 저장 기능
  const saveToLocalStorage = (data) => {
    const existingData = JSON.parse(localStorage.getItem("restaurantDetailsList")) || [];
    // 중복 방지: 이미 있는 id는 덮어쓰지 않도록 필터링
    const filteredData = existingData.filter(item => item.id !== data.id);

    //새 데이터를 기존 데이터 앞에 추가
    const updatedData = [
      {
        id: data.id,
        restaurantName: data.restaurantName || 'null',
        aiScore: Math.floor(data.aiScore) || 0,
        averageRate: data.averageRate || 0,
        address: data.address || 'Unknown Address',
        imgUrl: data.imgUrl || '',
        hasReviewEvent: data.hasReviewEvent || 'N/A',
        fakeReviewRate: data.fakeReviewRate || 0
      },
      ...filteredData
    ];

    // 로컬스토리지에 저장
    localStorage.setItem("restaurantDetailsList", JSON.stringify(updatedData));
  };

  //리뷰데이터에 대한 정보를 가져오기 기능
  const processReviewData = (reviews) => {
    // 기본값 설정
    let baeminCount = "0";
    let naverCount = "0";
    let coupangCount = "0";
    let baeminScore = "0";
    let naverScore = "0";
    let coupangScore = "0";

    // 리뷰 데이터 순회
    reviews.forEach((review) => {
      if (review.platform === "배달의 민족") {
        baeminCount = review.count;
        baeminScore = review.avg_score;
      } else if (review.platform === "네이버 지도") {
        naverCount = review.count;
        naverScore = review.avg_score;
      } else if (review.platform === "쿠팡이츠") {
        coupangCount = review.count;
        coupangScore = review.avg_score;
      }
    });

    // 상태 업데이트
    setBaeminReviewCount(baeminCount);
    setNaverReviewCount(naverCount);
    setCoupangEatsCount(coupangCount);
    setBaeminReviewScore(baeminScore);
    setNaverReviewScore(naverScore);
    setCoupangEatsScore(coupangScore);
  };

  //리뷰 점수에 따른 별점 이미지 설정하기 기능
  const getStarImage = (score) => {
    if (score >= 4.5) return fiveStar;
    if (score >= 3.5) return fourStar;
    if (score >= 2.5) return threeStar;
    if (score >= 1.5) return twoStar;
    if (score >= 0.5) return oneStar;
    if (score > 0) return oneStar;
    return zeroStar;
  };

  //실제 화면 구현부
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
                    <div className={styles.ai_predic_accuracy}>{aiPredicAccur} <span className={styles.percent}> %</span></div>
                    <div className={styles.ai_predic_acc_text}>진실리뷰 분류 정확도</div>
                    <div className={styles.ai_predic_acc_description}>*진실리뷰 분류 정확도는 진실리뷰 <br></br> 비율에 대한 정확도를 의미합니다.</div>
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
                <div className={styles.overview_raw_text_area}>Store Description</div>
                <div className={styles.overview_text_area}>
                    {overViewText}
                </div>
                <div className={styles.overview_raw_text_area}>A.i - Review Summary</div>
                <div className={styles.overview_ai_text_area}>
                    <div className={styles.overview_ai_positive_text_area}>긍정 리뷰 요약: {overViewAiPositiveText}</div>
                    <div className={styles.overview_ai_negative_text_area}>부정 리뷰 요약: {overViewAiNegativeText}</div>
                    <div className={styles.overview_ai_neutral_text_area}> 대가성 리뷰 비율: {fakeReviewRate}%</div>
                </div>

                <div className={styles.overview_under_ai_text_area}>
                    <div className={styles.overview_under_left_side}>
                      <div className={styles.ovw_under_left_wrapper}>
                        <div className={styles.ovw_under_left_text}>
                          <div className={styles.ovw_ult_top}>
                            <div className={styles.ovw_ult_top_top}>
                              <div className={styles.ovw_ult_top_top_1}>배민 리뷰</div>
                              <div className={styles.ovw_ult_top_top_2}>({baeminReviewCount}개)</div>
                            </div>
                            <div className={styles.ovw_ult_top_bottom}>
                              <img src={getStarImage(baeminReviewScore)} className={styles.ovw_ult_top_img} alt="star" />
                            </div>
                          </div>

                          <div className={styles.ovw_ult_mid}>
                            <div className={styles.ovw_ult_mid_mid}>
                              <div className={styles.ovw_ult_mid_mid_1}>네이버 리뷰</div>
                              <div className={styles.ovw_ult_mid_mid_2}>({naverReviewCount}개)</div>
                            </div>
                            <div className={styles.ovw_ult_mid_bottom}>
                              <img src={getStarImage(naverReviewScore)} className={styles.ovw_ult_mid_img} alt="star" />
                            </div>
                          </div>

                          <div className={styles.ovw_ult_bottom}>
                            <div className={styles.ovw_ult_bottom_bottom}>
                              <div className={styles.ovw_ult_bottom_bottom_1}>쿠팡이츠 리뷰</div>
                              <div className={styles.ovw_ult_bottom_bottom_2}>({coupangEatsCount}개)</div>
                            </div>
                            <div className={styles.ovw_ult_bottom_bottom_bottom}>
                              <img src={getStarImage(coupangEatsScore)} className={styles.ovw_ult_bottom_bottom_bottom_img} alt="star" />
                            </div>
                          </div>

                          <div className={styles.info_message}>
                            평균 평점이 없는 경우는 <br></br> 0점으로 표기됩니다
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
        </div>
    </div>
  )
}

export default Details