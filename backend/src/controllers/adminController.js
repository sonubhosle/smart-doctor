const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');


const getAdminDashboard = async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingApprovals = await User.countDocuments({ role: 'doctor', isApproved: false });

        const revenue = await Payment.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const monthlyRevenue = await Payment.aggregate([
            { $match: { status: 'paid' } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' },
                    },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 },
        ]);

        const appointmentStats = await Appointment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalDoctors,
                    totalPatients,
                    totalAppointments,
                    pendingApprovals,
                    totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
                },
                monthlyRevenue,
                appointmentStats,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllDoctors = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { role: 'doctor' };
        if (status === 'pending') {
            query.isApproved = false;
        } else if (status === 'approved') {
            query.isApproved = true;
        }

        const doctors = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                doctors,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const approveDoctor = async (req, res) => {
    try {
        const { isApproved } = req.body;

        const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        doctor.isApproved = isApproved;
        await doctor.save();

        res.json({
            success: true,
            message: `Doctor ${isApproved ? 'approved' : 'rejected'} successfully`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 10 } = req.query;

        const query = {};
        if (role && role !== 'all') {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot block admin' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin' });
        }

        await user.deleteOne();

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const appointments = await Appointment.find()
            .populate('patientId', 'name email photo')
            .populate('doctorId', 'name email photo specialization')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Appointment.countDocuments();

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


const getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { status: 'paid' };
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: start,
                $lte: end,
            };
        }

        const payments = await Payment.find(query)
            .populate({
                path: 'appointmentId',
                populate: {
                    path: 'doctorId patientId',
                    select: 'name',
                },
            })
            .sort('-createdAt');

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        // Calculate payment methods
        const razorpayCount = payments.filter(p => p.razorpay_payment_id).length;
        const cashCount = payments.length - razorpayCount;

        // Calculate monthly data for charts
        const monthlyData = {};
        payments.forEach(p => {
            const date = new Date(p.createdAt);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {
                    revenue: 0,
                    count: 0,
                    date: date
                };
            }
            monthlyData[monthYear].revenue += p.amount;
            monthlyData[monthYear].count += 1;
        });

        // Calculate growth
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const last30Days = payments.filter(p => new Date(p.createdAt) >= thirtyDaysAgo)
            .reduce((sum, p) => sum + p.amount, 0);
        const prev30Days = payments.filter(p =>
            new Date(p.createdAt) >= sixtyDaysAgo && new Date(p.createdAt) < thirtyDaysAgo
        ).reduce((sum, p) => sum + p.amount, 0);

        const growth = prev30Days > 0 ? ((last30Days - prev30Days) / prev30Days) * 100 : 0;

        // Calculate monthly average
        const monthlyAverage = Object.values(monthlyData).reduce((sum, m) => sum + m.revenue, 0) / Object.keys(monthlyData).length || 0;

        // Calculate projected revenue
        const projectedRevenue = last30Days * 12;

        // Calculate top doctors
        const doctorRevenue = {};
        payments.forEach(p => {
            const doctorName = p.appointmentId?.doctorId?.name || 'Unknown';
            if (!doctorRevenue[doctorName]) {
                doctorRevenue[doctorName] = { revenue: 0, count: 0 };
            }
            doctorRevenue[doctorName].revenue += p.amount;
            doctorRevenue[doctorName].count += 1;
        });

        const topDoctors = Object.entries(doctorRevenue)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        res.json({
            success: true,
            data: {
                payments,
                totalRevenue,
                count: payments.length,
                summary: {
                    totalRevenue,
                    totalAppointments: payments.length,
                    averagePerAppointment: payments.length > 0 ? totalRevenue / payments.length : 0,
                    growth,
                    monthlyAverage,
                    projectedRevenue,
                    topDoctors,
                    paymentMethods: {
                        razorpay: razorpayCount,
                        cash: cashCount
                    }
                },
                monthlyData: Object.values(monthlyData)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = {
    getAdminDashboard,
    getAllDoctors,
    approveDoctor,
    getAllUsers,
    toggleUserBlock,
    deleteUser,
    getAllAppointments,
    getRevenueAnalytics,
};