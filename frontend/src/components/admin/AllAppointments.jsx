import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaCalendarAlt,
    FaClock,
    FaUserMd,
    FaUser,
    FaRupeeSign,
    FaSearch,
    FaEye,
    FaTimes,
    FaFilter,
    FaDownload
} from 'react-icons/fa';
import { getAllAppointments, deleteAppointment } from '../../redux/slices/adminSlice';
import Spinner from '../common/Spinner';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const AllAppointments = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading } = useSelector((state) => state.admin);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: 'all',
        search: '',
        startDate: '',
        endDate: ''
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchAppointments();
    }, [dispatch, filters.page, filters.status]);

    useEffect(() => {
        if (appointments.length > 0) {
            calculateStats();
        }
    }, [appointments]);

    const fetchAppointments = () => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            status: filters.status !== 'all' ? filters.status : undefined
        };
        if (filters.search) params.search = filters.search;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        dispatch(getAllAppointments(params));
    };

    const calculateStats = () => {
        const total = appointments.length;
        const pending = appointments.filter(apt => apt.status === 'pending').length;
        const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
        const completed = appointments.filter(apt => apt.status === 'completed').length;
        const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
        const totalRevenue = appointments
            .filter(apt => apt.paymentStatus === 'completed')
            .reduce((sum, apt) => sum + apt.amount, 0);

        setStats({
            total,
            pending,
            confirmed,
            completed,
            cancelled,
            totalRevenue
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
        fetchAppointments();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value, page: 1 });
    };

    const handleResetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            status: 'all',
            search: '',
            startDate: '',
            endDate: ''
        });
        setTimeout(() => fetchAppointments(), 100);
    };

    const viewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
        // Delay scaling so CSS transitions trigger correctly
        setTimeout(() => setIsModalVisible(true), 10);
    };

    const closeDetails = () => {
        setIsModalVisible(false);
        // Wait for CSS transition to finish before unmounting
        setTimeout(() => {
            setShowModal(false);
            setSelectedAppointment(null);
        }, 300);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            dispatch(deleteAppointment(id));
        }
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

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const exportToCSV = () => {
        const csvData = appointments.map(apt => ({
            'Appointment ID': apt._id,
            'Patient Name': apt.patientId?.name || 'N/A',
            'Patient Email': apt.patientId?.email || 'N/A',
            'Doctor Name': apt.doctorId?.name || 'N/A',
            'Doctor Specialization': apt.doctorId?.specialization || 'N/A',
            'Date': new Date(apt.date).toLocaleDateString(),
            'Time': apt.time,
            'Status': apt.status,
            'Payment Status': apt.paymentStatus,
            'Amount': apt.amount,
            'Problem Description': apt.problemDescription
        }));

        const headers = Object.keys(csvData[0]);
        const csvContent = [
            headers.join(','),
            ...csvData.map(row =>
                headers.map(header => {
                    const value = row[header]?.toString() || '';
                    return value.includes(',') ? `"${value}"` : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">All Appointments</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        View and manage all appointments across the platform
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 group flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-500 transition-colors">Total</p>
                        <p className="text-3xl font-extrabold text-indigo-600 mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 group flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-yellow-500 transition-colors">Pending</p>
                        <p className="text-3xl font-extrabold text-yellow-600 mt-1">{stats.pending}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 group flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-green-500 transition-colors">Confirmed</p>
                        <p className="text-3xl font-extrabold text-green-600 mt-1">{stats.confirmed}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 group flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">Completed</p>
                        <p className="text-3xl font-extrabold text-blue-600 mt-1">{stats.completed}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 group flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-red-500 transition-colors">Cancelled</p>
                        <p className="text-3xl font-extrabold text-red-600 mt-1">{stats.cancelled}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 group flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-purple-500 transition-colors">Revenue</p>
                        <p className="text-2xl font-extrabold text-purple-600 mt-1">
                            ₹{stats.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-6 mb-8 relative z-30">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by patient or doctor..."
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all duration-300"
                                />
                                <FaSearch className="absolute left-4 top-4 text-gray-400" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                    className="w-full pl-5 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all duration-300 text-left flex justify-between items-center"
                                >
                                    <span className="capitalize text-gray-700 font-medium">{filters.status === 'all' ? 'All Status' : filters.status}</span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                <div className={`absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-indigo-50 rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden transition-all duration-300 origin-top transform ${isStatusDropdownOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}`}>
                                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((statusOption) => (
                                        <button
                                            key={statusOption}
                                            type="button"
                                            onClick={() => {
                                                handleFilterChange({ target: { name: 'status', value: statusOption } });
                                                setIsStatusDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-3 hover:bg-indigo-50/50 transition-colors capitalize ${filters.status === statusOption ? 'text-indigo-600 font-bold bg-indigo-50/30' : 'text-gray-700 font-medium'}`}
                                        >
                                            {statusOption === 'all' ? 'All Status' : statusOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all duration-300"
                                placeholder="Start Date"
                            />

                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all duration-300"
                                placeholder="End Date"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            <div className="flex space-x-3 w-full sm:w-auto">
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:shadow-md transition-all duration-300"
                                >
                                    Reset
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={exportToCSV}
                                className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-2xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
                            >
                                <FaDownload className="h-4 w-4" />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Appointments Table */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Doctor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-3xl">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/50 divide-y divide-gray-100">
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-medium">
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((appointment) => (
                                        <tr key={appointment._id} className="hover:bg-indigo-50/30 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={appointment.patientId?.photo}
                                                        alt={appointment.patientId?.name}
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                                                    />
                                                    <div className="ml-4">
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {appointment.patientId?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {appointment.patientId?.email || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={appointment.doctorId?.photo}
                                                        alt={appointment.doctorId?.name}
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                                                    />
                                                    <div className="ml-4">
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {appointment.doctorId?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-indigo-600 font-medium mt-0.5">
                                                            {appointment.doctorId?.specialization || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {new Date(appointment.date).toLocaleDateString(undefined, {
                                                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                                    <FaClock className="h-3 w-3 mr-1" />
                                                    {appointment.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                                                    {appointment.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                                    ₹{appointment.amount}
                                                </span>
                                            </td>
                                            <td className="px-6 flex gap-4 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => viewDetails(appointment)}
                                                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors duration-200 font-semibold shadow-sm"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                    <span className="text-sm">View</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appointment._id)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 px-3 py-2 rounded-xl transition-colors duration-200 shadow-sm"
                                                    title="Delete Appointment"
                                                >
                                                    <FaTimes className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Appointment Details Modal */}
                {showModal && selectedAppointment && (
                    <div className={`fixed inset-0 bg-black/40  backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Add overlay click to close */}
                        <div className="absolute inset-0" onClick={closeDetails}></div>

                        <div className={`relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-white/20 transform transition-all duration-300 overflow-hidden flex flex-col ${isModalVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}>
                            <div className="p-8 overflow-y-auto">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Appointment Details</h2>
                                    <button
                                        onClick={closeDetails}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Patient Information */}
                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <div className="bg-indigo-100 p-2 rounded-lg mr-3 shadow-sm">
                                                <FaUser className="text-indigo-600 h-4 w-4" />
                                            </div>
                                            Patient Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</p>
                                                <p className="font-bold text-gray-900">{selectedAppointment.patientId?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                                                <p className="font-bold text-gray-900">{selectedAppointment.patientId?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                                                <p className="font-bold text-gray-900">{selectedAppointment.patientId?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Doctor Information */}
                                    <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100/50 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <div className="bg-purple-100 p-2 rounded-lg mr-3 shadow-sm">
                                                <FaUserMd className="text-purple-600 h-4 w-4" />
                                            </div>
                                            Doctor Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</p>
                                                <p className="font-bold text-gray-900">{selectedAppointment.doctorId?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Specialization</p>
                                                <p className="font-bold text-indigo-600">{selectedAppointment.doctorId?.specialization}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                                                <p className="font-bold text-gray-900">{selectedAppointment.doctorId?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Information */}
                                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <div className="bg-blue-100 p-2 rounded-lg mr-3 shadow-sm">
                                                <FaCalendarAlt className="text-blue-600 h-4 w-4" />
                                            </div>
                                            Appointment Information
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                                                <p className="font-bold text-gray-900">
                                                    {new Date(selectedAppointment.date).toLocaleDateString(undefined, {
                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</p>
                                                <p className="font-bold text-gray-900">{selectedAppointment.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 shadow-sm ${getStatusColor(selectedAppointment.status)}`}>
                                                    {selectedAppointment.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment Status</p>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block mt-1 shadow-sm ${getPaymentStatusColor(selectedAppointment.paymentStatus)}`}>
                                                    {selectedAppointment.paymentStatus.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                                                <p className="font-extrabold text-lg text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-lg inline-block">₹{selectedAppointment.amount}</p>
                                            </div>
                                            {selectedAppointment.paymentId && (
                                                <div className="col-span-2 md:col-span-1 border-t border-gray-200 md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment ID</p>
                                                    <p className="font-mono text-xs text-gray-600 break-all bg-gray-100/50 px-2 py-1 rounded-md">{selectedAppointment.paymentId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Problem Description */}
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-3">Problem Description</h3>
                                        <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                                            {selectedAppointment.problemDescription || <span className="text-gray-400 italic">No description provided.</span>}
                                        </p>
                                    </div>

                                    {/* Timestamps */}
                                    <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 rounded-xl p-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">Created:</span>
                                            <span>{new Date(selectedAppointment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                            <span className="font-medium">Last Updated:</span>
                                            <span>{new Date(selectedAppointment.updatedAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllAppointments;