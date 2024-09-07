import React, { useState, useEffect, useCallback } from "react";
import "../Nhanvien/Nhanvien.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import UserTableKhachHang from "./UserTableKhachHang";
import EditUserKHModal from "./EditUserKHModal";
import ConfirmDeleteKHModal from "./ConfirmDeleteKHModal";
import SuccessDeleteKHModal from "./SuccessDeleteKHModal";

const Khachhang = () => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [originalData, setOriginalData] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const accessToken = useSelector((state) => state.users.accessToken);

  const handleDeleteUsers = () => {
    if (selectedIds.size === 0) {
      alert("Vui lòng chọn ít nhất một nhân viên để xóa");
      return;
    }
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/deleteUser/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userIds: Array.from(selectedIds) }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setShowSuccessDeleteModal(true);
        setUsers(users.filter((user) => !selectedIds.has(user._id)));
        setSelectedIds(new Set());
      } else {
        alert(data.msg || "Có lỗi xảy ra khi xóa nhân viên");
      }
    } catch (error) {
      alert("Xóa thất bại: " + error.message);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/getAllUser/?role=user",
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
      console.log(data);

      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/updateUser/${editUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Cập nhật thông tin thành công");
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Cập nhật thất bại: " + error.message);
    }
  };

  useEffect(() => {
    if (editUser) {
      setOriginalData({
        fullName: editUser.fullName || "",
        phoneNumber: editUser.phoneNumber || "",
        email: editUser.email || "",
      });
      setFormData({
        fullName: editUser.fullName || "",
        phoneNumber: editUser.phoneNumber || "",
        email: editUser.email || "",
      });
    }
  }, [editUser]);

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleRestoreOriginalData = () => {
    setFormData(originalData);
  };

  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
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
          <div className="buttonDelete" onClick={handleDeleteUsers}>
            <FontAwesomeIcon icon={faCircleMinus} className="icon" />
            <div className="classtext1">
              <p className="textNhanvien">Delete</p>
            </div>
          </div>
        </div>
      </div>

      <UserTableKhachHang
        users={users}
        loading={loading}
        error={error}
        selectedIds={selectedIds}
        handleRowClick={handleRowClick}
        handleOpenEditModal={handleOpenEditModal}
        setEditUser={setEditUser}
      />

      <EditUserKHModal
        showEditModal={showEditModal}
        handleCloseEditModal={handleCloseEditModal}
        formData={formData}
        handleInputChange={handleInputChange}
        togglePasswordVisibility={togglePasswordVisibility}
        showPassword={showPassword}
        handleUpdateUser={handleUpdateUser}
        handleRestoreOriginalData={handleRestoreOriginalData}
      />

      <ConfirmDeleteKHModal
        showModal={showConfirmDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <SuccessDeleteKHModal
        showModal={showSuccessDeleteModal}
        handleCloseModal={() => setShowSuccessDeleteModal(false)}
      />
    </div>
  );
};

export default Khachhang;
