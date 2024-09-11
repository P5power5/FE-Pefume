import React, { useState, useEffect } from "react";
import "./Style/Profile.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser } from "../../Login/Redux/Slice/userSlice";
import Modal from "react-modal";

const ProfileUser = () => {
  const userAccessToken = useSelector((state) => state.users.accessToken);
  const userId = useSelector((state) => state.users.user?.id);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/user/profile/${userId}`,
          {
            headers: {
              token: `Bearer ${userAccessToken}`,
            },
          }
        );

        const userData = response.data.data;
        if (userData) {
          setUserName(userData.userName || "");
          setFullName(userData.fullName || "");
          setEmail(userData.email || "");
          setPhone(userData.phoneNumber || "");
          setAddress(userData.address || "");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      getUserDetails();
    }
  }, [userId, userAccessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/user/updateUser/${userId}`,
        {
          fullName,
          email,
          phoneNumber: phone,
          address,
        },
        {
          headers: {
            token: `Bearer ${userAccessToken}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);

      // Cập nhật thông tin người dùng trong Redux
      dispatch(
        updateUser({
          fullName,
          email,
          phoneNumber: phone,
          address,
        })
      );

      // Mở modal thông báo thành công
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="main-content-profile-user">
        <h1 className="main-title-profile-user">My profile</h1>
        <p className="description-profile-user">
          Manage your information to secure your account
        </p>
        <form className="form-profile-user" onSubmit={handleFormSubmit}>
          <div className="form-group-profile-user">
            <label className="form-label-profile-user" htmlFor="userName">
              UserName
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={userName}
              onChange={handleInputChange}
              className="form-input-profile-user"
              readOnly // Không cho phép thay đổi userName
            />
          </div>
          <div className="form-group-profile-user">
            <label className="form-label-profile-user" htmlFor="fullName">
              FullName
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={handleInputChange}
              className="form-input-profile-user"
            />
          </div>
          <div className="form-group-profile-user">
            <label className="form-label-profile-user" htmlFor="email">
              Gmail
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="form-input-profile-user"
            />
          </div>
          <div className="form-group-profile-user">
            <label className="form-label-profile-user" htmlFor="phone">
              PhoneNumber
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleInputChange}
              className="form-input-profile-user"
            />
          </div>
          <div className="card-container-profile-user">
            <h2 className="card-title-profile-user">Address</h2>
            <div className="address-info-profile-user">
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={handleInputChange}
                className="form-input-profile-user"
              />
            </div>
          </div>
          <button
            type="submit"
            className="submit-button-profile-user"
            onClick={handleFormSubmit}
          >
            Save
          </button>
        </form>
      </div>

      {/* Modal hiển thị thông báo thành công */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Profile Updated Successfully"
        className="modal-success"
        overlayClassName="modal-overlay"
      >
        <h2>Profile Updated Successfully!</h2>
        <button onClick={closeModal} className="modal-confirmprofile">
          OK
        </button>
      </Modal>
    </div>
  );
};

export default ProfileUser;
