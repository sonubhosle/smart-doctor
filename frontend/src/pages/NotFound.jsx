import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary-600">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
                    <p className="text-gray-600 mt-2">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center justify-center space-x-2"
                    >
                        <FaHome className="h-5 w-5" />
                        <span>Go to Homepage</span>
                    </Link>

                    <Link
                        to="/doctors"
                        className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center space-x-2"
                    >
                        <FaSearch className="h-5 w-5" />
                        <span>Find Doctors</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Popular Pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/" className="text-sm text-gray-600 hover:text-primary-600">Home</Link>
                        <Link to="/doctors" className="text-sm text-gray-600 hover:text-primary-600">Doctors</Link>
                        <Link to="/about" className="text-sm text-gray-600 hover:text-primary-600">About</Link>
                        <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">Contact</Link>
                        <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">Login</Link>
                        <Link to="/register" className="text-sm text-gray-600 hover:text-primary-600">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;