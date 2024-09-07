import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
  faRightFromBracket,
  faUserTie,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import "./styleHeader.css";
import LoginModal from "../Login/Login";
import { logout } from "../Login/Redux/Slice/userSlice";
import Logo from "../../image/logo.png";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.users.user);
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 3)
      .join("");
  };

  const userInitials = userSelector?.fullName
    ? getInitials(userSelector.fullName)
    : "";
  const handleLogout = () => {
    dispatch(logout());
    if (userSelector?.roleId === "admin") {
      navigate("/");
    }
  };

  const handleLogout1 = () => {
    dispatch(logout());
    if (userSelector?.roleId === "user") {
      navigate("/");
    }
  };

  const isAdmin = userSelector?.roleId === "admin";
  const isLoggedIn = !!userSelector?.fullName;

  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/collection/getCollection/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setCollections(data.data);
      } else {
        console.error(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi: " + error.message);
    }
  }, []);

  const fetchCategories = useCallback(async (collectionName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/category/getCategoryByCollection/${collectionName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        console.error(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 mx-lg-5 px-lg-5">
        <div className="header-items container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo03"
              aria-controls="navbarTogglerDemo03"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <a
              className="navbar-brand d-lg-none image-logo"
              href="/"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <img src={Logo} alt="Logo" className="logo-img" />
            </a>

            <a
              className="navbar-brand mx-auto d-none py-lg-3 mx-lg-4 d-lg-block"
              href="/"
            >
              <img src={Logo} alt="Logo" className="logo-img" />
            </a>
          </div>
          <div
            className="collapse navbar-collapse order-lg-1"
            id="navbarTogglerDemo03"
          >
            <ul className="navbar-nav menu-list mb-2 mb-lg-0 d-lg-flex flex-lg-row flex-lg-wrap">
              {collections.map((collection) => (
                <li key={collection._id} className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    type="button"
                    id={`${collection.name}Dropdown`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={() => fetchCategories(collection.name)}
                  >
                    {collection.name}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby={`${collection.name}Dropdown`}
                  >
                    {categories.map((category) => (
                      <li key={category._id}>
                        <Link
                          className="dropdown-item"
                          to={`/category/${category._id}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-nav d-lg-flex flex-row order-lg-2">
            <div>
              <div className="navbar-icons">
                <div>
                  <Link to="/order">
                    <button className="btn cart-btn" type="button">
                      <FontAwesomeIcon
                        style={{ cursor: "pointer", fontSize: "1rem" }}
                        icon={faCartShopping}
                      />
                    </button>
                  </Link>
                </div>
                {isAdmin && (
                  <div>
                    <Link to="/admin">
                      <button className="btn cart-btn" type="button">
                        <FontAwesomeIcon
                          style={{ cursor: "pointer", fontSize: "1rem" }}
                          icon={faUserTie}
                        />
                      </button>
                    </Link>
                  </div>
                )}
                {!isLoggedIn && (
                  <div>
                    <button
                      className="btn cart-btn login-btn"
                      type="button"
                      onClick={openModal}
                    >
                      <FontAwesomeIcon
                        style={{ cursor: "pointer", fontSize: "1rem" }}
                        icon={faCircleUser}
                      />
                    </button>
                    <LoginModal isOpen={isModalOpen} onClose={closeModal} />
                  </div>
                )}
                {isLoggedIn && (
                  <div>
                    <button
                      className="btn logout-btn-1 logout-btn"
                      type="button"
                      onClick={
                        userSelector?.roleId === "admin"
                          ? handleLogout
                          : handleLogout1
                      } // Kiểm tra role và gọi hàm tương ứng
                    >
                      <FontAwesomeIcon
                        style={{ cursor: "pointer", fontSize: "1rem" }}
                        className="icon-logout"
                        icon={faRightFromBracket}
                      />
                    </button>
                  </div>
                )}

                <div className="user-greeting">
                  {userSelector?.fullName ? (
                    <Link to="/profile">
                      <div className="user-avatar">
                        <span className="avatar-text">{userInitials}</span>
                      </div>
                    </Link>
                  ) : (
                    <Link to="/login"></Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="welcome">
        <span>WELCOME ON OUR SHOP</span>
      </div>
    </>
  );
};

export default Header;
