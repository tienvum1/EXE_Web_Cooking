import React from 'react';
import styles from './WellnessChefSection.module.scss';

const WellnessChefSection = () => (
  <section className={styles.container}>
    <div className={styles.content}>
      <h2 className={styles.title}>Everyone can become a wellness chef,<br />creating nutritious and healthy meals in their own home kitchen.</h2>
      <p className={styles.description}>Fuel your body with wholesome ingredients, embrace a balanced lifestyle, and make every meal a step toward better health!</p>
      <button className={styles.button}>Learn More</button>
    </div>
    <div>
      {/* Thay đổi src hình ảnh bên dưới thành hình đầu bếp phù hợp */}
      <img src="/chef.png" alt="Chef" className={styles.image} />
    </div>
  </section>
);

export default WellnessChefSection; 