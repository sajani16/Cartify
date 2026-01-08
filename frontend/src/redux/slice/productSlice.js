import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ===================== FETCH PRODUCTS (ALL / FILTER / PAGINATION) ===================== */
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    {
      page = 1,
      limit = 8,
      append = false,
      category,
      isTrending,
      isOnSale,
      sort = "latest",
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();

      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (category) params.append("category", category);
      if (isTrending !== undefined) params.append("isTrending", isTrending);
      if (isOnSale !== undefined) params.append("isOnSale", isOnSale);
      if (sort) params.append("sort", sort);

      const res = await fetch(
        `http://localhost:3000/product/getProducts?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      return { ...data, append };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ===================== FETCH TRENDING PRODUCTS ===================== */
export const fetchTrendingProducts = createAsyncThunk(
  "product/fetchTrendingProducts",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        "http://localhost:3000/product/getProducts?isTrending=true&limit=8"
      );

      if (!res.ok) throw new Error("Failed to fetch trending products");

      const data = await res.json();
      return data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ===================== FETCH ON SALE PRODUCTS ===================== */
export const fetchOnSaleProducts = createAsyncThunk(
  "product/fetchOnSaleProducts",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        "http://localhost:3000/product/getProducts?isOnSale=true&limit=8"
      );

      if (!res.ok) throw new Error("Failed to fetch sale products");

      const data = await res.json();
      return data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ===================== SEARCH PRODUCTS ===================== */
export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async (
    { keyword, category, minPrice, maxPrice, page = 1, limit = 10 },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();

      if (keyword) params.append("keyword", keyword);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const res = await fetch(
        `http://localhost:3000/product/search?${params.toString()}`
      );

      if (!res.ok) throw new Error("Search failed");

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ===================== GET SINGLE PRODUCT ===================== */
export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3000/product/getProduct/${id}`);

      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      return data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ===================== SLICE ===================== */
const productSlice = createSlice({
  name: "product",
  initialState: {
    isLoading: false,
    data: [], // ALL PRODUCTS
    trending: [], // TRENDING PRODUCTS
    onSale: [], // SALE PRODUCTS
    single: null,
    error: null,

    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,

    filters: {
      category: "",
      sort: "latest",
      minPrice: "",
      maxPrice: "",
      keyword: "",
    },
  },
  reducers: {
    resetProducts: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalProducts = 0;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= FETCH ALL PRODUCTS ================= */
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { products, currentPage, totalPages, totalProducts, append } =
          action.payload;

        if (append) {
          state.data = [...state.data, ...products];
        } else {
          state.data = products;
        }

        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.totalProducts = totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ================= FETCH TRENDING ================= */
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ================= FETCH ON SALE ================= */
      .addCase(fetchOnSaleProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOnSaleProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onSale = action.payload;
      })
      .addCase(fetchOnSaleProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ================= SEARCH ================= */
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ================= SINGLE PRODUCT ================= */
      .addCase(fetchSingleProduct.pending, (state) => {
        state.isLoading = true;
        state.single = null;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.single = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProducts, setFilters } = productSlice.actions;
export default productSlice.reducer;
