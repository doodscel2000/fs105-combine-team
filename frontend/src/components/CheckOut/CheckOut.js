import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext/authContext";
import { useCart } from "../../contexts/cartContext/cartContext"; // Import your cart context hook
import ItemCheckOutPreview from "./ItemCheckOutPreview/ItemCheckOutPreview";
import styles from "./CheckOut.module.css";

const CheckOut = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { removeFromCart } = useCart(); // Get the removeFromCart function from context
  const selectedItems = location.state?.selectedItems || []; // Retrieve selected items

  console.log(selectedItems);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/userDetail/${currentUser.uid}`
        );
        const data = await response.json();

        if (response.ok) {
          setShippingInfo((prevInfo) => ({
            ...prevInfo,
            name: data.name,
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zip: data.zip || "",
          }));
        } else {
          console.error("Failed to fetch user details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    console.log("Order Summary:", { selectedItems, shippingInfo, paymentInfo });
  
    // Map selectedItems to the expected order item format
    const orderItems = selectedItems.map((item) => ({
      item: {
        itemId: item.itemId,
        itemName: item.name, // Assuming item has a name property
        itemDesc: item.description, // Assuming item has a description property
        itemOrderPrice: item.price,
        itemQuantity: item.quantity,
      },
      shippingAddress: shippingInfo.address, // Directly use shipping address
      hasShipped: false, // Default value, can be updated later
      customerId: currentUser.uid, // Ensure this is a valid ObjectID or adjust schema
      sellerId: item.sellerId, // Ensure this is a valid ObjectID or adjust schema
    }));
  
    // Perform your order submission logic here, then remove items from cart
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/createOrders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItems), // Send array of order items
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.json(); // Read error response for details
        throw new Error(errorResponse.message || "Failed to create order");
      }
  
      const data = await response.json();
      console.log("Order created successfully:", data);
      alert("Order has been placed successfully!");
      
      // If order is successfully submitted, remove items from the cart
      for (const item of selectedItems) {
        await removeFromCart(item.itemId); // Remove each item from the cart
      }
  
      alert("Checkout process initiated! (This is just a placeholder)");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("There was an error processing your order: " + error.message);
    }
  };

  return (
    <Container className={styles.checkoutPage}>
      <h1>Checkout</h1>

      <Row className="mb-4">
        <Col md={6}>
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            {selectedItems.map((item) => (
              <ItemCheckOutPreview key={item.itemId} item={item} />
            ))}
            <p>
              Total: $
              {selectedItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </p>
          </div>
        </Col>

        <Col md={6}>
          <Form onSubmit={handleCheckout} className={styles.checkoutForm}>
            <h2>Shipping Information</h2>
            <Form.Group controlId="shippingName" className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingInfo.name}
                onChange={handleShippingChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="shippingAddress" className="mb-3">
              <Form.Control
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="shippingCity">
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="shippingState">
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="shippingZip">
                  <Form.Control
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={shippingInfo.zip}
                    onChange={handleShippingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h2>Payment Information</h2>
            <Form.Group controlId="paymentCardNumber" className="mb-3">
              <Form.Control
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="paymentExpiryDate">
                  <Form.Control
                    type="text"
                    name="expiryDate"
                    placeholder="Expiry Date (MM/YY)"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="paymentCVV">
                  <Form.Control
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className={styles.button}>Place Order</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckOut;
