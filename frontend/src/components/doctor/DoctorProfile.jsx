import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaPlus, FaTrash, FaClock } from 'react-icons/fa';
import { updateDoctorProfile } from '../../redux/slices/doctorSlice';
import { uploadProfilePhoto } from '../../redux/slices/userSlice';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.doctor);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        specialization: user?.specialization || '',
        experience: user?.experience || 0,
        qualification: user?.qualification || '',
        consultationFees: user?.consultationFees || 0,
        availableSlots: user?.availableSlots || [],
    });

    const [newSlot, setNewSlot] = useState({
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
    });

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(user?.photo || '');

    const daysOfWeek = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                specialization: user.specialization || '',
                experience: user.experience || 0,
                qualification: user.qualification || '',
                consultationFees: user.consultationFees || 0,
                availableSlots: user.availableSlots || [],
            });
            setPhotoPreview(user.photo || '');
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleAddSlot = () => {
        // Check if slot for this day already exists
        const slotExists = formData.availableSlots.some(
            slot => slot.day === newSlot.day
        );

        if (slotExists) {
            toast.error(`Slot for ${newSlot.day} already exists`);
            return;
        }

        setFormData({
            ...formData,
            availableSlots: [...formData.availableSlots, newSlot],
        });

        // Reset form
        setNewSlot({
            day: 'Monday',
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true,
        });
    };

    const handleRemoveSlot = (index) => {
        const updatedSlots = formData.availableSlots.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            availableSlots: updatedSlots,
        });
    };

    const handleSlotChange = (e) => {
        setNewSlot({
            ...newSlot,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Upload photo if selected
        if (photo) {
            const photoData = new FormData();
            photoData.append('photo', photo);
            await dispatch(uploadProfilePhoto(photoData));
        }

        // Update profile
        await dispatch(updateDoctorProfile(formData));
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-50"></div>

            <div className=" px-4 sm:px-6 lg:px-18 relative z-10">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            Professional Settings
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Profile</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Manage your professional presence and consultation schedule.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Photo & Core Info */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Photo Card */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-white/80 transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                                <span className="w-1 h-5 bg-indigo-600 rounded-full mr-3"></span>
                                Profile Photo
                            </h2>
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                    <div className="relative">
                                        <img
                                            src={photoPreview || `https://ui-avatars.com/api/?name=${formData.name}&background=6366f1&color=fff&size=128`}
                                            alt="Profile"
                                            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-2xl relative z-10"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="absolute bottom-0 right-0 z-20 bg-gray-900 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-indigo-600 transition-colors shadow-lg border-2 border-white"
                                        >
                                            <input
                                                id="photo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-sm font-bold text-gray-900 capitalize">{formData.specialization || 'Professional Specialist'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Practice ID: {user?._id?.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                            <h3 className="text-white font-black text-lg mb-6 relative z-10">Quick Summary</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Consultation Fee</p>
                                    <p className="text-xl font-black text-white">₹{formData.consultationFees || 0}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Slots</p>
                                    <p className="text-xl font-black text-white">{formData.availableSlots.length} Regular</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Section: General Info */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100/50">
                            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                                <span className="w-1 h-6 bg-indigo-600 rounded-full mr-4"></span>
                                Personal Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        placeholder="doctor@example.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="my-10 border-gray-50" />

                            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                                <span className="w-1 h-6 bg-purple-600 rounded-full mr-4"></span>
                                Professional Expertise
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        placeholder="e.g. Cardiologist"
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        placeholder="e.g. MBBS, MD"
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Consultation Fees (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="consultationFees"
                                            value={formData.consultationFees}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full pl-9 pr-5 py-3.5 bg-gray-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-2xl text-indigo-600"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Availability Section */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100/50">
                            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                                <span className="w-1 h-6 bg-emerald-500 rounded-full mr-4"></span>
                                Schedule Management
                            </h2>

                            {/* Slot Creation Form */}
                            <div className="bg-emerald-50/30 border border-emerald-100/50 p-8 rounded-[2rem] mb-10">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-6">Create New Time Slot</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest ml-1">Day</label>
                                        <select
                                            name="day"
                                            value={newSlot.day}
                                            onChange={handleSlotChange}
                                            className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-900 text-sm appearance-none cursor-pointer"
                                        >
                                            {daysOfWeek.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest ml-1">Start Time</label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={newSlot.startTime}
                                            onChange={handleSlotChange}
                                            className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-900 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest ml-1">End Time</label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={newSlot.endTime}
                                            onChange={handleSlotChange}
                                            className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-900 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={handleAddSlot}
                                            className="w-full h-[46px] bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center space-x-2"
                                        >
                                            <FaPlus className="h-3 w-3" />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Slot List */}
                            <div className="space-y-4">
                                {formData.availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.availableSlots.map((slot, index) => (
                                            <div
                                                key={index}
                                                className="group flex items-center justify-between bg-gray-50/50 border border-gray-100 p-5 rounded-3xl hover:bg-indigo-50/30 hover:border-indigo-100 transition-all"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                                        <FaClock className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-900 tracking-tight">{slot.day}</div>
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            {slot.startTime} - {slot.endTime}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSlot(index)}
                                                    className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                >
                                                    <FaTrash className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <FaClock className="h-6 w-6" />
                                        </div>
                                        <p className="text-gray-900 font-bold">No Schedule Configured</p>
                                        <p className="text-gray-400 text-sm mt-1">Add your working hours to start receiving appointments.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Syncing Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="h-4 w-4" />
                                        <span>Save Professional Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;