import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resumes: [],
    currentResume: null,
    currentResumeId: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Set all resumes
    setResumes: (state, action) => {
      state.resumes = action.payload;
    },
    // Set current resume for editing
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload.data;
      state.currentResumeId = action.payload.id;
    },
    // Clear current resume (start new)
    clearCurrentResume: (state) => {
      state.currentResume = null;
      state.currentResumeId = null;
    },
    // Add new resume to list
    addResume: (state, action) => {
      state.resumes.unshift(action.payload);
      state.currentResumeId = action.payload._id;
    },
    // Update resume in list
    updateResumeInList: (state, action) => {
      const index = state.resumes.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.resumes[index] = action.payload;
      }
    },
    // Remove resume from list
    removeResumeFromList: (state, action) => {
      state.resumes = state.resumes.filter((r) => r._id !== action.payload);
      if (state.currentResumeId === action.payload) {
        state.currentResumeId = null;
        state.currentResume = null;
      }
    },
    // Set loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setResumes,
  setCurrentResume,
  clearCurrentResume,
  addResume,
  updateResumeInList,
  removeResumeFromList,
  setLoading,
  setError,
} = resumeSlice.actions;

export default resumeSlice.reducer;
