import React, { useState, useEffect, useCallback } from "react";
import "../Admin/Admin.css";
import Sidebar from "./Sidebar";
import Avatar from "../../image/Avatar.png";
import Logo1 from "../../image/logo1.png";
import Nhanvien from "../Nhanvien/Nhanvien";
import Khachhang from "../Khachhang/Khachhang";
import Sanpham from "../Sanpham/Sanpham";
import Bosuutap from "../Bosuutap/Bosuutap";
import Phanloai from "../Phanloai/Phanloai";
import Donhang from "../Donhang/Donhang";
import Doanhthu from "../Doanhthu/Doanhthu";
import Kho from "../Kho/Kho";
import Caidat from "../Caidat/Caidat";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../Login/Redux/Slice/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import EditAdminModal from "./EditAdminModal";

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("default");
  const [showEditModal1, setShowEditModal1] = useState(false);
  const [formData1, setFormData1] = useState({
    userName: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [users1, setUsers1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [editUser1, setEditUser1] = useState(null);
  const [originalData1, setOriginalData1] = useState({});
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const accessToken = useSelector((state) => state.users.accessToken);
  const handleProfileClick = () => {
    setShowModal(!showModal);
  };

  const renderContent = () => {
    switch (content) {
      case "nhanvien":
        return <Nhanvien />;
      case "khachhang":
        return <Khachhang />;
      case "sanpham":
        return <Sanpham />;
      case "bosuutap":
        return <Bosuutap />;
      case "phanloai":
        return <Phanloai />;
      case "donhang":
        return <Donhang />;
      case "doanhthu":
        return <Doanhthu />;
      case "kho":
        return <Kho />;
      case "caidat":
        return <Caidat />;
      default:
        return (
          <div className="class11">
            <img src={Logo1} alt="Logo1" className="img1" />
          </div>
        );
    }
  };

  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    console.log("Logging out...");
    if (user?.roleId === "admin") {
      navigate("/");
    }
  };

  useEffect(() => {
    if (editUser1) {
      setOriginalData1({
        fullName: editUser1.fullName || "",
        phoneNumber: editUser1.phoneNumber || "",
        email: editUser1.email || "",
      });
      setFormData1({
        fullName: editUser1.fullName || "",
        phoneNumber: editUser1.phoneNumber || "",
        email: editUser1.email || "",
      });
    }
  }, [editUser1]);

  const handleCloseEditModal1 = () => {
    setShowEditModal1(false);
  };

  const handleRestoreOriginalData1 = () => {
    setFormData1(originalData1);
  };

  const handleOpenEditModal1 = async () => {
    setLoading(true);
    try {
      await fetchUsers1();
      if (users1.length > 0) {
        const admin = users1[0];
        setEditUser1(admin);
        setShowEditModal1(true);
      } else {
        alert("Không tìm thấy thông tin admin.");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi lấy thông tin admin: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers1 = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/user/getAllUser/?role=admin`,
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
      // console.log(data);

      if (data.success) {
        setUsers1(data.data);
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
    fetchUsers1();
  }, [fetchUsers1]);

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateUser1 = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/user/updateUser/${editUser1._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData1),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Cập nhật thông tin thành công");
        setShowEditModal1(false);
        fetchUsers1();
      } else {
        alert(data.msg || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Cập nhật thất bại: " + error.message);
    }
  };

  return (
    <div className="containerAdmin">
      <div className="header-admin">
        <Sidebar setContent={setContent} />
        <div className="classdiv">
          <div className="class8">
            <div className="class9">
              <div className="classAdmin">
                <div className="classAdmintext">
                  <p className="classAdmintext1">
                    {user?.fullName || "Jane Cooper"}
                  </p>
                </div>
                <div className="classAdmintext">
                  <p className="classAdmintext2">
                    {user?.email || "jane.cooper@example.com"}
                  </p>
                </div>
              </div>
              <img
                src={Avatar}
                alt="Avatar"
                className="icon1"
                onClick={handleProfileClick}
              />
            </div>
            {showModal && (
              <div className="profileModal">
                <div className="classLogout" onClick={handleLogout}>
                  <p className="logoutText">Log out</p>
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="iconLogout"
                  />
                </div>
                <div
                  className="classThongtinAdmin"
                  onClick={handleOpenEditModal1}
                >
                  <p className="thongtinadminText">Thông tin Admin</p>
                  <FontAwesomeIcon icon={faUser} className="iconAdminuser" />
                </div>
              </div>
            )}
          </div>
          {renderContent()}
        </div>
      </div>

      <EditAdminModal
        showEditModal1={showEditModal1}
        handleCloseEditModal1={handleCloseEditModal1}
        formData1={formData1}
        handleInputChange1={handleInputChange1}
        togglePasswordVisibility1={togglePasswordVisibility1}
        showPassword1={showPassword1}
        handleUpdateUser1={handleUpdateUser1}
        handleRestoreOriginalData1={handleRestoreOriginalData1}
      />
    </div>
  );
};

export default Admin;
