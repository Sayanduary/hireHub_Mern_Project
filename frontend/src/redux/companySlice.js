import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/utils";
import { COMPANY_API_END_POINT } from "../utils/constant";

export const registerCompany = createAsyncThunk(
    "company/register",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(`${COMPANY_API_END_POINT}/register`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const fetchCompanies = createAsyncThunk(
    "company/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`${COMPANY_API_END_POINT}/get`);
            return res.data.companies;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const companySlice = createSlice({
    name: "company",
    initialState: {
        companies: [],
        singleCompany: null,
        loading: false,
        searchCompanyByText: ""
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerCompany.fulfilled, (state, action) => {
                state.companies.push(action.payload.company);
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.companies = action.payload;
            });
    }
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
