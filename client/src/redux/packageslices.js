import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  filterData: {
    options: {
      adult: 1,
      children: 0,
      room: 1,
    },
  },
};

const packageSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    setPackages(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setPackages } = packageSlice.actions;
export default packageSlice.reducer;
