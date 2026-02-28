import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    FaUserMd,
    FaUsers,
    FaCalendarCheck,
    FaClock,
    FaRupeeSign,
    FaChartBar,
    FaUserCheck,
    FaUserTimes
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getAdminDashboard } from '../../redux/slices/adminSlice';
import Spinner from '../common/Spinner';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { dashboard, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getAdminDashboard());
    }, [dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    const stats = [
        {
            title: 'Total Doctors',
            value: dashboard.stats?.totalDoctors || 0,
            icon: FaUserMd,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Patients',
            value: dashboard.stats?.totalPatients || 0,
            icon: FaUsers,
            color: 'bg-green-500',
        },
        {
            title: 'Total Appointments',
            value: dashboard.stats?.totalAppointments || 0,
            icon: FaCalendarCheck,
            color: 'bg-purple-500',
        },
        {
            title: 'Pending Approvals',
            value: dashboard.stats?.pendingApprovals || 0,
            icon: FaClock,
            color: 'bg-yellow-500',
        },
        {
            title: 'Total Revenue',
            value: `₹${dashboard.stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: FaRupeeSign,
            color: 'bg-orange-500',
        },
    ];

    // Monthly Revenue Chart Data
    const monthlyRevenueData = {
        labels: dashboard.monthlyRevenue?.map(item =>
            `${item._id.month}/${item._id.year}`
        ).reverse() || [],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: dashboard.monthlyRevenue?.map(item => item.total).reverse() || [],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    // Appointment Status Chart Data
    const appointmentStatusData = {
        labels: dashboard.appointmentStats?.map(item => item._id) || [],
        datasets: [
            {
                data: dashboard.appointmentStats?.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Revenue',
            },
        },
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Manage your healthcare platform efficiently
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500 p-6 flex items-center justify-between group cursor-pointer"
                        >
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-extrabold text-gray-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                <stat.icon className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Link
                        to="/admin/approve-doctors"
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500 p-6 flex items-center space-x-5 group"
                    >
                        <div className="bg-yellow-100 p-4 rounded-2xl group-hover:bg-yellow-200 transition-colors duration-300">
                            <FaUserCheck className="h-7 w-7 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Pending Approvals</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboard.stats?.pendingApprovals} doctors waiting
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500 p-6 flex items-center space-x-5 group"
                    >
                        <div className="bg-green-100 p-4 rounded-2xl group-hover:bg-green-200 transition-colors duration-300">
                            <FaUsers className="h-7 w-7 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Manage Users</h3>
                            <p className="text-sm text-gray-500 mt-1">View all users</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/appointments"
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500 p-6 flex items-center space-x-5 group"
                    >
                        <div className="bg-purple-100 p-4 rounded-2xl group-hover:bg-purple-200 transition-colors duration-300">
                            <FaCalendarCheck className="h-7 w-7 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Appointments</h3>
                            <p className="text-sm text-gray-500 mt-1">View all bookings</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/revenue"
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500 p-6 flex items-center space-x-5 group"
                    >
                        <div className="bg-orange-100 p-4 rounded-2xl group-hover:bg-orange-200 transition-colors duration-300">
                            <FaChartBar className="h-7 w-7 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Revenue Analytics</h3>
                            <p className="text-sm text-gray-500 mt-1">Track earnings</p>
                        </div>
                    </Link>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Revenue Chart */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue</h2>
                        {dashboard.monthlyRevenue?.length > 0 ? (
                            <div className="h-72">
                                <Bar data={monthlyRevenueData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">No revenue data available</p>
                        )}
                    </div>

                    {/* Appointment Status Chart */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Status</h2>
                        {dashboard.appointmentStats?.length > 0 ? (
                            <div className="h-72 flex justify-center">
                                <Pie data={appointmentStatusData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">No appointment data available</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Platform Activity</h2>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-gray-100 hover:bg-gray-50/50 p-4 rounded-2xl transition-colors duration-300 -mx-4 group">
                            <div className="flex items-center space-x-5">
                                <div className="bg-yellow-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <FaUserCheck className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">New Doctor Registrations</p>
                                    <p className="text-sm text-gray-500 mt-0.5">5 doctors pending approval</p>
                                </div>
                            </div>
                            <Link to="/admin/approve-doctors" className="text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors duration-300 shadow-sm">
                                Review &rarr;
                            </Link>
                        </div>

                        <div className="flex items-center justify-between border-b border-gray-100 hover:bg-gray-50/50 p-4 rounded-2xl transition-colors duration-300 -mx-4 group">
                            <div className="flex items-center space-x-5">
                                <div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <FaCalendarCheck className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">Today's Appointments</p>
                                    <p className="text-sm text-gray-500 mt-0.5">12 appointments scheduled</p>
                                </div>
                            </div>
                            <Link to="/admin/appointments" className="text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors duration-300 shadow-sm">
                                View &rarr;
                            </Link>
                        </div>

                        <div className="flex items-center justify-between hover:bg-gray-50/50 p-4 rounded-2xl transition-colors duration-300 -mx-4 group">
                            <div className="flex items-center space-x-5">
                                <div className="bg-orange-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <FaRupeeSign className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">Revenue Today</p>
                                    <p className="text-sm text-gray-500 mt-0.5">₹12,450 earned</p>
                                </div>
                            </div>
                            <Link to="/admin/revenue" className="text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors duration-300 shadow-sm">
                                Details &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;