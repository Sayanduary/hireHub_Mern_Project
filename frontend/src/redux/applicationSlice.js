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
        appliedJobIds: [], // Array of job IDs that user has applied to
        loading: false
    },
    reducers: {
        setAllAppliedJobs: (state, action) => {
            state.applied = action.payload;
            // Extract job IDs from applied jobs
            state.appliedJobIds = action.payload.map(app => app.job?._id || app.job).filter(Boolean);
        },
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        addAppliedJobId: (state, action) => {
            // Add a job ID to the applied list immediately
            if (!state.appliedJobIds.includes(action.payload)) {
                state.appliedJobIds.push(action.payload);
            }
        }
    }
});

export const { setAllAppliedJobs, setAllApplicants, addAppliedJobId } = applicationSlice.actions;
export default applicationSlice.reducer;
