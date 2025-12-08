import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/utils";
import { APPLICATION_API_END_POINT } from "../utils/constant";

export const applyForJob = createAsyncThunk(
    "application/apply",
    async (jobId, { rejectWithValue }) => {
        try {
            const res = await api.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const applicationSlice = createSlice({
    name: "application",
    initialState: { applied: [], loading: false },
    reducers: {},
    extraReducers: (builder) => { }
});

export default applicationSlice.reducer;
