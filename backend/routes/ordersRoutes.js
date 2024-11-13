const express = require("express");
const OrderItem = require("../models/orderItem"); // Adjust the path as necessary
const router = express.Router();

// Batch route to create multiple order items
router.post("/createOrders", async (req, res) => {
  const orderItemsData = req.body; // Expecting an array of order item objects

  try {
    // Validate input data
    if (!Array.isArray(orderItemsData) || orderItemsData.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Create order items in bulk
    const orderItems = await OrderItem.insertMany(orderItemsData);
    res.status(201).json(orderItems);
  } catch (error) {
    console.error("Error creating order items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to update an order item by ID
router.put("/updateOrder/:id", async (req, res) => {
  const { id } = req.params; // Extract order item ID from the URL
  const updateData = req.body; // The data to update

  try {
    // Find and update the order item
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    if (!updatedOrderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.json(updatedOrderItem);
  } catch (error) {
    console.error("Error updating order item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to fetch orders by customer ID
router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params; // Extract customer ID from the URL

  try {
    const orders = await OrderItem.find({ customerId }); // Fetch orders for the given customer ID

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by customer ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to fetch orders by seller ID
router.get("/seller/:sellerId", async (req, res) => {
  const { sellerId } = req.params; // Extract seller ID from the URL

  try {
    const orders = await OrderItem.find({ sellerId }); // Fetch orders for the given seller ID

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by seller ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
