import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const flightSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setFlights(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setFlights } = flightSlice.actions;
export default flightSlice.reducer;
