import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaEye, FaClock, FaCheckCircle } from 'react-icons/fa';
import { getDoctorAppointments, updateAppointmentStatus } from '../../redux/slices/doctorSlice';
import Spinner from '../common/Spinner';

const DoctorAppointments = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading } = useSelector((state) => state.doctor);
    const [filter, setFilter] = useState('all');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        setLocalLoading(true);
        const params = filter === 'all' ? {} : { status: filter };
        dispatch(getDoctorAppointments(params))
            .unwrap()
            .then(() => setLocalLoading(false))
            .catch(() => setLocalLoading(false));
    }, [dispatch, filter]);

    const handleStatusUpdate = (id, status) => {
        dispatch(updateAppointmentStatus({ id, status }));
    };

    const handleCheckPatient = (id, isChecked) => {
        dispatch(updateAppointmentStatus({ id, isChecked: !isChecked }));
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'confirmed': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (isLoading || localLoading) {
        return <Spinner />;
    }

    const filters = [
        { id: 'all', label: 'All Sessions', count: appointments?.length || 0 },
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[120px] -ml-40 -mt-40 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-50 rounded-full blur-[100px] -mr-20 -mb-20 opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="mb-10 bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] shadow-sm border border-white/80 transition-all hover:shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100/50">
                                Patient Management
                            </span>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Appointments</span>
                            </h1>
                            <p className="text-gray-500 mt-2 text-lg font-medium italic">Track and manage your upcoming and past medical consultations.</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Found</p>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter">{appointments?.length || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                <FaClock className="text-white text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Filter Navigation */}
                    <div className="mt-12 flex flex-wrap gap-3 p-2 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                    ${filter === f.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105'
                                        : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-100 hover:text-gray-900 group'
                                    }`}
                            >
                                {f.label}
                                {f.id === 'all' && appointments?.length > 0 &&
                                    <span className={`ml-2 px-2 py-0.5 rounded-md text-[8px] ${filter === f.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                        {f.count}
                                    </span>
                                }
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments Table Section */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-sm border border-white/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Schedule</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Billing & Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {!appointments || appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-24 text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                                <FaClock className="text-3xl" />
                                            </div>
                                            <h2 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-widest">No Sessions Found</h2>
                                            <p className="text-gray-400 font-medium">No appointments match your current filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((appointment) => (
                                        <tr
                                            key={appointment._id}
                                            className="group hover:bg-indigo-50/30 transition-colors duration-300"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        <img
                                                            src={appointment.patientId?.photo || `https://ui-avatars.com/api/?name=${appointment.patientId?.name}&background=6366f1&color=fff&size=64`}
                                                            alt={appointment.patientId?.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black text-gray-900 tracking-tight leading-none mb-1">
                                                            {appointment.patientId?.name || 'Anonymous'}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {appointment.patientId?.email?.slice(0, 20) || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 tracking-tight">
                                                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">
                                                        {appointment.time}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-black text-gray-900 whitespace-nowrap">₹{appointment.amount?.toLocaleString()}</span>
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${appointment.paymentStatus === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                            {appointment.paymentStatus}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${getStatusStyles(appointment.status)}`}>
                                                            {appointment.status}
                                                        </span>
                                                        {appointment.isChecked && (
                                                            <span className="ml-2 text-emerald-500" title="Checked In">
                                                                <FaCheckCircle className="text-xs" />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {appointment.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                                title="Confirm Session"
                                                            >
                                                                <FaCheck className="text-sm" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                                title="Cancel Session"
                                                            >
                                                                <FaTimes className="text-sm" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {appointment.status === 'confirmed' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                                className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-sm"
                                                                title="Mark Completed"
                                                            >
                                                                <FaCheckCircle className="text-sm" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCheckPatient(appointment._id, appointment.isChecked)}
                                                                className={`p-2.5 rounded-xl transition-all shadow-sm ${appointment.isChecked ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                                                title={appointment.isChecked ? "Checked In" : "Mark Check In"}
                                                            >
                                                                <FaClock className="text-sm" />
                                                            </button>
                                                        </>
                                                    )}

                                                    <Link
                                                        to={`/doctor/appointments/${appointment._id}`}
                                                        className="p-2.5 bg-white border border-gray-100 text-gray-400 rounded-xl hover:border-indigo-100 hover:text-indigo-600 transition-all shadow-sm"
                                                        title="View Portal"
                                                    >
                                                        <FaEye className="text-sm" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;