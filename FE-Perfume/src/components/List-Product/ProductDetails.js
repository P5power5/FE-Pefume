import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; // Import axios cho các yêu cầu API
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [activeContenance, setActiveContenance] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Lấy userId từ Redux store
  // const userAccessToken = useSelector((state) => state.users.accessToken);
  // console.log(userAccessToken);

  const userId = useSelector((state) => state.users.user?.id);
  console.log("User ID:", userId);

  // Hàm lấy dữ liệu sản phẩm từ API
  const fetchProduct = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/product/getProductDetails/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setProduct(data.data);
        // Nếu có biến thể, thiết lập biến thể đầu tiên làm mặc định
        if (data.data.variants && data.data.variants.length > 0) {
          setSelectedVariant(data.data.variants[0]);
          setActiveContenance(0); // Đánh dấu biến thể đầu tiên là đang hoạt động
        }
      } else {
        console.error("Error fetching product data:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  if (!product || !selectedVariant) {
    return <div>Loading...</div>;
  }

  const productImage =
    product.imgUrls && product.imgUrls.length > 0
      ? product.imgUrls[0]
      : "default-image.png";

  const productDescription =
    product.descriptionBody || "No description available.";

  const toggleImageSize = () => {
    setIsEnlarged(!isEnlarged);
  };

  const handleContenanceClick = (index) => {
    setSelectedVariant(product.variants[index]);
    setActiveContenance(index);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Ngăn chặn thực hiện nếu đang thêm vào giỏ hàng

    setIsAddingToCart(true); // Vô hiệu hóa nút trong khi API đang được thực hiện

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/cart/addtoCart`,
        null,
        {
          params: {
            userId: userId,
            productId: id,
            contenance: selectedVariant?.contenance,
            quantity: quantity,
          },
        }
      );

      if (response.data.success) {
        console.log("Sản phẩm đã được thêm vào giỏ hàng", response.data.data);
      } else {
        console.error("Lỗi:", response.data.error);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    } finally {
      setIsAddingToCart(false); // Kích hoạt lại nút sau khi API hoàn tất
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* Cột Hình Ảnh Sản Phẩm */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <img
              src={productImage}
              alt="Product"
              className={`product-image ${
                isEnlarged ? "product-image-enlarged" : ""
              }`}
              onClick={toggleImageSize}
            />
          </div>

          {/* Cột Thông Tin Sản Phẩm */}
          <div className="col-md-6">
            <h1>{product.name}</h1>
            <h2>
              {Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(selectedVariant.price)}
            </h2>
            <label>Quantity:</label>
            <div className="mb-3 quantity-container d-flex justify-content-between w-50">
              <span className="quantity-btn" onClick={decrementQuantity}>
                -
              </span>
              <input
                type="number"
                className="quantity-input mx-2"
                value={quantity}
                readOnly
              />
              <span className="quantity-btn" onClick={incrementQuantity}>
                +
              </span>
            </div>

            <div className="mb-3">
              <label className="form-label d-block">Contenances</label>
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  className={`btn contenance-btn ${
                    activeContenance === index ? "active" : ""
                  }`}
                  onClick={() => handleContenanceClick(index)}
                >
                  {variant.contenance}
                </button>
              ))}
            </div>

            <button
              disabled={isAddingToCart}
              className="btn btn-custom btn-cart mb-3"
              onClick={handleAddToCart}
            >
              {isAddingToCart ? "Pending...." : "  Add to Cart"}
            </button>
            <button className="btn btn-custom btn-shoppay">
              Pay with ShopPay
            </button>

            <div className="mt-3">
              <h4>Description</h4>
              <p>{productDescription}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
