


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Get user profile
export const getUserProfile = createAsyncThunk(
    'user/getProfile',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/users/profile`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${API_URL}/users/profile`, userData, config);

            // Update local storage
            const user = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...user, ...response.data.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Profile updated successfully!');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Upload profile photo
export const uploadProfilePhoto = createAsyncThunk(
    'user/uploadPhoto',
    async (formData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axios.post(`${API_URL}/users/upload-photo`, formData, config);

            // Update local storage
            const user = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...user, photo: response.data.data.photo };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Photo uploaded successfully!');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all doctors
export const getAllDoctors = createAsyncThunk(
    'user/getAllDoctors',
    async (filters, thunkAPI) => {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await axios.get(`${API_URL}/users/doctors?${queryString}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get doctor by ID
export const getDoctorById = createAsyncThunk(
    'user/getDoctorById',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/users/doctors/${id}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    profile: null,
    doctors: [],
    selectedDoctor: null,
    isLoading: false,
    isError: false,
    message: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearSelectedDoctor: (state) => {
            state.selectedDoctor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Profile
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get All Doctors
            .addCase(getAllDoctors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload;
            })
            .addCase(getAllDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Doctor By ID
            .addCase(getDoctorById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDoctorById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedDoctor = action.payload;
            })
            .addCase(getDoctorById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { clearSelectedDoctor } = userSlice.actions;
export default userSlice.reducer;