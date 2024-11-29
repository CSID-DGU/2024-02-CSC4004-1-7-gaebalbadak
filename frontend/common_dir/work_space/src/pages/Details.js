import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams 가져오기
import styles from './Details.module.css';
import NaverMap from '../components/NaverMap';

import logo from '../assets/img/filter-logo-img.png';
import ping from '../assets/img/ping.png';
import ai_gauge from '../assets/img/ai_gauge_bar.png';
import restaurant_img from '../assets/img/seoulkatsu.jpg';
import footer_img from '../assets/img/footer.png';
import five_star from '../assets/img/five_star.png';
import three_star from '../assets/img/three_star.png';

const Details = () => {
  const { id } = useParams(); // URL에서 id 가져오기 -> router에서 동적으로 details/id 로 url을 생성하기 위해 필요

  const [logoImg, setLogoImg] = useState(logo);
  const [pingImg, setPingImg] = useState(ping);
  const [aiGaugeImg, setAiGauge] = useState(ai_gauge);
  const [restaurantImg, setRestaurantImg] = useState(restaurant_img);
  const [footerImg, setFooterImg] = useState(footer_img);
  const [fiveStarImg, setFiveStarImg] = useState(five_star);
  const [threeStarImg, setThreeStarImg] = useState(three_star);

  const [restaurantName, setRestaurantName] = useState('서울카츠');
  const [aiScore, setAiScore] = useState('65');
  const [aiPredicAccur, setAiPredicAccur] = useState('80');
  const [reviewSummaryText, setReviewSummaryText] = useState('Not Bad');
  const [overViewText, setOverViewText] = useState('플랫폼에 있는 가게 소개글입니다.');
  const [overViewAiPositiveText, setOverViewAiPositiveText] = useState('긍정리뷰 요약');
  const [overViewAiNegativeText, setOverViewAiNegativeText] = useState('부정리뷰 요약');
  const [overViewAiNeutralText, setOverViewAiNeutralText] = useState('중립리뷰 요약');

  const [baeminReviewCount, setBaeminReviewCount] = useState('100');
  const [naverReviewCount, setNaverReviewCount] = useState('180');
  const [coupangEatsCount, setCoupangEatsCount] = useState('250');

  const [positiveReviewRatio, setPositiveReviewRatio] = useState('70');
  const [negativeReviewRatio, setNegativeReviewRatio] = useState('60');
  const [neutralReviewRatio, setNeutralReviewRatio] = useState('50');

  const [latitude, setLatitude] = useState(37.561118); // 위도 상태 추가
  const [longitude, setLongitude] = useState(126.995013); // 경도 상태 추가

  // 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/restaurant/details/${id}`); // id를 URL에 추가
        if (!response.ok) throw new Error('Failed to fetch data');
        const results = await response.json();

        // 상태 업데이트
        setRestaurantName(results.restaurant.name);
        setAiScore(results.restaurant.ai_review_score.toString());
        setAiPredicAccur(results.restaurant.prediction_accuracy.toString());
        setRestaurantImg(results.restaurant.main_image_url || restaurant_img);

        setReviewSummaryText(results.ai_review.opinion || 'Not Available');
        setOverViewText(results.ai_review.overview.description || '플랫폼에 있는 가게 소개글입니다.');
        setOverViewAiPositiveText(results.ai_review.review_summary.positive_summary || '긍정리뷰 요약');
        setOverViewAiNegativeText(results.ai_review.review_summary.negative_summary || '부정리뷰 요약');
        setOverViewAiNeutralText(results.ai_review.review_summary.neutral || '중립리뷰 요약');

        setBaeminReviewCount(results.ai_review.reviews[0].count || '0');
        setNaverReviewCount(results.ai_review.reviews[1].count || '0');
        setCoupangEatsCount(results.ai_review.reviews[2].count || '0');

        setPositiveReviewRatio(results.ai_review.review_sentiment_ratio.positive * 100);
        setNegativeReviewRatio(results.ai_review.review_sentiment_ratio.negative * 100);
        setNeutralReviewRatio((1 - results.ai_review.review_sentiment_ratio.positive - results.ai_review.review_sentiment_ratio.negative) * 100);

        // 위도와 경도 추가 설정
        setLatitude(results.map.location.latitude || 37.561118);
        setLongitude(results.map.location.longitude || 126.995013);        

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]); // id 변경 시마다 fetch 재실행


  return (
    <div className={styles.wrapper}>
        <div className={styles.header}></div>
        <div className={styles.contents}>
          <div className={styles.logo_area}>
            <img src={logoImg} className={styles.logo_img} alt='logo'></img>
          </div>
          <div className={styles.restaurants_name_area}>
              <img src={pingImg} className={styles.ping_img} alt='ping'></img>
              <div className={styles.nameText}>{restaurantName}</div>
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
                    <div className={styles.overview_ai_positive_text_area}>{overViewAiPositiveText}</div>
                    <div className={styles.overview_ai_negative_text_area}>{overViewAiNegativeText}</div>
                    <div className={styles.overview_ai_neutral_text_area}>{overViewAiNeutralText}</div>
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
                          <NaverMap latitude={latitude} longitude={longitude} /> {/* 위도와 경도 전달 */}
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