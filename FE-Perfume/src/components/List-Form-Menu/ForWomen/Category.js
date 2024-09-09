import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import "../ForWomen/Category.css";
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

const LynneDeR = () => {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false); // Trạng thái cho PRICE RANGE
  const [minPrice, setMinPrice] = useState(""); // Giá tối thiểu
  const [maxPrice, setMaxPrice] = useState(""); // Giá tối đa
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Trạng thái tổng số trang
  const { categoryId } = useParams();
  const accessToken = useSelector((state) => state.users.accessToken);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    } else {
      setError("Không tìm thấy danh mục.");
    }
  }, [categoryId, sortBy, sortOrder, minPrice, maxPrice, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/product/getProductsByCategory/${categoryId}?sortBy=${sortBy}&sortOrder=${sortOrder}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${currentPage}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.data.products)) {
        setProducts(data.data.products);
        setTotalPages(data.data.totalPages); // Cập nhật tổng số trang
        if (data.data.products.length > 0) {
          setCategoryName(data.data.products[0].category.name);
        } else {
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

  const handleSortSelection = (selectedSortBy, selectedSortOrder) => {
    setSortBy(selectedSortBy);
    setSortOrder(selectedSortOrder);
    setIsDropdownOpen(false); // Đóng dropdown sau khi chọn
  };

  const handlePriceRangeSubmit = () => {
    setIsPriceRangeOpen(false); // Đóng dropdown PRICE RANGE sau khi submit
    fetchProducts(); // Lấy lại danh sách sản phẩm với khoảng giá mới
  };

  return (
    <div>
      <Header />
      <div className="container px-5">
        <div className="info-Link row">
          <h2>{categoryName}</h2>
        </div>
        <div className="row">
          <div className="form-Filter mt-3 d-flex justify-content-between">
            <div className="d-flex flex-grow-1 gap-3">
              <div>Filter:</div>
              <div className="dropdown-containercategory">
                <div
                  className="sort-Price d-flex gap-1"
                  onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
                >
                  <div className="sort-Price d-flex gap-1">
                    <label className="no-asterisk">PRICE RANGE</label>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
                {isPriceRangeOpen && (
                  <div className="dropdown-menucategory show">
                    <div className="price-range-inputs d-flex">
                      <input
                        type="number"
                        placeholder="De"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="price-input"
                      />
                      <input
                        type="number"
                        placeholder="À"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="price-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="dropdown-containercategory">
              <div
                className="sort-By d-flex gap-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <label className="no-asterisk">
                  SortBy:
                  <span style={{ marginLeft: "5px" }}>
                    {sortBy === "name"
                      ? sortOrder === "asc"
                        ? "A -> Z"
                        : "Z -> A"
                      : sortBy === "price"
                      ? sortOrder === "asc"
                        ? "Price low to high"
                        : "Price high to low"
                      : sortBy === "sold"
                      ? sortOrder === "asc"
                        ? "Sold at least"
                        : "Most sold"
                      : ""}
                  </span>
                </label>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menucategory show">
                  <div onClick={() => handleSortSelection("name", "asc")}>
                    A - Z
                  </div>
                  <div onClick={() => handleSortSelection("name", "desc")}>
                    Z - A
                  </div>
                  <div onClick={() => handleSortSelection("price", "desc")}>
                    Price low to high
                  </div>
                  <div onClick={() => handleSortSelection("price", "asc")}>
                    Price high to low
                  </div>
                  <div onClick={() => handleSortSelection("sold", "asc")}>
                    Sold at least
                  </div>
                  <div onClick={() => handleSortSelection("sold", "desc")}>
                    Most sold
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-3">
          {error && products.length === 0 && (
            <div>Error: Không có sản phẩm nào trong danh mục này.</div>
          )}
          {products.length > 0
            ? products.map((product) => {
                const price =
                  product.variants.length > 0
                    ? product.variants[0].price
                    : "N/A";
                const img =
                  product.imgUrls.length > 0 ? product.imgUrls[0] : "";

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
            : !error && <div>No products available</div>}
        </div>
        <div className="pagination-controlscategory">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LynneDeR;
