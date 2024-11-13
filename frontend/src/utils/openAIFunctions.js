import axios from "axios";

// Utility function to generate description for an item
export const generateDescription = async (itemName) => {
  if (!itemName) {
    throw new Error("Item name is required.");
  }

  try {
    // Create the prompt by prefixing the itemName
    const prompt = `Create an e-commerce description for: ${itemName}`;

    // Send POST request to the backend API endpoint
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/openai/generate-description`, {
      prompt: prompt, // The prompt now contains the item name with the prefix
    });

    // Return the response data (the generated description)
    return response.data.description;
  } catch (error) {
    console.error("Error sending description request:", error);
    throw new Error("Failed to generate description.");
  }
};

// Utility function to generate categories for an item
export const generateCategories = async (itemName) => {
  if (!itemName) {
    throw new Error("Item name is required.");
  }

  try {
    // Send POST request to the backend API endpoint for category generation
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/openai/generate-category`, {
      itemName: itemName, // The prompt now contains the item name with the prefix for categories
    });

    // Return the generated categories
    return response.data.categories;
  } catch (error) {
    console.error("Error sending category request:", error);
    throw new Error("Failed to generate categories.");
  }
};
