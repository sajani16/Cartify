import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:3000/order";

/* ================= USER ================= */

export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      const res = await axios.post(
        `${API}/createorder`,
        orderData, // ✅ REAL DATA, NOT {}
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Order creation failed"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMy",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const res = await axios.get(`${API}/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.orders || [];
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const res = await axios.delete(`${API}/cancelorder/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.order;
  }
);

/* ================= ADMIN ================= */

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const res = await axios.get(`${API}/allorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.orders || [];
  }
);

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
      return res.data.order; // ✅ returns updated order
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
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
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* USER */
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (action.payload) {
          state.myOrders = [action.payload, ...state.myOrders];
        }
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

      /* COMMON */
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
          state.error = action.payload; // ✅ REAL BACKEND MESSAGE
        }
      );
  },
});

export default orderSlice.reducer;
