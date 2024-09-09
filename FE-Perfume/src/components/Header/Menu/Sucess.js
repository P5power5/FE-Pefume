import React, { useEffect, useState } from "react";
// import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
// import { Button, Row } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Header";
import Footer from "../../Footer/Footer";

const Sucess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [transactionData, setTransactionData] = useState(null);
  const [invalidResponse, setInvalidResponse] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/VNPAY/vnpay_return?${params}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "97") {
          setInvalidResponse(true);
        } else {
          setTransactionData(data);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu từ server:", error));
  }, [params]);
  const containerStyle = {
    height: "40vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };
  const iconStyle = {
    color:
      transactionData && transactionData.vnp_ResponseCode === "00"
        ? "green"
        : "red",
    fontSize: "4rem",
  };
  if (!transactionData && !invalidResponse) {
    return (
      <div className="container" style={containerStyle}>
        <div style={contentStyle}>
          <p style={{ fontSize: "2rem" }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  if (invalidResponse) {
    return (
      <div>
        <Header />
        <div className="container" style={containerStyle}>
          {/* <Row>
          <CloseCircleOutlined style={{ ...iconStyle, color: "red" }} />
        </Row> */}
          <p style={{ fontSize: "2rem", color: "red" }}>Dữ liệu không hợp lệ</p>
          <div style={contentStyle}>
            <p style={{ fontSize: "1.25rem" }}>Mã lỗi: 97</p>
            <p style={{ fontSize: "1.25rem" }}>
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </p>
          </div>
          <NavLink to={"/profile/orders"}>
            <button>Quay lại đơn hàng</button>
          </NavLink>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="container" style={containerStyle}>
      {/* <Row>
        {transactionData.vnp_ResponseCode === "00" ? (
          <CheckCircleOutlined style={iconStyle} />
        ) : (
          <CloseCircleOutlined style={iconStyle} />
        )}
      </Row> */}
      <p style={{ fontSize: "2rem", color: iconStyle.color }}>
        {transactionData.vnp_ResponseCode === "00"
          ? "Thanh toán thành công"
          : "Thanh toán thất bại"}
      </p>
      <div style={contentStyle}>
        <p style={{ fontSize: "1.25rem" }}>
          Mã giao dịch: {transactionData.vnp_TransactionNo}
        </p>
        <p style={{ fontSize: "1.25rem" }}>
          Nội dung thanh toán: {transactionData.vnp_OrderInfoFormatted}
        </p>
        <p style={{ fontSize: "1.25rem" }}>
          Số tiền giao dịch:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(transactionData.vnp_Amount / 100)}
        </p>
        <p style={{ fontSize: "1.25rem" }}>
          Ngân hàng giao dịch: {transactionData.vnp_BankCode}
        </p>
        <p style={{ fontSize: "1.25rem" }}>
          Ngày tạo hoá đơn: {transactionData.vnp_PayDate}
        </p>
      </div>
      <NavLink to={`/order-detail/${transactionData.vnp_TxnRef}`}>
        <button>Xem chi tiết đơn hàng</button>
      </NavLink>
    </div>
  );
};

export default Sucess;
