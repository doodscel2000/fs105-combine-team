import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ItemCard from "../ItemCard/ItemCard"; // Adjust path as necessary
import styles from "./ItemList.module.css";
import { useNavigate } from "react-router-dom";

const ItemList = ({ currentUser, currentView = "", isDashboard, onItemSelect, searchQuery }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl =
      currentView === "itemlist" && currentUser?.uid
        ? `${process.env.REACT_APP_API_URL}/items/allfrom/${currentUser.uid}`
        : `${process.env.REACT_APP_API_URL}/items/allitems?amount=15`;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching items from:", apiUrl);
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          setItems(response.data);
          setFilteredItems(response.data); // Initialize filteredItems with fetched items
        } else if (response.status === 404) {
          setItems([]);
          setFilteredItems([]); // Also clear filteredItems
          console.log("No items found");
        }
      } catch (error) {
        setError("Error fetching items. Please try again later.");
        console.error("Error fetching items:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentUser?.uid, currentView]);

  useEffect(() => {
    // Filter items whenever the searchQuery changes
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        item.description.toLowerCase().includes(lowercasedQuery) ||
        (item.category && item.category.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // If no search query, show all items
    }
  }, [searchQuery, items]); // Run when searchQuery or items change

  if (loading) {
    return <div>Loading items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!filteredItems || filteredItems.length === 0) {
    return <div>No items available.</div>;
  }

  const handleCardClick = (itemId) => {
    if (isDashboard) {
      // If in dashboard, call the parent function
      onItemSelect(itemId);
    } else {
      // Otherwise, navigate to the item detail page
      navigate(`/itemdetails/${itemId}`);
      console.log(`Navigating to item detail for item ID: ${itemId}`);
    }
  };

  return (
    <div className={`row ${styles.itemList}`}>
      {filteredItems.map((item) => (
        <div className="col-6 col-md-3 col-lg-2 p-1 m-0" key={item._id}>
          <ItemCard
            itemId={item._id}
            imageUrls={item.imageUrls}
            itemName={item.name}
            price={item.price}
            onCardClick={() => handleCardClick(item._id)} // Pass the item ID to handleCardClick
          />
        </div>
      ))}
    </div>
  );
};

ItemList.propTypes = {
  currentUser: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  currentView: PropTypes.string,
  isDashboard: PropTypes.bool, // New prop
  onItemSelect: PropTypes.func, // Function for dashboard item selection
  searchQuery: PropTypes.string.isRequired, // New prop for search query
};

export default ItemList;
