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
              <div className={styles.overview_bottom_area}></div>
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