import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  filterData: {
    dates: [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ],

    destination: "",
    options: {
      adult: 1,
      children: 0,
      room: 1,
    },
  },
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    sethotels(state, action) {
      console.log(action.payload);
      state.data.push(action.payload);
    },

    setFilterData(state, action) {
      console.log(action.payload);
      state.filterData = action.payload;
    },
  },
});

export const { sethotels, setFilterData } = hotelSlice.actions;
export default hotelSlice.reducer;
