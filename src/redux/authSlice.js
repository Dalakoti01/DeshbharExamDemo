import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  allJobs: [],
  singleJob : null,
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
    setSingleJob : (state, action) => {
      state.singleJob = action.payload;
    }
  },
});

export const { setUser, setAllJobs,setSingleJob } = authSlice.actions;
export default authSlice.reducer;
