import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import styles from './AdBanner.module.css';  // Assuming you're using module.css for custom styles

const AdBanner = () => {
  return (
    <div className={styles.banner}>
      <Container>
        <Row className="justify-content-center align-items-center" style={{ height: '200px' }}>
          <Col md={8}>
            <h1 className={styles.bannerTitle}>Limited Time Offer!</h1>
            <p className={styles.bannerText}>Get 50% off on your first purchase. Shop now and enjoy exclusive deals!</p>
          </Col>
          <Col md={4} className="text-md-end text-center">
            <Button className={styles.bannerButton} variant="primary" size="lg">
              Shop Now
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdBanner;
