import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Row, Col, Container } from "react-bootstrap";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import styles from "./Login.module.css"; // Adjust the path to your CSS module

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate
  const apiUrl = process.env.REACT_APP_API_URL;

  const createUserInMongoDB = async (user) => {
    console.log(user.phoneNumber||'blank');
    try {
      const response = await fetch(`${apiUrl}/users/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          address: "",
          phone: user.phoneNumber || "", // Optional; can prompt user for phone later
          firebaseId: user.uid, // Use the Firebase UID
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User created successfully in MongoDB:", data);
      } else {
        console.error("Error creating user in MongoDB:", data.message);
      }
    } catch (error) {
      console.error("Error creating user in MongoDB:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const auth = getAuth(); // Get Firebase Auth instance

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Logged in user:", user.uid); // Display the UID of the logged-in user
      navigate("/home"); // Redirect to home page
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage); // Set the error message to display
      console.error("Error signing in:", errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in with Google:", user.uid); // Display the UID of the logged-in user

      // Check if the user already exists in MongoDB
      const response = await fetch(`${apiUrl}/users/${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        // User exists, proceed with the application flow
        console.log("User already exists in MongoDB:", data);
      } else {
        // User does not exist, create a new user in MongoDB
        await createUserInMongoDB(user); // Pass the user object
        console.log("New user created in MongoDB:", {
          uid: user.uid,
          email: user.email,
        });
      }

      navigate("/home"); // Redirect to home page
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage); // Set the error message to display
      console.error("Error signing in with Google:", errorMessage);
    }
  };

  return (
    <Container className="col-lg-4">
      <Row>
        <h2 className="text-center">Login</h2>
      </Row>
      <form onSubmit={handleSubmit}>
        <Row className="col col-12 col-md-8 mx-auto pb-4">
          <Col xs={12} lg={4}>
            <label>Email:</label>
          </Col>
          <Col xs={12} lg={8}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </Col>
          </Row>
          <Row className="col col-12 col-md-8 mx-auto pb-4">
          <Col xs={12} lg={4}>
            <label>Password:</label>
          </Col>
          <Col xs={12} lg={8}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </Col>
          </Row>
          <Row className="col col-12 col-md-8 mx-auto">
          <Col className="text-center">
            <button type="submit" className={`${styles.button} col col-12 col-md-8 mx-auto`}>
              Log In
            </button>
          </Col>
        </Row>
      </form>
      <Row className="mx-auto justify-content-center">
      <Col xs={10} md={6}> {/* Adjust the width as needed */}
        <div className={styles.divider}></div>
      </Col>
    </Row>
      <Row className="col col-12 col-md-8 mx-auto pb-3">
        <button onClick={handleGoogleSignIn} className={`${styles.button} fs-5 col col-lg-8 mx-auto`}>
          Google Sign-in
        </button>
      </Row>
      {error && <p className={styles.error}>{error}</p>}{" "}
    </Container>
  );
};

export default LoginForm;
