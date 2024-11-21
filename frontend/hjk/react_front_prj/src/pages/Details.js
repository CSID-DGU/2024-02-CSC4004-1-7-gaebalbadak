import React from 'react'
import styles from './Details.module.css'
import logo from '../assets/img/detail-icon-img.png'
import ping from '../assets/img/ping.png'

const Details = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.header}></div>
        <div className={styles.contents}>
          <img src={logo} className={styles.logo_img} alt='logo'></img>

          <div className={styles.restaurants_name_area}>
              <img src={ping} className={styles.ping_img} alt='ping'></img>
              <div className={styles.nameText}>서울카츠</div>
          </div>
          <div className={styles.contents_area}>
            <div className={styles.review_area}>
              
            </div>
            <div className={styles.overview_area}>
              
            </div>
          </div>
        </div>
    </div>
  )
}

export default Details