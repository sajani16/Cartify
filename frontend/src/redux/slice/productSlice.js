import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch products with optional append
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ page, limit, append = false }, thunkAPI) => {
    try {
      const res = await fetch(
        `http://localhost:3000/product/getProducts?page=${page}&limit=${limit}`
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      // Include append flag in payload
      return { ...data, append };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    isLoading: false,
    data: [],
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    resetProducts: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;

        const { products, currentPage, totalPages, append } = action.payload;

        if (append) {
          // Append for “Load More” feature
          state.data = [...state.data, ...products];
        } else {
          // Replace data for normal pagination
          state.data = products;
        }

        state.currentPage = currentPage;
        state.totalPages = totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
