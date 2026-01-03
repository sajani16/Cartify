import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API = "http://localhost:3000/cart";

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/getcart",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`${API}/getcart`, config);
    return res.data;
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addtocart",
  async ({ productId, quantity }, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.post(
      `${API}/addtocart`,
      { productId, quantity },
      config
    );
    return res.data;
  }
);

// Update cart quantity
export const updateCart = createAsyncThunk(
  "cart/updatecart",
  async ({ productId, quantity }, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.put(
      `${API}/updatecart/${productId}`,
      { quantity },
      config
    );
    return res.data;
  }
);

// Remove item
export const removeCartItem = createAsyncThunk(
  "cart/removefromcart",
  async (productId, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.delete(
      `${API}/removefromcart/${productId}`,
      config
    );
    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          // backend returns cart object with products array
          state.items = action.payload.cart?.products || [];
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default cartSlice.reducer;
