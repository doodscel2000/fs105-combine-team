const express = require("express");
const axios = require("axios");
require("dotenv").config();  // To load the API key from .env file

const router = express.Router();

// POST endpoint to generate product description
router.post("/generate-description", async (req, res) => {
  const { prompt } = req.body; // Assuming the prompt is passed in the body

  // Check if prompt is provided
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // Use the correct OpenAI endpoint
      {
        model: "gpt-3.5-turbo", // You can also use "gpt-4" if you have access
        messages: [
          {
            role: "user",
            content: prompt, // Send the prompt content
          },
        ],
        max_tokens: 150, // Adjust token length based on your needs
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Use the API key from .env file
          "Content-Type": "application/json",
        },
      }
    );

    // Return the generated description
    const generatedText = response.data.choices[0].message.content;
    res.json({ description: generatedText });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
});

// POST endpoint to generate related categories for an item
router.post('/generate-category', async (req, res) => {
  const { itemName } = req.body;  // Item name passed in the request body

  // Validate input
  if (!itemName) {
    return res.status(400).json({ error: 'Item name is required.' });
  }

  try {
    // Create the prompt for generating categories
    const prompt = `RETURN IN 1 LINE OF STRING AND DO NOT NUMBER. Generate up to 10 related category names for the item: ${itemName}`;

    // Call OpenAI API to get related categories
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // OpenAI endpoint
      {
        model: "gpt-3.5-turbo", // Model being used
        messages: [
          {
            role: "user",
            content: prompt, // Send the prompt content
          },
        ],
        max_tokens: 150, // Adjust token length if needed
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Use API key from .env file
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the categories from the response and return it in a consistent structure
    const generatedCategories = response.data.choices[0].message.content.trim();
    res.json({ categories: generatedCategories });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate categories" });
  }
});

module.exports = router;
