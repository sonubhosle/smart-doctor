


const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    uploadProfilePhoto,
    getApprovedDoctors,
    getDoctorById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-photo', protect, upload.single('photo'), uploadProfilePhoto);
router.get('/doctors', getApprovedDoctors);
router.get('/doctors/:id', getDoctorById);

module.exports = router;