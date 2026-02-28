import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaClock,
    FaUserMd,
    FaRupeeSign,
    FaEye,
    FaStar,
    FaFilter,
    FaTimes,
    FaCheckCircle,
    FaClock as FaClockIcon
} from 'react-icons/fa';
import { getUserAppointments, cancelAppointment, deleteAppointment } from '../../redux/slices/appointmentSlice';
import Spinner from '../common/Spinner';
import GiveReview from './GiveReview';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const AppointmentHistory = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading } = useSelector((state) => state.appointment);

    const [filter, setFilter] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        dispatch(getUserAppointments({ status: filter !== 'all' ? filter : undefined }));
    }, [dispatch, filter]);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (showDetails || showReviewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showDetails, showReviewModal]);

    const handleCancelAppointment = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            await dispatch(cancelAppointment(id));
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment from your history?')) {
            await dispatch(deleteAppointment(id));
        }
    };

    const viewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetails(true);
    };

    const openReviewModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowReviewModal(true);
    };

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClockIcon className="h-4 w-4 text-yellow-600" />;
            case 'confirmed':
                return <FaCheckCircle className="h-4 w-4 text-green-600" />;
            case 'completed':
                return <FaCheckCircle className="h-4 w-4 text-blue-600" />;
            case 'cancelled':
                return <FaTimes className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const canCancel = (appointment) => {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        return appointment.status === 'pending' ||
            (appointment.status === 'confirmed' && appointmentDate > today);
    };

    const canReview = (appointment) => {
        return appointment.status === 'completed' && !appointment.hasReviewed;
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-80 bg-gradient-to-bl from-indigo-100 to-purple-50 opacity-50 rounded-bl-[8rem] pointer-events-none -mr-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="mb-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-70"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
                            My Appointments
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">
                            View and manage all your appointments
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-indigo-100/40 p-5 mb-8 border border-white flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex items-center space-x-3 bg-indigo-50/50 px-4 py-2 rounded-xl">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <FaFilter className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-indigo-900">Filter Status</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'all'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 hover:-translate-y-0.5'
                                : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'pending'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md shadow-yellow-200 hover:-translate-y-0.5'
                                : 'bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 border border-gray-100'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('confirmed')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'confirmed'
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200 hover:-translate-y-0.5'
                                : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-100'
                                }`}
                        >
                            Confirmed
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'completed'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 hover:-translate-y-0.5'
                                : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'
                                }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilter('cancelled')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'cancelled'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 hover:-translate-y-0.5'
                                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-100'
                                }`}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 p-12 text-center border border-white">
                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                            <FaCalendarAlt className="h-10 w-10 text-indigo-300" />
                        </div>
                        <p className="text-gray-900 font-bold text-xl mb-2">No appointments found</p>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">You don't have any appointments matching the selected filter.</p>
                        <Link
                            to="/doctors"
                            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Book an Appointment
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment._id}
                                className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-md p-6 hover:shadow-xl hover:shadow-indigo-100/50 hover:bg-white transition-all duration-300 border border-white hover:border-indigo-50"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    {/* Doctor Info */}
                                    <div className="flex items-center space-x-5">
                                        <div className="relative">
                                            <img
                                                src={appointment.doctorId?.photo}
                                                alt={appointment.doctorId?.name}
                                                className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors"
                                            />
                                            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm ${appointment.status === 'completed' ? 'bg-green-500' :
                                                appointment.status === 'cancelled' ? 'bg-red-500' :
                                                    appointment.status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'
                                                }`}></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors">Dr. {appointment.doctorId?.name}</h3>
                                            <p className="text-indigo-600 font-medium text-sm mt-0.5">{appointment.doctorId?.specialization}</p>
                                            <div className="flex items-center mt-2 text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg w-fit">
                                                <FaRupeeSign className="h-3 w-3 mr-1 text-indigo-400" />
                                                <span className="font-bold">{appointment.amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="mt-6 lg:mt-0 grid grid-cols-2 gap-y-4 gap-x-6 lg:flex lg:items-center lg:space-x-8 lg:bg-gray-50/50 lg:p-4 lg:rounded-2xl">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                            <div className="flex items-center text-sm font-semibold text-gray-800">
                                                <div className="p-1.5 bg-indigo-50 rounded-md mr-2">
                                                    <FaCalendarAlt className="h-3 w-3 text-indigo-500" />
                                                </div>
                                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                                            <div className="flex items-center text-sm font-semibold text-gray-800">
                                                <div className="p-1.5 bg-purple-50 rounded-md mr-2">
                                                    <FaClock className="h-3 w-3 text-purple-500" />
                                                </div>
                                                <span>{appointment.time}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                            <div className="flex items-center">
                                                <span className={`flex items-center text-xs font-bold shadow-sm ${getStatusColor(appointment.status)} px-3 py-1.5 rounded-xl`}>
                                                    {getStatusIcon(appointment.status)}
                                                    <span className="ml-1.5">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                                            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm ${appointment.paymentStatus === 'completed'
                                                ? 'bg-green-100 text-green-800 ring-1 ring-green-200/50'
                                                : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200/50'
                                                }`}>
                                                {appointment.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => viewDetails(appointment)}
                                            className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-200 flex items-center space-x-2 font-bold transition-all duration-300"
                                        >
                                            <FaEye className="h-4 w-4" />
                                            <span className="text-sm">Details</span>
                                        </button>

                                        {canCancel(appointment) && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-200 flex items-center space-x-2 font-bold transition-all duration-300"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                                <span className="text-sm">Cancel</span>
                                            </button>
                                        )}

                                        {canReview(appointment) && (
                                            <button
                                                onClick={() => openReviewModal(appointment)}
                                                className="bg-yellow-50 text-yellow-700 px-4 py-2.5 rounded-xl hover:bg-yellow-500 hover:text-white hover:shadow-md hover:shadow-yellow-200 flex items-center space-x-2 font-bold transition-all duration-300"
                                            >
                                                <FaStar className="h-4 w-4" />
                                                <span className="text-sm">Review</span>
                                            </button>
                                        )}

                                        {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
                                            <button
                                                onClick={() => handleDeleteAppointment(appointment._id)}
                                                className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-200 hover:text-gray-900 flex items-center space-x-2 font-bold transition-all duration-300"
                                                title="Delete from history"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                                <span className="text-sm">Delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Problem Description (visible on mobile/tablet) */}
                                <div className="mt-5 lg:hidden bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reason for visit</p>
                                    <p className="text-sm text-gray-800 font-medium">{appointment.problemDescription}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Appointment Details Modal */}
                {showDetails && selectedAppointment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop with fade-in effect */}
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
                            onClick={() => setShowDetails(false)}
                        ></div>

                        {/* Modal container with scale-in effect */}
                        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-fadeIn transition-all duration-300 transform">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5 flex justify-between items-center text-white shrink-0">
                                <h2 className="text-2xl font-bold tracking-tight">Appointment Details</h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Doctor Information */}
                                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                                        <h3 className="font-bold text-indigo-900 mb-4 flex items-center text-lg">
                                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mr-3">
                                                <FaUserMd className="h-4 w-4" />
                                            </div>
                                            Doctor Information
                                        </h3>
                                        <div className="flex items-center space-x-5 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                                            <img
                                                src={selectedAppointment.doctorId?.photo ? `${IMAGE_URL}/uploads/${selectedAppointment.doctorId.photo}` : 'https://via.placeholder.com/60'}
                                                alt={selectedAppointment.doctorId?.name}
                                                className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-50"
                                            />
                                            <div>
                                                <p className="font-bold text-xl text-gray-900">Dr. {selectedAppointment.doctorId?.name}</p>
                                                <p className="text-indigo-600 font-semibold mb-1">{selectedAppointment.doctorId?.specialization}</p>
                                                <p className="text-sm text-gray-600 font-medium">{selectedAppointment.doctorId?.email}</p>
                                                <p className="text-sm text-gray-600 font-medium">{selectedAppointment.doctorId?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Information */}
                                    <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/50">
                                        <h3 className="font-bold text-purple-900 mb-4 flex items-center text-lg">
                                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mr-3">
                                                <FaCalendarAlt className="h-4 w-4" />
                                            </div>
                                            Appointment Information
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-50">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                                <p className="font-bold text-gray-800">
                                                    {new Date(selectedAppointment.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                                                <p className="font-bold text-gray-800">{selectedAppointment.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${getStatusColor(selectedAppointment.status)}`}>
                                                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                                                <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${selectedAppointment.paymentStatus === 'completed'
                                                    ? 'bg-green-100 text-green-800 ring-1 ring-green-200/50'
                                                    : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200/50'
                                                    }`}>
                                                    {selectedAppointment.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amount</p>
                                                <p className="font-bold text-indigo-600 text-lg">₹{selectedAppointment.amount}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Problem Description */}
                                    <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-2">Reason for Visit</h3>
                                        <p className="text-gray-700 bg-white p-4 rounded-xl shadow-sm font-medium">
                                            {selectedAppointment.problemDescription}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50/80 mt-auto p-4 shrink-0 border-t border-gray-100">
                                <div className="text-xs font-semibold text-gray-400 flex flex-col sm:flex-row sm:justify-between items-center bg-white py-2 px-4 rounded-xl shadow-sm border border-gray-50">
                                    <span className="mb-1 sm:mb-0">Booking ID: {selectedAppointment._id}</span>
                                    <span>Booked on: {new Date(selectedAppointment.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Review Modal */}
                {showReviewModal && selectedAppointment && (
                    <GiveReview
                        appointment={selectedAppointment}
                        onClose={() => {
                            setShowReviewModal(false);
                            setSelectedAppointment(null);
                        }}
                        onSuccess={() => {
                            setShowReviewModal(false);
                            setSelectedAppointment(null);
                            dispatch(getUserAppointments({ status: filter !== 'all' ? filter : undefined }));
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AppointmentHistory;