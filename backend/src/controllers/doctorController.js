const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');


const getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const totalAppointments = await Appointment.countDocuments({ doctorId });
        const completedAppointments = await Appointment.countDocuments({
            doctorId,
            status: 'completed'
        });
        const pendingAppointments = await Appointment.countDocuments({
            doctorId,
            status: 'pending'
        });
        const cancelledAppointments = await Appointment.countDocuments({
            doctorId,
            status: 'cancelled'
        });

        const earnings = await Appointment.aggregate([
            { $match: { doctorId: doctorId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const averageRating = req.user.averageRating || 0;

        // Recent appointments
        const recentAppointments = await Appointment.find({ doctorId })
            .populate('patientId', 'name email photo')
            .sort('-createdAt')
            .limit(5);

        res.json({
            success: true,
            data: {
                stats: {
                    totalAppointments,
                    completedAppointments,
                    pendingAppointments,
                    cancelledAppointments,
                    totalEarnings: earnings.length > 0 ? earnings[0].total : 0,
                    averageRating,
                },
                recentAppointments,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await User.findById(req.user._id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        doctor.specialization = req.body.specialization || doctor.specialization;
        doctor.experience = req.body.experience || doctor.experience;
        doctor.qualification = req.body.qualification || doctor.qualification;
        doctor.consultationFees = req.body.consultationFees || doctor.consultationFees;

        if (req.body.availableSlots) {
            doctor.availableSlots = req.body.availableSlots;
        }

        await doctor.save();

        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getDoctorAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const doctorId = req.user._id;

        const query = { doctorId };
        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email photo phone')
            .sort('-date')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Appointment.countDocuments(query);

        res.json({
            success: true,
            data: {
                appointments,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateAppointmentStatus = async (req, res) => {
    try {
        const { status, isChecked } = req.body;
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            doctorId: req.user._id,
        });

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (status) {
            appointment.status = status;
        }

        if (isChecked !== undefined) {
            appointment.isChecked = isChecked;
        }

        await appointment.save();

        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getDoctorEarnings = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const earnings = await Appointment.aggregate([
            { $match: { doctorId: doctorId, status: 'completed' } },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        year: { $year: '$date' },
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
        ]);

        res.json({ success: true, data: earnings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDoctorReviews = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const reviews = await Review.find({ doctorId })
            .populate('patientId', 'name email photo')
            .populate('appointmentId', 'date')
            .sort('-createdAt');

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add this to your doctorController.js

const getAppointmentById = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const doctorId = req.user._id;

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctorId: doctorId // Ensure the appointment belongs to this doctor
        })
            .populate('patientId', 'name email phone photo')
            .populate('doctorId', 'name specialization email photo');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDoctorDashboard,
    updateDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus,
    getDoctorEarnings,
    getDoctorReviews,
    getAppointmentById,
};