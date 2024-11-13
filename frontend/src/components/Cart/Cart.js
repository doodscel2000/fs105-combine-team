import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/authContext";
import { useCart } from "../../contexts/cartContext/cartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartItem from "./CartItem/CartItem"; // Import the CartItem component
import styles from "./Cart.module.css";

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateQuantity, removeFromCart } = useCart();
  const [fullCartItems, setFullCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set()); // Set to keep track of selected items

  useEffect(() => {
    const fetchCartData = async () => {
      console.log("fetch cart - useEffect");
      if (currentUser) {
        try {
          const cartResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/cart/${currentUser.uid}`
          );
          const cartItems = cartResponse.data.items || [];

          const itemIds = cartItems.map((item) => item.itemId);
          const itemQuantities = Object.fromEntries(
            cartItems.map((item) => [item.itemId, item.quantity])
          );

          if (itemIds.length > 0) {
            const itemsResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/items/batch`,
              { itemIds }
            );
            const detailedItems = itemsResponse.data.items.map((item) => {
              return {
                itemId: item._id,
                name: item.name,
                price: item.price,
                quantity: itemQuantities[item._id] || 0,
                imageUrls: item.imageUrls,
                userId: cartItems.userId,
                sellerId: item.userId, // Include userId to identify the seller
              };
            });
            setFullCartItems(detailedItems);
          } else {
            setFullCartItems([]);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchCartData();
  }, [currentUser]);

  const handleItemSelect = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId); // Deselect the item if already selected
      } else {
        newSelected.add(itemId); // Select the item if not selected
      }

      // Log the selected items after the state has been updated
      console.log("Selected items:", Array.from(newSelected));
      return newSelected; // Return the updated Set
    });
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    console.log(
      "Quantity changed for item:",
      itemId,
      "New quantity:",
      newQuantity
    );

    // Update the local state
    setFullCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    await updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    // Filter fullCartItems to include only selected items
    const selectedCartItems = fullCartItems.filter((item) =>
      selectedItems.has(item.itemId)
    );
    console.log(
      "Proceeding to checkout with selected items:",
      selectedCartItems
    );

    // Navigate to checkout, passing the filtered array
    navigate("/checkout", { state: { selectedItems: selectedCartItems } });
  };

  const handleRemove = async () => {
    const itemsToRemove = Array.from(selectedItems);
    console.log("Removing items:", itemsToRemove);

    // Implement logic to remove selected items from the cart
    try {
      // Remove items from the server using the context function
      await Promise.all(
        itemsToRemove.map(async (itemId) => {
          // Call the removeFromCart method from context
          await removeFromCart(itemId); // This will handle both state and API removal
        })
      );

      // Update local state to remove the items
      setFullCartItems((prevItems) =>
        prevItems.filter((item) => !itemsToRemove.includes(item.itemId))
      );
      setSelectedItems(new Set()); // Clear selected items after removal
    } catch (error) {
      console.error("Error removing items from cart:", error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {fullCartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {fullCartItems.map((item) => (
            <CartItem
              key={item.itemId}
              item={item}
              quantity={item.quantity} // Pass quantity as prop
              onItemSelect={handleItemSelect}
              onQuantityChange={handleQuantityChange}
            />
          ))}
          <div className="cart-actions">
            <button
              className={styles.button}
              onClick={handleCheckout}
              disabled={selectedItems.size === 0} // Disable if no items are selected
            >
              Checkout
            </button>
            <button
              className={styles.button}
              onClick={handleRemove}
              disabled={selectedItems.size === 0} // Disable if no items are selected
            >
              Remove Selected
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
