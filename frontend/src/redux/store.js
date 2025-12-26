import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import themeSlice from "./slice/themeSlice";
import productSlice from "./slice/productSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    theme: themeSlice,
  },
});

export default store;
