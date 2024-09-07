import React from 'react';
import './VariantsModal.css'; 

const VariantsModal = ({ showModal, handleCloseModal, variants, productName }) => {
  if (!showModal) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalCloseButton" onClick={handleCloseModal}>
          &times;
        </button>
        <h2>{`Product Variants for ${productName}`}</h2> 
        <ul>
          {variants.map((variant, idx) => (
            <li key={idx}>
              {`Contenance: ${variant.contenance}, Price: ${variant.price}, In Stock: ${variant.inStock}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VariantsModal;
