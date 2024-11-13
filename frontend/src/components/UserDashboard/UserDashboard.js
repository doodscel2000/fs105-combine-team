import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AuthProvider } from "../../contexts/authContext/authContext"; // Adjust the path as needed
import UserDetails from "../UserDetail/UserDetail"; // Adjust the path as needed
import UserToggleBtn from "../UserToggleBtn/UserToggleBtn";
import ProfileNavBar from "../ProfileNavBar/ProfileNavBar";
import MyShopNavBar from "../MyShopNavBar/MyShopNavBar";
import MyItemBoard from "../MyItemBoard";
import OrderList from "../OrderList/OrderList";
import Earnings from "../Earnings/Earnings";
import { useAuth } from "../../contexts/authContext/authContext";

const UserDashboard = () => {
  const [currentView, setCurrentView] = useState("profile"); //profile,myshop
  const [profileNavView, setProfileNavView] = useState("profile"); //profile,order
  const [shopNavView, setshopNavView] = useState("item"); //item,order,event,earning,analytic
  const {currentUser} = useAuth();
  const userName = currentUser.displayName || ""

  const handleToggle = (view) => {
    console.log(`MainView Toggled to: ${view}`);
    setCurrentView(view);
  };

  const handleProfileNavView = (view) => {
    console.log(`ProfileNav View Toggled to: ${view}`);
    setProfileNavView(view);
  };

  const handleMyShopNavView = (view) => {
    console.log(`MyShopNav View Toggled to: ${view}`);
    setshopNavView(view);
  };

  return (
    <AuthProvider>
      <Container>
        <Row>
          <Col>
            <h2>Welcome {userName}</h2>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <UserToggleBtn onToggle={handleToggle} />
          </Col>
        </Row>

        {currentView === "profile" && (
          <>
            <ProfileNavBar onToggle={handleProfileNavView} />
            {profileNavView === "profile" && <UserDetails />}
            {profileNavView === "order" && <OrderList currentView={currentView} />}
          </>
        )}
        {currentView === "myshop" && (
          <>
            <MyShopNavBar onToggle={handleMyShopNavView} />
            {shopNavView === "item" && <MyItemBoard/>}
            {shopNavView === "order" && <OrderList currentView={currentView} />}
            {shopNavView === "earning" && <Earnings/>}
          </>
        )}
      </Container>
    </AuthProvider>
  );
};

export default UserDashboard;
