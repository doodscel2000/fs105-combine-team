import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Container, Row, Col, Button } from "react-bootstrap";
import { storage } from "../../firebase/firebase"; // Adjust path to your Firebase config
import styles from "./ProfileImage.module.css";

const ProfileImage = forwardRef(
  ({ imageUrl, onImageUrlChange, readOnly }, profileImageRef) => {
    const [image, setImage] = useState(null);
    const [localImageUrl, setLocalImageUrl] = useState(imageUrl || null); // Store local image URL for immediate display
    const [inputKey, setInputKey] = useState(Date.now()); // Key for resetting the input
    const [uploadComplete, setUploadComplete] = useState(false);

    useEffect(() => {
      setLocalImageUrl(imageUrl); // Update local image URL if the original one changes
      if (imageUrl) onImageUrlChange(imageUrl); // Notify parent of the current image URL
    }, [imageUrl, onImageUrlChange]);

    const handleImageChange = (e) => {
      const file = e.target.files[0]; // Get the first file from the input
      console.log("Selected file:", file); // Debugging statement
      if (file) {
        console.log("File name:", file.name); // Debugging statement to log file name
        setImage(file);
        setLocalImageUrl(URL.createObjectURL(file)); // Display selected file immediately
        setUploadComplete(false);
      } else {
        console.log("No file selected."); // Log if no file is selected
      }
    };

    const handleUpload = async () => {
      if (!image) return;
      try {
        // Handle existing images first
        if (imageUrl) {
          try {
            const existingImageRef = ref(storage, imageUrl); // Use ref instead of refFromURL
            await deleteObject(existingImageRef); // Use deleteObject for deletion
          } catch (deleteError) {
            console.error("Error deleting existing image:", deleteError);
            // Continue execution even if deletion fails
          }
        }
        // Prepare a unique file name
        let fileName = image.name;
        fileName = `${Date.now()}-${fileName}`;

        const storageRef = ref(storage, `profileImages/${fileName}`); // Change the path if needed
        await uploadBytes(storageRef, image);

        const downloadURL = await getDownloadURL(storageRef);
        setLocalImageUrl(downloadURL); // Update local URL with new download URL
        onImageUrlChange(downloadURL); // Notify parent of the new image URL
        setUploadComplete(true);
        console.log("handleUpload", downloadURL);
        return downloadURL;
        // const storageRef = ref(storage, `images/${fileName}`);
        // await uploadBytes(storageRef, file);
        // return await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error managing profile image:", error);
      }
    };

    const handleReset = () => {
      setLocalImageUrl(imageUrl); // Restore to the original image URL
      setImage(null); // Clear the selected image
      setInputKey(Date.now()); // Reset the input field by changing the key
    };

    // Expose handleUpload to the parent
    useImperativeHandle(profileImageRef, () => ({
      handleUpload,
      handleReset,
    }));

    return (
      <Container className={styles.profileImageContainer}>
        <Row>
          <Col>
            {localImageUrl ? (
              <img src={localImageUrl} alt="Profile" className={styles.image} />
            ) : (
              <p className={styles.noImageText}>No profile picture set.</p>
            )}
          </Col>
        </Row>

        <Row>
          <Col className={`${styles.cardBody} text-start`}>
            {/* <h4>Profile Picture</h4> */}
            <input
              key={inputKey} // Change key to reset the input value
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={readOnly} // Disable the input when in read-only mode
              className={styles.fileInput}
            />
            {image && !uploadComplete && (
              <Button
                onClick={handleReset}
                disabled={readOnly}
                className={styles.resetButton}
              >
                Reset
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
);

export default ProfileImage;
