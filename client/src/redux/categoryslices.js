import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
  products: "",
};

const categorySlice = createSlice({
  name: "categoris",
  initialState,
  reducers: {
    setCategories(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },

    setCategoryProduct(state, action) {
      console.log(action.payload);
      state.products = action.payload;
    },
  },
});

export const { setCategories, setCategoryProduct } = categorySlice.actions;
export default categorySlice.reducer;
