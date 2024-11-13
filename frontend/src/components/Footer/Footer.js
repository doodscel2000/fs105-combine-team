import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>Peddler - The Marketplace, <span className={styles.highlight}>Re-imagined</span>.</p>
      <p><a href="mailto:info@peddler.com">info@peddler.com</a></p>
      <div className={styles.socialLinks}>
        <a href="https://www.linkedin.com" className={styles.socialIcon}>LinkedIn</a>
        <a href="https://www.instagram.com" className={styles.socialIcon}>Instagram</a>
        <a href="https://www.facebook.com" className={styles.socialIcon}>Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
