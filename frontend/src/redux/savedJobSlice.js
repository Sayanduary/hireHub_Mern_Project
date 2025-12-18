import { createSlice } from "@reduxjs/toolkit";

const savedJobSlice = createSlice({
  name: "savedJob",
  initialState: {
    savedJobIds: []
  },
  reducers: {
    addSavedJobId: (state, action) => {
      if (!state.savedJobIds.includes(action.payload)) {
        state.savedJobIds.push(action.payload);
      }
    },
    removeSavedJobId: (state, action) => {
      state.savedJobIds = state.savedJobIds.filter(id => id !== action.payload);
    },
    setSavedJobIds: (state, action) => {
      state.savedJobIds = action.payload;
    }
  }
});

export const { addSavedJobId, removeSavedJobId, setSavedJobIds } = savedJobSlice.actions;
export default savedJobSlice.reducer;
