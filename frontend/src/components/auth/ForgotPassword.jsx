import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { forgotPassword, reset } from '../../redux/slices/authSlice';
import Spinner from '../common/Spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="h-screen w-full flex bg-white overflow-hidden">
                {/* Left Info Panel */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-indigo-400 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                    <div className="relative z-10 max-w-lg flex flex-col items-center text-center">
                        <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md shadow-2xl border border-white/20 mb-8">
                            <FaEnvelope className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">Check Your Inbox</h1>
                        <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-6">
                            We've sent a password reset link to your email. Please follow the link to regain access to your account.
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-gray-50/50">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -ml-20 -mb-20"></div>

                    <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white relative z-10 text-center">
                        <div className="bg-green-100/80 border border-green-200 text-green-700 px-6 py-5 rounded-2xl mb-8 shadow-sm">
                            <p className="font-bold text-lg mb-2 text-green-800">Email Sent!</p>
                            <p className="text-sm font-medium">
                                We've sent a password reset link to <strong className="text-green-900 break-all">{email}</strong>. Please check your inbox.
                            </p>
                        </div>
                        <Link to="/login" className="inline-flex items-center justify-center py-3.5 px-6 font-bold rounded-2xl text-indigo-600 bg-white border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-300 w-full shadow-sm">
                            <FaArrowLeft className="mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden">
            {/* Left Info Panel */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-indigo-400 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <div className="relative z-10 max-w-lg flex flex-col items-center text-center">
                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md shadow-2xl border border-white/20 mb-8 transform hover:-translate-y-2 transition-transform duration-500">
                        <FaEnvelope className="h-16 w-16 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">Forgot Password?</h1>
                    <p className="text-indigo-100 text-lg font-medium leading-relaxed">
                        Don't worry, it happens to the best of us. Just enter your email and we'll send you a link to reset your password.
                    </p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-gray-50/50">
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -ml-20 -mb-20"></div>

                <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white relative z-10">
                    <div className="mb-8">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-200">
                                <FaEnvelope className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center lg:text-left">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium text-center lg:text-left">
                            Enter the email associated with your account.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:hover:-translate-y-0 text-lg"
                            >
                                {isLoading ? <Spinner /> : 'Send Reset Link'}
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <Link to="/login" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-purple-600 transition-colors">
                                <FaArrowLeft className="mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;