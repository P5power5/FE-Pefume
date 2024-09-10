import React, { useEffect, useState } from "react";
import "./Style/UserOrder.css";
import axios from "axios";
import { useSelector } from "react-redux";

const UserOrder = ({ status }) => {
  const userAccessToken = useSelector((state) => state.users.accessToken);
  const userId = useSelector((state) => state.users.user?.id);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalAmountAllPages, setTotalAmountAllPages] = useState(0);

  const fetchOrders = async (page = 1) => {
    if (!userId) {
      console.error("User ID is required to fetch orders.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/order/getOrdersByUser/${userId}`,
        { status },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
          params: {
            page: page,
            limit: 5,
          },
        }
      );

      const newOrders = response.data.data;
      setOrders(newOrders);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(response.data.pagination.page);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const fetchTotalAmountAllPages = async () => {
    if (!userId) {
      console.error("User ID is required to fetch total amount.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/order/getOrdersByUser/${userId}`,
        { status },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
          params: {
            page: 1,
            limit: 9999,
          },
        }
      );

      const allOrders = response.data.data;
      const totalAmount = allOrders.reduce(
        (total, order) => total + order.totalPay,
        0
      );
      setTotalAmountAllPages(totalAmount);
    } catch (error) {
      console.error("Error fetching total amount:", error.message);
    }
  };

  const handleCancelled = async (orderId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/order/cancel/${orderId}`,
        { orderId },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
        }
      );
      if (response.data.success) {
        // Update orders list and total amount immediately
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        // Recalculate total amount for the current page
        fetchOrders(currentPage);
        fetchTotalAmountAllPages();
      } else {
        console.error("Lỗi khi hủy đơn hàng:", response.data.error);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
    fetchTotalAmountAllPages();
  }, [userId, userAccessToken, status, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const calculateCurrentPageTotalAmount = () => {
    return orders.reduce((total, order) => total + order.totalPay, 0);
  };

  const handleViewDetails = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders found for this status.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="userOrder-card userOrder-card-dark">
              <div className="userOrder-content">
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={order.items[0]?.imgUrls[0]}
                  alt={order.items[0]?.productName}
                />
                <div>
                  <h3>{order.items[0]?.productName}</h3>
                  <p>{order.items[0]?.contenance}</p>
                  <p>X{order.items[0]?.quantity}</p>
                </div>
              </div>
              <div className="userOrder-price">
                <span>Thành tiền</span>
                <span>{order.totalPay.toLocaleString()}₫</span>
              </div>
              <div className="userOrder-button-container">
                <button
                  className="userOrder-button userOrder-button-red"
                  onClick={() => handleViewDetails(order._id)}
                >
                  Xem chi tiết
                </button>
              </div>
              <div className="userOrder-button-container">
                <button
                  className="userOrder-button userOrder-button-red-1"
                  onClick={() => handleCancelled(order._id)}
                >
                  Hủy Đơn
                </button>
              </div>
            </div>
          ))}
          <div className="total-amount">
            <span>
              Total amount of {orders.length} orders on the current page:{" "}
            </span>
            <span>{calculateCurrentPageTotalAmount().toLocaleString()}₫</span>
          </div>
          <div className="total-amount">
            <span>Total amount of all orders: </span>
            <span>{totalAmountAllPages.toLocaleString()}₫</span>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="UserOrder-modal-overlay" onClick={closeModal}>
          <div
            className="UserOrder-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="UserOrder-modal-close" onClick={closeModal}>
              ×
            </button>
            <div>
              <div className="UserOrder-modal-header">
                <h2>Order details {selectedOrder.orderCode}</h2>
              </div>
            </div>
            <div className="UserOrder-modal-body">
              <div className="UserOrder-modal-info">
                <div className="UserOrder-info-section">
                  <div className="UserOrder-info-item">
                    <strong>Receiver:</strong> {selectedOrder.userFullName}
                  </div>
                  <div className="UserOrder-info-item">
                    <strong>Email:</strong> {selectedOrder.userEmail}
                  </div>
                  <div className="UserOrder-info-item">
                    <strong>Phone Number:</strong> {selectedOrder.userPhone}
                  </div>
                  <div className="UserOrder-info-item">
                    <strong>Address:</strong> {selectedOrder.address}
                  </div>
                </div>
                <div className="UserOrder-info-section">
                  <div className="UserOrder-info-item">
                    <strong>Delivery method:</strong>{" "}
                    {selectedOrder.shippingMethod}
                  </div>
                  <div className="UserOrder-info-item">
                    <strong>Status:</strong> {selectedOrder.status}
                  </div>
                  <div className="UserOrder-info-item">
                    <strong>Payment method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </div>
                  <div className="UserOrder-info-item">
                    <strong>Total amount:</strong>{" "}
                    {selectedOrder.totalPay.toLocaleString()}₫
                  </div>
                </div>
              </div>
              <div className="UserOrder-modal-items">
                <h3>Products in the order:</h3>
                <div
                  className={`UserOrder-order-items-container ${
                    selectedOrder.items.length > 3 ? "scroll" : ""
                  }`}
                >
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="UserOrder-order-item">
                      <img
                        style={{ width: "100px", height: "100px" }}
                        src={item.imgUrls[0]}
                        alt={item.productName}
                        className="UserOrder-order-item-img"
                      />
                      <div className="UserOrder-order-item-info">
                        <h4>{item.productName}</h4>
                        <p>{item.contenance}</p>
                        <p>X{item.quantity}</p>
                        <p>Giá: {item.price.toLocaleString()}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserOrder;
