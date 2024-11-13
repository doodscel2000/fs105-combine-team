// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID as a string
  items: {
    type: Map, // Use Map to represent the dictionary
    of: {
      quantity: { type: Number, required: true, min: 1 } // Quantity for each item
    }
  }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
