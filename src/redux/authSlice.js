import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  allJobs: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
  },
});

export const { setUser, setAllJobs } = authSlice.actions;
export default authSlice.reducer;
