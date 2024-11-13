import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/authContext/authContext";
import axios from "axios";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import styles from "./UserDetail.module.css";
import ProfileImage from "../ProfileImage/ProfileImage";

const UserDetail = () => {
  const { currentUser, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const profileImageRef = useRef();

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;

    if (currentUser?.uid) {
      const constructedUrl = `${apiUrl}/users/userDetail/${currentUser.uid}`;

      axios
        .get(constructedUrl)
        .then((response) => {
          setUserData(response.data);
          setFormData({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
          });
          setImageUrl(response.data.profileImage || ""); // Update imageUrl here
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setError("Failed to load user details");
        });
    }
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageUrlChange = (url) => {
    setImageUrl(url); // Update the imageUrl state with the new URL
    console.log("handleImageUrlChange", url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const constructedUrl = `${apiUrl}/users/update/${currentUser.uid}`;

    try {
      // Await profileImageRef to get the new image URL
      const newImageUrl = await profileImageRef.current.handleUpload();

      // Update formData with the new image URL if it's available
      const updatedFormData = newImageUrl
        ? { ...formData, profileImage: newImageUrl }
        : formData;

      console.log("handleSave", newImageUrl); // Ensure we have the new image URL
      console.log(updatedFormData);

      // Make the API call to update user data
      const response = await axios.put(constructedUrl, updatedFormData);
      setUserData(response.data);
      console.log("User updated successfully");

      // Update imageUrl with the new image URL
      if (newImageUrl) {
        setImageUrl(newImageUrl);
      }

      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating user details:", error);
      setError("Failed to update user details");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner
  }

  if (!currentUser || !userData) {
    return <div>{error || "No user details available."}</div>;
  }

  return (
    <Container>
      <Row>
        <Col lg={{ span: 6, order: 1 }} xs={{ span: 12, order: 2 }}>
          <Card className={styles.userDetailsCard}>
            <Card.Body>
              <Card.Title>User Details</Card.Title>
              <Form>
                {["name", "email", "phone", "address"].map((field) => (
                  <div className={styles.userDetailRow} key={field}>
                    <div className={styles.userDetailLabel}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </div>
                    <Form.Control
                      className={`${styles.formControl} ${
                        !isEditing ? styles.disabled : ""
                      }`} // Add the disabled class conditionally
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                ))}
              </Form>
              <Button
                className={isEditing ? styles.buttonSave : styles.buttonEdit} // Apply class based on editing state
                variant={isEditing ? "success" : "primary"} // Keep variant for bootstrap styling
                onClick={isEditing ? handleSave : handleEdit}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={{ span: 6, order: 2 }} xs={{ span: 12, order: 1 }}>
          <ProfileImage
            imageUrl={imageUrl}
            onImageUrlChange={handleImageUrlChange}
            readOnly={!isEditing}
            ref={profileImageRef}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetail;
