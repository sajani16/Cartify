import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import themeSlice from "./slice/themeSlice";
import productSlice from "./slice/productSlice";
import cartSlice from "./slice/cartSlice";
import orderSlice from "./slice/orderSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    theme: themeSlice,
    cart: cartSlice,
    order: orderSlice,
  },
});

export default store;
