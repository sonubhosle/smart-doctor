const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const crypto = require('crypto');


const createOrder = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('doctorId', 'consultationFees');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const options = {
            amount: appointment.amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${appointmentId}`,
        };

        const order = await razorpay.orders.create(options);

        // Save payment record
        await Payment.create({
            appointmentId,
            razorpay_order_id: order.id,
            amount: appointment.amount,
            currency: 'INR',
            status: 'created',
        });

        res.json({
            success: true,
            data: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appointmentId,
        } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update payment record
            const payment = await Payment.findOneAndUpdate(
                { razorpay_order_id },
                {
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'paid',
                }
            );

            // Update appointment
            await Appointment.findByIdAndUpdate(appointmentId, {
                paymentStatus: 'completed',
                paymentId: razorpay_payment_id,
                status: 'confirmed',
            });

            res.json({
                success: true,
                message: 'Payment verified successfully',
                data: { razorpay_payment_id },
            });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate({
                path: 'appointmentId',
                populate: {
                    path: 'doctorId patientId',
                    select: 'name email',
                },
            });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentById,
};