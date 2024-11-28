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


const Details = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.header}></div>
        <div className={styles.contents}>
          <div className={styles.logo_area}>
            <img src={logo} className={styles.logo_img} alt='logo'></img>
          </div>
          <div className={styles.restaurants_name_area}>
              <img src={ping} className={styles.ping_img} alt='ping'></img>
              <div className={styles.nameText}>서울카츠</div>
          </div>
          <div className={styles.contents_area}>
            <div className={styles.review_area}>
              <div className={styles.ai_score_area}>
                  <div className={styles.ai_score_text}>65</div>
                  <img src={ai_gauge} className={styles.ai_gauge_img} alt='ai_gauge'></img>
                  <div className={styles.text_about_ai}>A.I<br></br>score</div>
              </div>
              <div className={styles.ai_prediction_area}>
                  <div className={styles.ai_predic_area_wrapper}>
                    <div className={styles.ai_predic_accuracy}>80</div>
                    <div className={styles.ai_predic_acc_text}>Ai 예측 정확도</div>
                    <div className={styles.ai_predic_acc_description}>*예측 정확도는  A.i score의 <br></br> 정확도를 의미합니다.</div>
                  </div>
              </div>
              <div className={styles.review_summary_area}>
                  <div className={styles.review_summary_wrapper}>
                    <div className={styles.review_summary_text}>"Not Bad"</div>
                    <div className={styles.restaurants_img_area}>
                      <img src={restaurant_img} className={styles.restaurant_img} alt='restaurant_img'></img>
                    </div>
                  </div>
              </div>
            </div>
            <div className={styles.overview_area}>
              <div className={styles.overview_bottom_area}>
                <div className={styles.overview_raw_text_area}>Overview</div>
                <div className={styles.overview_ai_text_area}>
                    프랑스식 홈메이드 스타일 이탈리안요리 전문 레스토랑으로 10년 동안 변함 없는 맛으로 사랑받고 있습니다.
                    고급스러운 분위기와 합리적인 가격의 코스요리를 선보이고 있습니다. 기본에 충실하면서도 스타일을 주는 섬세한 
                    노력이 묻어나는 맛입니다. 전체적으로 최고 수준의 맛을 느낄 수 있을 것입니다. 브레이크 타임은 15시 ~ 17시 입니다.
                    감사합니다.
                </div>
                <div className={styles.overview_raw_text_area}>A.i - Review Summary</div>
                <div className={styles.overview_ai_text_area}>
                    프랑스식 홈메이드 스타일 이탈리안요리 전문 레스토랑으로 10년 동안 변함 없는 맛으로 사랑받고 있습니다.
                    고급스러운 분위기와 합리적인 가격의 코스요리를 선보이고 있습니다. 기본에 충실하면서도 스타일을 주는 섬세한 
                    노력이 묻어나는 맛입니다. 전체적으로 최고 수준의 맛을 느낄 수 있을 것입니다. 브레이크 타임은 15시 ~ 17시 입니다.
                    감사합니다.
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
                                (100개)
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
                                (180개)
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
                                (200개)
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
                              70%
                            </div>
                          </div>
                          <div className={styles.ovw_under_right_side_top_2}>
                            <div className={styles.over_under_right_side_top2_top}>
                              부정 리뷰 비율:
                            </div>
                            <div className={styles.over_under_right_side_top2_bottom}>
                              20%
                            </div>
                          </div>
                          <div className={styles.ovw_under_right_side_top_3}>
                            <div className={styles.ovw_under_right_side_top_3_top}>
                              중립 리뷰 비율:
                            </div>
                            <div className={styles.ovw_under_right_side_top_3_bottom}>
                              10%
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
              <img src={footer_img} className={styles.footer_img}></img>
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