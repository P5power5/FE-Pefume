import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "../Style/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CardItem = ({ title, price, img }) => (
  <div className="card border-0" style={{ minHeight: "200px" }}>
    <div className="card-body">
      <img className="mb-3" style={{ width: "100%", objectFit: "cover" }} src={img} alt="no"></img>
      <div className="card-title" style={{ overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
      <p className="card-text">{price}</p>
    </div>
  </div>
);

const AmbienceDifuser = () => {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("default");

  const fetchProducts = async (sortCriteria) => {
    let apiUrl = `http://171.244.188.157:443/collections/DIFFUSEUR%20AMBIANCE`;
    if (sortCriteria === "nameAtoZ") {
      apiUrl += `?sort_by=ASC`;
    } else if (sortCriteria === "nameZtoA") {
      apiUrl += `?sort_by=DESC`;
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    fetchProducts(sortCriteria);
  }, [sortCriteria]);

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  return (
    <div>
      <Header />
      <div className="container-fluid">
        <div className="info-Link row">
          <h2>AMBIENCE DIFFUSER</h2>
        </div>
        <div className="row">
          <div className="form-Filter mt-3 d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex flex-grow-1 gap-3 flex-wrap">
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
            <div className="d-flex gap-1 mt-2 mt-md-0">
              <label>SORT BY</label>
              <select onChange={handleSortChange} value={sortCriteria}>
                <option value="default">Default</option>
                <option value="nameAtoZ">Name : A to Z</option>
                <option value="nameZtoA">Name : Z to A</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          {error && <div>Error: {error}</div>}
          {products.data?.map((product) => (
            <div key={product._id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
              <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                <CardItem
                  title={product.name}
                  price={product.price[0].price}
                  img={product.img_urls}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AmbienceDifuser;
