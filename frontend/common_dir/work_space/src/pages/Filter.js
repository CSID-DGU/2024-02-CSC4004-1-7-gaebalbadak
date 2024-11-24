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
                <div className={styles.filter_thema_text}>정렬</div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>평점순</button>
                  <button type="button" className={styles.unpressedButton}>최신순</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}>분류</div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>한식</button>
                  <button type="button" className={styles.unpressedButton}>중식</button>
                  <button type="button" className={styles.unpressedButton}>일식</button>
                  <button type="button" className={styles.unpressedButton}>아시아</button>
                  <button type="button" className={styles.unpressedButton}>간식</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}></div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.unpressedButton}>카페</button>
                  <button type="button" className={styles.unpressedButton}>술집</button>
                  <button type="button" className={styles.unpressedButton}>기타</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}>테마</div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>상관없음</button>
                  <button type="button" className={styles.unpressedButton}>외식</button>
                  <button type="button" className={styles.unpressedButton}>데이트</button>
                  <button type="button" className={styles.unpressedButton}>접대</button>
                  <button type="button" className={styles.unpressedButton}>친구</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}></div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>외국손님</button>
                  <button type="button" className={styles.unpressedButton}>회식</button>
                  <button type="button" className={styles.unpressedButton}>모임</button>
                  <button type="button" className={styles.unpressedButton}>기념일</button>
                  <button type="button" className={styles.unpressedButton}>혼자</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}>지역</div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.pressedButton}>목정동</button>
                  <button type="button" className={styles.unpressedButton}>신림동</button>
                  <button type="button" className={styles.unpressedButton}>예관동</button>
                  <button type="button" className={styles.unpressedButton}>오장동</button>
                  <button type="button" className={styles.unpressedButton}>을지로 3가</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}></div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.unpressedButton}>을지로 4가</button>
                  <button type="button" className={styles.unpressedButton}>을지로 5가</button>
                  <button type="button" className={styles.unpressedButton}>인현동 1가</button>
                  <button type="button" className={styles.unpressedButton}>인현동 2가</button>
                  <button type="button" className={styles.unpressedButton}>장충동 2가</button>
                </div>
              </div>
              <div className={styles.buttons_line}>
              <div className={styles.filter_thema_text}></div>
                <div className={styles.filter_buttons_line}>
                  <button type="button" className={styles.unpressedButton}>주교동</button>
                  <button type="button" className={styles.unpressedButton}>초동</button>
                  <button type="button" className={styles.unpressedButton}>충무로 3가</button>
                  <button type="button" className={styles.unpressedButton}>충무로 4가</button>
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
                  <img src={ping} className={styles.ping_img}></img>
                </div>
                <div className={styles.result_title_text}>
                  서울카츠
                </div>
              </div>

              <div className={styles.result_contents}>
                <div className={styles.result_contents_text}>
                  주소: 서울 중구 서애로 13-2<br></br>
                  번호: 02-449-6234<br></br>
                  메뉴: 등심카츠(14,000)<br></br>
                  주차: 가능<br></br>
                  영업시간: 10:00~20:00
                </div>
                <img src={restaurant_1} className={styles.restuarant}></img>
              </div>
            </div>

            <div className={styles.result}>
              <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img}></img>
                </div>
                <div className={styles.result_title_text}>
                  장충족발
                </div>
              </div>

              <div className={styles.result_contents}>
                <div className={styles.result_contents_text}>
                  주소: 서울 중구 서애로 13-2<br></br>
                  번호: 02-612-5223<br></br>
                  메뉴: 족발(大) (42,000)<br></br>
                  주차: 불가<br></br>
                  영업시간: 14:00~22:00
                </div>
                <img src={restaurant_2} className={styles.restuarant}></img>
              </div>
            </div>
    
            <div className={styles.last_result}>
              <div className={styles.result_title}>
                <div className={styles.ping_area}>
                  <img src={ping} className={styles.ping_img}></img>
                </div>
                <div className={styles.result_title_text}>
                  옛날농장
                </div>
              </div>

              <div className={styles.result_contents}>
                <div className={styles.result_contents_text}>
                  주소: 서울 중구 서애로 13-2<br></br>
                  번호: 02-723-9182<br></br>
                  메뉴: 꽃등심 1인 人 (1,00,000)<br></br>
                  주차: 가능<br></br>
                  영업시간: 11:00~23:00
                </div>
                <img src={restaurant_3} className={styles.restuarant}></img>
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
