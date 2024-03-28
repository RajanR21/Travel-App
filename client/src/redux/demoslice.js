import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    setdata(state, action) {
      state.data = action.payload;
    },
    getdata(state) {
      state.data = JSON.parse(localStorage.getItem("users"));
      // return state?.data;
    },

    addUser: (state, action) => {},

    deleteUser: (state, action) => {
      const tmpdata = JSON.parse(localStorage.getItem("users"));
      console.log("tmp", tmpdata);
      state.data = tmpdata.filter((i) => i.id !== action.payload);
      localStorage.setItem("users", JSON.stringify(state.data));
    },
  },
});

export const { setdata, addUser, deleteUser, getdata } = demoSlice.actions;
export default demoSlice.reducer;
