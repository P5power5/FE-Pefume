import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Headers from "../Header";
import Footer from "../../Footer/Footer";
import "./Style/OrderCart.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userId = useSelector((state) => state.users.user?.id);
  const [isAnyItemSelected, setIsAnyItemSelected] = useState(false);
  const navigate = useNavigate(); // Để điều hướng

  // Hàm lấy dữ liệu giỏ hàng
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/getCart/${userId}`
      );
      if (response.data.success) {
        const items = response.data.data.map((item) => ({
          ...item,
          selected: item.checked,
        }));
        
        setCartItems(items);

        // Kiểm tra xem có sản phẩm nào đã được chọn không
        const anyItemChecked = items.some((item) => item.selected);
        setIsAnyItemSelected(anyItemChecked);
      } else {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng:", response.data.error);
      }
    } catch (error) {}
  }, [userId]);

  // Hàm xóa sản phẩm
  const handleDelete = async (cartItemId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/deleteCart/${userId}/${cartItemId}`
      );
      if (response.data.success) {
        // Loại bỏ sản phẩm khỏi danh sách giỏ hàng và tính lại tổng số tiền
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== cartItemId)
        );
      } else {
        console.error("Lỗi khi xóa sản phẩm:", response.data.error);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/updateQuantityCart/${userId}/${cartItemId}`,
        { quantity: newQuantity }
      );
      if (response.data.success) {
        // Cập nhật giỏ hàng sau khi thành công
        fetchCartItems();
      } else {
        console.error("Lỗi khi cập nhật số lượng:", response.data.error);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // Hàm cập nhật trạng thái checked cho tất cả các sản phẩm
  const updateAllCartItemsChecked = async (isChecked) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/updateAllCheckCart/${userId}`,
        { checked: isChecked }
      );
      if (response.data.success) {
        const items = response.data.data.map((item) => ({
          ...item,
          selected: item.checked,
        }));

        setCartItems(items);

        // Kiểm tra xem có sản phẩm nào đã được chọn không
        const anyItemChecked = items.some((item) => item.selected);
        setIsAnyItemSelected(anyItemChecked);
      } else {
        console.error(
          "Lỗi khi cập nhật trạng thái sản phẩm:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // Hàm cập nhật trạng thái checked cho một sản phẩm cụ thể
  const updateCartItemChecked = async (cartItemId, isChecked) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/updateCheckCart/${userId}/${cartItemId}`,
        { checked: isChecked }
      );

      if (response.data.success) {
        // Cập nhật lại trạng thái của sản phẩm trong danh sách giỏ hàng
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === cartItemId ? { ...item, selected: isChecked } : item
          )
        );
        const prevItems = cartItems;
        // Kiểm tra nếu có bất kỳ sản phẩm nào được chọn sau khi cập nhật
        const anyItemChecked = prevItems.some((item) =>
          item._id === cartItemId ? isChecked : item.selected
        );
        setIsAnyItemSelected(anyItemChecked);
      } else {
        console.error(
          "Lỗi khi cập nhật trạng thái sản phẩm:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // Xử lý sự kiện thay đổi số lượng
  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1; // Đảm bảo số lượng không nhỏ hơn 1
    updateQuantity(cartItemId, newQuantity);
  };

  const handleBuyClick = () => {
    if (!isAnyItemSelected) {
      toast.warning("Bạn chưa chọn sản phẩm nào để thanh toán!");
    } else {
      navigate("/payment"); // Điều hướng đến trang thanh toán nếu có sản phẩm được chọn
    }
  };

  // Hàm chọn tất cả sản phẩm
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    updateAllCartItemsChecked(isChecked);
  };

  // Xử lý sự kiện chọn sản phẩm
  const handleProductSelect = (cartItemId, isSelected) => {
    updateCartItemChecked(cartItemId, isSelected);
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    // Tính tổng số tiền khi danh sách giỏ hàng thay đổi
    const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    setTotalAmount(total);
  }, [cartItems]);

  return (
    <div>
      <Headers />
      <div className="container">
        <div className="container-order">
          <table className="product-table-order">
            <thead>
              <tr>
                <th>
                  <p>CheckAll</p>
                  <input
                    type="checkbox"
                    className="select-all-checkbox"
                    onChange={handleSelectAll}
                    checked={cartItems.every((item) => item.selected)}
                  />
                </th>
                <th>Image/ProductName</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Contenance</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td data-label="Select">
                    <input
                      type="checkbox"
                      className="product-checkbox"
                      checked={item.selected || false}
                      onChange={(e) =>
                        handleProductSelect(item._id, e.target.checked)
                      }
                    />
                  </td>
                  <td data-label="Product-order">
                    <img
                      src={item.imgUrls}
                      alt="Product"
                      className="product-image-order"
                    />
                    <span className="product-name-order">
                      {item.productName}
                    </span>
                  </td>
                  <td data-label="Unit Price">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </td>
                  <td data-label="Quantity">
                    <input
                      type="number"
                      value={item.quantity}
                      className="quantity-input-order"
                      onChange={(e) =>
                        handleQuantityChange(item._id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td data-label="Contenance">{item.contenance}</td>
                  <td data-label="Subtotal">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(item.subtotal)}
                  </td>
                  <td data-label="Action">
                    <button
                      className="delete-button-order"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="order-summary">
            <div className="total-payment-order">
              <span>
                Total payment ({cartItems.length} product
                {cartItems.length > 1 ? "s" : ""}):
              </span>{" "}
              <span className="total-amount-order">
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(totalAmount)}
              </span>
            </div>
            <button className="buy-button-order" onClick={handleBuyClick}>
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Order;
