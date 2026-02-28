import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import adminReducer from './slices/adminSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        doctor: doctorReducer,
        appointment: appointmentReducer,
        admin: adminReducer,
        review: reviewReducer,
    },
});