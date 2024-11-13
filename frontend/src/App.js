import React, { useState } from "react";
import { Container } from "react-bootstrap";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import styles from "./App.module.css";
import AdCarousel from "./components/AdCarousel";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp/SignUp";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ItemList from "./components/ItemList/ItemList";
import ItemDetail from "./components/ItemDetail/ItemDetail";
import UserDashboard from "./components/UserDashboard";
import { AuthProvider } from "./contexts/authContext/authContext";
import "./variables.css";
import { CartProvider } from "./contexts/cartContext/cartContext";
import Cart from "./components/Cart/Cart";
import CheckOut from "./components/CheckOut";

const MainContent = ({ searchQuery }) => { // Accept searchQuery as a prop
  const location = useLocation(); // Get the current location inside Router
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);
  };

  return (
    <div className={styles.mainbackground}>
      <Container className={styles.contentBody}>
        {location.pathname === "/home" && (
          <>
            <AdCarousel />
            <ItemList handleItemId={handleSelectItem} searchQuery={searchQuery} /> {/* Pass it to ItemList */}
          </>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route
            path="/itemdetails/:itemId"
            element={<ItemDetail itemId={selectedItemId} />}
          />
          {/* You can add more routes here as needed */}
        </Routes>
      </Container>
    </div>
  );
};


const App = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State to hold search query

  const handleSearch = (query) => {
    console.log("Search query:", query);
    setSearchQuery(query); // Update the search query state
    // Add any additional logic to perform search
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className={styles.container}>
            <Header onSearch={handleSearch} />
            <MainContent searchQuery={searchQuery} /> {/* Pass the query to MainContent */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};


export default App;
