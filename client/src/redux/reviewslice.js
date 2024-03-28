import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReview(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setReview, setCategoryProduct } = reviewSlice.actions;
export default reviewSlice.reducer;
