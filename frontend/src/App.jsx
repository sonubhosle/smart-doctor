import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import DoctorList from './components/patient/DoctorList';
import DoctorProfile from './components/patient/DoctorProfile';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/patient/Profile';
import BookAppointment from './components/patient/BookAppointment';
import AppointmentHistory from './components/patient/AppointmentHistory';
import DoctorAppointments from './components/doctor/DoctorAppointments';
import DoctorProfileEdit from './components/doctor/DoctorProfile';
import DoctorEarnings from './components/doctor/DoctorEarnings';
import DoctorReviews from './components/doctor/DoctorReviews';
import ApproveDoctors from './components/admin/ApproveDoctors';
import ManageUsers from './components/admin/ManageUsers';
import AllAppointments from './components/admin/AllAppointments';
import RevenueAnalytics from './components/admin/RevenueAnalytics';
import PendingApproval from './pages/PendingApproval';
import DoctorAppointmentDetail from './components/doctor/DoctorAppointmentDetail';

function App() {

  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password') || location.pathname === '/pending-approval';
  const hideFooter = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password') || location.pathname === '/pending-approval';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/book/:doctorId" element={<BookAppointment />} />
          <Route path="/patient/appointments" element={<AppointmentHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/profile" element={<DoctorProfileEdit />} />
          <Route path="/doctor/earnings" element={<DoctorEarnings />} />
          <Route path="/doctor/reviews" element={<DoctorReviews />} />
          <Route path="/doctor/appointments/:id" element={<DoctorAppointmentDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approve-doctors" element={<ApproveDoctors />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/appointments" element={<AllAppointments />} />
          <Route path="/admin/revenue" element={<RevenueAnalytics />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

export default App;