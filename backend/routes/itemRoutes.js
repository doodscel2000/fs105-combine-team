const express = require('express');
const Item = require('../models/item'); // Adjust the path as needed
const router = express.Router();

// GET: Fetch all items belonging to a specific user ID
router.get('/allfrom/:userId', async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters
  
    try {
        const items = await Item.find({ userId, deleted: false }); // Query to find items by userId
  
        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found for this user.' });
        }
  
        res.status(200).json(items); // Respond with the items found
    } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Internal server error' }); // Respond with an error message
    }
});
  

router.get('/details/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        // Find the item by its MongoDB Object ID and ensure it's not marked as deleted
        const item = await Item.findOne({ _id: itemId, deleted: false }); 

        // Check if item exists
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Return the item details
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/createItem', async (req, res) => {
    const { userId, shopId, name, description, stock, price, imageUrls, category } = req.body;

    try {
        // Create a new item instance
        const newItem = new Item({
            userId,
            shopId,
            name,
            description,
            stock,
            price,
            imageUrls: imageUrls || [], // Set to an empty array if not provided
            category,
            deleted: false // Set deleted to false by default
        });

        // Save the item to the database
        const savedItem = await newItem.save();

        // Return the created item details
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/batch', async (req, res) => {
    const { itemIds } = req.body; // Assume an array of item IDs is passed in the request body

    try {
        // Use MongoDB's $in operator to find items matching any of the given item IDs
        const items = await Item.find({ _id: { $in: itemIds }, deleted: false });

        // Check if items were found
        if (!items || items.length === 0) {
            return res.status(404).json({ message: 'No items found' });
        }

        res.status(200).json({ items }); // Respond with the items found
    } catch (error) {
        console.error('Error fetching batch items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch all items up to the specified amount
// example:/allitems?amount=15
router.get('/allitems', async (req, res) => {
    const amount = Math.min(parseInt(req.query.amount, 10) || 10, 30); // Default to 10 items if no amount is specified

    try {
        // Fetch the items with the specified amount
        const items = await Item.find({ deleted: false }).limit(amount);
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/updateItem/:id', async (req, res) => {
    const { id } = req.params;
    const { userId, shopId, name, description, stock, price, imageUrls, category } = req.body;
  
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            {
                userId,
                shopId,
                name,
                description,
                stock,
                price,
                imageUrls,
                category,
            },
            { new: true }
        );
  
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
  
        res.json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: 'Server error while updating item' });
    }
});

router.delete('/deleteItem/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the item by ID and update the deleted field to true
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { deleted: true }, // Set deleted to true
            { new: true } // Return the updated document
        );

        // Check if item exists
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item soft deleted successfully', item: updatedItem });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.query; // Get the search query from the request

    try {
        const results = await Item.find({
            $text: { $search: query } // Perform the text search
        });
        res.json(results); // Return the search results as JSON
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
