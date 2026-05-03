const express = require('express');
const router = express.Router();
const { createReview, getReviewsForProduct } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/:productId', getReviewsForProduct);

module.exports = router;
