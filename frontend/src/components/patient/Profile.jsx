import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSave } from 'react-icons/fa';
import { updateUserProfile, uploadProfilePhoto } from '../../redux/slices/userSlice';
import { changePassword } from '../../redux/slices/authSlice';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(user?.photo || '');

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            setPhotoPreview(user.photo || '');
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // Upload photo if selected
        if (photo) {
            const photoData = new FormData();
            photoData.append('photo', photo);
            await dispatch(uploadProfilePhoto(photoData));
        }

        // Update profile
        await dispatch(updateUserProfile(profileData));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        await dispatch(changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        }));

        // Clear form
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-80 bg-gradient-to-bl from-indigo-100 to-purple-50 opacity-60 rounded-bl-[10rem] pointer-events-none -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-indigo-50 rounded-tr-full opacity-40 blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="mb-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-70"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
                            My Profile
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </div>

                {/* Profile Photo */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 p-6 mb-6">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img
                                src={photoPreview || 'https://via.placeholder.com/100'}
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-indigo-50"
                            />
                            <label
                                htmlFor="photo-upload"
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
                            >
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                <FaCamera className="h-4 w-4" />
                            </label>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-gray-600 capitalize">{user?.role}</p>
                            {user?.role === 'doctor' && (
                                <p className="text-sm text-gray-500">
                                    {user?.specialization} • {user?.experience} years exp.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl flex space-x-1 shadow-sm border border-white/50 w-fit">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'profile'
                            ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50'
                            : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
                            }`}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'password'
                            ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50'
                            : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
                            }`}
                    >
                        Change Password
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 p-6">
                        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        className="pl-10 w-full px-4 py-2 border border-gray-200 bg-gray-50/50 focus:bg-white hover:border-indigo-300 shadow-sm transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        className="pl-10 w-full px-4 py-2 border border-gray-200 bg-gray-50/50 focus:bg-white hover:border-indigo-300 shadow-sm transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileChange}
                                        className="pl-10 w-full px-4 py-2 border border-gray-200 bg-gray-50/50 focus:bg-white hover:border-indigo-300 shadow-sm transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:from-indigo-700 hover:to-indigo-800 flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-medium"
                                >
                                    <FaSave className="h-4 w-4" />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 p-6">
                        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 focus:bg-white hover:border-indigo-300 shadow-sm transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 focus:bg-white hover:border-indigo-300 shadow-sm transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    minLength={6}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 6 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-200 bg-gray-50/50 focus:bg-white hover:border-indigo-300 shadow-sm transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:from-indigo-700 hover:to-indigo-800 flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-medium"
                                >
                                    <FaSave className="h-4 w-4" />
                                    <span>Update Password</span>
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;