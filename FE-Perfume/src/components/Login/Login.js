import React, { useState } from "react";
import "./Login.css";
import logo1 from "../../image/logo1.png";
import RegisterModal from "../Register/Register"; // Import RegisterModal
import Resetpassword from "../Resetpassword/Resetpassword";
import { useDispatch } from "react-redux";
import { setCredentials } from "./Redux/Slice/userSlice";
import { toast, ToastContainer } from "react-toastify"; // Nhập react-toastify
import "react-toastify/dist/ReactToastify.css"; // Nhập CSS của react-toastify

const Login = ({ isOpen, onClose }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

  const [isResetpasswordOpen, setIsRResetpasswordOpen] = useState(false);
  const openResetpassword = () => setIsRResetpasswordOpen(true);
  const closeResetpassword = () => setIsRResetpasswordOpen(false);

  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  // Thunk action cho đăng nhập
  const loginUser = async (credentials) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const { accessToken } = data;

      // Lưu accessToken vào localStorage
      localStorage.setItem("accessToken", accessToken);

      dispatch(setCredentials({ accessToken }));
      onClose();
      toast.success("Login successful!", {
        autoClose: 8000, // Thay đổi thời gian hiển thị
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(`Login failed: ${error.message}`, {
        autoClose: 4000, // Thay đổi thời gian hiển thị (5000ms = 5 giây)
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser({ userName, password });
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-form-container">
            <button className="modal-close-1" onClick={onClose}>
              &times;
            </button>
            <h2 className="modal-title">Login</h2>
            <form onSubmit={handleSubmit}>
              <label className="modal-label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="modal-input"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <label className="modal-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="modal-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="modal-button" >
                Login
              </button>
              <div className="forgot-password-conte">
                <div className="forgot-password">
                  <p>
                    <span onClick={openResetpassword}>Quên Mật Khẩu</span>
                  </p>
                </div>
                <div className="forgot-password">
                  <p>
                    <span onClick={openRegisterModal}>Sign up</span>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div>
            <div className="modal-image">
              <img src={logo1} alt="Logo" className="logo-img" />
            </div>
            <p style={{ textAlign: "center", paddingTop: "10px" }}>
              Chào mừng bạn đã đến với shop
            </p>
          </div>
        </div>
      </div>
      <RegisterModal isOpen={isRegisterOpen} onClose={closeRegisterModal} />
      <Resetpassword
        isOpen={isResetpasswordOpen}
        onClose={closeResetpassword}
      />
      <ToastContainer /> {/* Thêm ToastContainer vào render */}
    </>
  );
};

export default Login;
