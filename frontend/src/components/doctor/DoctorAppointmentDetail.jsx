// src/components/doctor/DoctorAppointmentDetail.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaCheckCircle, FaPhone, FaNotesMedical, FaCalendarAlt, FaClock, FaRupeeSign, FaCheck, FaTimes } from 'react-icons/fa';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';
import { getAppointmentById } from '../../redux/slices/doctorSlice';

const DoctorAppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointmentDetails();
    }, [id]);

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const result = await dispatch(getAppointmentById(id)).unwrap();
            setAppointment(result);
        } catch (error) {
            toast.error('Failed to fetch appointment details');
            console.error(error);
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return <Spinner />;
    }

    if (!appointment) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
                <div className="bg-white/70 backdrop-blur-2xl p-12 rounded-[3rem] shadow-xl border border-white max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTimes className="text-rose-500 text-3xl" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Not Found</h2>
                    <p className="text-gray-500 font-medium mb-8">This appointment could not be located in our records.</p>
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                        Return to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-50"></div>

            <div className="px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Back Link & Breadcrumb */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className="group flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-widest">Back to Portal</span>
                    </button>
                    <div className="flex items-center space-x-2">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(appointment.status)}`}>
                            {appointment.status}
                        </span>
                    </div>
                </div>

                {/* Compact Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Patient & Clinical Notes (Span 7) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Compact Patient Card */}
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-6 shadow-sm border border-white/80 group hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>

                            <div className="relative z-10 flex items-center space-x-6">
                                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={appointment.patientId?.photo || `https://ui-avatars.com/api/?name=${appointment.patientId?.name}&background=6366f1&color=fff&size=80`}
                                        alt={appointment.patientId?.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-md mb-2">Patient Profile</span>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">{appointment.patientId?.name}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                            <FaEnvelope className="mr-1.5 text-gray-300" /> {appointment.patientId?.email}
                                        </div>
                                        <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                            <FaPhone className="mr-1.5 text-gray-300" /> {appointment.patientId?.phone || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Notes Card */}
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 shadow-sm border border-white/80">
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center">
                                <span className="w-1 h-3 bg-indigo-600 rounded-full mr-3"></span>
                                Clinical Observations
                            </h3>
                            <div className="relative p-6 bg-indigo-50/30 rounded-2xl border border-indigo-50/50">
                                <FaNotesMedical className="absolute top-4 right-4 text-indigo-100 text-3xl" />
                                <p className="text-base font-medium text-gray-600 italic leading-relaxed relative z-10">
                                    "{appointment.problemDescription || 'No detailed clinical notes provided by the patient for this session.'}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Schedule & Billing (Span 5) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Compact Schedule Card */}
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-6 shadow-sm border border-white/80">
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center">
                                <span className="w-1 h-3 bg-purple-600 rounded-full mr-3"></span>
                                Session Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                    <FaCalendarAlt className="text-indigo-600 mb-3 text-lg group-hover:scale-110 transition-transform" />
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-black text-gray-900 leading-tight">
                                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                    <FaClock className="text-purple-600 mb-3 text-lg group-hover:scale-110 transition-transform" />
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-sm font-black text-gray-900 leading-tight">{appointment.time}</p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 shadow-xl shadow-indigo-100 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700"></div>
                            <h3 className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Financial Status</h3>
                            <div className="flex items-end justify-between relative z-10">
                                <div>
                                    <div className="text-4xl font-black tracking-tighter mb-2">₹{appointment.amount?.toLocaleString()}</div>
                                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20
                                        ${appointment.paymentStatus === 'completed' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300 animate-pulse'}
                                    `}>
                                        <FaCheckCircle className="mr-2" /> {appointment.paymentStatus}
                                    </span>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-xl border border-white/20">
                                    <FaRupeeSign />
                                </div>
                            </div>
                        </div>

                        {/* Compact Actions Section */}
                        <div className="flex gap-3">
                            {appointment.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center"
                                    >
                                        <FaCheck className="mr-2" /> Confirm
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                        className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                    >
                                        <FaTimes className="mr-2" /> Cancel
                                    </button>
                                </>
                            )}
                            {appointment.status === 'confirmed' && (
                                <button
                                    onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center"
                                >
                                    <FaCheckCircle className="mr-2" /> Settle Session
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointmentDetail;