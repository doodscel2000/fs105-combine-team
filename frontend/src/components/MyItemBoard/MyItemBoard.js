import React, { useState } from "react";
import ItemList from "../ItemList/ItemList";
import NewItem from "../NewItem";
import { useAuth } from "../../contexts/authContext/authContext";
import EditItem from "../EditItem/EditItem";
import styles from "./MyItemBoard.module.css";

const MyItemBoard = () => {
  const { currentUser } = useAuth();
  const [boardView, setBoardView] = useState("itemlist");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleToggleView = (view) => {
    console.log(`MyItemBoard View Toggled to: ${view}`);
    setBoardView(view);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
    setBoardView("itemdetail"); // Set view to item detail
  };

  return (
    <>
      <div className={styles.navBar}>
        <span
          className={`${styles.navItem} ${
            boardView === "newitem" ? styles.active : ""
          }`}
          onClick={() => handleToggleView("newitem")}
        >
          Add Item
        </span>
        <span
          className={`${styles.navItem} ${
            boardView === "itemlist" ? styles.active : ""
          }`}
          onClick={() => handleToggleView("itemlist")}
        >
          View Items
        </span>
      </div>
      {/* <button className={styles.button} onClick={() => handleToggleView("newitem")}>Add Item</button>
      <button className={styles.button} onClick={() => handleToggleView("itemlist")}>View Items</button> */}

      {/* Conditional rendering based on boardView state */}
      {boardView === "itemlist" && (
        <ItemList
          currentUser={currentUser}
          currentView={boardView}
          isDashboard={true} // Indicate that this is the dashboard
          onItemSelect={handleItemSelect} // Pass the item selection handler
        />
      )}
      {boardView === "newitem" && <NewItem />}
      {boardView === "itemdetail" && selectedItemId && (
        <EditItem
          itemId={selectedItemId}
          onDelete={() => handleToggleView("itemdetail")}
        />
      )}
    </>
  );
};

export default MyItemBoard;
