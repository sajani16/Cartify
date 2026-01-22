import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL + "/cart";

/* ================= THUNKS ================= */

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/getcart",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API}/getcart`, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addtocart",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${API}/addtocart`,
        { productId, quantity },
        config,
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

// Update cart quantity
export const updateCart = createAsyncThunk(
  "cart/updatecart",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(
        `${API}/updatecart/${productId}`,
        { quantity },
        config,
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update cart",
      );
    }
  },
);

// Remove item from cart
export const removeCartItem = createAsyncThunk(
  "cart/removefromcart",
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(
        `${API}/removefromcart/${productId}`,
        config,
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Update cart manually (used after placing partial order)
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled for all async thunks
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.items = action.payload.cart?.products || state.items;
        },
      )
      // Pending for all async thunks
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      // Rejected for all async thunks
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
