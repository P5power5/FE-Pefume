import React, { useEffect, useState } from "react";
import "./Style/UserOrder.css";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Style/UserOrder.css";
const UserCancelled = ({ status }) => {
  const userAccessToken = useSelector((state) => state.users.accessToken);
  const userId = useSelector((state) => state.users.user?.id);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchOrders = async (page = 1) => {
    if (!userId) {
      console.error("User ID is required to fetch orders.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/order/getOrdersByUser/${userId}`,
        { status },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
          params: {
            page: page, // Truyền số trang vào query
            limit: 5, // Giới hạn số mục trên mỗi trang
          },
        }
      );

      setOrders(response.data.data); // Cập nhật orders từ dữ liệu trả về
      setTotalPages(response.data.pagination.pages); // Cập nhật số trang tổng
      setCurrentPage(response.data.pagination.page); // Cập nhật trang hiện tại
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };
  useEffect(() => {
    fetchOrders(currentPage);
  }, [userId, userAccessToken, status, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders found for this status.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="userOrder-card userOrder-card-dark">
            <div className="userOrder-content">
              <img
                style={{ width: "100px", height: "100px" }}
                src={order.items[0]?.imgUrls[0]} // Assuming the first image URL is used
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
              <button className="userOrder-button userOrder-button-red">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))
      )}
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Trước
          </button>
        )}
        <span>
          Trang {currentPage} của {totalPages}
        </span>
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
        )}
      </div>
    </div>
  );
};
export default UserCancelled;
