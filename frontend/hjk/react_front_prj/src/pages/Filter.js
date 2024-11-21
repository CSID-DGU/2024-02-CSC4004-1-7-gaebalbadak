import React from 'react'
import styles from './Filter.module.css'

import logo from '../assets/img/filter-logo-img.png'
import refreshButton from '../assets/img/refresh-icon.png'
import footer_img from '../assets/img/footer.png'

const Filter = () => {
  return (
    <div className={styles.wrapper}>
    <div className={styles.header}></div>
    <div className={styles.contents}>
      <div className={styles.logo_area}>
        <img src={logo} className={styles.logo_img} alt='logo'></img>
      </div>
      <div className={styles.contents_area}>
        <div className={styles.raw_text_area}>
          <div className={styles.raw_text_filter}>필터 | </div>
          <div className={styles.refresh_icon_area}>
            <button type="button" className={styles.refresh_button}>
              <img src={refreshButton} className={styles.refresh_button_img} alt="refresh_button"></img>
            </button>
          </div>
          <div className={styles.raw_refresh_text}>
              <div className={styles.raw_refres_text_area}>초기화</div>
          </div>
        </div>
        <div className={styles.buttons_area}>
          <div className={styles.buttons_sum}>

          </div>
          <div className={styles.apply_button}>
            
          </div>
        </div>
        <div className={styles.filter_result_text_area}>

        </div>
        <div className={styles.filter_result_area}>

        </div>
      </div> 
      <div className={styles.footer_area}>
        <img src={footer_img} className={styles.footer_img}></img>
      </div>
    </div>
</div>
  )
}

export default Filter