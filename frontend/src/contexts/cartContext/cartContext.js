// CartContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../authContext/authContext"; // Adjust import based on your folder structure

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { currentUser, userLoggedIn } = useAuth(); // Access auth context
  const [cart, setCart] = useState([]); // Initialize cart state
  const [uniqueItemCount, setUniqueItemCount] = useState(0); // State for unique item count

  // Function to count unique items in the cart
  const countUniqueItems = (cartItems) => {
    return cartItems.length; // Unique items are simply the length of the cart array
  };

  useEffect(() => {
    const fetchCartData = async () => {
      if (userLoggedIn && currentUser) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart/${currentUser.uid}`);
          const items = response.data.items || []; // Assuming 'items' is the array returned by your API
          setCart(items); // Set the cart state to the array of items
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchCartData();
  }, [userLoggedIn, currentUser]); // Fetch data when user logs in or out

  // Function to add item to cart
  const addToCart = async (item) => {
    try {
      // Update local state
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(cartItem => cartItem.itemId === item.itemId);

        if (existingItemIndex > -1) {
          // If the item exists, update the quantity
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += item.quantity; // Update the quantity
          return updatedCart;
        } else {
          // If it's a new item, add it to the cart
          return [...prevCart, { itemId: item.itemId, quantity: item.quantity }];
        }
      });

      // Send API request to add the item to the cart
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/addToCart`, {
        userId: currentUser.uid, // Include user ID if necessary
        itemId: item.itemId,
        quantity: item.quantity,
      });

      console.log('Item added to cart:', response.data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Optionally, you could also handle reverting the cart state in case of an error
    }
  };

  // New function to update item quantity in the cart
  const updateQuantity = async (itemId, quantity) => {
    try {
      setCart((prevCart) => {
        return prevCart.map((item) =>
          item.itemId === itemId ? { ...item, quantity } : item
        );
      });

      // Send API request to update the item quantity in the cart
      await axios.put(`${process.env.REACT_APP_API_URL}/cart/updateQuantity`, {
        userId: currentUser.uid, // Include user ID if necessary
        itemId,
        quantity,
      });

      console.log('Item quantity updated successfully');
    } catch (error) {
      console.error('Error updating item quantity:', error);
      // Optionally handle error (revert cart state, etc.)
    }
  };

  // New function to remove an item from the cart
  const removeFromCart = async (itemId) => {
    try {
      // Update local state to remove the item
      setCart((prevCart) => prevCart.filter(item => item.itemId !== itemId));

      // Send API request to remove the item from the cart
      await axios.post(`${process.env.REACT_APP_API_URL}/cart/removeItem`, {
        userId: currentUser.uid, // Use the userId from the auth context
        itemId, // The itemId to remove
      });

      console.log('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Optionally handle error (revert cart state, etc.)
    }
  };

  // Calculate and set unique item count whenever the cart changes
  useEffect(() => {
    setUniqueItemCount(countUniqueItems(cart));
  }, [cart]); // Recalculate when cart changes

  return (
    <CartContext.Provider value={{ cart, setCart, uniqueItemCount, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
