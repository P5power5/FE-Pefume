import React, { useState } from "react";
import "../Resetpassword/Resetpassword.css";

const Resetpassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/user/send-reset-password-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.msg);
        setError("");
        setEmail(""); // Xóa email sau khi gửi thành công
      } else {
        setMessage("");
        setError(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      setMessage("");
      setError("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal-content">
        <div className="register-modal-form-container">
          <button className="register-modal-close" onClick={onClose}>
            &times;
          </button>
          <h2 className="register-modal-title">Quên Mật Khẩu</h2>
          <form onSubmit={handleSubmit}>
            <label className="register-modal-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="register-modal-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="register-modal-button">
              Nhập email
            </button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
