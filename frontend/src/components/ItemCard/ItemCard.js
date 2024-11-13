import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./ItemCard.module.css";

const ItemCard = ({
  itemId,
  imageUrls, // This can be a string or array depending on your implementation
  itemName,
  price,
  onCardClick,
}) => {

  // Placeholder image URL from Picsum
  const defaultImage = "https://picsum.photos/200/300";

  return (
    <Container
      onClick={() => onCardClick(itemId)}
      className={`${styles.itemCard} p-1`}
      style={{ cursor: "pointer" }} // Optional: Show pointer cursor on hover
    >
      <Row className="h-50 d-flex justify-content-center align-items-center text-center">
        <Col className="h-100 d-flex justify-content-center">
          <img
            src={Array.isArray(imageUrls) ? imageUrls[0] : imageUrls || defaultImage} // Use the first image if it's an array
            alt={itemName}
            className={styles.itemImage} // Updated class name to match the CSS
            onError={(e) => (e.target.src = defaultImage)} // Fallback in case image fails to load
          />
        </Col>
      </Row>
      <Row className="h-50">
        <Col className="h-100">
          <h3 className={styles.itemTitle}>
            {itemName.length > 20 ? `${itemName.slice(0, 20)}...` : itemName}
          </h3>
          <p className={styles.itemPrice}>${price.toFixed(2)}</p>
          {/* <p className={styles.discount}>Discount Placeholder!</p> */}
        </Col>
      </Row>
    </Container>
  );
};

ItemCard.propTypes = {
  itemId: PropTypes.string.isRequired,
  imageUrls: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // Adjusted to accept both string and array
  itemName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  onCardClick: PropTypes.func.isRequired, // Marking as required for clarity
};

export default ItemCard;
