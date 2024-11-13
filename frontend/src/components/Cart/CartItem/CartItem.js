import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./CartItem.module.css";

const CartItem = ({ item, quantity, onItemSelect, onQuantityChange }) => {
  const handleCheckboxChange = () => {
    onItemSelect(item.itemId);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, quantity + value);
    onQuantityChange(item.itemId, newQuantity);
  };

  const handleInputChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    onQuantityChange(item.itemId, newQuantity);
  };

  const totalPrice = (quantity * item.price).toFixed(2);
  
  // Safely access the image URL
  const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'fallback-image-url.jpg'; // replace with your fallback image URL

  return (
    <Container fluid className={styles.cartItem}>
      <Row className="align-items-center">
        <Col xs="auto">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className={styles.checkbox}
          />
        </Col>
        <Col xs="auto">
          <img src={imageUrl} alt={item.name} className={styles.image} />
        </Col>
        <Col>
          <div className={styles.itemInfo}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.price}>${item.price.toFixed(2)}</span>
          </div>
        </Col>
        <Col xs="auto">
          <div className={styles.quantityEditor}>
            <button 
              className={styles.quantityButton} 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1} // Disable if quantity is 1
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              className={styles.quantityInput}
              min="1" // Ensure the input cannot go below 1
            />
            <button 
              className={styles.quantityButton} 
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        </Col>
        <Col xs="auto" className={styles.totalPrice}>
          Total: ${totalPrice}
        </Col>
      </Row>
    </Container>
  );
};

export default CartItem;
