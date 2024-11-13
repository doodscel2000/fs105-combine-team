// ProfileNavBar.js
import React, { useState } from "react";
import styles from "./ProfileNavBar.module.css";

const ProfileNavBar = ({ onToggle }) => {
  const [activeView, setActiveView] = useState('profile'); // Default active view

  const handleClick = (view) => {
    setActiveView(view); // Set the active view
    onToggle(view); // Call the parent function to inform the change
  };

  return (
    <div className={styles.navBar}>
      <span 
        className={`${styles.navItem} ${activeView === 'profile' ? styles.active : ''}`} 
        onClick={() => handleClick('profile')}
      >
        Profile
      </span>
      <span 
        className={`${styles.navItem} ${activeView === 'order' ? styles.active : ''}`} 
        onClick={() => handleClick('order')}
      >
        Orders
      </span>
    </div>
  );
};

export default ProfileNavBar;
