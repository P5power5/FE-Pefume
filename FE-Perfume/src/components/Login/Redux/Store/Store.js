import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slice/userSlice"; // Điều chỉnh đường dẫn đúng

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
