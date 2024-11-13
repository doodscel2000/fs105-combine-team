import React, { useCallback,useEffect, useImperativeHandle, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../firebase/firebase"; // Adjust path to your Firebase config
import styles from "./ImageDrop.module.css"; // Your CSS module

const ImageDrop = React.forwardRef(({ existingImages = [] }, reactRef) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]); // State for accepted files
  const [deletedImageUrls, setDeletedImageUrls] = useState([]); // State for deleted image URLs
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [currentImages, setCurrentImages] = useState([]); // State for current images
  const prevImagesRef = useRef(existingImages); // Track the previous existingImages

  useEffect(() => {
    // Check if existingImages has actually changed
    const existingImagesChanged = prevImagesRef.current !== existingImages;

    if (existingImagesChanged) {
      setCurrentImages(existingImages.map((url) => ({ url, markedForDeletion: false })));
      prevImagesRef.current = existingImages; // Update the reference to the latest images
    }
  }, [existingImages]);
  
  // Handle file drops
  const onDrop = useCallback(
    (files) => {
      const validFiles = files.filter((file) => file.type.startsWith("image/"));
      if (validFiles.length === 0) {
        setErrorMessage("Please upload valid image files only.");
        return;
      }

      setErrorMessage(""); // Clear any previous error messages

      // Filter out duplicates
      const newFiles = validFiles.filter(
        (file) =>
          !acceptedFiles.some((existingFile) => existingFile.name === file.name)
      );

      if (newFiles.length === 0) {
        setErrorMessage("Some files are already added.");
        return;
      }

      setAcceptedFiles((prevFiles) => [...prevFiles, ...newFiles]); // Add new valid files
    },
    [acceptedFiles]
  );

  // Mark existing image for deletion or restore
  const handleToggleImage = (url) => {
    setCurrentImages((prevImages) =>
      prevImages.map((image) =>
        image.url === url
          ? { ...image, markedForDeletion: !image.markedForDeletion }
          : image
      )
    );
    
    setDeletedImageUrls((prevDeleted) => {
      const isCurrentlyDeleted = prevDeleted.includes(url);
      // If marked for deletion, add to deletedImageUrls; otherwise, remove it
      return isCurrentlyDeleted ? prevDeleted.filter((img) => img !== url) : [...prevDeleted, url];
    });
  };

  // Remove a specific file and its preview
  const handleRemoveImage = (event, fileToRemove) => {
    event.stopPropagation(); // Prevent click event from bubbling up to the dropzone
    URL.revokeObjectURL(URL.createObjectURL(fileToRemove)); // Revoke object URL for the removed file
    setAcceptedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
  };

  // Check if a file name already exists in Firebase Storage
  const checkFileExists = async (fileName) => {
    const storageRef = ref(storage, "images"); // Reference to the images folder
    const files = await listAll(storageRef); // List all files in the folder
    return files.items.some((item) => item.name === fileName); // Check for existing file names
  };

// Helper function to extract the base file path from a Firebase Storage URL
const extractFilePath = (url) => {
  // Split the URL by '?' to separate the token from the path
  const urlToken = url.split('?')[0]; 
  // Split the remaining URL by '/' to get all parts
  const urlParts = urlToken.split('/');
  // Get the last part of the URL which contains the encoded file path
  const encodedFilePath = urlParts[urlParts.length - 1];
  // Replace encoded slashes with regular slashes to get the final file path
  const filePath = encodedFilePath.replaceAll("%2F", "/");
  return filePath; // Return the cleaned file path
};

// Example usage within the handleUpload function or wherever you delete images
const handleDeleteImages = async (deletedImageUrls) => {
  const promises = deletedImageUrls.map(async (url) => {
    const filePath = extractFilePath(url); // Get the file path
    const fileRef = ref(storage, filePath); // Create a reference to the file in Firebase
    console.log('Deleting:',filePath);
    await deleteObject(fileRef); // Delete the file
  });

  await Promise.all(promises); // Wait for all delete operations to finish
};

  // Upload images to Firebase Storage
  const handleUpload = async () => {
    // Handle existing images first
    if (deletedImageUrls.length > 0) {
      await handleDeleteImages(deletedImageUrls); // Pass the deletedImageUrls array
    }

    const newImageUrls = await Promise.all(
      acceptedFiles.map(async (file) => {
        let fileName = file.name;
        const fileExists = await checkFileExists(fileName);

        // If the file name exists, append a timestamp to create a unique name
        if (fileExists) {
          fileName = `${Date.now()}-${file.name}`; // e.g., 1634238492000-image.jpg
        }

        const storageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );

    // Combine remaining existing image URLs with new image URLs
    const remainingImages = currentImages
      .filter((img) => !img.markedForDeletion)
      .map((img) => img.url);

    resetState(); // Clear state after upload
    return [...remainingImages, ...newImageUrls]; // Return combined URLs
  };

  // Reset component state
  const resetState = () => {
    setAcceptedFiles([]); // Clear accepted files
    setDeletedImageUrls([]); // Clear deleted URLs
    setCurrentImages(existingImages.map((url) => ({ url, markedForDeletion: false }))); // Reset current images
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    noClick: true, // Disable click to open file dialog
  });

  useImperativeHandle(reactRef, () => ({
    handleUpload,
    resetState,
  }));

  return (
    <div>
      <div {...getRootProps({ className: styles.dropzone })}>
        <p>Drag & drop some images here, or click the button to select files</p>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {/* Preview existing images */}
        <div className={styles.previewContainer}>
          {currentImages.map(({ url, markedForDeletion }, index) => (
            <div key={index} className={styles.imagePreviewWrapper}>
              <img
                src={url} // Use existing image URLs for previews
                alt={`Existing preview ${index}`}
                className={`${styles.imagePreview} ${markedForDeletion ? styles.greyscale : ""}`} // Apply greyscale if marked for deletion
              />
              <button
                type="button"
                onClick={() => handleToggleImage(url)} // Toggle deletion
                className={styles.removeButton}
              >
                &times; {/* Red cross button */}
              </button>
            </div>
          ))}

          {/* Preview newly accepted files */}
          {acceptedFiles.map((file) => (
            <div key={file.name} className={styles.imagePreviewWrapper}>
              <img
                src={URL.createObjectURL(file)} // Use createObjectURL for previews
                alt={`preview-${file.name}`}
                className={styles.imagePreview}
              />
              <button
                type="button"
                onClick={(event) => handleRemoveImage(event, file)} // Pass event to prevent bubbling
                className={styles.removeButton}
              >
                &times; {/* Red cross button */}
              </button>
            </div>
          ))}
        </div>
      </div>

      <input
        {...getInputProps()}
        style={{ display: "none" }} // Hide the default file input
        onChange={(e) => onDrop(Array.from(e.target.files))} // Handle file selection
      />
      <button
        type="button"
        onClick={() => document.querySelector('input[type="file"]').click()} // Trigger file input click
        className={styles.fileSelectButton}
      >
        Select Files
      </button>
    </div>
  );
});

export default ImageDrop;
