import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Get admin dashboard stats
export const getAdminDashboard = createAsyncThunk(
    'admin/getDashboard',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/admin/dashboard`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all doctors (for admin)
export const getAllDoctors = createAsyncThunk(
    'admin/getAllDoctors',
    async (params, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            };

            const response = await axios.get(`${API_URL}/admin/doctors`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Approve/Reject doctor
export const approveDoctor = createAsyncThunk(
    'admin/approveDoctor',
    async ({ id, isApproved }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(
                `${API_URL}/admin/doctors/${id}/approve`,
                { isApproved },
                config
            );

            toast.success(`Doctor ${isApproved ? 'approved' : 'rejected'} successfully!`);
            return { id, isApproved };
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all users
export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (params, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            };

            const response = await axios.get(`${API_URL}/admin/users`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Toggle user block status
export const toggleUserBlock = createAsyncThunk(
    'admin/toggleUserBlock',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${API_URL}/admin/users/${id}/toggle-block`, {}, config);
            toast.success(response.data.message);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.delete(`${API_URL}/admin/users/${id}`, config);
            toast.success(response.data.message);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all appointments (for admin)
export const getAllAppointments = createAsyncThunk(
    'admin/getAllAppointments',
    async (params, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            };

            const response = await axios.get(`${API_URL}/admin/appointments`, config);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete appointment (for admin)
export const deleteAppointment = createAsyncThunk(
    'admin/deleteAppointment',
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

// Get revenue analytics
export const getRevenueAnalytics = createAsyncThunk(
    'admin/getRevenueAnalytics',
    async (params, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            };

            const response = await axios.get(`${API_URL}/admin/revenue`, config);
            console.log('Revenue API response:', response.data); // Add this log
            return response.data.data; // This should be your data object
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
            totalDoctors: 0,
            totalPatients: 0,
            totalAppointments: 0,
            pendingApprovals: 0,
            totalRevenue: 0,
        },
        monthlyRevenue: [],
        appointmentStats: [],
    },
    doctors: [],
    users: [],
    appointments: [],
    revenue: {
        payments: [],
        totalRevenue: 0,
        count: 0,
    },
    totalPages: 1,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminState: (state) => {
            state.dashboard = {
                stats: {
                    totalDoctors: 0,
                    totalPatients: 0,
                    totalAppointments: 0,
                    pendingApprovals: 0,
                    totalRevenue: 0,
                },
                monthlyRevenue: [],
                appointmentStats: [],
            };
            state.doctors = [];
            state.users = [];
            state.appointments = [];
            state.revenue = {
                payments: [],
                totalRevenue: 0,
                count: 0,
            };
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Dashboard
            .addCase(getAdminDashboard.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(getAdminDashboard.rejected, (state, action) => {
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
                state.doctors = action.payload.doctors;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getAllDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Approve Doctor
            .addCase(approveDoctor.fulfilled, (state, action) => {
                const { id, isApproved } = action.payload;
                state.doctors = state.doctors.map(doctor =>
                    doctor._id === id ? { ...doctor, isApproved } : doctor
                );

                // Update dashboard stats
                if (isApproved) {
                    state.dashboard.stats.pendingApprovals--;
                    state.dashboard.stats.totalDoctors++;
                }
            })
            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Toggle User Block
            .addCase(toggleUserBlock.fulfilled, (state, action) => {
                const userId = action.payload;
                state.users = state.users.map(user =>
                    user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                );
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                const userId = action.payload;
                state.users = state.users.filter(user => user._id !== userId);

                // Update dashboard stats
                const deletedUser = state.users.find(u => u._id === userId);
                if (deletedUser) {
                    if (deletedUser.role === 'doctor') {
                        state.dashboard.stats.totalDoctors--;
                    } else if (deletedUser.role === 'patient') {
                        state.dashboard.stats.totalPatients--;
                    }
                }
            })
            // Get All Appointments
            .addCase(getAllAppointments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload.appointments;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getAllAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Appointment
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.filter(apt => apt._id !== action.payload);
                state.dashboard.stats.totalAppointments--;
            })
            // Get Revenue Analytics
            // Get Revenue Analytics
            .addCase(getRevenueAnalytics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRevenueAnalytics.fulfilled, (state, action) => {
                state.isLoading = false;
                // The API returns data wrapped in a data property
                state.revenue = {
                    payments: action.payload.payments || [],
                    totalRevenue: action.payload.totalRevenue || 0,
                    count: action.payload.count || 0,
                    summary: action.payload.summary || {},
                    monthlyData: action.payload.monthlyData || []
                };
            })
            .addCase(getRevenueAnalytics.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;