import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Image, Carousel, Toast } from "react-bootstrap";
import styles from "./ItemDetail.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/authContext";
import { useCart } from "../../contexts/cartContext/cartContext"; // Import useCart

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;
  const { addToCart } = useCart(); // Use the Cart Context

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/items/details/${itemId}`
        );
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItemDetails();
  }, [itemId]);

  const handleQuantityChange = (value) => {
    setQuantity((prev) => Math.max(0, prev + value));
  };

  const handleAddToCart = () => {
    if (!userId) {
      console.error("User is not logged in.");
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }
  
    // Create an item object with the itemId and quantity
    const itemToAdd = { itemId, quantity };
  
    // Add item to cart using the Cart Context
    addToCart(itemToAdd); // Add the item to the cart context
    setQuantity(0); // Reset quantity input after adding to cart
    setShowToast(true); // Show the toast message
  
    // Hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className={styles.itemDetail}>
      <div className={styles.itemImages}>
        <Carousel interval={null}>
          {item.imageUrls.map((url, index) => (
            <Carousel.Item key={index}>
              <Image
                src={url}
                alt={`Item image ${index + 1}`}
                className={styles.image}
                fluid
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div className={styles.itemInfo}>
        <h2>{item.name}</h2>
        <p>Rating: {item.rating}</p>
        <h4>Price: ${item.price}</h4>
        <div className={styles.quantityControl}>
          <Button className={styles.button} onClick={() => handleQuantityChange(-1)}>-</Button>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value)))}
            className={styles.quantityInput}
          />
          <Button className={styles.button} onClick={() => handleQuantityChange(1)}>+</Button>
          <Button 
            variant="primary"
            onClick={handleAddToCart}
            className={`${styles.addToCartButton} ${
              quantity === 0 ? styles.faded : ""
            }`}
          >
            Add to Cart
          </Button>
        </div>
        <div className={styles.itemDescription}>
          <p>{item.description}</p>
        </div>
      </div>

      {/* Toast for visual feedback */}
      <Toast 
        onClose={() => setShowToast(false)} 
        show={showToast} 
        delay={3000} 
        autohide 
        className={styles.addToCartToast}
      >
        <Toast.Body>Item added to cart!</Toast.Body>
      </Toast>
    </div>
  );
};

export default ItemDetail;
