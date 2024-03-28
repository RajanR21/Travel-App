import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const subcategorySlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {
    setSubCategories(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setSubCategories } = subcategorySlice.actions;
export default subcategorySlice.reducer;
