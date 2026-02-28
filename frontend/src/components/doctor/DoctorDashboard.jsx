import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    FaCalendarCheck,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaRupeeSign,
    FaStar,
    FaUser,
    FaChartLine
} from 'react-icons/fa';
import { getDoctorDashboard } from '../../redux/slices/doctorSlice';
import Spinner from '../common/Spinner';

const DoctorDashboard = () => {
    const dispatch = useDispatch();
    const { dashboard, isLoading } = useSelector((state) => state.doctor);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getDoctorDashboard());
    }, [dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    const stats = [
        {
            title: 'Total Appointments',
            value: dashboard.stats?.totalAppointments || 0,
            icon: FaCalendarCheck,
            gradient: 'from-blue-600 to-indigo-600',
            shadow: 'shadow-blue-200',
        },
        {
            title: 'Completed',
            value: dashboard.stats?.completedAppointments || 0,
            icon: FaCheckCircle,
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-200',
        },
        {
            title: 'Pending',
            value: dashboard.stats?.pendingAppointments || 0,
            icon: FaClock,
            gradient: 'from-amber-400 to-orange-500',
            shadow: 'shadow-amber-200',
        },
        {
            title: 'Cancelled',
            value: dashboard.stats?.cancelledAppointments || 0,
            icon: FaTimesCircle,
            gradient: 'from-rose-500 to-red-600',
            shadow: 'shadow-rose-200',
        },
        {
            title: 'Total Earnings',
            value: `₹${(dashboard.stats?.totalEarnings || 0).toLocaleString()}`,
            icon: FaRupeeSign,
            gradient: 'from-indigo-600 to-purple-700',
            shadow: 'shadow-indigo-200',
        },
        {
            title: 'Average Rating',
            value: dashboard.stats?.averageRating?.toFixed(1) || '0.0',
            icon: FaStar,
            gradient: 'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-200',
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[120px] -ml-40 -mt-40 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-50 rounded-full blur-[100px] -mr-20 -mb-20 opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="mb-12 bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] shadow-sm border border-white/80 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-50/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">
                                Practice Overview
                            </span>
                            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">Dr. {user?.name}</span>
                            </h1>
                            <p className="text-gray-500 mt-3 text-lg font-medium">
                                Here's what's happening with your practice dashboard today.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Date</p>
                                <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <FaCalendarCheck className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats & Quick Actions Stack */}
                <div className="space-y-8 mb-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:${stat.shadow} hover:-translate-y-1 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Portal Row (3 Columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/doctor/appointments"
                            className="bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden group border border-gray-100 hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-center space-x-4 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                                    <FaCalendarCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-base tracking-tight">View Appointments</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Manage your appointments</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/doctor/profile"
                            className="bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden group border border-gray-100 hover:shadow-xl hover:shadow-emerald-50/50 hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-center space-x-4 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                    <FaUser className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-base tracking-tight">Update Profile</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Edit your availability</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/doctor/earnings"
                            className="bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden group border border-gray-100 hover:shadow-xl hover:shadow-purple-50/50 hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-center space-x-4 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                                    <FaChartLine className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-base tracking-tight">View Earnings</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Check your revenue</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Activity & Insights Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Appointments Table Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Patient Activity</h2>
                                <Link to="/doctor/appointments" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center group">
                                    View All <FaChartLine className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {dashboard.recentAppointments?.length > 0 ? (
                                <div className="overflow-x-auto px-6 pb-6 pt-2">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Details</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                                                <th className="px-6 py-1 text-left"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {dashboard.recentAppointments.map((appointment) => (
                                                <tr key={appointment._id} className="group hover:bg-indigo-50/30 transition-colors">
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-12 w-12 rounded-[1.25rem] bg-indigo-50 border-2 border-white shadow-sm flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                                                <img
                                                                    className="h-full w-full object-cover"
                                                                    src={appointment.patientId?.photo || `https://ui-avatars.com/api/?name=${appointment.patientId?.name}&background=6366f1&color=fff`}
                                                                    alt={appointment.patientId?.name}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                                                    {appointment.patientId?.name}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400 font-medium">Regular Patient</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {new Date(appointment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </div>
                                                        <div className="text-xs text-gray-400 flex items-center mt-0.5">
                                                            <FaClock className="h-2.5 w-2.5 mr-1" /> {appointment.time}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                                                            ${appointment.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700' : ''}
                                                            ${appointment.status === 'pending' ? 'bg-amber-50 text-amber-700' : ''}
                                                            ${appointment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : ''}
                                                            ${appointment.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : ''}
                                                        `}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`w-2 h-2 rounded-full ${appointment.paymentStatus === 'completed' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>
                                                            <span className="text-xs font-bold text-gray-700 capitalize">{appointment.paymentStatus}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            to={`/doctor/appointments/${appointment._id}`}
                                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                                        >
                                                            Portal
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-300">
                                        <FaCalendarCheck className="h-8 w-8" />
                                    </div>
                                    <p className="text-gray-900 font-bold text-xl">No Appointments Today</p>
                                    <p className="text-gray-400 mt-2 font-medium">Relax, there are no upcoming sessions for now.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Insight Card Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mb-8 group-hover:scale-150 transition-transform"></div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                                    <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
                                    AI Insight
                                </h4>
                                <div className="space-y-6">
                                    <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                                        <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">Performance</p>
                                        <p className="text-sm font-medium text-indigo-900 leading-relaxed italic">
                                            "Your patient satisfaction is top-tier this month. Consistent replies are driving rating growth."
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end px-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Profit</p>
                                            <p className="text-2xl font-black text-gray-900 tracking-tighter">+ 12.5%</p>
                                        </div>
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <FaChartLine className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;