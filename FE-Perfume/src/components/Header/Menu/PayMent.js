import React, { useCallback, useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../../Footer/Footer";
import "./Style/PayMent.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const PayMent = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("in Store");
  const userId = useSelector((state) => state.users.user);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/getCartChecked/${userId?.id}`
      );
      if (response.data.success) {
        setLoading(false);
        setOrderData(response.data.data);
        updateTotalAmount(response.data.data);
      } else {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng:", response.data.error);
      }
    } catch (error) {
     
    }
  }, [userId]);
  

  useEffect(() => {
    fetchCartItems(userId);
  }, [fetchCartItems, userId]);

  useEffect(() => {
    if (orderData) {
      updateTotalAmount(orderData);
    }
  }, [orderData]);
  const handlePay = async () => {
    if (isAddingToCart) return; // Ngăn chặn thực hiện nếu đang thêm vào giỏ hàng
    setIsAddingToCart(true); // Vô hiệu hóa nút trong khi API đang được thực hiện
    try {
      const orderDataToSend = {
        userFullName: userId.fullName,
        userEmail: userId.email,
        address: userId.address,
        shippingMethod: selectedShippingMethod, // Ensure this matches the allowed values
        paymentMethod: selectedPaymentMethod, // Ensure this matches the allowed values
        subTotal: totalAmount,
        totalPay: totalAmount,
        userPhone: userId.phoneNumber,
        items: orderData,
        shippingFee: 0, // Or adjust if this value should be dynamic
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/order/add/${userId.id}`,
        orderDataToSend
      );

      if (response.data.success) {
        setShowSuccessModal(true);
        const orderCode = response.data.order.orderCode;
        if (selectedPaymentMethod === "VN_PAY") {
          // Gọi API của bạn để lấy URL thanh toán VNPay
          const orderDataToSend = {
            orderCode: orderCode,
            amount: totalAmount,
            bankCode: "",
            language: "",
            orderinfo: `${userId.fullName} thanh toán thành công `,
          };
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_ADDRESS}/vnpay/create_payment_url`, // Thay đổi URL này thành API tạo thanh toán VNPay của bạn
            orderDataToSend
          );
          // Chuyển hướng người dùng đến trang thanh toán VNPay
          window.location.href = response.data.data;
        }
      } else {
        alert("Order placement failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Server Response:", error.response.data);
        alert(
          "Order placement failed due to server error: " +
            error.response.data.message
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error("No Response:", error.request);
        alert("Order placement failed due to no response from server.");
      } else {
        // Something else happened
        console.error("Error Message:", error.message);
        alert("Order placement failed due to an error: " + error.message);
      }
    } finally {
      setIsAddingToCart(false); // Kích hoạt lại nút sau khi API hoàn tất
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!orderData) {
    return <p>No data found.</p>;
  }

  const updateTotalAmount = (items) => {
    // Tính tổng giá trị của các mục giỏ hàng
    const total = items.reduce((acc, item) => acc + item.subtotal, 0); // Tính tổng từ cột 'subtotal'
    setTotalAmount(total);
  };
  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/");
  };
  return (
    <div>
      <Header />
      <div className="container">
        <div className="card-payment">
          <h1 className="title-payment">Pay</h1>
          <div className="receiver-info-payment">
            <div className="payment-section">
              <h2 className="section-title-payment">RECEIVER</h2>
              <p>Full name: {userId?.fullName}</p>
              <p>Phone Number: {userId?.phoneNumber}</p>
              <p>Address: {userId?.address}</p>
            </div>
          </div>
          <table className="order-table-payment">
            <thead>
              <tr>
                <th className="table-header-payment">Product name</th>
                <th className="table-header-payment">Quantity</th>
                <th className="table-header-payment">Unit price</th>
                <th className="table-header-payment">Subtotal bill</th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((item, index) => (
                <tr key={index}>
                  <td className="table-cell-payment">{item.productName}</td>
                  <td className="table-cell-payment">{item.quantity}</td>
                  <td className="table-cell-payment">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </td>
                  <td className="table-cell-payment">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="payment-info-payment">
            <div>
              <h3 className="section-title-payment">SHIPPING METHOD</h3>
              <select
                className="payment-methods-payment"
                value={selectedShippingMethod}
                onChange={(e) => setSelectedShippingMethod(e.target.value)}
              >
                <option value="in Store">In Store</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            <div>
              <h3 className="section-title-payment">PAYMENT METHODS</h3>
              <select
                className="payment-methods-payment"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="COD">COD</option>
                <option value="VN_PAY">VN_PAY</option>
              </select>
            </div>
            <div className="pricing-info-payment">
              <p>
                Shipping fee:{" "}
                <span className="font-semibold-payment">FREE</span>
              </p>
              <p>
                Total bill:{" "}
                <span className="font-semibold-payment">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(totalAmount)}
                </span>
              </p>
            </div>
          </div>
          <div className="total-amount-center-payment">
            <span className="total-price-payment">
              {orderData.paymentRequired}
            </span>
          </div>
          <button
            disabled={isAddingToCart}
            className="btn-pay-payment"
            onClick={handlePay}
          >
            {isAddingToCart ? "loading..." : "Pay"}
          </button>
        </div>
      </div>
      {showSuccessModal && (
        <div className="modal-payment">
          <div className="modal-content-payment">
            <div className="modal-icon-payment">
              <svg
                className="checkmark-payment"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark-circle-payment"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check-payment"
                  fill="none"
                  d="M16 27l7 7 13-13"
                />
              </svg>
            </div>
            <h2>Order Placed Successfully</h2>
            <button className="button-modal-payment" onClick={handleModalClose}>
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PayMent;
