import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user.slice"
import loadingSlice from "./slice/loading.slice"
import authSlice from "./slice/auth.slice"

const store = configureStore({
  reducer: {
    user: userSlice,
    loading: loadingSlice,
    auth: authSlice,
  },
  devTools: true,
});

export default store;