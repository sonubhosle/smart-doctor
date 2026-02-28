import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaClock,
    FaStethoscope,
    FaRupeeSign,
    FaUserMd,
    FaArrowLeft,
    FaInfoCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
import { getDoctorById } from '../../redux/slices/userSlice';
import { createAppointment, getAvailableSlots, clearAvailableSlots } from '../../redux/slices/appointmentSlice';
import PaymentGateway from '../payment/PaymentGateway';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedDoctor: doctor, isLoading: doctorLoading } = useSelector((state) => state.user);
    const { availableSlots, isLoading: slotsLoading } = useSelector((state) => state.appointment);
    const { user } = useSelector((state) => state.auth);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        problemDescription: ''
    });
    const [selectedDate, setSelectedDate] = useState('');
    const [appointmentId, setAppointmentId] = useState(null);
    const [doctorHasSlots, setDoctorHasSlots] = useState(false);

    useEffect(() => {
        dispatch(getDoctorById(doctorId));
        return () => {
            dispatch(clearAvailableSlots());
        };
    }, [dispatch, doctorId]);

    // Check if doctor has any slots configured
    useEffect(() => {
        if (doctor?.availableSlots) {
            const hasSlots = doctor.availableSlots.some(slot => slot.isAvailable === true);
            setDoctorHasSlots(hasSlots);
        }
    }, [doctor]);

    useEffect(() => {
        if (selectedDate) {
            dispatch(getAvailableSlots({ doctorId, date: selectedDate }));
        }
    }, [dispatch, doctorId, selectedDate]);

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setFormData({ ...formData, date, time: '' });
    };

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.time || !formData.problemDescription) {
            toast.error('Please fill in all fields');
            return;
        }

        // Check if user is logged in
        if (!user) {
            toast.error('Please login to book appointment');
            navigate('/login');
            return;
        }

        const appointmentData = {
            doctorId,
            date: formData.date,
            time: formData.time,
            problemDescription: formData.problemDescription
        };

        try {
            const result = await dispatch(createAppointment(appointmentData)).unwrap();
            if (result?._id) {
                setAppointmentId(result._id);
                setStep(2);
                toast.success('Appointment created! Proceed to payment.');
            }
        } catch (error) {
            toast.error(error || 'Failed to create appointment');
        }
    };

    const handlePaymentSuccess = () => {
        toast.success('Appointment booked successfully!');
        navigate('/patient/appointments');
    };

    if (doctorLoading) {
        return <Spinner />;
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500 text-lg">Doctor not found</p>
                        <button
                            onClick={() => navigate('/doctors')}
                            className="mt-4 text-primary-600 hover:text-primary-700"
                        >
                            Back to Doctor List
                        </button>
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/doctors/${doctorId}`)}
                    className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 font-medium transition-colors bg-white/50 px-4 py-2 rounded-xl shadow-sm border border-white/50"
                >
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Back to Doctor Profile
                </button>

                {/* Progress Steps */}
                <div className="mb-10 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50">
                    <div className="flex items-center justify-center max-w-lg mx-auto">
                        <div className={`flex flex-col items-center flex-1 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg mb-2 shadow-sm transition-all duration-300 ${step >= 1 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-200' : 'bg-gray-100 text-gray-400'
                                }`}>
                                1
                            </div>
                            <span className="text-sm font-bold tracking-wide">Book Slot</span>
                        </div>
                        <div className={`w-24 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-200'}`} />
                        <div className={`flex flex-col items-center flex-1 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg mb-2 shadow-sm transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-200' : 'bg-gray-100 text-gray-400'
                                }`}>
                                2
                            </div>
                            <span className="text-sm font-bold tracking-wide">Payment</span>
                        </div>
                    </div>
                </div>

                {/* Doctor Info Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/40 p-6 mb-8 border border-white flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                        <img
                            src={doctor.photo || 'https://via.placeholder.com/60'}
                            alt={doctor.name}
                            className="h-20 w-20 rounded-2xl object-cover border-4 border-indigo-50 shadow-sm"
                        />
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">Dr. {doctor.name}</h2>
                            <p className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2">{doctor.specialization}</p>
                            <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 w-fit">
                                <FaRupeeSign className="h-3.5 w-3.5 mr-1 text-green-600" />
                                <span>Fee: <span className="font-bold text-gray-900 text-base">₹{doctor.consultationFees}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100/50">
                            <FaInfoCircle className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-indigo-800 text-center">Complete the details<br />to confirm your visit.</p>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-white">
                        <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">Appointment Details</h2>

                        {/* Show warning if doctor has no slots */}
                        {!doctorHasSlots && (
                            <div className="mb-8 p-5 bg-yellow-50/80 border-2 border-yellow-200 rounded-2xl flex items-start shadow-sm">
                                <div className="bg-yellow-200/50 p-2 rounded-xl mr-4 flex-shrink-0">
                                    <FaExclamationTriangle className="text-yellow-600 h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-yellow-900 font-bold text-lg mb-1">No availability set</p>
                                    <p className="text-yellow-700 font-medium">
                                        This doctor hasn't set their availability yet. Please check back later or choose another doctor.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                Select Date
                            </label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-indigo-50 bg-gray-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-indigo-200"
                                    required
                                    disabled={!doctorHasSlots}
                                />
                                <FaCalendarAlt className="absolute left-4 top-4 text-indigo-400 group-hover:text-indigo-600 transition-colors h-5 w-5" />
                            </div>
                            <p className="text-xs font-medium text-gray-500 mt-2 ml-1">
                                You can book up to 30 days in advance
                            </p>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                                    <span>Available Time Slots</span>
                                    {slotsLoading && <Spinner size="small" />}
                                </label>
                                {slotsLoading ? (
                                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <p className="text-sm font-medium text-indigo-600 mt-2">Fetching available slots...</p>
                                    </div>
                                ) : availableSlots && availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleTimeSelect(slot)}
                                                className={`p-3.5 text-sm font-bold border-2 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex items-center justify-center ${formData.time === slot
                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-200/50'
                                                    : 'border-indigo-100 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30'
                                                    }`}
                                            >
                                                <FaClock className={`mr-2 h-4 w-4 ${formData.time === slot ? 'text-white/80' : 'text-indigo-400'}`} />
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50/80 rounded-2xl border-2 border-dashed border-gray-200">
                                        <FaCalendarAlt className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-800 font-bold text-lg mb-1">
                                            {doctorHasSlots
                                                ? `No slots available`
                                                : 'Doctor has not set any availability'}
                                        </p>
                                        {doctorHasSlots && (
                                            <p className="text-sm font-medium text-gray-500">
                                                Please try selecting a different date
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Problem Description */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                Reason for Visit
                            </label>
                            <div className="relative group">
                                <textarea
                                    name="problemDescription"
                                    value={formData.problemDescription}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Briefly describe your symptoms or reason for the consultation..."
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-indigo-50 bg-gray-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium text-gray-800 resize-none group-hover:border-indigo-200"
                                    required
                                />
                                <FaStethoscope className="absolute left-4 top-4 text-indigo-400 group-hover:text-indigo-600 transition-colors h-5 w-5" />
                            </div>
                        </div>

                        {/* Fee Summary */}
                        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 p-6 rounded-2xl mb-8 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Payment Summary</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600 font-medium">Consultation Fee</span>
                                <span className="font-bold text-gray-800">₹{doctor.consultationFees}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Platform Fee</span>
                                <span className="font-bold text-gray-800">₹0</span>
                            </div>
                            <div className="border-t-2 border-gray-200/50 py-4 flex justify-between items-center bg-white/50 px-4 rounded-xl mt-2">
                                <span className="font-extrabold text-gray-900 text-lg">Total Amount</span>
                                <span className="font-extrabold text-indigo-700 text-2xl">₹{doctor.consultationFees}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!formData.date || !formData.time || !formData.problemDescription || slotsLoading || !doctorHasSlots}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:shadow-none"
                        >
                            {!doctorHasSlots
                                ? 'Doctor Unavailable'
                                : slotsLoading
                                    ? 'Checking Availability...'
                                    : 'Proceed to Payment (₹' + doctor.consultationFees + ')'}
                        </button>

                        <p className="text-xs font-semibold text-gray-500 text-center mt-6 flex items-center justify-center bg-gray-50 w-fit mx-auto px-4 py-2 rounded-full border border-gray-100">
                            <FaInfoCircle className="mr-2 text-indigo-400" />
                            Payments are processed securely via Razorpay
                        </p>
                    </form>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-white">
                        <PaymentGateway
                            amount={doctor.consultationFees}
                            appointmentId={appointmentId}
                            onSuccess={handlePaymentSuccess}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;