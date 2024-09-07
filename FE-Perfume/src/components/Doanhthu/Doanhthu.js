import React, { useState } from "react";
import Avatar from "../../image/Avatar.png";
import logout from "../../image/logout.png";
import "../Doanhthu/Doanhthu.css";
import { Helmet } from "react-helmet";
import timkiem from "../../image/timkiem.png";

const Doanhthu = () => {
  const [showModal, setShowModal] = useState(false);

  const handleProfileClick = () => {
    console.log("Profile clicked");
    setShowModal(!showModal);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="classKhachhang1">
        <div className="classKhachhang2">
          <div className="searchContainer">
            <input type="text" placeholder="Search" className="textInput" />
            <img src={timkiem} alt="Search" className="searchIcon" />
          </div>
          <div className="classKhachhang4">
            <div className="classKhachhang3">
              <div className="classtext">
                <p className="classKhachhangtext">Jane Cooper</p>
              </div>
              <div className="classtext">
                <p className="classKhachhangtext1">jane.cooper@example.com</p>
              </div>
            </div>
            <img
              src={Avatar}
              alt="Avatar"
              className="icon1"
              onClick={handleProfileClick}
            />
          </div>
        </div>
        {showModal && (
          <div className="profile">
            <p className="logout">Đăng xuất</p>
            <img src={logout} alt="logout" className="icon2" />
          </div>
        )}
      </div>

      <div className="class11">
        <p>Doanh Thu</p>
      </div>
    </div>
  );
};

export default Doanhthu;
