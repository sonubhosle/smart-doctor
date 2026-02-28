import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserMd, FaUser, FaBan, FaTrash, FaSearch } from 'react-icons/fa';
import { getAllUsers, toggleUserBlock, deleteUser } from '../../redux/slices/adminSlice';
import Spinner from '../common/Spinner';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.admin);
    const [filters, setFilters] = useState({
        role: 'all',
        page: 1,
        limit: 10,
        search: '',
    });

    useEffect(() => {
        dispatch(getAllUsers(filters));
    }, [dispatch, filters.role, filters.page]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(getAllUsers(filters));
    };

    const handleBlockToggle = (id) => {
        if (window.confirm('Are you sure you want to toggle block status?')) {
            dispatch(toggleUserBlock(id));
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete user ${name}?`)) {
            dispatch(deleteUser(id));
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">Manage Users</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        View and manage all users in the system
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all duration-300"
                                />
                                <FaSearch className="absolute left-4 top-4 text-gray-400" />
                            </div>
                        </div>
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                            className="px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all duration-300 cursor-pointer min-w-[150px]"
                        >
                            <option value="all">All Users</option>
                            <option value="patient">Patients</option>
                            <option value="doctor">Doctors</option>
                            <option value="admin">Admins</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-3xl">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/50 divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                                                        src={user.photo || 'https://via.placeholder.com/40'}
                                                        alt={user.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.role === 'doctor' ? (
                                                    <div className="bg-blue-100 p-1.5 rounded-lg mr-2 shadow-sm">
                                                        <FaUserMd className="h-3.5 w-3.5 text-blue-600" />
                                                    </div>
                                                ) : user.role === 'admin' ? (
                                                    <div className="bg-purple-100 p-1.5 rounded-lg mr-2 shadow-sm">
                                                        <FaUser className="h-3.5 w-3.5 text-purple-600" />
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-100 p-1.5 rounded-lg mr-2 shadow-sm">
                                                        <FaUser className="h-3.5 w-3.5 text-green-600" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-semibold capitalize text-gray-700">{user.role}</span>
                                                {user.role === 'doctor' && (
                                                    <span className={`ml-2 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${user.isApproved
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {user.isApproved ? 'APPROVED' : 'PENDING'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-700 bg-gray-50/80 px-3 py-1 rounded-lg inline-block">{user.phone || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full shadow-sm ${user.isBlocked
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleBlockToggle(user._id)}
                                                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm ${user.isBlocked
                                                        ? 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white hover:shadow-green-200'
                                                        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white hover:shadow-yellow-200'
                                                        }`}
                                                    title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                                >
                                                    <FaBan className="h-4 w-4" />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-red-200 transition-all duration-300 shadow-sm"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;