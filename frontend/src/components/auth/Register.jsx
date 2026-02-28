import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserMd, FaUser, FaEnvelope, FaLock, FaPhone, FaStethoscope, FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';
import { register, reset } from '../../redux/slices/authSlice';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const Register = () => {
    const [role, setRole] = useState('patient');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        // Doctor specific fields
        specialization: '',
        experience: '',
        qualification: '',
        consultationFees: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            toast.success('Registration successful! Please login.');
            navigate('/login');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only JPG, PNG and GIF files are allowed');
                return;
            }

            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        // Create FormData for multipart/form-data
        const userData = new FormData();
        userData.append('name', formData.name);
        userData.append('email', formData.email);
        userData.append('password', formData.password);
        userData.append('phone', formData.phone);
        userData.append('role', role);

        // Add photo if selected
        if (photo) {
            userData.append('photo', photo);
        }

        // Add doctor specific fields
        if (role === 'doctor') {
            userData.append('specialization', formData.specialization);
            userData.append('experience', formData.experience);
            userData.append('qualification', formData.qualification);
            userData.append('consultationFees', formData.consultationFees);
        }

        dispatch(register(userData));
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
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">Join Smart Doctor</h1>
                    <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-10">
                        Unlock a world of better healthcare. Create an account to schedule appointments, manage your profile, and receive top-tier medical assistance.
                    </p>

                    <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10 text-left w-full max-w-sm">
                        <h3 className="font-bold text-white mb-4 text-lg">Why join us?</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-indigo-50"><span className="h-2 w-2 bg-green-400 rounded-full mr-3"></span> Fast & secure bookings</li>
                            <li className="flex items-center text-indigo-50"><span className="h-2 w-2 bg-purple-400 rounded-full mr-3"></span> Access to top specialists</li>
                            <li className="flex items-center text-indigo-50"><span className="h-2 w-2 bg-orange-400 rounded-full mr-3"></span> 24/7 medical support</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 lg:w-1/2 flex flex-col items-center overflow-y-auto overflow-x-hidden    h-full relative  bg-gray-50/50">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 opacity-30 rounded-full blur-3xl mix-blend-multiply pointer-events-none -ml-20 -mb-20"></div>

                <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white relative z-10 my-auto">
                    <div className="mb-6">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-200">
                                <FaUserMd className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center lg:text-left">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium text-center lg:text-left">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-purple-600 transition-colors duration-300">
                                Sign in now
                            </Link>
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex justify-center space-x-3 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('patient')}
                            className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${role === 'patient'
                                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-indigo-100 transform scale-100 relative z-10'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            <FaUser className={`mr-2 h-4 w-4 ${role === 'patient' ? 'text-indigo-500' : 'text-gray-400'}`} />
                            Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${role === 'doctor'
                                ? 'bg-white text-purple-600 shadow-md ring-1 ring-purple-100 transform scale-100 relative z-10'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            <FaStethoscope className={`mr-2 h-4 w-4 ${role === 'doctor' ? 'text-purple-500' : 'text-gray-400'}`} />
                            Doctor
                        </button>
                    </div>

                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center group mb-6">
                        <div className="relative">
                            <div className="p-1 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 shadow-xl shadow-indigo-100/50 group-hover:shadow-purple-200/50 transition-all duration-300">
                                <img
                                    src={photoPreview || (role === 'doctor' ? 'https://ui-avatars.com/api/?name=Dr&background=random' : 'https://ui-avatars.com/api/?name=User&background=random')}
                                    alt="Profile Preview"
                                    className="h-[4.5rem] w-[4.5rem] rounded-full object-cover border-4 border-white"
                                />
                            </div>
                            <label
                                htmlFor="photo-upload"
                                className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full cursor-pointer hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ring-2 ring-white"
                            >
                                <FaCamera className="h-3.5 w-3.5 drop-shadow-sm" />
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <FaPhone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 pr-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="Password (min 6)"
                                        minLength="6"
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

                            <div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3.5 pl-11 pr-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                        placeholder="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-indigo-500 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Doctor Specific Fields */}
                            {role === 'doctor' && (
                                <>
                                    <div className="md:col-span-2 pt-4 border-t border-gray-200">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <FaStethoscope className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                            </div>
                                            <input
                                                id="specialization"
                                                name="specialization"
                                                type="text"
                                                required
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                                placeholder="Speciality (e.g. Cardiology)"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold group-focus-within:text-indigo-500 transition-colors z-10">
                                                <span>#</span>
                                            </div>
                                            <input
                                                id="experience"
                                                name="experience"
                                                type="number"
                                                required
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                                placeholder="Years of Experience"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold group-focus-within:text-purple-500 transition-colors z-10">
                                                <span>Q</span>
                                            </div>
                                            <input
                                                id="qualification"
                                                name="qualification"
                                                type="text"
                                                required
                                                value={formData.qualification}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                                placeholder="Qualification (e.g. MBBS, MD)"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold group-focus-within:text-indigo-500 transition-colors z-10">
                                                <span>₹</span>
                                            </div>
                                            <input
                                                id="consultationFees"
                                                name="consultationFees"
                                                type="number"
                                                required
                                                value={formData.consultationFees}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3.5 pl-11 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm hover:border-gray-400"
                                                placeholder="Consultation Fees"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center ml-1 py-2">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-colors"
                            />
                            <label htmlFor="terms" className="ml-2 block text-xs font-medium text-gray-500">
                                I agree to the{' '}
                                <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Terms</span>
                                {' '} & {' '}
                                <span className="text-purple-600 font-bold cursor-pointer hover:underline">Privacy Policy</span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:-translate-y-0 transition-all duration-300 text-base"
                            >
                                {isLoading ? <Spinner size="small" /> : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;