import React, { useState, useCallback, useEffect } from "react";
import "./Bosuutap.css";
import { Helmet } from "react-helmet";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleMinus,
  faCirclePlus,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from "axios";

const Bosuutap = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
  });
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAccessToken = useSelector((state) => state.users.accessToken);
  const user = useSelector((state) => state.users.user);

  const fetchCollectionData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/collection/getCollection"
      );
      setCollection(response.data.data);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddStaff = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/collection/addCollection",
        { name: formData.name },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${userAccessToken}`,
          },
        }
      );
      const newCollection = response.data.data;
      setCollection((prevCollection) => [...prevCollection, newCollection]);
      setShowAddModal(false); // Đóng modal sau khi thêm thành công
      setFormData({ name: "" }); // Reset form dữ liệu
    } catch (error) {
      setError("Error adding data");
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
        "http://localhost:5000/api/collection/deleteCollection",
        { collectionsId: Array.from(selectedIds) },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${userAccessToken}`,
          },
        }
      );

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        // Xử lý thành công
        fetchCollectionData(); // Refresh the collection data
        setSelectedIds(new Set()); // Clear selected ids
      } else {
        // Xử lý khi có lỗi từ server
        setError(
          "Error deleting data: " + response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setError("Error deleting data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  useEffect(() => {
    fetchCollectionData();
  }, [fetchCollectionData]);

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
      <div className="classNhanvien1">
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
          <div className="classNhanvien4">
            <div className="classNhanvien3">
              <div className="classtext">
                <p className="classNhanvientext">
                  {user?.fullName || "Jane Cooper"}
                </p>
              </div>
              <div className="classtext">
                <p className="classNhanvientext1">
                  {user?.email || "jane.cooper@example.com"}
                </p>
              </div>
            </div>
            <FaUserCircle
              className="icon1"
              onClick={() => setShowModal(!showModal)}
            />
          </div>
        </div>
        {showModal && (
          <div className="profile">
            <p className="logout">Log out</p>
            <FaSignOutAlt className="icon2" />
          </div>
        )}
      </div>
      <div className="noidung">
        <div className="tableContainer">
          <table className="userTable">
            <thead>
              <tr>
                <th>
                  <div className="circle2"></div>
                </th>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4">Error: {error}</td>
                </tr>
              ) : collection.length === 0 ? (
                <tr>
                  <td colSpan="4">No data found</td>
                </tr>
              ) : (
                collection.map((item, index) => (
                  <tr
                    key={item._id}
                    onClick={() =>
                      setSelectedIds((prevSelectedIds) => {
                        const newSelectedIds = new Set(prevSelectedIds);
                        if (newSelectedIds.has(item._id)) {
                          newSelectedIds.delete(item._id);
                        } else {
                          newSelectedIds.add(item._id);
                        }
                        return newSelectedIds;
                      })
                    }
                    style={{
                      backgroundColor: selectedIds.has(item._id)
                        ? "#FDDDDD"
                        : "#ffffff",
                    }}
                  >
                    <td>
                      <div
                        className="circle"
                        style={{
                          backgroundColor: selectedIds.has(item._id)
                            ? "#da4343"
                            : "#ffffff",
                        }}
                      ></div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {collection.map((item, index) => (
            <div
              key={item._id}
              className="editButtonContainer"
              style={{
                top: `calc(${index * 42}px + 44px)`,
                left: "1133px",
              }}
            >
              <FontAwesomeIcon icon={faPen} className="editIcon" />
            </div>
          ))}
        </div>
      </div>
      {showAddModal && (
        <div className="modal1">
          <div className="modalContent1">
            <div className="h2div">
              <h2 className="h2">Add</h2>
              <div className="divclassIcon">
                <div className="classIcon">
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={handleCloseAddModal}
                  />
                </div>
              </div>
            </div>

            <div className="form-container">
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
              <button className="submitButton" onClick={handleAddStaff}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bosuutap;






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
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="fullName"
                  value={updateData.name}
                  onChange={handleUpdateInputChange}
                />
              </div>
            </div>
            <button className="submitButton" onClick={handleUpdateStaff}>
              Update
            </button>
            {/* <button onClick={handleCloseUpdateModal}>Cancel</button> */}
          </div>
        </div>