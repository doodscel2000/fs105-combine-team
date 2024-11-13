import React, { useState } from 'react';
import styles from './UserToggleBtn.module.css'; // Adjust path as necessary

const UserToggleBtn = ({ onToggle }) => {
    const [active, setActive] = useState('profile'); // Default active tab

    const handleToggle = (view) => {
        setActive(view);
        onToggle(view); // Call the parent function to handle the toggle
    };

    return (
        <div className={styles.toggleButton}>
            <div 
                className={`${styles.toggleOption} ${active === 'profile' ? styles.active : ''}`} 
                onClick={() => handleToggle('profile')}
            >
                MyProfile
            </div>
            <div 
                className={`${styles.toggleOption} ${active === 'myshop' ? styles.active : ''}`} 
                onClick={() => handleToggle('myshop')}
            >
                MyShops
            </div>
        </div>
    );
};

export default UserToggleBtn; // Ensure you are exporting the component
