import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext/authContext";
import axios from "axios";
import styles from "./EditItem.module.css";
import ImageDrop from "../ImageDrop/ImageDrop";
import {
  generateCategories,
  generateDescription,
} from "../../utils/openAIFunctions";

const EditItem = ({ itemId, onDelete }) => {
  const imageDropRef = useRef();
  const { currentUser } = useAuth();
  const [isUpdated, setIsUpdated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    imageUrls: [],
  });

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/items/details/${itemId}`
        );
        setFormData(response.data);

        setIsUpdated(false);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchItemData();
  }, [itemId, isUpdated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newImageUrls = await imageDropRef.current?.handleUpload();

    const dataToSend = {
      ...formData,
      userId: currentUser.uid,
      imageUrls: newImageUrls.length ? newImageUrls : formData.imageUrls,
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/items/updateItem/${itemId}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Updated item:", response.data);
      setIsUpdated(true);
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleDelete = async () => {
    if (confirmationInput === "delete") {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/items/deleteItem/${itemId}`
        );
        console.log(response.data.message);
        onDelete(); // Call the parent's delete handler
        setIsModalOpen(false); // Close the modal after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("There was an error deleting the item. Please try again.");
      }
    } else {
      alert('Please type "delete" to confirm deletion.');
    }
  };

  return (
    <>
      <h2>Editing Item:</h2>
      <Form onSubmit={handleSubmit} className={styles.itemForm}>
        <Row className="mb-3">
          <Col lg={2} className={styles.labelCol}>
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
              className={styles.formControl}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className={styles.labelCol}>
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
              className={styles.formControl}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className={styles.labelCol}>
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
              className={styles.formControl}
            />
          </Col>
          <Col lg={2} className="d-flex align-items-center">
            <Button
              variant="primary"
              type="button"
              onClick={handleGenerateCategories} // Call handleGenerateCategories when clicked
              className={styles.generateBtn}
            >
              Generate Categories
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className={styles.labelCol}>
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
              className={styles.formControl}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={2} className={styles.labelCol}>
            <Form.Label>Description</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows={5}
              className={styles.formControl}
            />
          </Col>
          <Col lg={2} className="d-flex align-items-center">
            <Button
              type="button"
              variant="primary"
              onClick={handleGenerateDescription} // Call handleGenerateDescription when clicked
              className={styles.generateBtn}
            >
              Generate Description
            </Button>
          </Col>
        </Row>

        <ImageDrop existingImages={formData.imageUrls} ref={imageDropRef} />
        <Button variant="primary" type="submit" className={styles.updateItem}>
          Update Item
        </Button>
      </Form>
      <button onClick={() => setIsModalOpen(true)} className={styles.deleteItem}>Delete Item</button>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Type "delete" to confirm deletion:</p>
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditItem;
