import React, { useState, useEffect, useCallback } from "react";
import "../Sanpham/Sanpham.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import UserTableProduct from "./UserTableProduct";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ConfirmAddProductModal from "./ConfirmAddProductModal";
import ConfirmDeleteProductModal from "./ConfirmDeleteProductModal";
import SuccessAddProductModal from "./SuccessAddProductModal";
import SuccessDeleteProductModal from "./SuccessDeleteProductModal";
import debounce from "lodash/debounce";

const Sanpham = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryName: "",
    collectionName: "",
    variants: [{ contenance: "", price: "", inStock: 0, sold: 0 }],
    descriptionBody: "",
    releaseDate: "",
    imgUrls: [],
  });

  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [loadingAddProduct, setLoadingAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const accessToken = useSelector((state) => state.users.accessToken);
  const handleDeleteProducts = () => {
    if (selectedIds.size === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }
    setShowConfirmDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      if (selectedIds.size === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để xóa");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/product/deleteProduct",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ productIds: Array.from(selectedIds) }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowSuccessDeleteModal(true);
        fetchProducts();
        setSelectedIds(new Set());
      } else {
        alert(data.msg || "Có lỗi xảy ra khi xóa sản phẩm");
      }
    } catch (error) {
      alert("Xóa thất bại: " + error.message);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const fetchCategories = useCallback(
    async (collectionId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/category/getCategoryByCollection/${collectionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        } else {
          setError(data.msg || "Có lỗi xảy ra");
        }
      } catch (error) {
        setError("Đã xảy ra lỗi: " + error.message);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/collection/getCollection/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();

      if (data.success) {
        setCollections(data.data);
      } else {
        setError(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchProducts = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/product/getProduct?page=${page}&limit=${limit}&search=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.data.products);
          setTotalPages(data.data.totalPages);
          setCurrentPage(data.data.currentPage);
        } else {
          setError(data.msg || "Có lỗi xảy ra");
        }
      } catch (error) {
        setError("Đã xảy ra lỗi: " + error.message);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      fetchProducts(1, 10, searchTerm);
    }, 300),
    [] 
  );

  useEffect(() => {
    fetchCollections();
    fetchProducts(currentPage);
  }, [fetchCollections, fetchProducts, currentPage]);

  const handleRowClick = (id) => {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return newSelectedIds;
    });
  };

  const handleConfirmAdd = async () => {
    setLoadingAddProduct(true);
    try {
      let imageUrls = [];

      if (formData.images.length > 0) {
        const imageUploadPromises = Array.from(formData.images).map((image) => {
          const formData = new FormData();
          formData.append("images", image);
          return fetch("http://localhost:5000/api/uploads", {
            method: "POST",
            headers: {
              token: `Bearer ${accessToken}`,
            },
            body: formData,
          }).then((response) => response.json());
        });

        const responses = await Promise.all(imageUploadPromises);
        imageUrls = responses.flatMap((response) => response.imageUrls);
      }

      const productData = {
        ...formData,
        imgUrls: imageUrls,
      };

      const response = await fetch(
        "http://localhost:5000/api/product/addProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      if (data.success) {
        setShowSuccessModal(true);
        setShowAddModal(false);
        setShowConfirmModal(false);
        setFormData({
          name: "",
          categoryName: "",
          collectionName: "",
          variants: [{ contenance: "", price: "", inStock: 0, sold: 0 }],
          descriptionBody: "",
          releaseDate: "",
          imgUrls: [],
        });
        fetchCollections();
        fetchProducts();
      } else {
        alert(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Thêm sản phẩm thất bại: " + error.message);
    } finally {
      setLoadingAddProduct(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files),
    }));
  };

  const handleInputChange = (e, index, variantField) => {
    const { name, value } = e.target;
    if (variantField) {
      setFormData((prevData) => {
        const newVariants = [...prevData.variants];
        newVariants[index] = {
          ...newVariants[index],
          [variantField]: value,
        };
        return {
          ...prevData,
          variants: newVariants,
        };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "collectionName") {
        const selectedCollection = collections.find(
          (collection) => collection._id === value
        );
        if (selectedCollection) {
          fetchCategories(selectedCollection._id);
        }
      }
    }
  };

  const handleUpdateProduct = async () => {
    setLoadingUpdate(true);
    try {
      let imageUrls = [];

      if (formData.images && formData.images.length > 0) {
        const imageUploadPromises = Array.from(formData.images).map((image) => {
          const formData = new FormData();
          formData.append("images", image);
          return fetch("http://localhost:5000/api/uploads", {
            method: "POST",
            headers: {
              token: `Bearer ${accessToken}`,
            },
            body: formData,
          }).then((response) => response.json());
        });

        const responses = await Promise.all(imageUploadPromises);
        imageUrls = responses.flatMap((response) => response.imageUrls);
      }

      const productData = {
        ...formData,
        imgUrls: imageUrls,
      };

      const response = await fetch(
        `http://localhost:5000/api/product/updateProduct/${editProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Cập nhật sản phẩm thành công");
        handleCloseEditModal();
        fetchCollections();
        fetchProducts();
      } else {
        alert(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Cập nhật thất bại: " + error.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (editProduct) {
      setOriginalData({
        name: editProduct.name || "",
        categoryName: editProduct.categoryName || "",
        collectionName: editProduct.collectionName || "",
        variants: editProduct.variants || [
          { contenance: "", price: "", inStock: 0, sold: 0 },
        ],
        descriptionBody: editProduct.descriptionBody || "",
        releaseDate: editProduct.releaseDate || "",
        imgUrls: editProduct.imgUrls || [],
      });
      setFormData({
        name: editProduct.name || "",
        categoryName: editProduct.categoryName || "",
        collectionName: editProduct.collectionName || "",
        variants: editProduct.variants || [
          { contenance: "", price: "", inStock: 0, sold: 0 },
        ],
        descriptionBody: editProduct.descriptionBody || "",
        releaseDate: editProduct.releaseDate || "",
        imgUrls: editProduct.imgUrls || [],
      });
    }
  }, [editProduct]);

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      categoryName: "",
      collectionName: "",
      variants: [],
      descriptionBody: "",
      releaseDate: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleRestoreOriginalData = () => {
    setFormData(originalData);
  };

  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      releaseDate: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchProducts(1, 10, searchTerm);
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

      <div className="classNhanVien">
        <div className="classNhanvien2">
          <div className="searchContainer">
            <div className="searchContainer">
              <input
                type="text"
                placeholder="Search"
                className="textInput"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="searchIcon"
                onClick={() => fetchProducts(1, 10, searchTerm)}
              />
            </div>
          </div>
          <div className="buttonAdd" onClick={handleOpenAddModal}>
            <FontAwesomeIcon icon={faCirclePlus} className="icon" />
            <div className="classtext1">
              <p className="textNhanvien">Add</p>
            </div>
          </div>
          <div className="buttonDelete" onClick={handleDeleteProducts}>
            <FontAwesomeIcon icon={faCircleMinus} className="icon" />
            <div className="classtext1">
              <p className="textNhanvien">Delete</p>
            </div>
          </div>
        </div>
      </div>

      <UserTableProduct
        products={products}
        loading={loading}
        error={error}
        selectedIds={selectedIds}
        handleRowClick={handleRowClick}
        handleOpenEditModal={handleOpenEditModal}
        setEditProduct={setEditProduct}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AddProductModal
        showModal={showAddModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleOpenConfirmModal={handleOpenConfirmModal}
        handleCloseModal={handleCloseAddModal}
        collections={collections}
        categories={categories}
        handleDateChange={handleDateChange}
        handleAddProduct={handleConfirmAdd}
        handleImageChange={handleImageChange}
        loading={loadingAddProduct}
        fetchCategories={fetchCategories} 
      />

      <EditProductModal
        showEditModal={showEditModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleUpdateProduct={handleUpdateProduct}
        handleCloseEditModal={handleCloseEditModal}
        collections={collections}
        categories={categories}
        handleDateChange={handleDateChange}
        handleImageChange={handleImageChange}
        handleRestoreOriginalData={handleRestoreOriginalData}
        loadingUpdate={loadingUpdate}
        fetchCategories={fetchCategories} 
      />

      <ConfirmAddProductModal
        showModal={showConfirmModal}
        handleConfirmAdd={handleConfirmAdd}
        handleCloseModal={handleCloseConfirmModal}
      />

      <ConfirmDeleteProductModal
        showModal={showConfirmDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <SuccessAddProductModal
        showModal={showSuccessModal}
        handleCloseModal={() => setShowSuccessModal(false)}
      />

      <SuccessDeleteProductModal
        showModal={showSuccessDeleteModal}
        handleCloseModal={() => setShowSuccessDeleteModal(false)}
      />
    </div>
  );
};

export default Sanpham;
