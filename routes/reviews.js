// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/reviews');
// const authMiddleware = require('../middleware/auth');

// // Create a review for a book
// router.post('/:bookId', authMiddleware.protectRoute, reviewController.createReview);

// // Get all reviews for a book
// router.get('/:bookId', reviewController.getReviews);

// // Delete a review
// router.delete('/:id', authMiddleware.protectRoute, reviewController.deleteReview);

// module.exports = router;