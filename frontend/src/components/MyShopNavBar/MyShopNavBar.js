// MyShopNavBar.js
import React, { useState } from "react";
import styles from "./MyShopNavBar.module.css";

const MyShopNavBar = ({ onToggle }) => {
  const [activeView, setActiveView] = useState("profile"); // Default active view

  const handleClick = (view) => {
    setActiveView(view); // Set the active view
    onToggle(view);
  };

  return (
    <div className={styles.navBar}>
      <span 
        className={`${styles.navItem} ${activeView === 'item' ? styles.active : ''}`} 
        onClick={() => handleClick('item')}
      >
        My Items
      </span>
      <span 
        className={`${styles.navItem} ${activeView === 'order' ? styles.active : ''}`} 
        onClick={() => handleClick('order')}
      >
        Orders
      </span>
      <span 
        className={`${styles.navItem} ${activeView === 'earning' ? styles.active : ''}`} 
        onClick={() => handleClick('earning')}
      >
        Earnings
      </span>
    </div>
  );
};

export default MyShopNavBar;
