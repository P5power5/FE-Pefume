import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import "../Style/style.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CardItem = ({ title, price, img }) => (
  <div className="card border-0">
    <div className="card-body">
      <img className="mb-3" style={{ width: "100%" }} src={img} alt="Product" />
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{price}</p>
    </div>
  </div>
);

const Sakura = () => {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  console.log("categoryId:", categoryId);

  const accessToken = useSelector((state) => state.users.accessToken);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    } else {
      setError("Không tìm thấy danh mục.");
    }
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      console.log("Fetching products for category:", categoryId);
      const response = await fetch(
        `http://localhost:5000/api/product/getProductsByCategory/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success && Array.isArray(data.data.products)) {
        setProducts(data.data.products);
        if (data.data.products.length === 0) {
          setError("Không có sản phẩm nào trong danh mục này.");
        }
      } else {
        setError(
          data.message || "Không tìm thấy sản phẩm nào với danh mục này."
        );
      }
    } catch (error) {
      setError("Đã xảy ra lỗi: " + error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="container px-5">
        <div className="info-Link row">
          <h2>LYNNE DE R</h2>
        </div>
        <div className="row ">
          <div className="form-Filter mt-3 d-flex  justify-content-between">
            <div className="d-flex flex-grow-1 gap-3 ">
              <div>Filter:</div>
              <div className="sort-Availability d-flex gap-1">
                <label>AVAILABILITY</label>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
              <div className="sort-Price d-flex gap-1">
                <label>PRICE RANGE</label>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </div>
            <div className="d-flex gap-1">
              <label>SORT BY</label>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          {error && <div>Error: {error}</div>}
          {products.length > 0 ? (
            products.map((product) => {
              const price =
                product.variants.length > 0 ? product.variants[0].price : "N/A";
              const img = product.imgUrls.length > 0 ? product.imgUrls[0] : "";

              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  style={{ textDecoration: "none" }}
                >
                  <CardItem title={product.name} price={price} img={img} />
                </Link>
              );
            })
          ) : (
            <div>No products available</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sakura;
