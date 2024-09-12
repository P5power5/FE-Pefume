import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faEye,
  faEyeSlash,
  faCirclePlus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const AddStaffModal = ({
  showModal,
  formData,
  handleInputChange,
  handleOpenConfirmModal,
  handleCloseModal,
  togglePasswordVisibility,
  showPassword,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal1">
      <div className="modalContent1">
        <div className="h2div">
          <h2 className="h2">Add STAFF</h2>
          <div className="divclassIcon">
            <div className="classIcon">
              <FontAwesomeIcon icon={faXmark} onClick={handleCloseModal} />
            </div>
          </div>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="fullName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="phoneNumber"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              value={formData.userName}
              onChange={handleInputChange}
              className="userName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label-password">
              Password
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="password"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="toggle-password"
              />
            </div>
          </div>
          <div className="form-buttons">
            <button className="classbuttonAdd" onClick={handleOpenConfirmModal}>
              <FontAwesomeIcon icon={faCirclePlus} className="iconAdd" />
              <p className="textAdd">Add</p>
            </button>

            <button className="classbuttonCancel" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faCircleXmark} className="iconCancel" />
              <p className="textCancel">Cancel</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
