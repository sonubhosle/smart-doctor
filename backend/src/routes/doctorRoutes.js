const express = require('express');
const router = express.Router();
const {
    getDoctorDashboard,
    updateDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus,
    getDoctorEarnings,
    getDoctorReviews,
    getAppointmentById
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, isApprovedDoctor } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('doctor'));
router.use(isApprovedDoctor);

router.get('/dashboard', getDoctorDashboard);
router.put('/profile', updateDoctorProfile);
router.get('/appointments', getDoctorAppointments);
router.get('/appointments/:id', getAppointmentById);
router.put('/appointments/:id', updateAppointmentStatus);
router.get('/earnings', getDoctorEarnings);
router.get('/reviews', getDoctorReviews);

module.exports = router;