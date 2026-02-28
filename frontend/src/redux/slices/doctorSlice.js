import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Get doctor dashboard stats
export const getDoctorDashboard = createAsyncThunk(
    'doctor/getDashboard',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/doctors/dashboard`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get doctor appointments
export const getDoctorAppointments = createAsyncThunk(
    'doctor/getAppointments',
    async (params, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            };


            const response = await axios.get(`${API_URL}/doctors/appointments`, config);

            // Ensure we return the data in the correct format
            return {
                appointments: response.data.data?.appointments || [],
                totalPages: response.data.data?.totalPages || 1,
                currentPage: response.data.data?.currentPage || 1,
                total: response.data.data?.total || 0
            };
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get single appointment by ID
export const getAppointmentById = createAsyncThunk(
    'doctor/getAppointmentById',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/doctors/appointments/${id}`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
    'doctor/updateAppointmentStatus',
    async ({ id, status, isChecked }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(
                `${API_URL}/doctors/appointments/${id}`,
                { status, isChecked },
                config
            );

            toast.success(`Appointment ${status} successfully!`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update doctor profile
export const updateDoctorProfile = createAsyncThunk(
    'doctor/updateProfile',
    async (profileData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${API_URL}/doctors/profile`, profileData, config);

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

// Get doctor earnings
export const getDoctorEarnings = createAsyncThunk(
    'doctor/getEarnings',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/doctors/earnings`, config);
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
    'doctor/getReviews',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/doctors/reviews`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    dashboard: {
        stats: {
            totalAppointments: 0,
            completedAppointments: 0,
            pendingAppointments: 0,
            cancelledAppointments: 0,
            totalEarnings: 0,
            averageRating: 0,
        },
        recentAppointments: [],
    },
    appointments: [],
    selectedAppointment: null,
    earnings: [],
    reviews: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        clearDoctorState: (state) => {
            state.dashboard = {
                stats: {
                    totalAppointments: 0,
                    completedAppointments: 0,
                    pendingAppointments: 0,
                    cancelledAppointments: 0,
                    totalEarnings: 0,
                    averageRating: 0,
                },
                recentAppointments: [],
            };
            state.appointments = [];
            state.selectedAppointment = null;
            state.earnings = [];
            state.reviews = [];
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedAppointment: (state) => {
            state.selectedAppointment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Dashboard
            .addCase(getDoctorDashboard.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(getDoctorDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;

                // Also update appointments with recent appointments from dashboard
                if (action.payload?.recentAppointments) {
                    state.appointments = [...action.payload.recentAppointments];
                }
            })
            .addCase(getDoctorDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Get Appointments
            .addCase(getDoctorAppointments.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(getDoctorAppointments.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload && action.payload.appointments) {
                    state.appointments = [...action.payload.appointments];
                    state.totalPages = action.payload.totalPages || 1;
                    state.currentPage = action.payload.currentPage || 1;
                    state.total = action.payload.total || 0;
                }
            })
            .addCase(getDoctorAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.appointments = [];
            })

            // Get Appointment By ID
            .addCase(getAppointmentById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(getAppointmentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedAppointment = action.payload;
            })
            .addCase(getAppointmentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.selectedAppointment = null;
            })

            // Update Appointment Status
            .addCase(updateAppointmentStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedAppointment = action.payload;

                // Update in appointments list
                if (state.appointments && state.appointments.length > 0) {
                    state.appointments = state.appointments.map(apt =>
                        apt._id === updatedAppointment._id ? updatedAppointment : apt
                    );
                }

                // Update in dashboard recent appointments
                if (state.dashboard?.recentAppointments) {
                    state.dashboard.recentAppointments = state.dashboard.recentAppointments.map(apt =>
                        apt._id === updatedAppointment._id ? updatedAppointment : apt
                    );
                }

                // Update selected appointment if it's the same one
                if (state.selectedAppointment?._id === updatedAppointment._id) {
                    state.selectedAppointment = updatedAppointment;
                }

                // Update dashboard stats
                if (state.dashboard?.stats) {
                    // Find the old appointment to know what status changed from
                    const oldAppointment = state.appointments.find(apt => apt._id === updatedAppointment._id);

                    if (oldAppointment && oldAppointment.status !== updatedAppointment.status) {
                        // Decrement old status count
                        if (oldAppointment.status === 'pending') state.dashboard.stats.pendingAppointments--;
                        if (oldAppointment.status === 'completed') state.dashboard.stats.completedAppointments--;
                        if (oldAppointment.status === 'cancelled') state.dashboard.stats.cancelledAppointments--;

                        // Increment new status count
                        if (updatedAppointment.status === 'pending') state.dashboard.stats.pendingAppointments++;
                        if (updatedAppointment.status === 'completed') state.dashboard.stats.completedAppointments++;
                        if (updatedAppointment.status === 'cancelled') state.dashboard.stats.cancelledAppointments++;
                    }
                }
            })
            .addCase(updateAppointmentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Update Profile
            .addCase(updateDoctorProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateDoctorProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.dashboard?.stats && action.payload.averageRating) {
                    state.dashboard.stats.averageRating = action.payload.averageRating;
                }
            })
            .addCase(updateDoctorProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Get Earnings
            .addCase(getDoctorEarnings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDoctorEarnings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.earnings = action.payload || [];
            })
            .addCase(getDoctorEarnings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.earnings = [];
            })

            // Get Reviews
            .addCase(getDoctorReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDoctorReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload || [];
            })
            .addCase(getDoctorReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.reviews = [];
            });
    },
});

export const { clearDoctorState, clearSelectedAppointment } = doctorSlice.actions;
export default doctorSlice.reducer;