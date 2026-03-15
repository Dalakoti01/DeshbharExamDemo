import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  allJobs: [],
  allResults : [],
  singleJob : null,
  singleResult : null,
  allAdmitCards : [],
  singleAdmitCard : null,
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
    },
    setAllAdmitCards : (state,action) => {
      state.allAdmitCards = action.payload;
    },
    setSingleAdmitCard : (state,action) => {
      state.singleAdmitCard = action.payload;
    }
    
  },
});

export const { setUser, setAllJobs,setSingleJob,setAllResults,setSingleResult,setAllAdmitCards,setSingleAdmitCard } = authSlice.actions;
export default authSlice.reducer;
