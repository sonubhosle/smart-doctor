const express = require('express');
const router = express.Router();
const {
    getAdminDashboard,
    getAllDoctors,
    approveDoctor,
    getAllUsers,
    toggleUserBlock,
    deleteUser,
    getAllAppointments,
    getRevenueAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-block', toggleUserBlock);
router.delete('/users/:id', deleteUser);
router.get('/appointments', getAllAppointments);
router.get('/revenue', getRevenueAnalytics);

module.exports = router;