import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    selectedJob: null,
    myJob: [],
    appliedJobs: [],
    application: [],
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.jobs = action.payload || []; // Ensure it's always an array
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload || null; // Prevent undefined values
    },
    setMyJob: (state, action) => {
      state.myJob = action.payload || [];
    },
    setAppliedJobs: (state, action) => {
      state.appliedJobs = action.payload || [];
    },
    setApplication: (state, action) => {
      state.application = action.payload || [];
    },
  },
});

export const {
  setAllJobs,
  setSelectedJob,
  setMyJob,
  setAppliedJobs,
  setApplication,
} = jobSlice.actions;

export default jobSlice.reducer;
