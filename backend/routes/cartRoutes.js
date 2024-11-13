const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Get cart for user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    
    // Convert Map back to an array for response
    const itemsArray = cart ? Array.from(cart.items.entries()).map(([itemId, { quantity }]) => ({
      itemId,
      quantity,
    })) : [];

    res.json({ userId: req.params.userId, items: itemsArray });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/addToCart', async (req, res) => {
  const { userId, itemId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    
    // Initialize the cart if it doesn't exist
    if (!cart) {
      cart = new Cart({ userId, items: new Map() }); // Initialize as Map
    }

    // Add or update the item in the cart
    if (cart.items.has(itemId)) {
      cart.items.get(itemId).quantity += quantity; // Update quantity if it exists
    } else {
      cart.items.set(itemId, { quantity }); // Set new itemId as key
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update the cart for a user
router.post('/updateCart', async (req, res) => {
  const { userId, items } = req.body; // Expecting userId and items array in the request body

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    // Initialize the cart if it doesn't exist
    if (!cart) {
      cart = new Cart({ userId, items: new Map() }); // Initialize with a new Map
    }

    // Update the items in the cart
    items.forEach(({ itemId, quantity }) => {
      if (quantity > 0) {
        cart.items.set(itemId, { quantity }); // Set or update item with quantity
      } else {
        cart.items.delete(itemId); // Remove item if quantity is 0 or less
      }
    });

    // Save the updated cart
    await cart.save();

    // Convert Map back to an array for response
    const itemsArray = Array.from(cart.items.entries()).map(([itemId, { quantity }]) => ({
      itemId,
      quantity,
    }));

    res.json({ userId, items: itemsArray });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Clear a specific item from the cart
router.post('/removeItem', async (req, res) => {
  const { userId, itemId } = req.body; // Expecting userId and itemId in the request body
  try {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the item exists in the cart before trying to remove it
    if (!cart.items.has(itemId)) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item with the given itemId from the Map
    cart.items.delete(itemId); // Use Map's delete method
    await cart.save();

    // Convert Map back to an array for response
    const itemsArray = Array.from(cart.items.entries()).map(([itemId, { quantity }]) => ({
      itemId,
      quantity,
    }));

    res.json({ userId, items: itemsArray }); // Return updated cart
  } catch (error) {
    console.error('Error removing item from cart:', error); // Log error for debugging
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

router.put('/updateQuantity', async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  try {
    // Check if the quantity is valid
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Update the item's quantity directly in the database using Map
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { [`items.${itemId}.quantity`]: quantity } }, // Update the quantity for the specific itemId in the Map
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Item quantity updated successfully', updatedCart });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
