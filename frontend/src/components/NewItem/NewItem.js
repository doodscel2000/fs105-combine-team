import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext/authContext";
import axios from "axios";
import styles from "./NewItem.module.css"; // Assuming you have a separate CSS module
import ImageDrop from "../ImageDrop/ImageDrop";
import {
  generateCategories,
  generateDescription,
} from "../../utils/openAIFunctions";

const NewItem = () => {
  const imageDropRef = useRef();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const handleGenerateCategories = async () => {
    try {
      // Call generateCategories to get the new category
      const newCategory = await generateCategories(formData.name);
      setFormData((prevData) => {
        // If categories is not set, initialize it as an empty string
        const categoriesString = prevData.categories || ''; // Default to empty string if undefined or null
  
        // Add the new category to the existing categories string if it's not already in it
        const updatedCategories = categoriesString
          ? `${categoriesString}, ${newCategory.trim()}`  // Append with a comma and space if existing categories exist
          : newCategory.trim();  // If no categories yet, just set the new category
  
        // Update the formData with the new categories string
        return {
          ...prevData,
          category: updatedCategories,
        };
      });
    } catch (error) {
      console.error("Error generating categories:", error);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      console.error("Item name is required.");
      return;
    }

    try {
      // Call generateDescription with the itemName
      const description = await generateDescription(formData.name);

      // Update formData with the new description, overriding the old one
      setFormData((prevData) => ({
        ...prevData,
        description: description, // This will overwrite the existing description
      }));

      console.log("Generated Description:", description);
    } catch (error) {
      console.error("Error generating description:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Trigger image upload and get URLs directly
    const urls = await imageDropRef.current?.handleUpload();

    const dataToSend = {
      ...formData, // Existing form data
      userId: currentUser.uid, // Add userId from the auth context
      imageUrls: urls, // Append the returned image URLs
    };

    console.log("Data to send:", dataToSend);

    try {
      // Make the API call to create the item using Axios
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/items/createItem`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Saved item:", response.data); // Handle the response
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        imageUrls: [],
      });
      imageDropRef.current?.resetState();
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="item-form">
        <Row className="mb-3">
          <Col lg={2} className="label-col">
            <Form.Label>Name</Form.Label>
          </Col>
          <Col lg={10}>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className="label-col">
            <Form.Label>Price</Form.Label>
          </Col>
          <Col lg={10}>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter item price"
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className="label-col">
            <Form.Label>Category</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter item category"
              required
            />
          </Col>
          <Col lg={2} className="d-flex align-items-center">
            <Button
              variant="primary"
              type="button"
              className={styles.generateBtn}
              onClick={handleGenerateCategories} // Call handleGenerateCategories when clicked
            >
              Generate Categories
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className="label-col">
            <Form.Label>Stock</Form.Label>
          </Col>
          <Col lg={10}>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className="label-col">
            <Form.Label>Description</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows={5} // Larger input field for description
            />
          </Col>
          <Col lg={2} className="d-flex align-items-center">
            <Button
              variant="primary"
              type="button"
              className={styles.generateBtn}
              onClick={handleGenerateDescription} // Call handleGenerateDescription when clicked
            >
              Generate Description
            </Button>
          </Col>
        </Row>

        <ImageDrop ref={imageDropRef} />

        <Button variant="primary" type="submit" className={styles.addItem}>
          Add Item
        </Button>
      </Form>
    </>
  );
};

export default NewItem;
