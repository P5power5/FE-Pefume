import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../Resetpassword/Resetpassword.css";

const ResetpassworForm = ({ onClose }) => {
  const { token } = useParams(); // Lấy token từ URL
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Token không hợp lệ.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/user/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.msg);
        setError(""); // Xóa lỗi nếu có
        setNewPassword(""); // Xóa mật khẩu sau khi cập nhật thành công
        setTimeout(() => onClose(), 2000); // Đóng modal sau 2 giây
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
          <h2 className="register-modal-title">Đặt Lại Mật Khẩu</h2>
          <form onSubmit={handleResetPassword}>
            <label className="register-modal-label" htmlFor="newPassword">
              Mật Khẩu Mới
            </label>
            <input
              type="password"
              id="newPassword"
              className="register-modal-input"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="register-modal-button">
              Cập Nhật Mật Khẩu
            </button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetpassworForm;
