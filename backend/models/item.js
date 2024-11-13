const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Changed to String to store user ID as a string
      required: true, // User ID is required
    },
    shopId: {
      type: String, // Changed to String to store shop ID as a string
      required: false, // Optional field for future feature
    },
    name: {
      type: String,
      required: true, // Item name is required
    },
    description: {
      type: String,
      required: false, // Description of the item
      default: 'No description available',
    },
    stock: {
      type: Number,
      required: true, // Stock quantity is required
      min: 0, // Stock cannot be negative
    },
    price: {
      type: Number,
      required: true, // Price of the item is required
      min: 0, // Price cannot be negative
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: false, // Category is required
    },
    deleted: {
      type: Boolean,
      default: false, // Soft delete flag defaults to false
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

itemSchema.index({ name: 'text', description: 'text', category: 'text' });

// Export the Item model
module.exports = mongoose.model("Item", itemSchema);
