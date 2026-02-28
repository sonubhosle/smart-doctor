const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const User = require('../models/User');


const createReview = async (req, res) => {
    try {
        const { doctorId, appointmentId, rating, review } = req.body;

        // Check if appointment exists and belongs to patient
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patientId: req.user._id,
            doctorId,
            status: 'completed',
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Completed appointment not found'
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            patientId: req.user._id,
            doctorId,
            appointmentId,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Review already exists for this appointment'
            });
        }

        const newReview = await Review.create({
            patientId: req.user._id,
            doctorId,
            appointmentId,
            rating,
            review,
        });

        // Update doctor's average rating
        await updateDoctorRating(doctorId);

        res.status(201).json({ success: true, data: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getDoctorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctorId: req.params.doctorId })
            .populate('patientId', 'name photo')
            .sort('-createdAt');

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            patientId: req.user._id,
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        review.rating = req.body.rating || review.rating;
        review.review = req.body.review || review.review;

        await review.save();

        // Update doctor's average rating
        await updateDoctorRating(review.doctorId);

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check authorization
        if (review.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const doctorId = review.doctorId;
        await review.deleteOne();

        // Update doctor's average rating
        await updateDoctorRating(doctorId);

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDoctorRating = async (doctorId) => {
    const reviews = await Review.find({ doctorId });

    if (reviews.length === 0) {
        await User.findByIdAndUpdate(doctorId, {
            averageRating: 0,
            totalRatings: 0,
        });
        return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await User.findByIdAndUpdate(doctorId, {
        averageRating: averageRating.toFixed(1),
        totalRatings: reviews.length,
    });
};

module.exports = {
    createReview,
    getDoctorReviews,
    updateReview,
    deleteReview,
};