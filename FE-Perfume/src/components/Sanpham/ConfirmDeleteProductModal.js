import React from "react";

const ConfirmDeleteModal = ({ showModal, onConfirm, onCancel }) => {
  if (!showModal) return null;

  return (
    <div className="modalConfirm">
      <div className="modalContentConfirm">
        <div className="formConfirm">
          <p className="classtextConfirmNhanVien">
            Are you sure you want to delete this product?
          </p>

          <div className="form-buttonsConfirm">
            <button className="classbuttonYes" onClick={onConfirm}>
              <p className="textYesNhanVien">Yes</p>
            </button>
            <button className="classbuttonNo" onClick={onCancel}>
              <p className="textNoNhanVien">No</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
