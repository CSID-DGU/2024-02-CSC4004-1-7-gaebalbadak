import React from 'react'
import styles from './Details.module.css'
import logo from '../assets/img/detail-icon-img.png'
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
              <div className={styles.review_star_area}>
                  <div className={styles.review_star_wrapper}>
                    <div className={styles.baemin_review_summary}>배민리뷰</div>
                    <div className={styles.baemin_star_img_area}>
                      <img src={three_star} className={styles.three_star_img} alt='three_star'></img>
                    </div>
                    <div className={styles.naver_review_summary}>네이버리뷰</div>
                    <div className={styles.naver_star_img_area}>
                      <img src={five_star} className={styles.five_star_img} alt='five_star'></img>
                    </div>
                    <div className={styles.coupang_review_summary}>쿠팡리뷰</div>
                    <div className={styles.coupang_star_img_area}>
                      <img src={three_star} className={styles.three_star_img} alt='three_star'></img>
                    </div>
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
              <div className={styles.overview_raw_text_area}>Overview</div>
              <div className={styles.overview_bottom_area}>
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
                            영업시간<br></br>10:00~20:00
                          </div>
                          <div className={styles.ovw_ult_mid}>
                            주차<br></br>가능, 발렛포함 
                          </div>
                          <div className={styles.ovw_ult_mid2}>
                            전화<br></br>02-123-1234
                          </div>
                          <div className={styles.ovw_ult_bottom}>
                            주소<br></br>중구 서애로 13-2
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.overview_under_right_side}>
                      <div className={styles.ovw_under_right_side_top}>

                      </div>
                      <div className={styles.ovw_under_right_side_bottom}>

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
    </div>
  )
}

export default Details