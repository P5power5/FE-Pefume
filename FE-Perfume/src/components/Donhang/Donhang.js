import React, { useState, useEffect, useCallback } from "react";
import "../Donhang/Donhang.css";
import "./Modal.css"; // Import CSS của modal
import { Helmet } from "react-helmet";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import Modal from "./Modal"; // Import component Modal

const Donhang = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); // Thêm trạng thái để lưu chi tiết đơn hàng

  const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái phân trang
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const itemsPerPage = 8; // Số lượng đơn hàng mỗi trang

  const userAccessToken = useSelector((state) => state.users.accessToken);

  const openProductModal = (order) => {
    setOrderDetails(order);
    setModalIsOpen(true);
  };

  const fetchCollectionData = useCallback(async () => {
    setLoading(true);
    const timeout = 300; 
    // Thiết lập thời gian chờ trước khi thực hiện gọi API
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/order`,
          {
            headers: {
              token: `Bearer ${userAccessToken}`,
            },
            params: {
              page: currentPage,
              limit: itemsPerPage,
            },
          }
        );
        setCollection(response.data.data);
        setTotalPages(Math.ceil(response.data.totalOrders / itemsPerPage)); // Cập nhật tổng số trang
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }, timeout);

    // Dọn dẹp timeout nếu hàm bị hủy
    return () => clearTimeout(timer);

  }, [userAccessToken, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchSearchData = useCallback(
    debounce(async (query) => {
      setCurrentPage(1);
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/order/search`,
          {
            headers: {
              token: `Bearer ${userAccessToken}`,
            },
            params: {
              userId,
              orderCode: query.toUpperCase(),
              status,
              startDate,
              endDate,
              page: currentPage, // Thêm phân trang vào tìm kiếm
              limit: itemsPerPage,
            },
          }
        );

        setCollection(response.data.data);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage)); // Cập nhật tổng số trang khi tìm kiếm
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    },0),
    [userId, status, startDate, endDate, currentPage, userAccessToken]
  );

  useEffect(() => {
    if (searchQuery) {
      fetchSearchData(searchQuery);
      console.log(searchQuery);
    } else {
      fetchCollectionData();
    }
  }, [searchQuery, fetchSearchData, fetchCollectionData]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/order/${orderId}/status`,
        { status },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
        }
      );
      if (searchQuery) {
        fetchSearchData(searchQuery);
      } else {
        fetchCollectionData();
      }
    } catch (error) {
      setError("Failed to update order status");
    }
  };
  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    setNewStatus(newStatus);

    if (
      newStatus !== "" &&
      newStatus !== collection.find((item) => item._id === orderId)?.status
    ) {
      updateOrderStatus(orderId, newStatus);
      setUpdatingStatusId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchQuery(value);
  };

  const getSelectClass = (status) => {
    return ["Delivered", "Cancelled"].includes(status)
      ? "select-status hide-arrow"
      : "select-status";
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="classNhanvienPhanLoai">
        <div className="classNhanvien2">
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search"
              className="textInput"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
          </div>
        </div>
      </div>
      <div className="noidungtable">
        <div className="tableContainer">
          <table className="userTable-1">
            <thead>
              <tr>
                <th>ORDERCODE</th>
                <th>FULLNAMEUSER</th>
                <th>PAYMENT STATUS</th>
                <th>PAYMENT METHOD</th>
                <th>SHIPPING METHOD</th>
                <th>PAID</th>
                <th>SEE MORE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : (
                collection
                  .sort((a, b) => a.orderCode.localeCompare(b.orderCode))
                  .map((item) => (
                    <tr key={item._id}>
                      <td>{item.orderCode}</td>
                      <td>{item.userFullName}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          <select
                            className={getSelectClass(item.status)}
                            value={
                              updatingStatusId === item._id
                                ? newStatus
                                : item.status
                            }
                            onChange={(e) =>
                              handleStatusChange(item._id, e.target.value)
                            }
                            onBlur={() => setUpdatingStatusId(null)}
                            disabled={["Cancelled", "Delivered"].includes(
                              item.status
                            )}
                          >
                            <option value="">Select Status</option>
                            {["Pending", "Sent", "Delivered", "Cancelled"].map(
                              (status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                          {["Cancelled", "Delivered"].includes(item.status) &&
                            item.statusDate && (
                              <span>{formatDate(item.statusDate)}</span>
                            )}
                        </div>
                      </td>
                      <td>{item.paymentMethod}</td>
                      <td>{item.shippingMethod}</td>
                      <td>{item.isPay ? "Done" : "Not yet"}</td>
                      <td>
                        <button onClick={() => openProductModal(item)}>
                          See MORE
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          orderDetails={orderDetails} // Truyền chi tiết đơn hàng vào modal
        />
      )}
    </div>
  );
};

export default Donhang;
