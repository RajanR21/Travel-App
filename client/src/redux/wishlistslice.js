import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishList(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setWishList } = wishlistSlice.actions;
export default wishlistSlice.reducer;
