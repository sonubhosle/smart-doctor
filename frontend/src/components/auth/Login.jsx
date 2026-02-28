import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserMd, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login, reset } from '../../redux/slices/authSlice';
import Spinner from '../common/Spinner';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (isSuccess || user) {
            if (user?.role === 'patient') {
                navigate('/patient/dashboard');
            } else if (user?.role === 'doctor') {
                if (user?.isApproved) {
                    navigate('/doctor/dashboard');
                } else {
                    navigate('/pending-approval');
                }
            } else if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            }
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden">
            {/* Left Info Panel */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-indigo-400 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <div className="relative z-10 max-w-lg flex flex-col items-center text-center">
                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md shadow-2xl border border-white/20 mb-8 transform hover:scale-105 transition-transform duration-500">
                        <FaUserMd className="h-16 w-16 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">Welcome to Smart Doctor</h1>
                    <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-10">
                        Experience the future of healthcare today. Manage your appointments, connect with specialists, and take control of your well-being.
                    </p>

                    <div className="flex items-center space-x-4 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" src="https://ui-avatars.com/api/?name=Dr+One&background=random" alt="Doctor" />
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" src="https://ui-avatars.com/api/?name=Dr+Two&background=random" alt="Doctor" />
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" src="https://ui-avatars.com/api/?name=Dr+Three&background=random" alt="Doctor" />
                        </div>
                        <p className="text-sm font-semibold text-indigo-50">+500 verified doctors</p>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-gray-50/50">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -ml-20 -mb-20"></div>

                <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white relative z-10">
                    <div>
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-200">
                                <FaUserMd className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center lg:text-left">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium text-center lg:text-left">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-indigo-600 hover:text-purple-600 transition-colors duration-300">
                                Create one now
                            </Link>
                        </p>
                    </div>

                    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
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
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 pr-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-purple-500 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-purple-600 transition-colors duration-300">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 text-lg"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;