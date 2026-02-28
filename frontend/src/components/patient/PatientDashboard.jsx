import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    FaCalendarCheck,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaRupeeSign,
    FaUserMd,
    FaStar,
    FaArrowRight
} from 'react-icons/fa';
import { getUserAppointments } from '../../redux/slices/appointmentSlice';
import Spinner from '../common/Spinner';

const PatientDashboard = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading } = useSelector((state) => state.appointment);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserAppointments({ limit: 5 }));
    }, [dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    // Calculate statistics
    const stats = {
        total: appointments.length,
        pending: appointments.filter(apt => apt.status === 'pending').length,
        confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
        completed: appointments.filter(apt => apt.status === 'completed').length,
        cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
        totalSpent: appointments
            .filter(apt => apt.paymentStatus === 'completed')
            .reduce((sum, apt) => sum + apt.amount, 0)
    };

    const recentAppointments = appointments.slice(0, 3);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-10 rounded-b-[4rem] pointer-events-none -mt-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Welcome Section */}
                <div className="mb-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-70"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
                            Welcome back, {user?.name}!
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">
                            Manage your appointments and healthcare journey
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 group/stats">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-100/40 p-6 border border-white transition-all duration-300 hover:shadow-indigo-200/50 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total</p>
                                <p className="text-3xl font-extrabold text-indigo-600">{stats.total}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-4 rounded-xl shadow-inner border border-indigo-100/50">
                                <FaCalendarCheck className="h-6 w-6 text-indigo-600 drop-shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-100/40 p-6 border border-white transition-all duration-300 hover:shadow-indigo-200/50 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full opacity-50"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Upcoming</p>
                                <p className="text-3xl font-extrabold text-green-600">{stats.confirmed}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-xl shadow-inner border border-green-100/50">
                                <FaClock className="h-6 w-6 text-green-600 drop-shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-100/40 p-6 border border-white transition-all duration-300 hover:shadow-indigo-200/50 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full opacity-50"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Completed</p>
                                <p className="text-3xl font-extrabold text-blue-600">{stats.completed}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl shadow-inner border border-blue-100/50">
                                <FaCheckCircle className="h-6 w-6 text-blue-600 drop-shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-100/40 p-6 border border-white transition-all duration-300 hover:shadow-indigo-200/50 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full opacity-50"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Spent</p>
                                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                                    ₹{stats.totalSpent.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl shadow-inner border border-purple-100/50">
                                <FaRupeeSign className="h-6 w-6 text-purple-600 drop-shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/doctors"
                        className="group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-indigo-100/30 p-6 hover:shadow-indigo-200/50 hover:bg-white/90 transition-all duration-300 flex items-center space-x-5 border border-white"
                    >
                        <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-3.5 rounded-xl border border-indigo-100/50 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                            <FaUserMd className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Find Doctors</h3>
                            <p className="text-sm text-gray-500 font-medium">Book new appointment</p>
                        </div>
                        <FaArrowRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all duration-300" />
                    </Link>

                    <Link
                        to="/patient/appointments"
                        className="group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-indigo-100/30 p-6 hover:shadow-indigo-200/50 hover:bg-white/90 transition-all duration-300 flex items-center space-x-5 border border-white"
                    >
                        <div className="bg-gradient-to-br from-green-100 to-green-50 p-3.5 rounded-xl border border-green-100/50 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                            <FaCalendarCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">My Appointments</h3>
                            <p className="text-sm text-gray-500 font-medium">View all appointments</p>
                        </div>
                        <FaArrowRight className="h-5 w-5 text-gray-300 group-hover:text-green-500 transform group-hover:translate-x-1 transition-all duration-300" />
                    </Link>

                    <Link
                        to="/profile"
                        className="group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-indigo-100/30 p-6 hover:shadow-indigo-200/50 hover:bg-white/90 transition-all duration-300 flex items-center space-x-5 border border-white"
                    >
                        <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-3.5 rounded-xl border border-purple-100/50 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                            <FaStar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">My Profile</h3>
                            <p className="text-sm text-gray-500 font-medium">Update information</p>
                        </div>
                        <FaArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-100/50 p-6 sm:p-8 border border-white">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <FaCalendarCheck className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-800">
                                Recent Appointments
                            </h2>
                        </div>
                        <Link
                            to="/patient/appointments"
                            className="bg-gray-50 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-gray-100 hover:border-indigo-200"
                        >
                            View All
                        </Link>
                    </div>

                    {recentAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {recentAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="group border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-indigo-100/40 hover:border-indigo-100 transition-all duration-300 bg-white"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <img
                                                    src={appointment.doctorId?.photo || 'https://via.placeholder.com/50'}
                                                    alt={appointment.doctorId?.name}
                                                    className="h-14 w-14 rounded-full object-cover border-2 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors"
                                                />
                                                <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${appointment.status === 'completed' ? 'bg-green-500' :
                                                    appointment.status === 'cancelled' ? 'bg-red-500' :
                                                        appointment.status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'
                                                    }`}></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Dr. {appointment.doctorId?.name}</h3>
                                                <p className="text-sm text-gray-500 font-medium">{appointment.doctorId?.specialization}</p>
                                                <div className="flex items-center space-x-2 mt-1.5 bg-gray-50 px-2 py-1 rounded-md w-fit">
                                                    <FaClock className="h-3 w-3 text-indigo-400" />
                                                    <span className="text-xs font-semibold text-gray-600">
                                                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-gray-50/50 p-2 rounded-xl">
                                            <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getStatusColor(appointment.status)}`}>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                            <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm ${appointment.paymentStatus === 'completed'
                                                ? 'bg-green-100 text-green-800 ring-1 ring-green-200/50'
                                                : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200/50'
                                                }`}>
                                                {appointment.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                <FaCalendarCheck className="h-8 w-8 text-indigo-200" />
                            </div>
                            <p className="text-gray-500 font-medium text-lg">No appointments yet</p>
                            <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">Your upcoming and past appointments will appear here.</p>
                            <Link
                                to="/doctors"
                                className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Book Your First Appointment
                            </Link>
                        </div>
                    )}
                </div>

                {/* Health Tips Section */}
                <div className="mt-8 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-xl border border-indigo-100/50 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-100/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex items-center space-x-3 mb-5">
                        <div className="text-2xl">💡</div>
                        <h3 className="font-bold text-lg text-indigo-900">Health Tips</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="flex items-start space-x-3 bg-white/60 p-4 rounded-2xl hover:bg-white/90 transition-colors border border-white/50 shadow-sm">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-0.5">
                                <FaCheckCircle className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Regular check-ups help prevent major health issues before they start</p>
                        </div>
                        <div className="flex items-start space-x-3 bg-white/60 p-4 rounded-2xl hover:bg-white/90 transition-colors border border-white/50 shadow-sm">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-0.5">
                                <FaCheckCircle className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Keep track of your medical history and share it with your doctor</p>
                        </div>
                        <div className="flex items-start space-x-3 bg-white/60 p-4 rounded-2xl hover:bg-white/90 transition-colors border border-white/50 shadow-sm">
                            <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-0.5">
                                <FaCheckCircle className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Book appointments well in advance for better availability slots</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;