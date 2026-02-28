import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes, FaEye, FaStar } from 'react-icons/fa';
import { getAllDoctors, approveDoctor } from '../../redux/slices/adminSlice';
import Spinner from '../common/Spinner';

const ApproveDoctors = () => {
    const dispatch = useDispatch();
    const { doctors, isLoading } = useSelector((state) => state.admin);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(getAllDoctors({ status: 'pending' }));
    }, [dispatch]);

    const handleApprove = (id) => {
        if (window.confirm('Are you sure you want to approve this doctor?')) {
            dispatch(approveDoctor({ id, isApproved: true }));
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Are you sure you want to reject this doctor?')) {
            dispatch(approveDoctor({ id, isApproved: false }));
        }
    };

    const viewDetails = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
        setTimeout(() => setIsModalVisible(true), 10);
    };

    const closeDetails = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setShowModal(false);
            setSelectedDoctor(null);
        }, 300);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">Approve Doctors</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Review and approve doctor registrations
                    </p>
                </div>

                {doctors.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-12 text-center">
                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheck className="text-indigo-400 text-3xl" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No pending doctor approvals</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500">
                                <div className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img
                                                src={doctor.photo || 'https://via.placeholder.com/60'}
                                                alt={doctor.name}
                                                className="h-16 w-16 rounded-full object-cover border-4 border-indigo-50 shadow-sm"
                                            />
                                            <div className="absolute bottom-0 right-0 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white" title="Pending"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
                                            <p className="text-indigo-600 font-medium text-sm">{doctor.specialization}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{doctor.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-2 bg-gray-50/80 p-4 rounded-2xl">
                                        <p className="text-sm flex justify-between">
                                            <span className="font-semibold text-gray-500">Experience:</span>
                                            <span className="font-bold text-gray-900">{doctor.experience} years</span>
                                        </p>
                                        <p className="text-sm flex justify-between">
                                            <span className="font-semibold text-gray-500">Qualification:</span>
                                            <span className="font-bold text-gray-900">{doctor.qualification}</span>
                                        </p>
                                        <p className="text-sm flex justify-between">
                                            <span className="font-semibold text-gray-500">Consultation Fees:</span>
                                            <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">₹{doctor.consultationFees}</span>
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-between items-center">
                                        <button
                                            onClick={() => viewDetails(doctor)}
                                            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors duration-200"
                                        >
                                            <FaEye className="h-4 w-4" />
                                            <span className="text-sm">Details</span>
                                        </button>
                                        <div className="space-x-3 flex">
                                            <button
                                                onClick={() => handleReject(doctor._id)}
                                                className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200"
                                                title="Reject"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(doctor._id)}
                                                className="bg-green-500 text-white p-2.5 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-sm hover:shadow-green-200 hover:-translate-y-0.5"
                                                title="Approve"
                                            >
                                                <FaCheck className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Doctor Details Modal */}
                {showModal && selectedDoctor && (
                    <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0" onClick={closeDetails}></div>

                        <div className={`relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-white/20 transform transition-all duration-300 overflow-hidden flex flex-col ${isModalVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}>
                            <div className="p-8 overflow-y-auto">
                                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Review Doctor Application</h2>
                                    <button
                                        onClick={closeDetails}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Profile Section */}
                                    <div className="flex items-center space-x-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                                        <div className="relative">
                                            <img
                                                src={selectedDoctor.photo || 'https://via.placeholder.com/100'}
                                                alt={selectedDoctor.name}
                                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-indigo-50"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                                                PENDING
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                                            <p className="text-indigo-600 font-semibold">{selectedDoctor.specialization}</p>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                                            Contact Information
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                                                <p className="font-bold text-gray-900">{selectedDoctor.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                                                <p className="font-bold text-gray-900">{selectedDoctor.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information */}
                                    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                                            Professional Overview
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                                                <p className="font-bold text-gray-900">{selectedDoctor.experience} <span className="text-gray-500 font-normal">years</span></p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Qualification</p>
                                                <p className="font-bold text-gray-900">{selectedDoctor.qualification}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fees</p>
                                                <p className="font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block">₹{selectedDoctor.consultationFees}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Available Slots */}
                                    {selectedDoctor.availableSlots?.length > 0 && (
                                        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                                <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                                                Availability Schedule
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {selectedDoctor.availableSlots.map((slot, index) => (
                                                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                        <span className="font-bold text-gray-700">{slot.day}</span>
                                                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                                                            {slot.startTime} - {slot.endTime}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-4 pt-6 mt-6">
                                        <button
                                            onClick={() => {
                                                handleReject(selectedDoctor._id);
                                                closeDetails();
                                            }}
                                            className="px-6 py-3 border-2 border-red-500 text-red-600 font-bold rounded-2xl hover:bg-red-50 hover:shadow-lg transition-all duration-300"
                                        >
                                            Reject Application
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleApprove(selectedDoctor._id);
                                                closeDetails();
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-200 hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Approve Doctor
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveDoctors;