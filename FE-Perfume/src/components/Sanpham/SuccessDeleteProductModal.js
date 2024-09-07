import React from "react";

const SuccessDeleteModal = ({ showModal, handleCloseModal }) => {
  if (!showModal) return null;

  return (
    <div className="modalConfirm">
      <div className="modalContentConfirm">
        <div className="formConfirm">
          <p className="classtextConfirmNhanVien">Delete product to list successfully </p>
          <div className="form-buttonsConfirm">
            <button className="classbuttonYes" onClick={handleCloseModal}>
              <p className="textYesNhanVien">OK</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessDeleteModal;
