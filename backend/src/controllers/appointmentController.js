const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Payment = require('../models/Payment');


const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, problemDescription } = req.body;

        const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isApproved: true });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Check if slot is available
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date: new Date(date),
            time,
            status: { $ne: 'cancelled' },
        });

        if (existingAppointment) {
            return res.status(400).json({ success: false, message: 'Time slot not available' });
        }

        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            date,
            time,
            problemDescription,
            amount: doctor.consultationFees,
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getUserAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const userId = req.user._id;

        let query = {};
        if (req.user.role === 'patient') {
            query.patientId = userId;
        } else if (req.user.role === 'doctor') {
            query.doctorId = userId;
        }

        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email photo')
            .populate('doctorId', 'name email photo specialization consultationFees')
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


const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name email phone photo')
            .populate('doctorId', 'name email photo specialization consultationFees');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check authorization
        if (
            appointment.patientId._id.toString() !== req.user._id.toString() &&
            appointment.doctorId._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check authorization
        if (
            appointment.patientId.toString() !== req.user._id.toString() &&
            appointment.doctorId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (appointment.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        // Process refund if payment was made
        if (appointment.paymentStatus === 'completed') {
            // Implement refund logic here
            appointment.paymentStatus = 'refunded';
            await appointment.save();
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check authorization (Admin or the Patient who owns it)
        if (
            req.user.role !== 'admin' &&
            appointment.patientId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this appointment' });
        }

        await appointment.deleteOne();

        res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const doctorId = req.params.doctorId;

        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const doctorSlots = doctor.availableSlots.find(slot => slot.day === dayOfWeek);

        if (!doctorSlots || !doctorSlots.isAvailable) {
            return res.json({ success: true, data: [] });
        }

        // Get booked appointments for that date
        const bookedAppointments = await Appointment.find({
            doctorId,
            date: new Date(date),
            status: { $ne: 'cancelled' },
        }).select('time');

        const bookedTimes = bookedAppointments.map(apt => apt.time);

        // Generate available time slots
        const availableSlots = generateTimeSlots(doctorSlots.startTime, doctorSlots.endTime)
            .filter(slot => !bookedTimes.includes(slot));

        res.json({ success: true, data: availableSlots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    while (start < end) {
        slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        start.setMinutes(start.getMinutes() + 30); // 30-minute slots
    }

    return slots;
};

module.exports = {
    createAppointment,
    getUserAppointments,
    getAppointmentById,
    cancelAppointment,
    getAvailableSlots,
    deleteAppointment
};