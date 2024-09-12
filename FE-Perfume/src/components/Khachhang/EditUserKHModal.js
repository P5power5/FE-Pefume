import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFloppyDisk,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const EditUserKHModal = ({
  showEditModal,
  handleCloseEditModal,
  formData,
  handleInputChange,
  handleUpdateUser,
  handleRestoreOriginalData,
}) => {
  if (!showEditModal) return null;

  return (
    <div className="modal1">
      <div className="modalContent1">
        <div className="h2div">
          <h2 className="h2">EDIT INFORMATION CLIENT</h2>
          <div className="divclassIcon">
            <div className="classIcon">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => {
                  handleRestoreOriginalData();
                  handleCloseEditModal();
                }}
              />
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
          <div className="form-buttons">
            <button className="classbuttonSave" onClick={handleUpdateUser}>
              <FontAwesomeIcon icon={faFloppyDisk} className="iconSave" />
              <p className="textSave">Save</p>
            </button>

            <button
              className="classbuttonCancel"
              onClick={() => {
                handleRestoreOriginalData();
                handleCloseEditModal();
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} className="iconCancel" />
              <p className="textCancel">Cancel</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserKHModal;
