import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaStar, FaTimes } from 'react-icons/fa';
import { createReview } from '../../redux/slices/reviewSlice';
import toast from 'react-hot-toast';

const GiveReview = ({ appointment, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!review.trim()) {
            toast.error('Please write a review');
            return;
        }

        setIsSubmitting(true);

        const reviewData = {
            doctorId: appointment.doctorId._id,
            appointmentId: appointment._id,
            rating,
            review: review.trim()
        };

        try {
            await dispatch(createReview(reviewData)).unwrap();
            toast.success('Review submitted successfully!');
            onSuccess();
        } catch (error) {
            toast.error(error || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with fade-in */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Modal Container with scale-in */}
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden relative z-10 animate-fadeIn transform transition-all duration-300 flex flex-col max-h-[90vh]">
                {/* Modal Header - Fixed */}
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Write a Review</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar">

                    {/* Doctor Info */}
                    <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
                        <img
                            src={appointment.doctorId?.photo || 'https://via.placeholder.com/40'}
                            alt={appointment.doctorId?.name}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold">Dr. {appointment.doctorId?.name}</p>
                            <p className="text-sm text-gray-600">{appointment.doctorId?.specialization}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Rating Stars */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="focus:outline-none"
                                    >
                                        <FaStar
                                            className={`h-8 w-8 ${star <= (hover || rating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                    {rating > 0 ? `${rating} out of 5` : 'Select rating'}
                                </span>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows="4"
                                placeholder="Share your experience with this doctor..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {review.length}/500 characters
                            </p>
                        </div>

                        {/* Tips */}
                        <div className="bg-blue-50 p-3 rounded-lg mb-6">
                            <h4 className="text-sm font-semibold text-blue-800 mb-2">Tips for writing a helpful review:</h4>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Be specific about your experience</li>
                                <li>• Mention the doctor's expertise and bedside manner</li>
                                <li>• Describe the treatment process</li>
                                <li>• Keep it honest and constructive</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GiveReview;