import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Create review
export const createReview = createAsyncThunk(
    'review/create',
    async (reviewData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${API_URL}/reviews`, reviewData, config);
            toast.success('Review submitted successfully!');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get doctor reviews
export const getDoctorReviews = createAsyncThunk(
    'review/getDoctorReviews',
    async (doctorId, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/reviews/doctor/${doctorId}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update review
export const updateReview = createAsyncThunk(
    'review/update',
    async ({ id, reviewData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData, config);
            toast.success('Review updated successfully!');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete review
export const deleteReview = createAsyncThunk(
    'review/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(`${API_URL}/reviews/${id}`, config);
            toast.success('Review deleted successfully!');
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    reviews: [],
    isLoading: false,
    isError: false,
    message: '',
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Review
            .addCase(createReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews.unshift(action.payload);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Doctor Reviews
            .addCase(getDoctorReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDoctorReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload;
            })
            .addCase(getDoctorReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Review
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            // Delete Review
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(r => r._id !== action.payload);
            });
    },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;