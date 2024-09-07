import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFloppyDisk,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const EditAdminModal = ({
  showEditModal1,
  handleCloseEditModal1,
  formData1,
  handleInputChange1,
  handleUpdateUser1,
  handleRestoreOriginalData1,
}) => {
  if (!showEditModal1) return null;

  return (
    <div className="modal1">
      <div className="modalContent1">
        <div className="h2div">
          <h2 className="h2">EDIT INFORMATION</h2>
          <div className="divclassIcon">
            <div className="classIcon">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => {
                  handleRestoreOriginalData1();
                  handleCloseEditModal1();
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
              value={formData1.fullName}
              onChange={handleInputChange1}
              className="fullName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData1.phoneNumber}
              onChange={handleInputChange1}
              className="phoneNumber"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData1.email}
              onChange={handleInputChange1}
              className="email"
            />
          </div>
          <div className="form-buttons">
            <button className="classbuttonSave" onClick={handleUpdateUser1}>
              <FontAwesomeIcon icon={faFloppyDisk} className="iconSave" />
              <p className="textSave">Save</p>
            </button>

            <button
              className="classbuttonCancel"
              onClick={() => {
                handleRestoreOriginalData1();
                handleCloseEditModal1();
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

export default EditAdminModal;
