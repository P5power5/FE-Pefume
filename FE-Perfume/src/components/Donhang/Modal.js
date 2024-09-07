import React from "react";
import "./Modal.css"; // Đảm bảo bạn có CSS cho modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
const Modal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-01">
      <div className="modal-content-01">
        <button onClick={onClose} className="modal-close-01">
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <h2 style={{ fontSize: "27px" }}>Order Details</h2>
        <div className="ahihi"></div>
        <div className="order-details-grid">
          <div>
            <h2>Customer information</h2>
            <p>
              <span>UserFullName:</span> {orderDetails.userFullName}
            </p>
            <p>
              <span>Email:</span> {orderDetails.userEmail}
            </p>
            <p>
              <span>Phone Number:</span> {orderDetails.userPhone}
            </p>
            <p>
              <span>Address:</span> {orderDetails.address}
            </p>
            <p>
              {" "}
              <span>Total:</span>{" "}
              {Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(orderDetails.totalPay)}
            </p>
          </div>
          <div>
            <h2>Order information</h2>
            <p>
              <span>Shipping Method:</span> {orderDetails.shippingMethod}
            </p>
            <p>
              <span>Payment Status:</span> {orderDetails.paymentMethod}
            </p>
            <p>
              <span>Shipping Status:</span>{" "}
              {orderDetails.isPay ? "Done" : "Not yet"}
            </p>
          </div>
        </div>
        <div className="ahihi"></div>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table className="product-table-01">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Contenance</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.quantity}</td>
                  <td>{product.contenance}</td>
                  <td>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(product.price)}
                  </td>
                  <td>{product.subtotal}</td>
                  <td>
                    <img
                      style={{ width: "70px", height: "70px" }}
                      src={product.imgUrls}
                      alt={product.productName}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal;
