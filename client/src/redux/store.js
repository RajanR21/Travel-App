import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslices.js";
import hotelReducer from "./hotelslices.js";
import categoryReducer from "./categoryslices.js";
import subcategoryReducer from "./subcategoryslice.js";
import cartReducer from "./cartslices.js";
import packageReducer from "./packageslices.js";
import reviewReducer from "./reviewslice.js";
import wishlistReducer from "./wishlistslice.js";
import flightReducer from "./flightslice.js";
import demoReducer from "./demoslice.js";
// it will autmatically generate a reducer same as we have in useReducer hook

const store = configureStore({
  reducer: {
    auth: authReducer, // all reducer will be in this store
    hotel: hotelReducer,
    category: categoryReducer,
    cart: cartReducer,
    package: packageReducer,
    subcategory: subcategoryReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    flight: flightReducer,
    demo: demoReducer,
  },
});

export default store;
