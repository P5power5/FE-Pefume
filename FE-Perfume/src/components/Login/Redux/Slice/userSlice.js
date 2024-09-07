// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Sửa import để sử dụng đúng hàm jwtDecode
// Định nghĩa trạng thái ban đầu
const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
};
// Tạo slice cho user
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;

      // Lưu accessToken vào localStorage
      localStorage.setItem("accessToken", accessToken);

      try {
        // Giải mã JWT để lấy thông tin người dùng
        const decodedToken = jwtDecode(accessToken);
        state.user = decodedToken;
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Failed to decode token:", error);
        state.user = null;
      }
    },
    updateUser: (state, action) => {
      const updatedUser = action.payload;
      state.user = { ...state.user, ...updatedUser };
    },
    logout: (state) => {
      // Xóa thông tin người dùng và accessToken
      state.user = null;
      state.accessToken = null;

      // Xóa accessToken khỏi localStorage
      localStorage.removeItem("accessToken");
    },
  },
});

// Export các action và reducer
export const { setCredentials,updateUser ,logout } = userSlice.actions;
export default userSlice.reducer;
