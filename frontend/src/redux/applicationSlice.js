import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/utils";
import { APPLICATION_API_END_POINT } from "../utils/constant";

export const applyForJob = createAsyncThunk(
    "application/apply",
    async (jobId, { rejectWithValue }) => {
        try {
            const res = await api.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applied: [],
        applicants: [],
        loading: false
    },
    reducers: {
        setAllAppliedJobs: (state, action) => {
            state.applied = action.payload;
        },
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAllAppliedJobs, setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
