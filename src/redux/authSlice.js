import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  allJobs: [],
  allResults : [],
  singleJob : null,
  singleResult : null
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
    },
    setAllResults : (state,action) => {
      state.allResults = action.payload;
    },
    setSingleResult : (state,action) => {
      state.singleResult = action.payload;
    }
    
  },
});

export const { setUser, setAllJobs,setSingleJob,setAllResults,setSingleResult } = authSlice.actions;
export default authSlice.reducer;
