import React, { useState } from "react";
import Header from "../Header";
import Footer from "../../Footer/Footer";
import "./Style/Profile.css";
import ProfileUser from "./ProfileUser";
import { Link } from "react-router-dom";
import OrderHistory from "./OrderHistory";
import ForgetPassWord from "./ForgetPassWord";

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState("Hồ sơ");
  const handleSelection = (item) => {
    setSelectedItem(item);
  };
  return (
    <div>
      <Header />
      <div className="container">
        <div className="flex-container-profile-user">
          <div className="sidebar-profile-user">
            <h2 className="sidebar-title-profile-user">Tài khoản của tôi</h2>
            <ul className="sidebar-menu-profile-user">
              <li
                className={`sidebar-item-profile-user ${
                  selectedItem === "Hồ sơ" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Hồ sơ")}
              >
                <Link>Profile</Link>
              </li>
              <li
                className={`sidebar-item-profile-user ${
                  selectedItem === "Đổi mật khẩu" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Đổi mật khẩu")}
              >
                <Link>Change Password</Link>
              </li>
              <li
                className={`sidebar-item-profile-user ${
                  selectedItem === "Đơn hàng" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Đơn hàng")}
              >
                <Link>Order</Link>
              </li>
            </ul>
          </div>
          <div className="main-content-profile-user">
            {selectedItem === "Hồ sơ" && <ProfileUser />}
            {selectedItem === "Đổi mật khẩu" && <ForgetPassWord />}
            {selectedItem === "Đơn hàng" && <OrderHistory />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
