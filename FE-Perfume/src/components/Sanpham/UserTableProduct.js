import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import DateFormatter from "./DateFormatter";
import VariantsModal from "./VariantsModal";

const UserTableProduct = ({
  products,
  loading,
  error,
  selectedIds,
  handleRowClick,
  handleOpenEditModal,
  setEditProduct,
  currentPage,
  totalPages,
  onPageChange, // callback để thay đổi trang
}) => {
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [selectedProductVariants, setSelectedProductVariants] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");

  const handleExpandRow = (id) => {
    setExpandedProductId((prevId) => (prevId === id ? null : id));
  };

  const handleOpenVariantsModal = (product) => {
    setSelectedProductVariants(product.variants);
    setSelectedProductName(product.name);
    setShowVariantsModal(true);
  };

  // Hàm để thay đổi trang khi người dùng chọn một trang khác
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="noidungtable">
      <div className="tableContainer">
        <table className="userTable">
          <thead>
            <tr>
              <th>
                <div className="circle2"></div>
              </th>
              <th>ID</th>
              <th>COLLECTION</th>
              <th>CATEGORY</th>
              <th>PRODUCT</th>
              <th>RELEASE DATE</th>
              <th>Image</th>
              <th>VARIANTS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8">Error: {error}</td>
              </tr>
            ) : !products || products.length === 0 ? (
              <tr>
                <td colSpan="8">No products found</td>
              </tr>
            ) : (
              products.map((product, index) => (
                <React.Fragment key={product._id}>
                  <tr
                    onClick={() => handleRowClick(product._id)}
                    style={{
                      backgroundColor: selectedIds.has(product._id)
                        ? "#FDDDDD"
                        : "#ffffff",
                    }}
                  >
                    <td>
                      <div
                        className="circle"
                        style={{
                          backgroundColor: selectedIds.has(product._id)
                            ? "#da4343"
                            : "#ffffff",
                        }}
                      ></div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{product.collectionId?.name}</td>
                    <td>{product.category?.name}</td>
                    <td>{product.name}</td>
                    <td>
                      <DateFormatter isoDate={product.releaseDate || ""} />
                    </td>
                    <td>
                      {product.imgUrls && product.imgUrls.length > 0 ? (
                        product.imgUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Product Image ${idx + 1}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              margin: "0 5px",
                            }}
                          />
                        ))
                      ) : (
                        <span>No Image Available</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="seeMore"
                        onClick={() => handleOpenVariantsModal(product)}
                      >
                        See More
                      </button>
                    </td>
                    <td>
                      <div
                        key={product._id}
                        className="editButtonContainerSP"
                        onClick={() => {
                          setEditProduct(product);
                          handleOpenEditModal();
                        }}
                      >
                        <FontAwesomeIcon icon={faPen} className="editIcon" />
                      </div>
                    </td>
                  </tr>
                  {expandedProductId === product._id && (
                    <tr>
                      <td colSpan="8">
                        <div>
                          <h4>Variants:</h4>
                          <ul>
                            {product.variants.map((variant, idx) => (
                              <li key={idx}>
                                {`Contenance: ${variant.contenance}, Price: ${variant.price}, In Stock: ${variant.inStock}, Sold: ${variant.sold}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <VariantsModal
        showModal={showVariantsModal}
        handleCloseModal={() => setShowVariantsModal(false)}
        variants={selectedProductVariants}
        productName={selectedProductName}
      />

      {/* Phần phân trang */}
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
    </div>
  );
};

export default UserTableProduct;
