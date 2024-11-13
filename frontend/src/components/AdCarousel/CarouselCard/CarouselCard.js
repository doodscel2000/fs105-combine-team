import React from 'react';
import styles from './CarouselCard.module.css';

const CarouselCard = ({ src, alt, children }) => {
  return (
    <div className={styles.carouselCard}>
        <div className={styles.card}>
          <img src={src} alt={alt} className={styles.cardImage} />
          {children} {/* Content wrapped inside the card */}
        </div>
    </div>
  );
};

export default CarouselCard;
