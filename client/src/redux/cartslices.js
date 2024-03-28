import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  subTotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  afterDiscount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cartItems = action.payload;
    },

    setCartDiscount(state, action) {
      state.afterDiscount = action.payload;
    },
    addToCart: (state, action) => {
      let { product, qty } = action.payload;
      let { images, price, title, _id, quantity } = product;
      let obj = {
        images,
        price,
        title,
        _id,
        stock: quantity,
        qty,
      };
      const isItemExist = state.cartItems.find(
        (i) => i.product._id === product._id
      );
      console.log(" inside product dispatch event", product);

      if (isItemExist) {
        state.cartItems.forEach((i) => {
          if (i._id === product._id) i.qty += qty;
        });
      } else {
        state.cartItems.push(obj);
        console.log("inside push");
      }
    },

    deleteFromCart: (state, action) => {
      state.user = state.user.filter((i) => i.product._id !== action.payload);
    },
    calculatePrice: (state, action) => {
      // console.log("ye hai qty", qty);
      let sum = 0;
      state.cartItems.forEach((i) => (sum += i?.price * i?.quantity));
      // console.log("ye he price ", i?.product?.price);
      state.subTotal = sum;
      state.total = (state.subTotal + state.tax + state.shipping).toFixed(2);
      // state.total -= state.afterDiscount;
    },
    discountPrice: (state, action) => {
      state.subTotal = state.total - state.afterDiscount;
      return state.subTotal;
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  calculatePrice,
  setCart,
  setCartDiscount,
  discountPrice,
} = cartSlice.actions;
export default cartSlice.reducer;
