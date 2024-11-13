const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  item: {
    itemId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemDesc: {
      type: String,
      required: false,
    },
    itemOrderPrice: {
      type: Number,
      required: true,
    },
    itemQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  hasShipped: {
    type: Boolean,
    default: false, // false indicates not yet shipped
  },
  isCompleted: {
    type: Boolean,
    default: false, // false indicates not yet completed
  },
  customerId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
module.exports = OrderItem;
