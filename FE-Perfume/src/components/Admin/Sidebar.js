import React from "react";
import Logo from "../assets/logo.png";
import "../Admin/Sidebar.css";
import { Link } from "react-router-dom";
import {
  faUser,
  faPeopleGroup,
  faFlask,
  faGem,
  faTags,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({ setContent }) => {
  return (
    <div className="class1">
      <div className="class2">
        <Link to="/">
          <img src={Logo} alt="Perfume" className="img" />
        </Link>
      </div>

      <div className="class3">
        <div className="class4"></div>
        <p className="tieude">Manage</p>
        <div className="class5">
          <div className="class6" onClick={() => setContent("nhanvien")}>
            <FontAwesomeIcon icon={faUser} className="iconAll" />
            <div className="class7">
              <p className="text">Staff</p>
            </div>
          </div>
          <div className="class6" onClick={() => setContent("khachhang")}>
            <FontAwesomeIcon icon={faPeopleGroup} className="iconAll" />
            <div className="class7">
              <p className="text">Client</p>
            </div>
          </div>
          <div className="class6" onClick={() => setContent("sanpham")}>
            <FontAwesomeIcon icon={faFlask} className="iconAll" />
            <div className="class7">
              <p className="text">Product</p>
            </div>
          </div>
          <div className="class6" onClick={() => setContent("bosuutap")}>
            <FontAwesomeIcon icon={faGem} className="iconAll" />
            <div className="class7">
              <p className="text">Collection</p>
            </div>
          </div>
          <div className="class6" onClick={() => setContent("phanloai")}>
            <FontAwesomeIcon icon={faTags} className="iconAll" />
            <div className="class7">
              <p className="text">Category</p>
            </div>
          </div>
        </div>

        <div className="class4"></div>
        <p className="tieude">Statistical</p>
        <div className="class5">
          <div className="class6" onClick={() => setContent("donhang")}>
            <FontAwesomeIcon icon={faShoppingCart} className="iconAll" />
            <div className="class7">
              <p className="text">Order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
