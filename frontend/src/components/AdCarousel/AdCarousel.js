import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselCard from './CarouselCard/CarouselCard';
import styles from './AdCarousel.module.css'; // Assuming you create a CSS module for styles

function AdCarousel() {
  return (
    <Carousel fade className={styles.carousel}>
      <Carousel.Item>
        <CarouselCard src="/images/1a.jpg" alt="First slide">
        </CarouselCard>
      </Carousel.Item>

      <Carousel.Item>
        <CarouselCard src="/images/2a.jpg" alt="Second slide">
        </CarouselCard>
      </Carousel.Item>
    </Carousel>
  );
}

export default AdCarousel;
