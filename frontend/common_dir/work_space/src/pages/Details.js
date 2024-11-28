import React from 'react'
import styles from './Details.module.css'
import NaverMap from '../components/NaverMap'

import logo from '../assets/img/filter-logo-img.png'
import ping from '../assets/img/ping.png'
import ai_gauge from '../assets/img/ai_gauge_bar.png'
import restaurant_img from '../assets/img/seoulkatsu.jpg'
import footer_img from '../assets/img/footer.png'
import five_star from '../assets/img/five_star.png'
import three_star from '../assets/img/three_star.png'
import { useState } from 'react'

const Details = () => {

  let [logoImg, setLogoImg] = useState(logo);
  let [pingImg, setPingImg] = useState(ping);
  let [aiGaugeImg, setAiGauge] = useState(ai_gauge);
  let [restaurantImg, setRestaurantImg] = useState(restaurant_img);
  let [footerImg, setFooterImg] = useState(footer_img);
  let [fiveStarmg, setFiveStarImg] = useState(five_star);
  let [threeStarImg, setThreeStarImg] = useState(three_star);

  let [restaurantName, setRestaurantName] = useState('서울카츠');
  let [aiScore, setAiScore] = useState('65');
  let [aiPredicAccur, setAiPredicAccur] = useState('80');
  let [reviewSummaryText, setReviewSummaryText] = useState('Not Bad');
  let [overViewText, setOverViewText] = useState('플랫폼에 있는 가게 소개글입니다.')
  let [overViewAiPositiveText, setOverViewAiPositiveText] = useState('긍정리뷰 요약')
  let [overViewAiNegativeText, setOverViewAiNegativeText] = useState('부정리뷰 요약')
  let [overViewAiNeutralText, setOverViewAiNeutralText] = useState('중립리뷰 요약')

  let [baeminReviewCount, setBaeminReviewCount] = useState('100');
  let [naverReviewCount, setNaverReviewCount] = useState('180');
  let [coupangEatsCount, setCoupangEatsCount] = useState('250');

  let [positiveReviewRatio, setPositiveReviewRatio] = useState('70');
  let [negativeReviewRatio, setNegativeReviewRatio] = useState('60');
  let [neutralReviewRatio, setNeutralReviewRatio] = useState('50');

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
                          <NaverMap></NaverMap>
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