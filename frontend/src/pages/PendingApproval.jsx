import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
    FaClock,
    FaEnvelope,
    FaArrowLeft,
    FaCheckCircle,
    FaUserShield,
    FaStethoscope,
    FaShieldAlt,
    FaSignOutAlt
} from 'react-icons/fa';

const PendingApproval = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogoutAndLogin = () => {
        dispatch(logout());
        navigate('/login');
    };

    const steps = [
        { title: 'Application Submitted', desc: 'Credentials received', status: 'completed', icon: FaCheckCircle },
        { title: 'Verifying Documents', desc: 'Auth team reviewing details', status: 'current', icon: FaUserShield },
        { title: 'System Access', desc: 'Dashboard activation', status: 'pending', icon: FaStethoscope },
    ];

    return (
        <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            {/* Mesh Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-indigo-100/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-purple-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl transform animate-fadeIn">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-white overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Left Side: Brand & Status Illustration */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50/50 to-white/50 p-8 md:p-12 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-slate-100">
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping scale-75 opacity-20"></div>
                                <div className="absolute inset-0 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin-slow"></div>
                                <div className="relative flex items-center justify-center h-full w-full rounded-full bg-white shadow-sm">
                                    <FaShieldAlt className="h-12 w-12 text-indigo-600" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                                Verification <br /> in Progress
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                Our medical board is currently verifying your professional credentials.
                            </p>
                        </div>

                        {/* Right Side: Process & Info */}
                        <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                            {/* Visual Roadmap */}
                            <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10 relative">
                                <div className="hidden sm:block absolute top-[1.5rem] left-[10%] right-[10%] h-px bg-slate-100 z-0"></div>

                                {steps.map((step, idx) => (
                                    <div key={idx} className="relative z-10 flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-2 flex-1">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${step.status === 'completed' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' :
                                            step.status === 'current' ? 'border-2 border-indigo-500 text-indigo-600 bg-white' :
                                                'bg-slate-50 border border-slate-200 text-slate-300'
                                            }`}>
                                            <step.icon className="text-sm" />
                                        </div>
                                        <div className="sm:mt-2">
                                            <h4 className={`text-[13px] font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                                                {step.title}
                                            </h4>
                                            <p className="text-[9px] uppercase tracking-widest font-black text-slate-400">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Info Box */}
                            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 mb-8 flex items-center space-x-4">
                                <div className="bg-white p-2.5 rounded-lg shadow-sm shrink-0">
                                    <FaClock className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-800 text-xs">Estimated Wait: 24-48 Hours</h3>
                                    <p className="text-[11px] text-slate-500 leading-tight">We'll email you at your registered address once approved.</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
                                    <FaEnvelope className="h-3.5 w-3.5 opacity-70" />
                                    <a href="mailto:support@smartdoctor.com" className="hover:underline">support@smartdoctor.com</a>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Link to="/" className="text-slate-400 hover:text-slate-900 text-xs font-bold transition-colors">
                                        Back to Home
                                    </Link>
                                    <button
                                        onClick={handleLogoutAndLogin}
                                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl shadow-slate-200 hover:shadow-indigo-100 transition-all active:scale-95 flex items-center"
                                    >
                                        <FaSignOutAlt className="mr-2 opacity-70" />
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                    System Verification Protocol v2.4
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
