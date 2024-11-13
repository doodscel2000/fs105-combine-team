import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Header.module.css";
import { useAuth } from "../../contexts/authContext/authContext";
import { useCart } from "../../contexts/cartContext/cartContext"; // Import the useCart hook
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import axios from "axios";

const Header = ({ onSearch }) => {
  const { cart } = useCart();
  const { currentUser, userLoggedIn } = useAuth(); // Get auth state
  const { uniqueItemCount } = useCart(); // Access cart context
  const [profileImage, setProfileImage] = useState(""); // State to hold profile image URL
  const [clearSearchInput, setClearSearchInput] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    onSearch(""); // Reset the search query
    setClearSearchInput(true);
    navigate("/home"); // Navigate to the home page
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    try {
      // Send the current cart to your backend to save it in MongoDB
      await axios.post(`${process.env.REACT_APP_API_URL}/cart/updateCart`, {
        userId: currentUser.uid, // Ensure you have access to currentUser
        items: cart,
      });

      await signOut(auth); // Sign out the user
      navigate("/home"); // Redirect to home or login page after logout
      window.location.reload();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleProfile = () => {
    navigate("/userdashboard");
  };

  const handleCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userLoggedIn && currentUser) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/${currentUser.uid}`
          );
          setProfileImage(
            response.data.profileImage || "placeholder-image-url"
          ); // Assuming profileImage is the field name in your MongoDB
        } catch (error) {
          console.error("Error fetching profile image:", error);
          setProfileImage("placeholder-image-url"); // Fallback to placeholder in case of an error
        }
      }
    };

    fetchProfileImage();
  }, [userLoggedIn, currentUser]);

  return (
    <header className={styles.header}>
      <Container>
        <Row>
          <Col className="text-end">
            <div className={styles.profile}>
              {userLoggedIn ? (
                <>
                  <span onClick={handleProfile} style={{ cursor: "pointer" }}>
                    <img
                      src={profileImage}
                      alt="Profile"
                      className={styles.profileImage}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "5px",
                      }} // Adjust styling as needed
                    />
                    {currentUser.displayName}
                  </span>
                  <span> | </span>
                  <span
                    onClick={handleLogout}
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    Logout
                  </span>
                </>
              ) : (
                <>
                  <span onClick={handleLogin} style={{ cursor: "pointer" }}>
                    Login
                  </span>
                  <span> | </span>
                  <span onClick={handleSignup} style={{ cursor: "pointer" }}>
                    Sign Up
                  </span>
                </>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 6, order: "first" }}
            md={{ span: 2, order: "first" }}
          >
            <span
              className={styles.logo}
              onClick={goToHome}
              style={{ cursor: "pointer" }}
            >
              Peddler
            </span>
          </Col>
          <Col xs={{ span: 12, order: "last" }} md={8} className="m-auto">
            <SearchBar onSearch={onSearch} clearInput={clearSearchInput} />
          </Col>
          <Col
            xs={{ span: 2, order: 1, offset: 4 }}
            md={{ span: 2, order: "last", offset: 0 }}
            className="text-start"
          >
            <div
              className={styles.cartContainer}
              onClick={handleCart}
              style={{ cursor: "pointer" }}
            >
              <span className={styles.icons}>🛒</span>
              {uniqueItemCount > 0 && (
                <span className={styles.cartCount}>{uniqueItemCount}</span>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
