import React from "react";

const ConfirmAddModal = ({ showModal, handleConfirmAdd, handleCloseModal }) => {
  if (!showModal) return null;

  return (
    <div className="modalConfirm">
      <div className="modalContentConfirm">
        <div className="formConfirm">
          <p className="classtextConfirmNhanVien">
            Are you sure you want to add this product?
          </p>

          <div className="form-buttonsConfirm">
            <button className="classbuttonYes" onClick={handleConfirmAdd}>
              <p className="textYesNhanVien">Yes</p>
            </button>
            <button className="classbuttonNo" onClick={handleCloseModal}>
              <p className="textNoNhanVien">No</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAddModal;
