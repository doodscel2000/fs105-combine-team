const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user'); // Adjust the path as necessary
const admin = require('firebase-admin'); // Import Firebase Admin SDK

const router = express.Router();

// Create a new user
router.post('/createUser', async (req, res) => {
    const { email, name, address, phone, firebaseId } = req.body;

    // Validate required fields
    if (!email || !name || !firebaseId) {
        return res.status(400).json({ message: 'Email, name, and Firebase ID are required.' });
    }

    try {
        // Create a new user document in MongoDB
        const newUser = new User({
            firebase_id: firebaseId,
            email,
            name,
            address,
            phone
        });

        // Save the user to the database
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully!', user: newUser });
    }  catch (error) {
        console.error('Error creating user:', error);
        
        // Check if the error is a MongoDB error and extract the error message
        let errorMessage;
        if (error instanceof mongoose.Error.ValidationError) {
            // For validation errors
            errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
        } else if (error.code === 11000) {
            // Handle duplicate key error (e.g., unique index violation)
            errorMessage = 'A user with this email already exists.';
        } else {
            // Fallback to generic message
            errorMessage = error.message || 'Internal server error';
        }
    
        return res.status(500).json({ message: errorMessage });
    }
});

// In your user routes (e.g., users.js)
router.get('/:firebaseId', async (req, res) => {
    try {
        const user = await User.findOne({ firebase_id: req.params.firebaseId });
        if (user) {
            return res.status(200).json(user); // User found
        }
        return res.status(404).json({ message: 'User not found' }); // User not found
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// getUserDetails
router.get('/userDetail/:uid', async (req, res) => {
    try {
        const { uid } = req.params; // Make sure to get the uid from req.params
        const user = await User.findOne({ firebase_id: uid }); // Check the field name here

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Only respond once
        }

        // Send user details if found
        return res.json({
            name: user.name,
            email: user.email,
            phone: user.phone, // Ensure phone is in your schema
            address: user.address, // Ensure address is in your schema
            profileImage: user.profileImage
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' }); // Ensure a single response on error
    }
});

// Update user details by uid
router.put('/update/:uid', async (req, res) => {
    const { uid } = req.params; // Get user ID from URL parameters
    const { name, email, phone, address, profileImage } = req.body; // Destructure the updated data from the request body

    try {
        // Find the user by UID and update their details
        const updatedUser = await User.findOneAndUpdate(
            { firebase_id: uid },
            { name, email, phone, address, profileImage }, // Include profileImage in the update
            { new: true, runValidators: true } // Options: return the updated document and validate
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser); // Return the updated user data
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
