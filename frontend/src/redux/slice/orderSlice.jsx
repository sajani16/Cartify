import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL + "/order";

/* ================= USER ================= */

// Create a new order for selected cart items
export const createOrder = createAsyncThunk(
  "order/create",
  async ({ shippingAddress, paymentMethod, selectedProductIds }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      // Send selected items to backend
      const res = await axios.post(
        `${API}/createorder`,
        { shippingAddress, paymentMethod, selectedProductIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove ordered items from cart in Redux
      const cartItems = thunkAPI.getState().cart.items;
      const remainingCart = cartItems.filter(
        (item) => !selectedProductIds.includes(item.product._id)
      );
      thunkAPI.dispatch({ type: "cart/setCartItems", payload: remainingCart });

      return res.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Order creation failed"
      );
    }
  }
);

// Fetch logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMy",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const res = await axios.get(`${API}/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.orders || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Cancel user's order
export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const res = await axios.delete(`${API}/cancelorder/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

/* ================= ADMIN ================= */

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const res = await axios.get(`${API}/allorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.orders || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch all orders"
      );
    }
  }
);

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const res = await axios.put(
        `${API}/updateorder/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update order"
      );
    }
  }
);

/* ================= SLICE ================= */

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optional manual error update
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* USER */
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (action.payload)
          state.myOrders = [action.payload, ...state.myOrders];
        state.loading = false;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.myOrders = state.myOrders.map((o) =>
          o._id === action.payload?._id ? action.payload : o
        );
        state.loading = false;
        state.error = null;
      })

      /* ADMIN */
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.allOrders = state.allOrders.map((o) =>
          o._id === action.payload?._id ? action.payload : o
        );
        state.loading = false;
        state.error = null;
      })

      /* COMMON MATCHERS */
      .addMatcher(
        (action) =>
          action.type.startsWith("order/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("order/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setOrderError } = orderSlice.actions;
export default orderSlice.reducer;
