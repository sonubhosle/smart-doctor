const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getUserAppointments,
    getAppointmentById,
    cancelAppointment,
    deleteAppointment,
    getAvailableSlots,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/available-slots/:doctorId', getAvailableSlots);
router.get('/my-appointments', protect, getUserAppointments);
router.get('/:id', protect, getAppointmentById);
router.post('/', protect, authorize('patient'), createAppointment);
router.put('/:id/cancel', protect, cancelAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;