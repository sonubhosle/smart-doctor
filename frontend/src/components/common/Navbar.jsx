import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaUserMd,
    FaSignOutAlt,
    FaUser,
    FaChevronDown,
    FaCalendarCheck,
    FaCreditCard,
    FaStar,
    FaCog,
    FaHeart,
    FaBars,
    FaTimes,
    FaAward
} from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-btn')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Find Doctors', path: '/doctors' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'patient': return '/patient/dashboard';
            case 'doctor': return '/doctor/dashboard';
            case 'admin': return '/admin/dashboard';
            default: return '/';
        }
    };

    const getDropdownItems = () => {
        if (user?.role === 'patient') {
            return [
                { icon: FaUser, label: 'Profile', path: '/profile' },
                { icon: FaCalendarCheck, label: 'My Appointments', path: '/patient/appointments' },
                { icon: FaHeart, label: 'Health Journal', path: '/patient/dashboard' },
            ];
        } else if (user?.role === 'doctor') {
            return [
                { icon: FaUser, label: 'Profile', path: '/doctor/profile' },
                { icon: FaCalendarCheck, label: 'Consultations', path: '/doctor/appointments' },
                { icon: FaStar, label: 'My Reviews', path: '/doctor/reviews' },
            ];
        } else if (user?.role === 'admin') {
            return [
                { icon: FaUser, label: 'Profile', path: '/admin/profile' },
                { icon: FaCog, label: 'Verify Doctors', path: '/admin/approve-doctors' },
                { icon: FaCreditCard, label: 'Revenue Analytics', path: '/admin/revenue' },
            ];
        }
        return [];
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/90 backdrop-blur-2xl border-b border-slate-100/50 sticky top-0 z-[1000] shadow-sm shadow-indigo-50/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">

                    {/* --- Logo --- */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <FaUserMd className="h-6 w-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-black text-xl text-slate-900 tracking-tighter leading-none block">Smart Doctor</span>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Global Health</span>
                            </div>
                        </Link>
                    </div>

                    {/* --- Desktop Navigation --- */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive(link.path)
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* --- User Actions --- */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="hidden md:flex bg-slate-900 border border-slate-800 text-white px-6 py-2.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
                                >
                                    DASHBOARD
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-3 bg-slate-50 border border-slate-100 px-2 sm:px-4 py-2 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                                    >
                                        <div className="relative">
                                            {user.photo ? (
                                                <img
                                                    src={user.photo}
                                                    alt={user.name}
                                                    className="h-9 w-9 rounded-xl object-cover border-2 border-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <p className="text-xs font-black text-slate-900 leading-tight">{user.name?.split(' ')[0]}</p>
                                            <p className="text-[9px] font-bold text-slate-400 capitalize -mt-0.5">{user.role}</p>
                                        </div>
                                        <FaChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-300 transform origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100">
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{user.email}</p>
                                        </div>
                                        <div className="p-3">
                                            {getDropdownItems().map((item, index) => (
                                                <Link
                                                    key={index}
                                                    to={item.path}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            ))}
                                            <div className="h-px bg-slate-100 my-2 mx-4"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <FaSignOutAlt className="h-4 w-4" />
                                                <span>Terminate Session</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-slate-600 font-bold text-sm px-6 py-2.5 rounded-2xl hover:bg-slate-50 transition-all"
                                >
                                    Member Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white font-black text-xs px-7 py-3 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transform active:scale-95 transition-all"
                                >
                                    JOIN PLATFORM
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-btn lg:hidden w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 text-xl hover:bg-indigo-600 hover:text-white transition-all"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                </div>
            </div>

            {/* --- Mobile Menu --- */}
            <div
                className={`lg:hidden fixed inset-0 z-[-1] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div
                ref={mobileMenuRef}
                className={`lg:hidden fixed left-0 top-20 w-full bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center justify-center p-4 rounded-[2rem] text-sm font-black transition-all ${isActive(link.path)
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {!user && (
                        <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100">
                            <Link to="/login" className="flex items-center justify-center w-full py-4 text-slate-900 font-black text-sm rounded-[2rem] bg-slate-50">
                                Sign In
                            </Link>
                            <Link to="/register" className="flex items-center justify-center w-full py-4 bg-indigo-600 text-white font-black text-sm rounded-[2rem] shadow-xl shadow-indigo-100">
                                Create Account
                            </Link>
                        </div>
                    )}

                    {user && (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <Link to={getDashboardLink()} className="flex items-center space-x-3 p-4 rounded-3xl bg-indigo-50 text-indigo-700 font-bold">
                                <FaAward className="w-5 h-5" />
                                <span>Personal Dashboard</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center space-x-3 p-4 w-full rounded-3xl bg-rose-50 text-rose-600 font-bold">
                                <FaSignOutAlt className="w-5 h-5" />
                                <span>Logout Securely</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;