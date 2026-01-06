import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { loadState, saveState } from "./storage";

const rootReducer = combineReducers({
  auth: authSlice,
});

// 🔑 Load state on startup
const preloadedState = typeof window !== "undefined" ? loadState() : undefined;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});

// 🔑 Save only `auth` slice (or more if you want)
if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveState({
      auth: store.getState().auth,
    });
  });
}