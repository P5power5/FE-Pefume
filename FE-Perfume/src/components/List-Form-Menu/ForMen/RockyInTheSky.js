import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import "../Style/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


const CardItem = ({ title, price, img }) => (
  <div className="card border-0">
    <div className="card-body">
      <img className="mb-3" style={{ width: "100%" }} src={img} alt="no"></img>
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{price}</p>
    </div>
  </div>
);

const  RockyInTheSky = () => {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    fetch("http://171.244.188.157:443/products?name=ROCKY%20IN%20THE%20SKY")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="info-Link row">
          <h2>ROCKY IN THE SKY</h2>
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
          {products.data?.map((product, index) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              style={{ textDecoration: "none" }}
            >
              <CardItem
                title={product.name}
                price={product.price[0].price}
                img={product.img_urls}
              />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RockyInTheSky;
