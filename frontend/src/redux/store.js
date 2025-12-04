import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user.slice"
import loadingSlice from "./slice/loading.slice"
import authSlice from "./slice/auth.slice"
import cartSlice from "./slice/cart.slice"

const store = configureStore({
  reducer: {
    user: userSlice,
    loading: loadingSlice,
    auth: authSlice,
    cart: cartSlice,
  },
  devTools: true,
});

export default store;