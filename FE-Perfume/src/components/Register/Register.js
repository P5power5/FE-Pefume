import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo1 from "../../image/logo1.png";

const RegisterModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  if (!isOpen) return null;

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
  };

  const validateFullName = (fullName) => {
    const fullNamePattern = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;
    return fullNamePattern.test(fullName);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{1,11}$/;
    return phonePattern.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const gmailPattern = /@gmail\.com$/;
    return emailPattern.test(email) && gmailPattern.test(email);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "password") {
      setPassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long and include at least one special character.",
      }));
    } else if (id === "fullname") {
      setFullname(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: validateFullName(value)
          ? ""
          : "Full Name must have each word starting with an uppercase letter.",
      }));
    } else if (id === "phonenumber") {
      setPhonenumber(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: validatePhoneNumber(value)
          ? ""
          : "Phone Number must be a number and up to 11 digits.",
      }));
    } else if (id === "email") {
      setEmail(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value)
          ? ""
          : "Email must be in valid format and end with @gmail.com.",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) return;

    const userData = {
      userName,
      fullName,
      phoneNumber,
      email,
      password,
      address,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      onClose();
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      console.log("Register successful:", data);

      const loginResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, password }),
        }
      );
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(`Login response was not ok: ${errorText}`);
      }
      const loginData = await loginResponse.json();
      localStorage.setItem("authToken", loginData.token);
      console.log("Login successful:", loginData);

      navigate("/");

      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around",flexDirection:"column"   }}>
          <div className="register-logo1">
            <img src={logo1} alt="logo1" className="logo1-register" />
          </div>
          {/* <div>
            <p>Hello! Welcome to Perfume.</p>
          </div> */}
        </div>

        <div className="register-modal-form-container">
          <button className="register-modal-close" onClick={onClose}>
            &times;
          </button>
          <h2 className="register-modal-title">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="register-modal-row">
              <div className="register-modal-col">
                <label className="register-modal-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="register-modal-input"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="register-modal-col">
                <label className="register-modal-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="register-modal-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <div className="register-modal-error">{errors.password}</div>
                )}
              </div>
            </div>
            <div className="register-modal-row">
              <div className="register-modal-col">
                <label className="register-modal-label" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  className="register-modal-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={handleChange}
                  required
                />
                {errors.fullName && (
                  <div className="register-modal-error">{errors.fullName}</div>
                )}
              </div>
              <div className="register-modal-col">
                <label className="register-modal-label" htmlFor="phonenumber">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phonenumber"
                  className="register-modal-input"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handleChange}
                  required
                />
                {errors.phoneNumber && (
                  <div className="register-modal-error">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
            </div>
            <div className="register-modal-row">
              <div className="register-modal-col">
                <label className="register-modal-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="register-modal-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <div className="register-modal-error">{errors.email}</div>
                )}
              </div>
              <div className="register-modal-col">
                <label className="register-modal-label" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="register-modal-input"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="register-modal-button"
              disabled={Object.values(errors).some((error) => error)}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
