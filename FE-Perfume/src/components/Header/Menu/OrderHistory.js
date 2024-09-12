import React, { useState } from "react";
import "./Style/OrderHistory.css";
import UserCancelled from "./UserCancelled";
import UserOder from "./UserOrder";

const OrderHistory = () => {
  const [selectedItem, setSelectedItem] = useState("Tất cả");
  const handleSelection = (item) => {
    setSelectedItem(item);
  };
  return (
    <div>
      <div className="container-1">
        <div className="flex-container-profile-user-1">
          <div className="sidebar-profile-user-1">
            <ul className="sidebar-menu-profile-user-1">
              <li
                className={`sidebar-item-profile-user-1 ${
                  selectedItem === "Chờ thanh toán" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Chờ thanh toán")}
              >
                <span>Waiting for processing</span>
              </li>
              <li
                className={`sidebar-item-profile-user-1 ${
                  selectedItem === "Đang giao" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Đang giao")}
              >
                <span>Delivering</span>
              </li>

              <li
                className={`sidebar-item-profile-user-1 ${
                  selectedItem === "Hoàn thành" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Hoàn thành")}
              >
                <span>Complete</span>
              </li>
              <li
                className={`sidebar-item-profile-user-1 ${
                  selectedItem === "Đã hủy" ? "selected" : ""
                }`}
                onClick={() => handleSelection("Đã hủy")}
              >
                <span>Canceled</span>
              </li>
            </ul>
          </div>
          <div className="main-content-profile-user-1">
            {selectedItem === "Đang giao" && <UserOder status="Sent" />}
            {selectedItem === "Chờ thanh toán" && <UserOder status="Pending" />}
            {selectedItem === "Hoàn thành" && <UserOder status="Delivered" />}
            {selectedItem === "Đã hủy" && <UserOder status="Cancelled" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
