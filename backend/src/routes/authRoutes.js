const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Make sure this path is correct
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Add upload middleware to register route
router.post('/register', upload.single('photo'), registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/change-password', protect, changePassword);

module.exports = router;