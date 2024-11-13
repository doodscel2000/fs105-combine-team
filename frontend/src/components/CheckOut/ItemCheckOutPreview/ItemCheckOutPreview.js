// ItemCheckOutPreview.js
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Image } from 'react-bootstrap'; // Import necessary components from React-Bootstrap
import styles from './ItemCheckOutPreview.module.css'; // CSS module for styling

const ItemCheckOutPreview = ({ item: { id, name, quantity, price, imageUrls } }) => {
  const total = price * quantity;

  return (
    <Row className={styles.itemPreview}>
      <Col xs={4} md={3}>
        <Image 
          src={imageUrls[0]} 
          alt={name} 
          fluid 
          className={styles.itemImage} // Use CSS module for styling
        />
      </Col>
      <Col xs={8} md={9}>
        <p><strong>{name}</strong></p>
        <p>Quantity: {quantity}</p>
        <p>Price: ${price.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </Col>
    </Row>
  );
};

ItemCheckOutPreview.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired, // Include imageUrls prop
  }).isRequired,
};

export default ItemCheckOutPreview;
