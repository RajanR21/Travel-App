import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("user"),
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      console.log(action.payload);
      state.token = action.payload;
      localStorage.setItem("user", action.payload);
    },

    setAdminStatus(state, action) {
      state.isAdmin = action.payload;
    },
  },
});

export const { setToken, setAdminStatus } = authSlice.actions;
export default authSlice.reducer;
