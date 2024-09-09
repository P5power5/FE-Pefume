import React, { useState } from "react";
import "./Style/ForgetPassWord.css";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-modal";

const ForgetPassWord = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userAccessToken = useSelector((state) => state.users.accessToken);
  const userId = useSelector((state) => state.users.user);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    checkPasswordsMatch(e.target.value, confirmNewPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    checkPasswordsMatch(newPassword, e.target.value);
  };

  const checkPasswordsMatch = (newPwd, confirmPwd) => {
    setPasswordsMatch(newPwd === confirmPwd);
  };

  const changePassword = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/user/changePassword/${userId?.id}`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
        }
      );
      const { data } = response;
      // if (response.status === 200) {
      //   alert(data.msg);
      //   window.location.reload();
      // } else {
      //   alert(data.msg);
      // }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentPassword && newPassword && confirmNewPassword) {
      if (newPassword === confirmNewPassword) {
        changePassword();
      } else {
        setPasswordsMatch(false);
      }
    } else {
      if (!currentPassword) {
        alert("Vui lòng nhập mật khẩu cũ");
      } else if (!newPassword) {
        alert("Vui lòng nhập mật khẩu mới");
      } else if (!confirmNewPassword) {
        alert("Vui lòng nhập xác nhận mật khẩu mới");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="body-forget">
      <div className="container-forget">
        <h2>Đổi mật khẩu</h2>
        <p className="text-forget">Vui lòng nhập thông tin</p>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="lable-forget">
            <span className="label-text-forget">Mật khẩu cũ</span>
            <input
              type="password"
              className="input-forget"
              placeholder="Nhập mật khẩu cũ"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="lable-forget">
            <span className="label-text-forget">Mật khẩu mới</span>
            <input
              className="input-forget"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div className="lable-forget">
            <span className="label-text-forget">Xác nhận mật khẩu mới</span>
            <input
              className="input-forget"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmNewPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          {!passwordsMatch && (
            <p className="error-message">Mật khẩu không trùng khớp</p>
          )}
          <div className="button-container-forget">
            <button className="button update-button-forget" type="submit">
              Cập nhật
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Profile Updated Successfully"
        className="modal-successpassword"
        overlayClassName="modal-overlaypassword"
      >
        <h2>Password Updated Successfully!</h2>
        <button onClick={closeModal} className="modal-confirmpassword">
          OK
        </button>
      </Modal>
    </div>
  );
};

export default ForgetPassWord;
