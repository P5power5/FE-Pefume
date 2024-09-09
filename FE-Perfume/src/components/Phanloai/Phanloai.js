import React, { useState, useCallback, useEffect } from "react";
import "../Phanloai/Phanloai.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleMinus,
  faCirclePlus,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const Phanloai = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [updateData, setUpdateData] = useState({
    id: "",
    name: "",
    collectionName: "",
  });
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userAccessToken = useSelector((state) => state.users.accessToken);
  const [formData, setFormData] = useState({
    name: "",
    collectionName: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Fetch collection data
  const fetchCollectionData = useCallback(async (collectionName) => {
    setLoading(true);
    try {
      const encodedCollectionName = encodeURIComponent(collectionName);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/category/getCategoryByCollection/${encodedCollectionName}`
      );
      setCollection(response.data.data);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/api/collection/getCollection`
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch collection data when selectedCollection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionData(selectedCollection);
    }
  }, [selectedCollection, fetchCollectionData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddStaff = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/category/addCategory",
        { name: formData.name, collectionName: formData.collectionName },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${userAccessToken}`,
          },
        }
      );
      const newCollection = response.data.data;
      setCollection((prevCollection) => [...prevCollection, newCollection]);
      setShowAddModal(false);
      setFormData({ name: "", collectionName: "" });
    } catch (error) {
      setError("Error adding data");
    }
  };

  const handleUpdateStaff = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/category/updateCategory/${updateData.id}`,
        {
          name: updateData.name,
          collectionName: updateData.collectionName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${userAccessToken}`,
          },
        }
      );

      const updatedCollection = response.data.data;
      setCollection((prevCollection) =>
        prevCollection.map((item) =>
          item._id === updatedCollection._id ? updatedCollection : item
        )
      );

      setShowUpdateModal(false);
      setUpdateData({ id: "", name: "", collectionName: "" });
    } catch (error) {
      setError("Error updating data");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      alert("No items selected for deletion");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the selected items?")
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/category/deleteCategory",
        { categoryIds: Array.from(selectedIds) },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${userAccessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setCollection((prevCollection) =>
          prevCollection.filter((item) => !selectedIds.has(item._id))
        );
        setSelectedIds(new Set());
        
      } else {
        setError(
          "Error deleting data: " + (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setError("Error deleting data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenUpdateModal = (item) => {
    setUpdateData({
      id: item._id,
      name: item.name,
      collectionName: item.collectionId.name,
    });
    setShowUpdateModal(true);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleButtonClick = () => {
    if (selectedCollection) {
      fetchCollectionData(selectedCollection);
    } else {
      setError("Please select a category");
    }
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
            <input type="text" placeholder="Search" className="textInput" />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
          </div>
          <div className="buttonAdd" onClick={handleOpenAddModal}>
            <FontAwesomeIcon icon={faCirclePlus} className="icon" />
            <div className="classtext1">
              <p className="textNhanvien">Add</p>
            </div>
          </div>
          <div className="buttonDelete" onClick={handleDeleteSelected}>
            <FontAwesomeIcon icon={faCircleMinus} className="icon" />
            <div className="classtext1">
              <p className="textNhanvien">Delete</p>
            </div>
          </div>
        </div>
      </div>
      <div className="noidungtable">
        <div className="container">
          <select
            className="select"
            onChange={(e) => setSelectedCollection(e.target.value)}
            value={selectedCollection}
          >
            <option value="">Select a category</option>
            {categories.map((collection) => (
              <option key={collection._id} value={collection.name}>
                {collection.name}
              </option>
            ))}
          </select>
          <button className="button" onClick={handleButtonClick}>
            Get Data
          </button>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
        </div>
        <div className="tableContainer">
          <table className="userTable">
            <thead>
              <tr>
                <th>
                  <div className="circle2"></div>
                </th>
                <th>STT</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collection.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const id = item._id;
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? new Set(prev.add(id))
                            : new Set(
                                Array.from(prev).filter(
                                  (itemId) => itemId !== id
                                )
                              )
                        );
                      }}
                      checked={selectedIds.has(item._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    <button
                      className="editBtn"
                      onClick={() => handleOpenUpdateModal(item)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal1">
          <div className="modalContent1">
            <div className="h2div">
              <h2 className="h2">Add New Item</h2>
              <div className="divclassIcon">
                <div className="classIcon">
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="closeIcon"
                    onClick={handleCloseAddModal}
                  />
                </div>
              </div>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="selectOption">Collection</label>
                <select
                  name="collectionName"
                  value={formData.collectionName}
                  onChange={handleInputChange}
                  className="selectField"
                >
                  <option value="">-- Please choose a Collection --</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="fullName"
                />
              </div>

              <button
                type="submit"
                className="submitBtn1"
                onClick={handleAddStaff}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal1">
          <div className="modalContent1">
            <div className="h2div">
              <h2 className="h2">Update Item</h2>
              <div className="divclassIcon">
                <div className="classIcon">
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="closeIcon"
                    onClick={handleCloseUpdateModal}
                  />
                </div>
              </div>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="selectOption">Collection</label>
                <select
                  name="collectionName"
                  value={updateData.collectionName}
                  onChange={handleUpdateInputChange}
                  className="selectField"
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={updateData.name}
                  onChange={handleUpdateInputChange}
                  className="fullName"
                />
              </div>
              <button
                type="submit"
                className="submitBtn1"
                onClick={handleUpdateStaff}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phanloai;
