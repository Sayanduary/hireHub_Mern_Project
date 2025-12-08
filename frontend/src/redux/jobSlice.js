import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/utils";
import { JOB_API_END_POINT } from "../utils/constant";

export const postJob = createAsyncThunk(
    "job/post",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(`${JOB_API_END_POINT}/post`, data);
            return res.data.job;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const fetchJobs = createAsyncThunk(
    "job/get",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`${JOB_API_END_POINT}/get`);
            return res.data.jobs;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const jobSlice = createSlice({
    name: "job",
    initialState: { jobs: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postJob.fulfilled, (state, action) => {
                state.jobs.push(action.payload);
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.jobs = action.payload;
            });
    }
});

export default jobSlice.reducer;
