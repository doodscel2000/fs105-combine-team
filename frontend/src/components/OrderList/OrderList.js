import React, { useEffect, useState } from 'react';
import OrderItem from './OrderItem';
import styles from './OrderList.module.css'; // Importing the CSS module
import { useAuth } from '../../contexts/authContext/authContext';
import axios from 'axios';

const OrderList = ({ currentView }) => {
    
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let response;

        if (currentView === "profile") {
            console.log('profile');
          response = await fetch(`${process.env.REACT_APP_API_URL}/orders/customer/${userId}`);
        } else if (currentView === "myshop") {
            console.log('myshop');
          response = await fetch(`${process.env.REACT_APP_API_URL}/orders/seller/${userId}`);
        } else {
          throw new Error("Invalid view");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentView, userId]);

  const handleAcknowledgeReceipt = async (orderItem) => {
    try {
      // Prepare the updated order data
      const updatedOrder = { ...orderItem, isCompleted: true };
  
      // Make the API call to update the order in the database
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/orders/updateOrder/${orderItem._id}`, updatedOrder); // Use _id here
  
      if (response.status === 200) {
        // Update local state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderItem._id ? { ...order, isCompleted: true } : order // Use _id for comparison
          )
        );
        alert(`Receipt acknowledged for: ${orderItem.item.itemName}`);
      }
    } catch (error) {
      console.error("Error acknowledging receipt:", error);
      alert("Failed to acknowledge receipt. Please try again.");
    }
  };
  
  const handleShipOut = async (orderItem) => {
    try {
      const updatedOrder = { ...orderItem, hasShipped: true };
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/orders/updateOrder/${orderItem._id}`, updatedOrder);

      if (response.status === 200) {
        // Update local state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderItem.id ? { ...order, hasShipped: true } : order
          )
        );
        alert(`Item shipped out: ${orderItem.item.itemName}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to ship out the item. Please try again.");
    }
  };
  

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.orderListContainer}>
      <h3>Your Orders</h3>
      {orders.length > 0 ? (
        <div className={styles.orderItemsContainer}>
          {orders.map(orderItem => (
            <OrderItem 
              key={orderItem._id} // Ensure to use a unique key
              orderItem={orderItem} 
              onAcknowledgeReceipt={handleAcknowledgeReceipt}
              onShipOut={handleShipOut}
              currentView={currentView}
            />
          ))}
        </div>
      ) : (
        <div>No orders found.</div>
      )}
    </div>
  );
};

export default OrderList;
