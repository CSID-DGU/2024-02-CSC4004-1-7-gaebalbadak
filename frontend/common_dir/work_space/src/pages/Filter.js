import React from 'react';
import styles from './Filter.module.css';

import logo from '../assets/img/filter-logo-img.png';
import refreshButton from '../assets/img/refresh-icon.png';
import ping from '../assets/img/ping.png';
import footer_img from '../assets/img/footer.png';
import restaurant_1 from '../assets/img/restaurant1.png';
import restaurant_2 from '../assets/img/seoulkatsu.jpg';
import restaurant_3 from '../assets/img/restaurant3.png';

const Filter = () => {
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
              <button type="button" className={styles.refresh_button}>
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
                  <button type="button" className={styles.pressedButton}>한식</button>
                  <button type="button" className={styles.unpressedButton}>중식</button>
                  <button type="button" className={styles.unpressedButton}>양식</button>
                  <button type="button" className={styles.unpressedButton}>아시아</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
                <div className={styles.filter_thema_text}></div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>간식</button>
                  <button type="button" className={styles.unpressedButton}>카페</button>
                  <button type="button" className={styles.unpressedButton}>술집</button>
                  <button type="button" className={styles.unpressedButton}>기타</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
                <div className={styles.filter_thema_text}>정렬</div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.unpressedButton}>Ai점수</button>
                  <button type="button" className={styles.unpressedButton}>긍정비율</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
                <div className={styles.filter_thema_text_review}>리뷰이벤트</div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>O</button>
                  <button type="button" className={styles.unpressedButton}>X</button>
                </div>
              </div>
            </div>
          </div>

          <button type="button" className={styles.apply_button}>Apply</button>

          <div className={styles.raw_text_area}>
            <div className={styles.raw_text_filter_result}>필터 검색 결과</div>
          </div>

          <div className={styles.results_area}>
            <div className={styles.result}>
              <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img} alt="Ping" />
                </div>
                <div className={styles.result_title_text}>장충족발</div>
              </div>
              <div className={styles.result_contents}>
                <div className={styles.result_contents_text_1}>
                  <div className={styles.rctc2_1}>Ai score: 65</div>
                  <div className={styles.rctc2_2}>리뷰이벤트: 0</div>
                  <div className={styles.rctc2_3}>Address: 서울 중구 필동 2가</div>
                  <div className={styles.rctc2_4}>진실리뷰비율: 60%</div>
                </div>
                <img
                  src={restaurant_2}
                  className={styles.restaurant}
                  alt="Restaurant 2"
                />
              </div>
            </div>

            <div className={styles.result}>
              <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img} alt="Ping" />
                </div>
                <div className={styles.result_title_text}>장충족발</div>
              </div>
              <div className={styles.result_contents}>
                <div className={styles.result_contents_text_2}>
                  <div className={styles.rctc2_1}>Ai score: 65</div>
                  <div className={styles.rctc2_2}>리뷰이벤트: 0</div>
                  <div className={styles.rctc2_3}>Address: 서울 중구 필동 2가</div>
                  <div className={styles.rctc2_4}>진실리뷰비율: 60%</div>
                </div>
                <img
                  src={restaurant_2}
                  className={styles.restaurant}
                  alt="Restaurant 2"
                />
              </div>
            </div>

            <div className={styles.result}>
              <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img} alt="Ping" />
                </div>
                <div className={styles.result_title_text}>장충족발</div>
              </div>
              <div className={styles.result_contents}>
                <div className={styles.result_contents_text_3}>
                  <div className={styles.rctc2_1}>Ai score: 65</div>
                  <div className={styles.rctc2_2}>리뷰이벤트: 0</div>
                  <div className={styles.rctc2_3}>Address: 서울 중구 필동 2가</div>
                  <div className={styles.rctc2_4}>진실리뷰비율: 60%</div>
                </div>
                <img
                  src={restaurant_2}
                  className={styles.restaurant}
                  alt="Restaurant 2"
                />
              </div>
            </div>

            <div className={styles.last_result}>
              <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img} alt="Ping" />
                </div>
                <div className={styles.result_title_text}>장충족발</div>
              </div>
              <div className={styles.result_contents}>
                <div className={styles.result_contents_text_4}>
                  <div className={styles.rctc2_1}>Ai score: 65</div>
                  <div className={styles.rctc2_2}>리뷰이벤트: 0</div>
                  <div className={styles.rctc2_3}>Address: 서울 중구 필동 2가</div>
                  <div className={styles.rctc2_4}>진실리뷰비율: 60%</div>
                </div>
                <img
                  src={restaurant_2}
                  className={styles.restaurant}
                  alt="Restaurant 2"
                />
              </div>
            </div>
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
