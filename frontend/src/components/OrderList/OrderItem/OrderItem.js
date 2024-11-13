import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./OrderItem.module.css";

const OrderItem = ({
  orderItem,
  onAcknowledgeReceipt,
  onShipOut,
  currentView,
}) => {
  const {
    item: { itemName, itemQuantity, itemOrderPrice },
    hasShipped,
    isCompleted, // Ensure this property is passed in
  } = orderItem;

  const totalPrice = itemQuantity * itemOrderPrice;

  const handleReceiptAcknowledgment = () => {
    if (onAcknowledgeReceipt) {
      onAcknowledgeReceipt(orderItem); // Pass the orderItem to the parent
    }
  };

  const handleShipOut = () => {
    if (onShipOut) {
      onShipOut(orderItem); // Pass the orderItem to the parent for shipping out
    }
  };

  return (
    <Container fluid className={`${styles.orderItemContainer} ${isCompleted ? styles.completed : ""}`}>
      <Row className="align-items-center">
        <Col lg={8} md={6} sm={12} className={styles.itemDetails}>
          <span className={styles.itemName}>{itemName}</span>
          <span className={styles.itemQuantity}>Quantity: {itemQuantity}</span>
          <span className={styles.itemOrderPrice}>
            Price: ${itemOrderPrice.toFixed(2)}
          </span>
          <span className={styles.totalPrice}>
            Total: ${totalPrice.toFixed(2)}
          </span>
        </Col>
        <Col lg={2} md={4} sm={12} className={styles.shipmentStatus}>
          <span className={styles.status}>
            Status: {hasShipped ? "Shipped" : "Not Shipped"}
          </span>
        </Col>
        <Col lg={2} md={2} sm={12} className="text-end">
          {isCompleted ? (
            <span className={`${styles.completedRemark} text-success fw-bold`}>
              COMPLETED
            </span>
          ) : (
            <>
              {currentView === "profile" && (
                <Button
                  className={styles.receiptButton}
                  onClick={handleReceiptAcknowledgment}
                  disabled={!hasShipped} // Disable the button if hasShipped is false
                  title={!hasShipped ? "Item has not been shipped yet." : ""}
                >
                  Received Order
                </Button>
              )}
              {currentView === "myshop" && (
                <Button
                  className={`${styles.shipButton} ${hasShipped ? styles.faded : ""}`}
                  onClick={handleShipOut}
                >
                  Ship Out
                </Button>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderItem;
