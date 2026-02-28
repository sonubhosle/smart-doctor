import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    FaSearch,
    FaFilter,
    FaStar,
    FaRupeeSign,
    FaMapMarkerAlt,
    FaGraduationCap,
    FaBriefcase,
    FaTimes
} from 'react-icons/fa';
import { getAllDoctors } from '../../redux/slices/userSlice';
import Spinner from '../common/Spinner';

const DoctorList = () => {
    const dispatch = useDispatch();
    const { doctors, isLoading } = useSelector((state) => state.user);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        specialization: '',
        minPrice: '',
        maxPrice: '',
        rating: '',
        location: ''
    });

    const specializations = [
        'Cardiologist',
        'Dermatologist',
        'Pediatrician',
        'Neurologist',
        'Orthopedic',
        'Gynecologist',
        'Psychiatrist',
        'Dentist',
        'Ophthalmologist',
        'General Physician'
    ];

    useEffect(() => {
        dispatch(getAllDoctors(filters));
    }, [dispatch, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(getAllDoctors(filters));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            specialization: '',
            minPrice: '',
            maxPrice: '',
            rating: '',
            location: ''
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="h-4 w-4 text-yellow-400" />);
            } else {
                stars.push(<FaStar key={i} className="h-4 w-4 text-gray-300" />);
            }
        }
        return stars;
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-80 bg-gradient-to-bl from-indigo-100 to-purple-50 opacity-60 rounded-bl-[10rem] pointer-events-none -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-indigo-50 rounded-tr-full opacity-40 blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="mb-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-70"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
                            Find a Doctor
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">
                            Search and filter through our verified doctors
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-6 mb-8 border border-white">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by doctor name or specialization..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-indigo-50 bg-gray-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium text-gray-800 placeholder-gray-400 group-hover:border-indigo-200"
                            />
                            <FaSearch className="absolute left-4 top-4 text-indigo-400 group-hover:text-indigo-600 transition-colors h-5 w-5" />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-3.5 rounded-2xl flex items-center justify-center space-x-2 font-bold transition-all duration-300 ${showFilters
                                    ? 'bg-indigo-100 text-indigo-700 shadow-inner'
                                    : 'bg-white border-2 border-indigo-50 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 shadow-sm'
                                    }`}
                            >
                                <FaFilter className="h-4 w-4" />
                                <span>Filters</span>
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Filters Panel */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-indigo-50/80' : 'max-h-0 opacity-0 mt-0 pt-0 border-transparent'}`}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-indigo-900 text-lg flex items-center">
                                <div className="p-1.5 bg-indigo-100 rounded-lg mr-2">
                                    <FaFilter className="h-3.5 w-3.5 text-indigo-600" />
                                </div>
                                Advanced Filters
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
                            >
                                <FaTimes className="h-3 w-3" />
                                <span>Clear all</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Specialization
                                </label>
                                <select
                                    name="specialization"
                                    value={filters.specialization}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2.5 border-2 border-transparent bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700 shadow-sm"
                                >
                                    <option value="">All Specializations</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Price Range (₹)
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        className="w-1/2 px-4 py-2.5 border-2 border-transparent bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700 shadow-sm"
                                    />
                                    <span className="text-gray-400 font-bold">-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        className="w-1/2 px-4 py-2.5 border-2 border-transparent bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Minimum Rating
                                </label>
                                <select
                                    name="rating"
                                    value={filters.rating}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2.5 border-2 border-transparent bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700 shadow-sm"
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="font-semibold text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 inline-block">
                        Found <span className="text-indigo-600 font-bold">{doctors.length}</span> doctors
                    </p>
                </div>

                {/* Doctor Grid */}
                {doctors.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 p-12 text-center border border-white">
                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                            <FaSearch className="h-8 w-8 text-indigo-300" />
                        </div>
                        <p className="text-gray-900 font-bold text-xl mb-2">No doctors found matching your criteria</p>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Try adjusting your search criteria or clear the filters to view all available doctors.</p>
                        <button
                            onClick={clearFilters}
                            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-indigo-100/60 transition-all duration-300 overflow-hidden flex flex-col border border-white hover:border-indigo-100 transform hover:-translate-y-1"
                            >
                                <div className="p-6 flex-grow">
                                    {/* Doctor Image and Basic Info */}
                                    <div className="flex items-center space-x-5">
                                        <div className="relative">
                                            <img
                                                src={doctor.photo || 'https://via.placeholder.com/80'}
                                                alt={doctor.name}
                                                className="h-24 w-24 rounded-2xl object-cover border-4 border-indigo-50 group-hover:border-indigo-100 transition-colors shadow-sm"
                                            />
                                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                                                <div className="bg-green-500 h-3.5 w-3.5 rounded-full border-2 border-white"></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors leading-tight">Dr. {doctor.name}</h3>
                                            <p className="inline-block text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mt-2 shadow-sm">{doctor.specialization}</p>
                                        </div>
                                    </div>

                                    {/* Ratings */}
                                    <div className="flex items-center justify-between mt-5 bg-gray-50/80 px-4 py-2 rounded-xl border border-gray-100">
                                        <div className="flex items-center space-x-1">
                                            {renderStars(doctor.averageRating || 0)}
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-50">
                                            {doctor.totalRatings || 0} reviews
                                        </span>
                                    </div>

                                    {/* Doctor Details */}
                                    <div className="mt-5 space-y-3 px-1">
                                        <div className="flex items-center text-sm font-medium text-gray-600">
                                            <div className="bg-indigo-50 p-1.5 rounded-md mr-3">
                                                <FaBriefcase className="h-3.5 w-3.5 text-indigo-500" />
                                            </div>
                                            <span>{doctor.experience} years experience</span>
                                        </div>
                                        <div className="flex items-center text-sm font-medium text-gray-600">
                                            <div className="bg-purple-50 p-1.5 rounded-md mr-3">
                                                <FaGraduationCap className="h-3.5 w-3.5 text-purple-500" />
                                            </div>
                                            <span className="line-clamp-1">{doctor.qualification}</span>
                                        </div>
                                        <div className="flex items-center text-sm font-medium text-gray-600">
                                            <div className="bg-green-50 p-1.5 rounded-md mr-3">
                                                <FaRupeeSign className="h-3.5 w-3.5 text-green-500" />
                                            </div>
                                            <span>Consultation: <span className="font-bold text-gray-800">₹{doctor.consultationFees}</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-4 bg-gray-50/50 mt-auto border-t border-gray-100 group-hover:bg-indigo-50/30 transition-colors">
                                    <Link
                                        to={`/doctors/${doctor._id}`}
                                        className="block w-full bg-white border-2 border-indigo-100 text-indigo-700 font-bold text-center py-3 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                                    >
                                        View Full Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorList;