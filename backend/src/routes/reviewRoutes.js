const express = require('express');
const router = express.Router();
const {
    createReview,
    getDoctorReviews,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/doctor/:doctorId', getDoctorReviews);
router.post('/', protect, authorize('patient'), createReview);
router.put('/:id', protect, authorize('patient'), updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;