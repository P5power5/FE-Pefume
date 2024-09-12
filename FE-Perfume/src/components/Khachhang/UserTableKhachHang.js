import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const UserTableKhachHang = ({
  users,
  loading,
  error,
  selectedIds,
  handleRowClick,
  handleOpenEditModal,
  setEditUser,
}) => {
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
              <th>FULL NAME</th>
              <th>PHONE</th>
              <th>EMAIL</th>
              <th>USER</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6">Error: {error}</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  onClick={() => handleRowClick(user._id)}
                  style={{
                    backgroundColor: selectedIds.has(user._id)
                      ? "#FDDDDD"
                      : "#ffffff",
                  }}
                >
                  <td>
                    <div
                      className="circle"
                      style={{
                        backgroundColor: selectedIds.has(user._id)
                          ? "#da4343"
                          : "#ffffff",
                      }}
                    ></div>
                  </td>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{user.userName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTableKhachHang;
