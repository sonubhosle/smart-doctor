import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
    FaStar,
    FaRupeeSign,
    FaBriefcase,
    FaGraduationCap,
    FaClock,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaArrowLeft,
    FaCheckCircle,
    FaUserMd
} from 'react-icons/fa';
import { getDoctorById } from '../../redux/slices/userSlice';
import { getDoctorReviews } from '../../redux/slices/reviewSlice';
import Spinner from '../common/Spinner';

const DoctorProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedDoctor: doctor, isLoading } = useSelector((state) => state.user);
    const { reviews } = useSelector((state) => state.review);
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        dispatch(getDoctorById(id));
        dispatch(getDoctorReviews(id));
    }, [dispatch, id]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="h-5 w-5 text-yellow-400" />);
            } else {
                stars.push(<FaStar key={i} className="h-5 w-5 text-gray-300" />);
            }
        }
        return stars;
    };

    const getDayAvailability = (day) => {
        if (!doctor?.availableSlots) return null;
        return doctor.availableSlots.find(slot => slot.day === day);
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (isLoading) {
        return <Spinner />;
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500 text-lg">Doctor not found</p>
                        <Link to="/doctors" className="inline-block mt-4 text-primary-600 hover:text-primary-700">
                            Back to Doctor List
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-80 bg-gradient-to-bl from-indigo-100 to-purple-50 opacity-60 rounded-bl-[10rem] pointer-events-none -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-indigo-50 rounded-tr-full opacity-40 blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back Button */}
                <Link
                    to="/doctors"
                    className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
                >
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Back to Doctor List
                </Link>

                {/* Doctor Profile Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-8 mb-8 border border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between relative z-10">
                        <div className="flex items-center space-x-8">
                            <div className="relative">
                                <img
                                    src={doctor.photo || 'https://via.placeholder.com/120'}
                                    alt={doctor.name}
                                    className="h-36 w-36 rounded-2xl object-cover border-4 border-indigo-50 shadow-md bg-white"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-sm">
                                    <div className="bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Dr. {doctor.name}</h1>
                                <p className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold uppercase tracking-wider mt-3 shadow-sm">{doctor.specialization}</p>

                                <div className="flex items-center mt-4 bg-gray-50/80 w-fit px-3 py-1.5 rounded-xl border border-gray-100">
                                    <div className="flex items-center">
                                        {renderStars(doctor.averageRating || 0)}
                                    </div>
                                    <span className="ml-2 text-sm font-bold text-gray-700">
                                        {doctor.averageRating?.toFixed(1) || '0.0'} <span className="text-gray-400 font-medium">({doctor.totalRatings || 0} reviews)</span>
                                    </span>
                                </div>

                                <div className="flex items-center mt-4 space-x-6">
                                    <span className="flex items-center text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-50">
                                        <FaBriefcase className="mr-2 h-4 w-4 text-indigo-500" />
                                        {doctor.experience} years experience
                                    </span>
                                    <span className="flex items-center text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-50">
                                        <FaGraduationCap className="mr-2 h-4 w-4 text-purple-500" />
                                        {doctor.qualification}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Book Appointment Button */}
                        {user?.role === 'patient' && (
                            <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end p-4 bg-gray-50/50 rounded-2xl border border-gray-100 min-w-[250px]">
                                <div className="text-center md:text-right mb-4">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Consultation Fee</p>
                                    <p className="text-3xl font-extrabold text-indigo-700">₹{doctor.consultationFees}</p>
                                </div>
                                <Link
                                    to={`/patient/book/${doctor._id}`}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-3.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 text-center shadow-lg shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Book Appointment
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl flex space-x-1 shadow-sm border border-white/50 w-fit">
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'about'
                            ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50'
                            : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
                            }`}
                    >
                        About
                    </button>
                    <button
                        onClick={() => setActiveTab('availability')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'availability'
                            ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50'
                            : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
                            }`}
                    >
                        Availability
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'reviews'
                            ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50'
                            : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
                            }`}
                    >
                        Reviews <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{doctor.totalRatings || 0}</span>
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'about' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Professional Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About Section */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-8 border border-white hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                                        <FaUserMd className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    About Dr. {doctor.name}
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                        <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider mb-2">Specialization</h3>
                                        <p className="text-gray-700 font-medium">{doctor.specialization}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                        <h3 className="font-bold text-purple-900 text-sm uppercase tracking-wider mb-2">Qualifications</h3>
                                        <p className="text-gray-700 font-medium">{doctor.qualification}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                        <h3 className="font-bold text-green-900 text-sm uppercase tracking-wider mb-2">Experience</h3>
                                        <p className="text-gray-700 font-medium">{doctor.experience} years of professional experience</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-8 border border-white hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                                        <FaPhone className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-700 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <div className="bg-white p-2 rounded-lg shadow-sm mr-4 border border-gray-50">
                                            <FaEnvelope className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <span className="font-medium">{doctor.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <div className="bg-white p-2 rounded-lg shadow-sm mr-4 border border-gray-50">
                                            <FaPhone className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <span className="font-medium">{doctor.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Quick Info */}
                        <div className="space-y-8">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-8 border border-white hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Consultation Details</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Fee</p>
                                        <p className="text-xl font-extrabold text-indigo-700">₹{doctor.consultationFees}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Payment</p>
                                        <p className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">Online</p>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Next Slot</p>
                                        <p className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                            {getDayAvailability(new Date().toLocaleDateString('en-US', { weekday: 'long' }))
                                                ? 'Available Today'
                                                : 'Check Schedule'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
                                <h3 className="font-bold text-xl text-indigo-900 mb-6 relative z-10">Why choose Dr. {doctor.name}?</h3>
                                <ul className="space-y-4 text-gray-800 relative z-10 font-medium">
                                    <li className="flex items-center bg-white/60 p-3 rounded-xl border border-white shadow-sm">
                                        <div className="bg-green-100 p-1.5 rounded-lg mr-3">
                                            <FaCheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <span>Verified professional</span>
                                    </li>
                                    <li className="flex items-center bg-white/60 p-3 rounded-xl border border-white shadow-sm">
                                        <div className="bg-indigo-100 p-1.5 rounded-lg mr-3">
                                            <FaCheckCircle className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <span>{doctor.experience}+ years experience</span>
                                    </li>
                                    <li className="flex items-center bg-white/60 p-3 rounded-xl border border-white shadow-sm">
                                        <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                                            <FaCheckCircle className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span>{doctor.totalRatings || 0}+ patient reviews</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'availability' && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-8 border border-white hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center border-b border-gray-100 pb-4">
                            <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                                <FaCalendarAlt className="h-5 w-5 text-indigo-600" />
                            </div>
                            Weekly Availability
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {daysOfWeek.map(day => {
                                const slot = getDayAvailability(day);
                                return (
                                    <div
                                        key={day}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${slot?.isAvailable
                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md'
                                            : 'bg-gray-50 border-gray-100 opacity-70'
                                            }`}
                                    >
                                        <h3 className="font-bold text-lg mb-3 text-gray-800">{day}</h3>
                                        {slot?.isAvailable ? (
                                            <div className="flex items-center text-green-700 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-green-100/50 w-fit">
                                                <FaClock className="h-4 w-4 mr-2" />
                                                <span>
                                                    {slot.startTime} - {slot.endTime}
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 font-medium flex items-center">
                                                <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                                                Not available
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-8 border border-white hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center border-b border-gray-100 pb-4">
                            <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                                <FaStar className="h-5 w-5 text-indigo-600" />
                            </div>
                            Patient Reviews
                        </h2>

                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                                    <FaStar className="h-6 w-6 text-indigo-300" />
                                </div>
                                <p className="text-gray-900 font-bold text-lg">No reviews yet</p>
                                <p className="text-gray-500 mt-1">Be the first to review Dr. {doctor.name} after your consultation.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={review.patientId?.photo || 'https://via.placeholder.com/40'}
                                                    alt={review.patientId?.name}
                                                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg">{review.patientId?.name}</p>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-50 flex items-center ml-2">
                                                <div className="flex space-x-0.5">
                                                    {renderStars(review.rating).map((star, idx) => (
                                                        <React.Fragment key={idx}>
                                                            {React.cloneElement(star, { className: star.props.className.replace('w-5 h-5', 'w-3.5 h-3.5') })}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 italic border-l-4 border-indigo-100 pl-4 py-1">"{review.review}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorProfile;