import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Create appointment
export const createAppointment = createAsyncThunk(
    'appointment/create',
    async (appointmentData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${API_URL}/appointments`, appointmentData, config);
            toast.success('Appointment created successfully!');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get user appointments
export const getUserAppointments = createAsyncThunk(
    'appointment/getUserAppointments',
    async (params, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            };

            const response = await axios.get(`${API_URL}/appointments/my-appointments`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Cancel appointment
export const cancelAppointment = createAsyncThunk(
    'appointment/cancel',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${API_URL}/appointments/${id}/cancel`, {}, config);
            toast.success('Appointment cancelled successfully!');
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
    'appointment/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(`${API_URL}/appointments/${id}`, config);
            toast.success('Appointment deleted successfully!');
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get available slots
export const getAvailableSlots = createAsyncThunk(
    'appointment/getAvailableSlots',
    async ({ doctorId, date }, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/appointments/available-slots/${doctorId}`, {
                params: { date },
            });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    appointments: [],
    availableSlots: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
};

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        clearAvailableSlots: (state) => {
            state.availableSlots = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Appointment
            .addCase(createAppointment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments.unshift(action.payload);
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get User Appointments
            .addCase(getUserAppointments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload.appointments;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getUserAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cancel Appointment
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.map(apt =>
                    apt._id === action.payload ? { ...apt, status: 'cancelled' } : apt
                );
            })
            // Delete Appointment
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.filter(apt => apt._id !== action.payload);
            })
            // Get Available Slots
            .addCase(getAvailableSlots.fulfilled, (state, action) => {
                state.availableSlots = action.payload;
            });
    },
});

export const { clearAvailableSlots } = appointmentSlice.actions;
export default appointmentSlice.reducer;