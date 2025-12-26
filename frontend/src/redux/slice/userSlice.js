import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("user")) || {
  token: null,
  name: null,
  email: null,
  _id: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.role = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.name = null;
      state.email = null;
      state.token = null;
      state._id = null;
      state.role = null;
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
